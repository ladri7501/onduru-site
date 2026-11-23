(() => {
  'use strict';

  const copy = {
    ko: {
      title: '서울에서 잇는 연대',
      lead: '전시에서는 파운더리를 가진 나라가 모델을 열고, 다른 나라도 협약을 통해 함께 씁니다.',
      share: '모델을 함께 나눌 나라', cut: '공급을 중단한 나라',
      all: '전체 선택', clear: '선택 해제', none: '선택 없음', unavailable: '공유할 수 있는 나라 없음',
      every: n => '전체 ' + n + '개국',
      more: (first, n) => first + ' 외 ' + n + '개국',
      connected: (sources, members) => sources + '개국이 모델을 나누고 ' + members + '개 국가·지역이 협약에 참여합니다.',
      empty: '열려 있는 파운더리를 고르면 협약국들이 연결됩니다.',
      cutHome: '서울의 공급은 멈췄습니다. 다른 나라의 연대는 이어집니다.'
    },
    en: {
      title: 'Solidarity from Seoul',
      lead: 'In this exhibition, countries open their foundries and others use the shared models by agreement.',
      share: 'Countries to share models with', cut: 'Countries suspending supply',
      all: 'Select all', clear: 'Clear selection', none: 'None selected', unavailable: 'No countries available to share',
      every: n => 'All ' + n + ' countries',
      more: (first, n) => first + ' and ' + n + ' more',
      connected: (sources, members) => sources + (sources === 1 ? ' country shares' : ' countries share') + ' models across an agreement covering ' + members + ' countries and territories.',
      empty: 'Choose an available foundry to connect the participating countries.',
      cutHome: 'Supply from Seoul is suspended. Other countries keep working together.'
    },
    es: {
      title: 'Cooperación desde Seúl',
      lead: 'En esta exposición, unos países abren sus centros de modelos y otros los utilizan gracias a un acuerdo.',
      share: 'Países con los que compartir modelos', cut: 'Países que suspenden el suministro',
      all: 'Seleccionar todos', clear: 'Borrar selección', none: 'Ninguno seleccionado', unavailable: 'Ningún país disponible para compartir',
      every: n => (n === 1 ? 'El único país disponible' : 'Los ' + n + ' países'),
      more: (first, n) => first + ' y ' + n + ' más',
      connected: (sources, members) => sources + (sources === 1 ? ' país comparte' : ' países comparten') + ' modelos mediante un acuerdo que reúne a ' + members + ' países y territorios.',
      empty: 'Elige un centro disponible para conectar a los países participantes.',
      cutHome: 'Se suspende el suministro desde Seúl. Los demás países siguen cooperando.'
    }
  };
  const initialCuts = ['US', 'CN'];
  const edition = 'foundry-coalition-v2';
  const ledgerPrefix = 'onduru.federation.event.v1.';
  const memory = new Map();
  let nextId = 0;

  function el(tag, className) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    return item;
  }

  function button(className) {
    const item = el('button', className);
    item.type = 'button';
    return item;
  }

  function equal(a, b) {
    return a.size === b.size && [...a].every(code => b.has(code));
  }

  function latest(lane, currentEditionOnly) {
    let last = null;
    function consider(entry) {
      if (!entry || entry.scope !== lane || entry.caseKey || (currentEditionOnly && entry.edition !== edition)) return;
      if (!Array.isArray(entry.blocked) || !Array.isArray(entry.members)) return;
      if (!last || entry.time > last.time || (entry.time === last.time && entry.sequence > last.sequence)) last = entry;
    }
    memory.forEach(consider);
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (!key?.startsWith(ledgerPrefix)) continue;
        try { consider(JSON.parse(window.localStorage.getItem(key))); } catch { /* Invalid historical event. */ }
      }
    } catch { /* Storage is optional in embedded previews. */ }
    return last;
  }

  function writeEvent(lane, action, wanted, plan) {
    const previous = latest(lane, false);
    const id = window.crypto?.randomUUID?.() || Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    const entry = {
      id, edition, time: Date.now(), sequence: (previous?.sequence || 0) + 1, parent: previous?.id || '',
      scope: lane, caseKey: '', action, author: 'actorOn', decision: 'proposed',
      origin: 'KR', focus: plan.focus?.region || 'KR', requested: [...wanted], providers: plan.providers.map(p => p.region),
      members: plan.participatingCountries, blocked: plan.blocked, task: plan.task, executed: false, rawTransfers: 0
    };
    try { window.localStorage.setItem(ledgerPrefix + id, JSON.stringify(entry)); }
    catch { memory.set(id, entry); }
  }

  function multiSelect(kind, change, bulk, beforeOpen) {
    const uid = 'f-combo-' + ++nextId;
    const wrap = el('div', 'f-field'), label = el('span', 'f-label');
    const trigger = button('f-trigger'), value = el('span', 'f-value');
    const popup = el('div', 'f-popup'), list = el('div', 'f-list'), tools = el('div', 'f-bulk');
    const selectAll = button(), clear = button();
    label.id = uid + '-label'; value.id = uid + '-value'; list.id = uid + '-list';
    trigger.setAttribute('role', 'combobox'); trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-controls', list.id); trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-labelledby', label.id + ' ' + value.id);
    list.tabIndex = 0; list.setAttribute('role', 'listbox');
    list.setAttribute('aria-multiselectable', 'true'); list.setAttribute('aria-labelledby', label.id);
    popup.hidden = true;
    trigger.append(value); tools.append(selectAll, clear); popup.append(list, tools); wrap.append(label, trigger, popup);
    let codes = [], names = new Map(), options = new Map(), selected = new Set(), cursor = null, locale = 'ko';
    let typed = '', typeTime = 0;
    function setCursor(code, scroll = true) {
      if (!options.has(code)) return;
      options.get(cursor)?.classList.remove('is-cursor');
      cursor = code;
      const option = options.get(code);
      option.classList.add('is-cursor'); list.setAttribute('aria-activedescendant', option.id);
      if (scroll && !popup.hidden) {
        const offset = option.offsetTop;
        if (offset < list.scrollTop) list.scrollTop = offset;
        else if (offset + option.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = offset + option.offsetHeight - list.clientHeight;
      }
    }
    function close(refocus = false) {
      if (popup.hidden) return;
      popup.hidden = true; trigger.setAttribute('aria-expanded', 'false');
      document.removeEventListener('pointerdown', outside, true);
      if (refocus && !trigger.disabled) trigger.focus({preventScroll: true});
    }
    function outside(event) { if (!wrap.contains(event.target)) close(); }
    function open(last = false) {
      if (trigger.disabled) return;
      beforeOpen();
      popup.hidden = false; trigger.setAttribute('aria-expanded', 'true');
      document.addEventListener('pointerdown', outside, true);
      list.focus({preventScroll: true});
      setCursor(last ? codes.at(-1) : codes.find(code => selected.has(code)) || codes[0]);
    }
    trigger.addEventListener('click', () => popup.hidden ? open() : close(true));
    trigger.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault(); event.stopPropagation(); open(event.key === 'ArrowUp');
      }
    });
    wrap.addEventListener('focusout', event => {
      if (!wrap.contains(event.relatedTarget)) close();
    });
    wrap.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !popup.hidden) {
        event.preventDefault(); event.stopPropagation(); close(true);
      }
    });
    list.addEventListener('click', event => {
      const option = event.target.closest('[role=option]');
      if (!option || !list.contains(option)) return;
      list.focus({preventScroll: true}); setCursor(option.dataset.code, false);
      change(cursor);
    });
    list.addEventListener('keydown', event => {
      const idx = codes.indexOf(cursor), last = codes.length - 1;
      let next;
      if (event.key === 'ArrowDown') next = Math.min(last, idx + 1);
      else if (event.key === 'ArrowUp') next = Math.max(0, idx - 1);
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = last;
      else if (event.key === 'Enter' || event.key === ' ') change(cursor);
      else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') bulk(true);
      else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const now = Date.now(), letter = event.key.toLocaleLowerCase(locale);
        typed = now - typeTime > 700 ? letter : typed + letter; typeTime = now;
        const start = idx + 1, ordered = [...codes.slice(start), ...codes.slice(0, start)];
        let target = ordered.find(code => names.get(code).toLocaleLowerCase(locale).startsWith(typed));
        if (!target) { typed = letter; target = ordered.find(code => names.get(code).toLocaleLowerCase(locale).startsWith(letter)); }
        if (target) setCursor(target);
      } else return;
      event.preventDefault(); event.stopPropagation();
      if (next != null) setCursor(codes[next]);
    });
    selectAll.addEventListener('click', () => { bulk(true); list.focus({preventScroll: true}); });
    clear.addEventListener('click', () => { bulk(false); list.focus({preventScroll: true}); });
    function render(available, desired, displayNames, lang) {
      const c = copy[lang], rebuild = locale !== lang || codes.join() !== available.join();
      codes = available; names = displayNames; selected = desired; locale = lang;
      if (rebuild) {
        options = new Map(codes.map(code => {
          const option = el('div', 'f-option');
          option.id = uid + '-' + code; option.dataset.code = code;
          option.setAttribute('role', 'option'); option.textContent = names.get(code);
          return [code, option];
        }));
        list.replaceChildren(...options.values());
        if (!options.has(cursor)) cursor = codes[0] || null;
        if (cursor) setCursor(cursor, false);
        else list.removeAttribute('aria-activedescendant');
      }
      label.textContent = c[kind];
      const checked = codes.filter(code => selected.has(code)), summary = checked.map(code => names.get(code));
      value.textContent = !codes.length ? c.unavailable : !checked.length ? c.none :
        checked.length === codes.length && codes.length > 2 ? c.every(codes.length) :
        checked.length <= 2 ? summary.join(' · ') : c.more(summary.slice(0, 2).join(' · '), checked.length - 2);
      for (const [code, item] of options) item.setAttribute('aria-selected', String(selected.has(code)));
      trigger.disabled = !codes.length;
      if (trigger.disabled) close();
      selectAll.textContent = c.all; clear.textContent = c.clear;
      selectAll.setAttribute('aria-disabled', String(checked.length === codes.length));
      clear.setAttribute('aria-disabled', String(!checked.length));
    }
    return {element: wrap, render, close};
  }

  function mount(onChange, _onFocus, lane = 'solidarity') {
    const root = el('section', 'federation-panel'), title = el('h3'), lead = el('p', 'f-hint');
    const fields = el('div', 'f-fields'), status = el('p', 'f-stats');
    status.setAttribute('role', 'status'); status.setAttribute('aria-atomic', 'true');
    let places = null, lang = 'ko', focus = 'KR', wanted = null, blocked = new Set(initialCuts);
    let all = [], names = new Map(), plan = null, held = false, pending = null;
    const share = multiSelect('share', code => toggle('share', code), value => chooseAll('share', value), () => cut.close());
    const cut = multiSelect('cut', code => toggle('cut', code), value => chooseAll('cut', value), () => share.close());
    fields.append(share.element, cut.element); root.append(title, lead, fields, status);

    function calculate() {
      return window.Federation.inspectCountries(places, {
        origin: 'KR', focus, members: 'all', providerCountries: [...wanted], blocked: [...blocked], held
      });
    }
    function reflect() {
      plan = {...calculate(), decision: held ? 'held' : 'proposed', upstreamHeld: held};
      const c = copy[lang];
      title.textContent = c.title; lead.textContent = c.lead;
      share.render(all.filter(code => !blocked.has(code)), wanted, names, lang);
      cut.render(all, blocked, names, lang);
      const connected = plan.providers.length ? c.connected(plan.providers.length, plan.participatingCountries.length) : c.empty;
      const text = (plan.providers.length && blocked.has('KR') ? c.cutHome + ' ' : '') + connected;
      if (status.textContent !== text) status.textContent = text;
    }
    function setSelection(kind, next) {
      const previous = kind === 'share' ? wanted : blocked;
      if (equal(previous, next)) return;
      if (kind === 'share') wanted = next; else blocked = next;
      reflect(); writeEvent(lane, kind === 'share' ? 'ledgerChange' : 'policyChange', wanted, plan);
      onChange?.(plan);
    }
    function toggle(kind, code) {
      if (!all.includes(code) || (kind === 'share' && blocked.has(code))) return;
      const next = new Set(kind === 'share' ? wanted : blocked);
      if (next.has(code)) next.delete(code); else next.add(code);
      setSelection(kind, next);
    }
    function chooseAll(kind, value) {
      const next = new Set(kind === 'share' ? wanted : blocked);
      for (const code of all) {
        if (kind === 'share' && blocked.has(code)) continue;
        if (value) next.add(code); else next.delete(code);
      }
      setSelection(kind, next);
    }
    function refresh(nextPlaces, visible, language) {
      if (!nextPlaces?.length) return null;
      const chosenLang = Object.hasOwn(copy, language) ? language : 'ko';
      if (places !== nextPlaces || lang !== chosenLang) {
        places = nextPlaces; lang = chosenLang;
        const display = new Intl.DisplayNames([lang], {type: 'region'});
        all = window.Federation.countryProviders(places).map(provider => provider.region);
        names = new Map(all.map(code => [code, lang === 'ko' && code === 'AU' ? '호주' : display.of(code)]));
      }
      focus = typeof visible === 'string' ? visible : visible?.region || 'KR';
      if (wanted === null) {
        const previous = latest(lane, true);
        wanted = new Set((previous?.requested || all).filter(code => all.includes(code)));
        blocked = new Set((previous?.blocked || initialCuts).filter(code => all.includes(code)));
      }
      if (pending) {
        if (Array.isArray(pending.providerCountries)) wanted = new Set(pending.providerCountries.filter(code => all.includes(code)));
        if (Array.isArray(pending.blocked)) blocked = new Set(pending.blocked.filter(code => all.includes(code)));
        held = Boolean(pending.held); pending = null;
      }
      reflect(); return plan;
    }
    function dismiss() { share.close(); cut.close(); }
    function reset() {
      dismiss(); wanted = null; blocked = new Set(initialCuts); plan = null; pending = null; held = false;
    }
    return {
      element: root, refresh, reset, dismiss, destroy: dismiss, snapshot: () => plan,
      configure(settings) { pending = settings || {}; },
      setUpstreamHeld(value) { held = Boolean(value); if (plan) reflect(); }
    };
  }
  window.FederationPanel = {mount};
})();
