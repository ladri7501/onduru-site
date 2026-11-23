/* The places are geographic. All foundries, sharing agreements, models and tasks
   below are fictional. This calculator only receives IDs and geographic metadata. */
(() => {
  'use strict';

  const facilities = [
    ['US', 'newYork', 'large'], ['US', 'losAngeles', 'large'],
    ['CN', 'beijing', 'large'], ['CN', 'shanghai', 'large'],
    ['KR', 'seoul', 'large'], ['IN', 'newDelhi', 'large'],
    ['FR', 'paris', 'large'], ['GB', 'london', 'large'], ['RU', 'moscow', 'large'],
    ['CA', 'ottawa', 'large'], ['BR', 'saoPaulo', 'large'],
    ['ES', 'madrid', 'shared'], ['KE', 'nairobi', 'compact'],
    ['SN', 'dakar', 'compact'], ['BR', 'recife', 'shared'], ['FJ', 'suva', 'compact']
  ].map(([region, cityId, scale]) => ({region, cityId, scale}));
  const jurisdictions = Object.freeze([...new Set(facilities.map(item => item.region))]);
  const sample = ['newYork','beijing','seoul','paris','london','newDelhi','dakar','nairobi','recife','madrid'];

  // The stub processes three distinct public-notice references carried on four
  // synthetic slips. It never reads case contents, an identity or a network service.
  const slips = Object.freeze(['n3','n1','n1','n2']);
  const allowedReferences = new Set(slips);
  function defaults(places, focus) {
    const ids = new Set(places.filter(place => place.kind !== 'territory').map(place => place.id));
    return [...new Set([focus, ...sample])].filter(id => ids.has(id));
  }
  function providers(places) {
    const byId = new Map(places.map(place => [place.id, place.region]));
    return facilities.filter(provider => byId.get(provider.cityId) === provider.region)
      .map(provider => ({...provider}));
  }

  // Unit vectors keep nearest-hub comparisons continuous across the date line.
  function toVector(place) {
    const radians = Math.PI / 180;
    const latitude = place.lat * radians, longitude = place.lon * radians;
    return [Math.cos(latitude) * Math.cos(longitude), Math.sin(latitude), Math.cos(latitude) * Math.sin(longitude)];
  }
  function dot(a,b) {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  }
  function nearest(originId, options, vectors) {
    let nearestId = null, greatest = -Infinity;
    for (const id of options) {
      const score = dot(vectors.get(originId), vectors.get(id));
      if (score > greatest) { greatest = score; nearestId = id; }
    }
    return nearestId;
  }

  function divideWork(focus, partners, vectors) {
    const used = new Set();
    function assign(priority, preferPeer=false) {
      // Share roles across eligible partners when possible; if resources are
      // scarce the same local/cooperative model can carry more than one stage.
      const fresh = partners.filter(partner => !used.has(partner.cityId));
      const candidates = fresh.length ? fresh : partners;
      const peers = preferPeer ? candidates.filter(partner => partner.cityId !== focus.id) : [];
      const pool = peers.length ? peers : candidates;
      const scale = priority.find(scale => pool.some(partner => partner.scale === scale));
      const matches = pool.filter(partner => partner.scale === scale);
      const best = nearest(focus.id, matches.map(partner => partner.cityId), vectors);
      const participant = matches.find(partner => partner.cityId === best) || matches[0];
      used.add(participant.cityId);
      return participant;
    }
    const prepare = assign(['compact','shared','large']);
    const compose = assign(['large','shared','compact']);
    const review = assign(['shared','compact','large'],true);
    const grouped = [...new Set(slips)].sort();
    const compiled = grouped.map(ref => ({ref, occurrences:slips.filter(slip => slip === ref).length}));
    const verified = compiled.filter(entry => allowedReferences.has(entry.ref) && entry.occurrences > 0);
    const stages = [
      ['prepare', prepare, grouped], ['compose', compose, compiled.map(entry => entry.ref)],
      ['review', review, verified.map(entry => entry.ref)],
      ['return', {cityId:focus.id,scale:'local'}, verified.map(entry => entry.ref)]
    ];
    return stages.map(([role, resource, output]) => ({role, cityId:resource.cityId, scale:resource.scale, units:output.length, output}));
  }

  function network(focus, members, available, suspended, jobs, vectors) {
    const edges = new Map();
    function connect(from, to, kind='live', work=false) {
      if (!from || !to || from === to) return;
      // Membership arcs are undirected. The ordered work itinerary lives in jobs.
      const key = from < to ? from+'|'+to : to+'|'+from;
      if (!edges.has(key)) edges.set(key, {from,to,kind,work});
      else if (work) edges.get(key).work = true;
    }

    const supplyIds = available.map(foundry => foundry.cityId);
    const sources = new Set(supplyIds);
    if (supplyIds.length) {
      // Each participating place is connected to a source. The sources share a
      // ring, so the entire authorized coalition stays connected after a cutoff.
      for (let i = 0; i < supplyIds.length; i++)
        connect(supplyIds[i], supplyIds[(i+1) % supplyIds.length]);
      for (const city of members) {
        if (!sources.has(city.id)) connect(city.id, nearest(city.id, supplyIds, vectors));
      }
      if (focus && members.some(city => city.id === focus.id)) {
        for (const id of supplyIds) connect(focus.id,id);
      }
      let last = focus?.id;
      for (const step of jobs) {
        connect(last,step.cityId,'live',true);
        last = step.cityId;
      }
    }
    // A closed offer is shown even when countersigning or sending work is
    // impossible. Red arcs are display-only and never take part in reachability.
    for (const source of suspended) {
      const target = focus?.region !== source.region && focus ? focus.id :
        members.find(city => city.region !== source.region)?.id;
      connect(source.cityId, target, 'cut');
    }
    return [...edges.values()];
  }

  function inspect(places, settings={}) {
    const byId = new Map(places.map(place => [place.id, place]));
    const focus = byId.get(settings.focus) || null;
    const disabled = new Set(settings.blocked || []);
    const blocked = jurisdictions.filter(region => disabled.has(region));
    const cuts = new Set(blocked);
    // An on-land map representative is not evidence of a resident city or a partner.
    const eligible = places.filter(city => city.kind !== 'territory' && !cuts.has(city.region));
    const chosen = new Set(settings.members === 'all' ? [] : settings.members || []);
    const members = settings.members === 'all' ? eligible : eligible.filter(city => chosen.has(city.id));
    const enrolled = new Set(members.map(city => city.id));
    const supply = facilities.filter(item => byId.get(item.cityId)?.region === item.region);
    const available = supply.filter(source => enrolled.has(source.cityId));
    const suspended = supply.filter(source => cuts.has(source.region));
    const vectors = new Map(places.map(city => [city.id, toVector(city)]));
    let reason = 'ready';
    if (settings.held) reason = 'held';
    else if (focus && cuts.has(focus.region)) reason = 'focus-cut';
    else if (!members.length) reason = 'no-members';
    else if (!focus || !enrolled.has(focus.id)) reason = 'focus-outside';
    else if (!available.length) reason = 'no-foundry';
    else if (members.length < 2) reason = 'single-hub';
    const ready = reason === 'ready';
    const jobs = ready ? divideWork(focus,available,vectors) : [];
    const lines = network(focus,members,available,suspended,jobs,vectors);
    return {focus, blocked, eligible, members, providers:available.map(source => ({...source})),
      participatingCountries:[...new Set(members.map(city => city.region))], lines,
      jobs, reason, ready, rawTransfers:0};
  }

  // Country roles are illustrative offers in this edition of the exhibition.
  // The country-of-origin of a real model is not a condition for treaty access.
  const countryOffers = {
    US:['large','compact'], CN:['large','compact'], KR:['large','compact'],
    IN:['large','compact'], FR:['large'], GB:['large'], RU:['large'],
    CA:['large','compact'], BR:['shared','compact'], ES:['compact','shared'],
    JP:['large'], DE:['large','shared'], AU:['shared','compact']
  };
  const countryJurisdictions = Object.freeze(Object.keys(countryOffers));
  const defaultCuts = ['US','CN'];
  const referenceFields = Object.freeze(['noticeRef']);

  function countryAnchors(places) {
    const order = {capital:0, seat:1, city:2, island:3};
    const anchors = new Map();
    for (const place of places) {
      if (!place.region || place.kind === 'territory') continue;
      const previous = anchors.get(place.region);
      if (!previous || (order[place.kind] ?? 4) < (order[previous.kind] ?? 4)) {
        anchors.set(place.region, place);
      }
    }
    return [...anchors.values()];
  }

  function countryProviders(places) {
    const anchors = new Map(countryAnchors(places).map(place => [place.region,place]));
    return countryJurisdictions.filter(code => anchors.has(code)).map(region => ({
      region, cityId:anchors.get(region).id, scale:countryOffers[region][0],
      scales:[...countryOffers[region]]
    }));
  }

  // Split real synthetic input between distinct workers when two are available.
  // Each worker hands back references only. No model or network API is called.
  function sharedWork(origin, supply) {
    function choose(priorities, desired) {
      const preferred = priorities.map(code => supply.find(offer => offer.region === code));
      const resource = preferred.find(offer => offer?.scales.includes(desired))
        || supply.find(offer => offer.scales.includes(desired))
        || preferred.find(Boolean) || supply[0];
      return {region:resource.region, cityId:resource.cityId,
        scale:resource.scales.includes(desired) ? desired : resource.scale};
    }
    function parallel(first, second) {
      if (first.cityId !== second.cityId) return [first,second];
      const other = supply.find(offer => offer.cityId !== first.cityId);
      return other ? [first,{region:other.region,cityId:other.cityId,scale:other.scale}] : [first];
    }
    function stage(role, workers, output) {
      return {role, cityId:workers[0].cityId, scale:workers[0].scale,
        units:output.length, output, workers};
    }
    function split(role, roster, input, operation) {
      const workers = roster.map((worker,index) => {
        const items = input.filter((_,i) => i % roster.length === index);
        const output = operation(items);
        return {...worker,units:output.length,output};
      });
      return stage(role, workers, [...new Set(workers.flatMap(worker=>worker.output))].sort());
    }
    function transfer(from, to) {
      return from === to ? [] : [{from,to}];
    }
    const prepare = split('prepare',parallel(
      choose(['CN','KR','IN','CA'],'compact'),choose(['ES','AU','BR','IN'],'compact')
    ),slips,items=>[...new Set(items)].sort());
    const drafter = choose(['US','KR','FR','GB','IN'],'large');
    const draft = [...prepare.output].sort();
    const compose = stage('compose',[{...drafter,units:draft.length,output:draft}],draft);
    const review = split('review',parallel(
      choose(['AU','BR','DE','ES'],'shared'), choose(['FR','JP','IN','GB'],'large')
    ),compose.output,items=>items.filter(ref=>allowedReferences.has(ref)));
    const result = [...review.output];
    const receive = stage('return',[{
      region:origin.region,cityId:origin.id,scale:'local',units:result.length,output:result
    }],result);
    return {
      jobs:[prepare,compose,review,receive],
      workBatches:[
        prepare.workers.flatMap(worker=>transfer(origin.id,worker.cityId)),
        prepare.workers.flatMap(worker=>transfer(worker.cityId,compose.cityId)),
        review.workers.flatMap(worker=>transfer(compose.cityId,worker.cityId)),
        review.workers.flatMap(worker=>transfer(worker.cityId,origin.id))
      ]
    };
  }

  function countryNetwork(origin, focus, members, supply, suspended, workBatches, vectors, originCut) {
    const edges = new Map();
    const sourceIds = new Set(supply.map(offer => offer.cityId));
    const cutIds = new Set(suspended.map(offer => offer.cityId));
    function connect(from, to, kind='live', work=false) {
      if (!from || !to || from === to) return;
      const key = from < to ? from+'|'+to : to+'|'+from;
      const existing = edges.get(key);
      if (existing) {
        if (work && existing.kind === 'live') existing.work = true;
        return;
      }
      edges.set(key,{from,to,kind,work,peer:kind==='live' && sourceIds.has(from) && sourceIds.has(to)});
    }
    // Sharing foundries have a direct agreement with each other. Each other
    // participating country can reach the whole federation through a live offer.
    const hubs = [...sourceIds];
    for (let i=0; i<hubs.length; i++) {
      for (let j=i+1; j<hubs.length; j++) connect(hubs[i],hubs[j]);
    }
    if (hubs.length) {
      for (const member of members) {
        if (!sourceIds.has(member.id)) connect(member.id,nearest(member.id,hubs,vectors));
      }
      // Looking at a country makes its available agreements visible without
      // changing the origin, collaborators or work assigned to those collaborators.
      const viewers = new Set([origin?.id,focus?.id]);
      for (const id of viewers) {
        if (!id || cutIds.has(id)) continue;
        if (sourceIds.has(id)) {
          for (const member of members) connect(id,member.id);
        } else if (id===origin?.id || members.some(member=>member.id===id)) {
          for (const hub of hubs) connect(id,hub);
        }
      }
      for (const batch of workBatches) for (const arc of batch) connect(arc.from,arc.to,'live',true);
    }
    // Withdrawn offers stay visible even when no models can be shared. None
    // of these lines gives a route to a worker or a permission to send work.
    const destinations = members.map(place=>place.id);
    for (const source of suspended) {
      const receiver = origin && !originCut ? origin.id :
        nearest(source.cityId, destinations, vectors) ||
        [...vectors.keys()].find(id=>!cutIds.has(id));
      connect(source.cityId,receiver,'cut');
    }
    return [...edges.values()];
  }

  function inspectCountries(places, settings={}) {
    const anchors = countryAnchors(places);
    const byRegion = new Map(anchors.map(place=>[place.region,place]));
    const byId = new Map(places.map(place=>[place.id,place.region]));
    function location(value) {
      return byRegion.get(value) || byRegion.get(byId.get(value)) || null;
    }
    const origin = location(settings.origin || 'KR');
    const focus = location(settings.focus) || origin;
    const offers = countryProviders(anchors);
    const blockedCodes = new Set(settings.blocked ?? defaultCuts);
    const blocked = offers.filter(item=>blockedCodes.has(item.region)).map(item=>item.region);
    const cuts = new Set(blocked);
    const eligible = anchors.filter(place=>!cuts.has(place.region));
    const choice = settings.members ?? 'all';
    const chosen = new Set(choice === 'all' ? [] : choice);
    const members = choice === 'all' ? eligible : eligible.filter(place=>chosen.has(place.region));
    const participatingCountries = members.map(place=>place.region);
    const supplyChoice = settings.providerCountries ?? 'all';
    const permitted = new Set(supplyChoice === 'all' ? participatingCountries :
      participatingCountries.filter(code=>supplyChoice.includes(code)));
    const providers = offers.filter(item=>permitted.has(item.region));
    const suspended = offers.filter(item=>cuts.has(item.region));
    const originCut = Boolean(origin && cuts.has(origin.region));
    let reason = 'ready';
    if (settings.held) reason = 'held';
    else if (originCut) reason = 'focus-cut';
    else if (!members.length) reason = 'no-members';
    else if (!origin) reason = 'focus-outside';
    else if (!providers.length) reason = 'no-foundry';
    const ready = reason === 'ready';
    const {jobs,workBatches} = ready ? sharedWork(origin,providers) : {jobs:[],workBatches:[]};
    const vectors = new Map(anchors.map(place=>[place.id,toVector(place)]));
    const lines = countryNetwork(origin,focus,members,providers,suspended,workBatches,vectors,originCut);
    return {countryMode:true, origin, focus, blocked, eligible, members, participatingCountries,
      providers, jobs, workBatches, lines, reason, ready,
      localOnly:ready && members.length === 1 && members[0].region === origin.region,
      task:{id:'public-notices',fields:[...referenceFields],recipient:origin?.region || null},rawTransfers:0};
  }

  window.Federation = Object.freeze({inspect, providers, defaults, jurisdictions,
    countryAnchors, countryJurisdictions, countryProviders, inspectCountries});
})();
