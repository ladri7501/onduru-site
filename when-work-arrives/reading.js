(() => {
  'use strict';

  function line(text, className, principle) {
    const node = document.createElement('p');
    node.className = 'reading-layer ' + className;
    if (principle) {
      const label = document.createElement('span');
      label.className = 'reading-principle';
      label.textContent = principle;
      node.append(label);
    }
    node.append(document.createTextNode(text));
    return {node, spoken: principle ? principle + ' · ' + text : text};
  }

  function fade(phase, start, end) {
    const t = Math.max(0, Math.min(1, (phase - start) / (end - start)));
    return t * t * (3 - 2 * t);
  }

  function mount(container) {
    container.classList.add('reading');
    let layers = [], ends = [], inFilm = false;
    const quiet = .958, fadeWidth = .038;

    function setScene(parts, note, glossParts, film = false) {
      inFilm = film;
      container.classList.toggle('film-reading', film);
      if(film){
        layers = [line(parts[0],'reading-poem'),line(parts[1],'reading-poem')];
        container.replaceChildren(...layers.map(layer => layer.node));
        return;
      }
      const glosses = glossParts?.length === 2 && glossParts[1] ? glossParts : [note[1]];
      layers = [
        line(parts[0], 'reading-poem'),
        line(parts[1], 'reading-poem'),
        ...glosses.map((text, i) => line(text, 'scene-note reading-meaning', i === 0 ? note[0] : ''))
      ];
      ends = glosses.length === 2 ? [.22, .445, .69, quiet] : [.24, .49, quiet];
      container.replaceChildren(...layers.map(layer => layer.node));
    }

    function render(phase, reducedMotion) {
      if(inFilm){
        // Hold both lines while the camera moves so each cut can be read as a whole.
        const lead = reducedMotion ? 1 : fade(phase, 0, .055);
        const reply = reducedMotion ? 1 : fade(phase, .13, .22);
        layers[0].node.style.opacity=String(lead);
        layers[1].node.style.opacity=String(reply);
        return reply>.05 ? layers.map(layer=>layer.spoken).join(' ') : layers[0].spoken;
      }
      let start = 0, spoken = '';
      for (let i = 0; i < layers.length; i++) {
        const end = ends[i], layer = layers[i];
        const active = phase >= start && phase < end;
        let alpha = 0;
        if (active) {
          alpha = reducedMotion ? 1 : fade(phase, start, start + fadeWidth)
            * (1 - fade(phase, end - fadeWidth, end));
          if (alpha > .01) spoken = layer.spoken;
        }
        const next = String(Math.round(alpha * 1000) / 1000);
        if (next !== layer.node.style.opacity) layer.node.style.opacity = next;
        start = end;
      }
      return spoken;
    }

    return {setScene, render};
  }

  window.ExhibitReading = {mount};
})();
