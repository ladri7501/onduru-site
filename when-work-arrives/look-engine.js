/* A synthetic wardrobe, scoped to one visit. Ratings describe the garments in this exhibition. */
(() => {
  'use strict';

  // Every three-entry scale follows the scene: rainy gallery, spring walk, autumn evening.
  // Colour affinity is indexed by the chosen anchor: grey knit, plum scarf, sage raincoat.
  const items = {
    layer: [
      {weather:[2,3,3], occasion:[4,2,4], colour:[4,3,2]}, // Tailored trousers
      {weather:[1,3,4], occasion:[3,2,4], colour:[3,4,2]}, // Flared skirt
      {weather:[4,4,1], occasion:[2,4,1], colour:[2,2,4]}  // Relaxed cropped trousers
    ],
    ring: [
      {weather:[4,4,3], occasion:[2,4,1], colour:[2,2,3]},
      {weather:[4,3,3], occasion:[4,3,3], colour:[4,3,3]}, // Silver band
      {weather:[2,3,3], occasion:[3,2,4], colour:[3,4,4], addition:true} // Stone ring
    ],
    necklace: [
      {weather:[4,4,3], occasion:[2,4,1], colour:[2,3,3]},
      {weather:[3,3,3], occasion:[3,3,4], colour:[3,4,4]}, // Pendant
      {weather:[1,2,3], occasion:[4,1,4], colour:[4,3,2], addition:true} // Pearls
    ],
    bag: [
      {weather:[1,4,2], occasion:[1,3,2], colour:[2,2,3]},
      {weather:[2,2,3], occasion:[4,2,2], colour:[4,2,3]}, // Canvas tote, room for a catalogue
      {weather:[4,3,3], occasion:[3,4,4], colour:[2,4,4]}, // Crossbody, hands stay free
      {weather:[4,3,2], occasion:[2,4,1], colour:[2,2,4], addition:true} // Water-resistant backpack
    ]
  };
  // Fictional local offers for the three pieces the visitor does not own.
  // A fitting can only surface an offer available by that outing.
  const offers = {
    ring: [
      {shop:'workshop', won:34000, days:0, stock:2},
      {shop:'market', won:27000, days:2, stock:3}
    ],
    necklace: [
      {shop:'workshop', won:58000, days:0, stock:1},
      {shop:'market', won:41000, days:2, stock:2}
    ],
    bag: [
      {shop:'outdoor', won:52000, days:0, stock:3},
      {shop:'market', won:39000, days:1, stock:2},
      {shop:'outdoor', won:35000, days:0, stock:0}
    ]
  };
  // A visit is local. The fictional weather territory receives only a city-scale
  // area and an outing window. The personal territory retains preferences and the calendar.
  const outings=[
    {window:'rainy-afternoon',days:0}, {window:'spring-day',days:2}, {window:'autumn-evening',days:1}
  ];
  const outlook={'rainy-afternoon':{band:0,celsius:16},'spring-day':{band:1,celsius:19},'autumn-evening':{band:2,celsius:9}};
  function forecastFor(season) {
    const query={area:'demo-city',window:outings[season].window};
    return {query,...outlook[query.window]};
  }
  const catalogueKeys={stoneRing:'ring',pearlNecklace:'necklace',rainPack:'bag'};
  const article={ring:'stoneRing',necklace:'pearlNecklace',bag:'rainPack'};
  const keys = Object.keys(items);
  function quote(criteria) {
    const entries=offers[catalogueKeys[criteria.article]] || [];
    const eligible=entries.filter(item=>item.stock>0 && item.days<=criteria.withinDays);
    return eligible.sort((a,b)=>a.won-b.won || a.days-b.days)[0];
  }
  function sources(look,allowShop=true,batch=null) {
    if(!allowShop)return [];
    return additions(look).map(key=>{
      // Construct a fresh request; the shop never receives the wardrobe, occasion or person.
      const terms={article:article[key],withinDays:outings[look.season].days};
      const token=terms.article+'/'+terms.withinDays;
      if(batch?.has(token))return batch.get(token);
      const gate=window.ScopedHandoff;
      const packet=gate.open('shop',terms,{purpose:'match-accessory'});
      const criteria=gate.receive(packet,'shop');
      const found=quote(criteria);
      const offer=found?gate.returnTo(packet,'wardrobe',found):null;
      const response={key,criteria,offer,alias:packet.alias};
      batch?.set(token,response);
      return response;
    });
  }
  const priorities = {
    balanced:[.34,.36,.30],
    weather:[.72,.16,.12],
    schedule:[.14,.73,.13],
    taste:[.13,.14,.73]
  };
  // The companion garment and bag matter most to comfort and the day's activity.
  // The jewellery plays a greater part when meeting the visitor's colour preference.
  const influence = {
    weather:[.46,.07,.09,.38],
    occasion:[.37,.13,.16,.34],
    colour:[.27,.22,.28,.23]
  };
  const dimensionKeys = Object.keys(influence);

  function validIndex(value, length = 3) {
    return Number.isInteger(value) && value >= 0 && value < length;
  }
  function additions(state) {
    return keys.filter(key => items[key][state[key]]?.addition);
  }
  function evaluate(state, weights, referenceKeys, reference) {
    const affinity = dimensionKeys.map(dimension => {
      const index = dimension === 'colour' ? state.base : dimension === 'weather' ? forecastFor(state.season).band : state.season;
      return keys.reduce((sum, key, i) => sum + items[key][state[key]][dimension][index] * influence[dimension][i], 0);
    });
    const matches = referenceKeys.filter(key => state[key] === reference[key]).length;
    const added = additions(state);
    const score = affinity.reduce((sum, value, i) => sum + value * weights[i], 0);
    // Unrequested additions have a cost; existing pieces are plentiful in both sets.
    const extra = Math.max(0, added.length - 1);
    const value = score - extra * .7 + matches * .82;
    const strongest = affinity.map((n,i) => n * weights[i]);
    const leading = strongest.indexOf(Math.max(...strongest));
    let reason;
    if (referenceKeys.length && matches === referenceKeys.length) reason = 'feedback';
    else if (leading === 2) reason = 'palette';
    else if (leading === 0) reason = ['rain','light','evening'][state.season];
    else if (state.season === 1 && (state.bag === 2 || state.bag === 3)) reason = 'hands';
    else reason = ['gallery','walk','evening'][state.season];
    return {look:{...state,added,reason}, value, suitability:score, matches};
  }
  function distance(a, b) {
    return keys.reduce((sum, key) => sum + Number(a[key] !== b[key]), 0);
  }
  function shortlist(pool, previouslyShown, referenceKeys) {
    const chosen = [];
    const layers = new Set();
    const shownAdditions = new Set();
    const availableAdditions = new Set(pool.flatMap(entry => entry.look.added));
    while (chosen.length < 3) {
      let best, highest = -Infinity;
      for (const candidate of pool) {
        if (layers.has(candidate.look.layer)) continue;
        if (shownAdditions.size < availableAdditions.size &&
            !candidate.look.added.some(key => !shownAdditions.has(key))) continue;
        const shown = previouslyShown.concat(chosen);
        const difference = shown.length ? Math.min(...shown.map(look => distance(candidate.look, look))) : 0;
        // Start with the closest feasible match, then show three genuinely different silhouettes.
        const exact = !chosen.length && referenceKeys.length ? candidate.matches * 5 : 0;
        const value = candidate.value + difference * (chosen.length ? .36 : .10) + exact;
        if (value > highest) { highest = value; best = candidate.look; }
      }
      chosen.push(best);
      layers.add(best.layer);
      for (const key of best.added) shownAdditions.add(key);
    }
    return chosen;
  }
  function rank(config = {}) {
    const base = validIndex(config.base) ? config.base : 0;
    const season = validIndex(config.season) ? config.season : 0;
    const weights = Object.hasOwn(priorities, config.priority) ? priorities[config.priority] : priorities.balanced;
    const reference = config.reference || {};
    const referenceKeys = keys.filter(key => validIndex(reference[key], items[key].length));
    const candidates = [];
    for (let layer = 0; layer < items.layer.length; layer++) {
      for (let ring = 0; ring < items.ring.length; ring++) {
        for (let necklace = 0; necklace < items.necklace.length; necklace++) {
          for (let bag = 0; bag < items.bag.length; bag++) {
            const trial={base,season,layer,ring,necklace,bag};
            if(config.allowShop===false && additions(trial).length)continue;
            candidates.push(evaluate(trial,weights,referenceKeys,reference));
          }
        }
      }
    }
    const owned = shortlist(candidates.filter(entry => !entry.look.added.length), [], referenceKeys);
    // Suggest one new piece at a time unless the visitor has put several new items together.
    const newItems = candidates.filter(({look}) => look.added.length === 1 ||
      (look.added.length > 1 && look.added.every(key => reference[key] === look[key])));
    const inquiries=new Map();
    const available = config.allowShop===false
      ? candidates.filter(({look})=>!owned.includes(look))
      : newItems.filter(({look})=>sources(look,true,inquiries).every(({offer})=>Boolean(offer)));
    const optional = shortlist(available, owned, referenceKeys);
    // Trace real candidates from preliminary trials into the leading shortlist.
    const ranked = [...candidates].sort((a,b) => a.value - b.value);
    const trials = [.04,.16,.29,.43,.58,.72,.86,.94].map(fraction => ranked[Math.floor(fraction * ranked.length)].look);
    trials.push(owned[0]);
    return {looks:owned.concat(optional),trials,tested:candidates.length,forecast:forecastFor(season),inquiries};
  }

  // Compare changing one piece at a time, holding the chosen base and all other pieces fixed.
  // A hypothetical purchase is eligible only when the visitor already put it in the chosen look.
  function tryOccasions(chosen, priority) {
    const personal = priorities[priority] || priorities.balanced;
    const situations = [[.58,.36,.06],[.36,.57,.07],[.34,.53,.13]];
    return situations.map((situation,season) => {
      const weights = situation.map((value,i)=>value*.8+personal[i]*.2);
      const baseline = {...chosen,season};
      let best = evaluate(baseline,weights,[],{}), changed = null, tested = 1;
      for (const key of keys) {
        for (let id=0;id<items[key].length;id++) {
          if (id===chosen[key] || items[key][id].addition) continue;
          const trial = evaluate({...baseline,[key]:id},weights,[],{});
          tested++;
          if (trial.suitability > best.suitability + 1e-8) {
            best=trial; changed=key;
          }
        }
      }
      return {look:best.look, changed, tested};
    });
  }

  function compareBases(config = {}) {
    const results = [0,1,2].map(base => rank({...config,base}));
    // Present two owned silhouettes and one optional accent for the outing.
    const accent = ['bag','ring','necklace'][results[0].looks[0].season];
    const comparison = results.map((result,base) => {
      if (base === 2) return result.looks.find(look => look.added.includes(accent)) || result.looks[0];
      const owned = result.looks.slice(0,3);
      if (base === 1) return owned.find(look => look.layer !== results[0].looks[0].layer) || owned[0];
      return owned[0];
    });
    return {results,comparison,priority:config.priority||'balanced',allowShop:config.allowShop!==false,tested:results.reduce((sum,result) => sum + result.tested,0)};
  }
  window.LookEngine = {rank, additions, sources, forecastFor, compareBases, tryOccasions};
})();
