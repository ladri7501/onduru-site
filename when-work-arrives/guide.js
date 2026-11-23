(() => {
  'use strict';

  let currentLocale;
  let openPrinciple = null;
  let currentPage = 'philosophy';
  const index = document.getElementById('guide-index');
  const pageLabels = {
    ko: {index: '도록 목차', philosophy: '철학', flow: '요청의 경로', source: '자료와 기록'},
    en: {index: 'Catalogue contents', philosophy: 'Philosophy', flow: 'A request’s path', source: 'Sources and records'},
    es: {index: 'Índice del catálogo', philosophy: 'Filosofía', flow: 'Ruta de una petición', source: 'Fuentes y registros'}
  };

  function selectPage(page) {
    currentPage = page;
    for (const button of index.querySelectorAll('button')) {
      const selected = button.dataset.page === page;
      button.setAttribute('aria-pressed', String(selected));
      document.getElementById('guide-' + button.dataset.page).hidden = !selected;
    }
    document.getElementById('guide-related').hidden = page !== 'source';
  }

  for (const button of index.querySelectorAll('button')) {
    button.addEventListener('click', () => selectPage(button.dataset.page));
  }

  function make(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function localize(locale, title) {
    const words = window.CaseGuideText[locale];
    const labels = window.TerritoryGuide[locale];
    document.getElementById('guide-label').textContent = labels.heading;
    document.getElementById('guide-title').textContent = title;
    document.getElementById('close-guide').textContent = labels.close;
    document.getElementById('guide-intent').textContent = words.intent;
    if (currentLocale === locale) return;
    currentLocale = locale;

    document.getElementById('guide-legend').textContent = words.legend;
    index.setAttribute('aria-label', pageLabels[locale].index);
    for (const button of index.querySelectorAll('button')) {
      button.textContent = pageLabels[locale][button.dataset.page];
    }
    const philosophy = make('section', 'catalogue-philosophy');
    philosophy.id = 'guide-philosophy';
    philosophy.append(make('h3', '', words.philosophyTitle), make('p', '', words.philosophy), make('p', '', words.horizon));

    const flow = make('section', 'catalogue-flow');
    flow.id = 'guide-flow';
    flow.append(make('h3', '', words.flowTitle));
    const rows = new Map();

    function show(key) {
      openPrinciple = key;
      for (const [name, {button, panel}] of rows) {
        const expanded = name === key;
        button.setAttribute('aria-expanded', String(expanded));
        panel.hidden = !expanded;
      }
    }

    for (const [key, [name, heading, definition]] of Object.entries(words.principles)) {
      const row = make('div', 'catalogue-entry');
      const buttonHeading = make('h4', '');
      const button = make('button', 'catalogue-choice');
      button.type = 'button';
      button.id = 'guide-choice-' + key;
      const panel = make('section', 'catalogue-leaf');
      panel.id = 'guide-leaf-' + key;
      panel.setAttribute('aria-labelledby', button.id);
      button.setAttribute('aria-controls', panel.id);
      const term = make('strong', 'catalogue-term', name);
      if (locale === 'ko') term.lang = 'en';
      const indicator = make('span', 'catalogue-mark');
      indicator.setAttribute('aria-hidden', 'true');
      button.append(term, make('span', 'catalogue-function', words.flowKeys[key]), indicator);
      button.addEventListener('click', () => {
        show(openPrinciple === key ? null : key);
        button.scrollIntoView({block: 'nearest'});
      });
      rows.set(key, {button, panel});
      buttonHeading.append(button);
      panel.append(make('p', 'catalogue-question', heading), make('p', '', definition));

      if (key === 'method') {
        const beats = make('ol', 'catalogue-beats');
        for (const beat of words.beats) beats.append(make('li', '', beat));
        const steps = make('ol', 'catalogue-steps');
        for (const [action, explanation] of words.methodSteps) {
          const step = make('li');
          step.append(make('strong', '', action), make('small', '', explanation));
          steps.append(step);
        }
        panel.append(beats, steps);
      }
      row.append(buttonHeading, panel);
      flow.append(row);
    }
    show(openPrinciple);

    const credit = make('p', 'catalogue-source');
    const link = make('a', '', words.sourceLink);
    link.href = window.Prologue.sourceUrl(locale);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    credit.append(make('span', '', words.sourceNote), link);
    const sources = make('section', 'catalogue-sources');
    sources.id = 'guide-source';
    const geography = make('p', 'catalogue-source');
    geography.append(make('span', '', words.geographyNote));
    for (const atlasSource of window.FederationAtlas.sources.slice(0, 2)) {
      const source = make('a', '', atlasSource.name);
      source.href = atlasSource.url;
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      geography.append(source);
      if (atlasSource.licenseUrl) {
        const license = make('a', '', atlasSource.license);
        license.href = atlasSource.licenseUrl;
        license.target = '_blank';
        license.rel = 'noopener noreferrer';
        geography.append(license);
      }
    }
    sources.append(make('h3', '', pageLabels[locale].source), credit, geography);
    document.getElementById('guide-sections').replaceChildren(philosophy, flow, sources);
    selectPage(currentPage);
  }

  window.CaseGuide = {localize};
})();
