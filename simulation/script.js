/* ONDURU 바탕 시안(base) — 움직임 둘. 바깥 라이브러리 없음. 꺼져도 글은 다 보이고 링크는 다 든다.
 *  1. 목록에서 지금 읽는 칸을 짚는다(aria-current → 열린 원).
 *  2. 없는 주소: 연을 무작위로 고르고, 남은 초를 세고, 머무르기 · 다른 연 보기를 듣는다.
 *     미리보기(<html data-variant>)에서는 초가 다 되어도 옮겨 가지 않는다. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;

  /* ───── 1. 지금 읽는 칸 ───── */
  var index = d.querySelector('.index');
  if (index) {
    var links = [].slice.call(index.querySelectorAll('a[href^="#"]'));
    var secs = links.map(function (a) { return d.getElementById(a.getAttribute('href').slice(1)); });
    var cur = -1, waiting = false;
    var mark = function () {
      waiting = false;
      var line = Math.max(120, window.innerHeight * 0.33), now = -1, i;
      for (i = 0; i < secs.length; i++) { if (secs[i] && secs[i].getBoundingClientRect().top <= line) now = i; }
      /* 바닥에 닿았으면 마지막 칸(짧아서 줄에 못 닿는 칸) */
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= root.scrollHeight - 2) now = secs.length - 1;
      if (now === cur) return;
      if (cur >= 0) links[cur].removeAttribute('aria-current');
      cur = now;
      if (cur < 0) return;
      links[cur].setAttribute('aria-current', 'location');
      /* 띠(휴대폰)에서는 짚은 것이 보이게 옆으로 민다 — 페이지는 건드리지 않는다 */
      var r = links[cur].getBoundingClientRect(), b = index.getBoundingClientRect();
      if (r.left < b.left + 12) index.scrollLeft -= (b.left + 12 - r.left);
      else if (r.right > b.right - 12) index.scrollLeft += (r.right - b.right + 12);
    };
    var ask = function () { if (!waiting) { waiting = true; window.requestAnimationFrame(mark); } };
    window.addEventListener('scroll', ask, { passive: true });
    window.addEventListener('resize', ask);
    mark();
  }

  /* ───── 2. 없는 주소 ───── */
  var nf = d.querySelector('[data-nf="root"]');
  if (nf) {
    var q = function (k) { return nf.querySelector('[data-nf="' + k + '"]'); };
    var stanzas = [].slice.call(nf.querySelectorAll('.stanza'));
    var froms = [].slice.call(nf.querySelectorAll('[data-from]'));
    var count = q('count'), state = q('state'), go = q('go'), stay = q('stay'), another = q('another');
    var shown = 0, timer = null, left = 0;
    var total = parseInt(nf.getAttribute('data-seconds'), 10) || 0;
    var preview = false;
    var calm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    var show = function (i) {
      var w = stanzas[i].getAttribute('data-work'), k;
      for (k = 0; k < stanzas.length; k++) stanzas[k].hidden = (k !== i);
      for (k = 0; k < froms.length; k++) froms[k].hidden = (froms[k].getAttribute('data-from') !== w);
      shown = i;
    };
    var paint = function () { count.textContent = nf.getAttribute('data-moving').replace('{n}', String(left)); };
    var stop = function () { if (timer) { window.clearInterval(timer); timer = null; } count.hidden = true; stay.hidden = true; };
    var arrive = function () {
      stop();
      if (!preview) { window.location.href = go.href; return; }
      var s = d.createElement('span');           /* 미리보기에서만 보이는 상태 줄 */
      s.lang = 'ko'; s.setAttribute('translate', 'no'); s.textContent = nf.getAttribute('data-pv-arrive');
      state.textContent = ''; state.appendChild(s);
    };
    var start = function () {
      if (timer) window.clearInterval(timer);
      left = total; paint(); state.textContent = ''; count.hidden = false; stay.hidden = false;
      timer = window.setInterval(function () { left -= 1; if (left <= 0) arrive(); else paint(); }, 1000);
    };

    if (stanzas.length) {
      show(Math.floor(Math.random() * stanzas.length));
      if (stanzas.length > 1) {
        another.hidden = false;
        another.addEventListener('click', function () {
          var i; do { i = Math.floor(Math.random() * stanzas.length); } while (i === shown);
          show(i);
          if (timer) start();                      /* 새 연을 읽을 시간을 처음부터 다시 준다 */
        });
      }
    }
    /* 저절로 감: 움직임 줄이기를 켠 사람에게는 하지 않는다(스크립트가 꺼지면 이 줄 자체가 없다) */
    if (total > 0 && !calm) {
      stay.addEventListener('click', function () { stop(); state.textContent = nf.getAttribute('data-staying'); });
      start();
    }
  }
})();


/* ───── 시뮬레이션: 그림 셋의 움직임 — 지금 페이지의 스크립트 그대로 ───── */
(function(){
'use strict';
var reduce=false;
try{reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
var STATES=['w','fz','sig','unk','deny','tr'];
[].slice.call(document.querySelectorAll('figure.sim')).forEach(function(fig){
  var svg=fig.querySelector('svg'),steps=[].slice.call(fig.querySelectorAll('ol.steps > li')),ctl=fig.querySelector('.ctl');
  if(!svg||!steps.length||!ctl)return;
  var bPlay=ctl.querySelector('.play'),bPrev=ctl.querySelector('.prev'),bNext=ctl.querySelector('.next'),cnt=ctl.querySelector('.cnt'),cap=fig.querySelector('.capnow');
  var cur=-1,timer=null,dwell=parseInt(fig.getAttribute('data-dwell'),10)||3400;
  function all(k){return [].slice.call(fig.querySelectorAll('[data-k="'+k+'"]'));}
  function clear(){
    [].slice.call(fig.querySelectorAll('.on')).forEach(function(el){el.classList.remove('on');});
    STATES.forEach(function(s){[].slice.call(fig.querySelectorAll('.s-'+s)).forEach(function(el){el.classList.remove('s-'+s);});});
  }
  function show(k){
    cur=k;clear();
    fig.classList.toggle('run',k>=0);svg.classList.toggle('dim',k>=0);
    steps.forEach(function(li,j){li.classList.toggle('cur',j===k);if(j===k)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});
    if(k>=0){
      for(var j=0;j<=k;j++){(steps[j].getAttribute('data-state')||'').split(/\s+/).forEach(function(p){if(!p)return;var a=p.split(':');all(a[1]).forEach(function(el){el.classList.add('s-'+a[0]);});});}
      (steps[k].getAttribute('data-on')||'').split(/\s+/).forEach(function(id){if(id)all(id).forEach(function(el){el.classList.add('on');});});
    }
    cnt.textContent=k>=0?(k+1)+' / '+steps.length:'';
    if(cap){cap.hidden=k<0;cap.textContent='';if(k>=0){var d=steps[k].querySelector('.d'),w=steps[k].querySelector('.w'),b=document.createElement('b');b.textContent=(k+1)+'. '+(d.firstChild?d.firstChild.textContent:'').trim();cap.appendChild(b);cap.appendChild(document.createTextNode(w?w.textContent:''));}}
  }
  function halt(){if(timer){clearTimeout(timer);timer=null;}bPlay.textContent=bPlay.getAttribute('data-play');bPlay.setAttribute('aria-pressed','false');}
  function wait(k){var li=steps[k],n=li?(li.textContent||'').replace(/\s+/g,'').length:0;return Math.max(dwell,Math.min(9500,800+n*60));}
  function tick(){
    if(cur>=steps.length-1){timer=null;halt();show(-1);return;}
    show(cur+1);timer=setTimeout(tick,wait(cur));
  }
  function play(){if(cur>=steps.length-1)show(-1);bPlay.textContent=bPlay.getAttribute('data-pause');bPlay.setAttribute('aria-pressed','true');timer=setTimeout(tick,cur<0?250:wait(cur));}
  bPlay.addEventListener('click',function(){if(timer)halt();else play();});
  bNext.addEventListener('click',function(){halt();show(cur>=steps.length-1?-1:cur+1);});
  bPrev.addEventListener('click',function(){halt();show(cur<0?steps.length-1:cur-1);});
  steps.forEach(function(li,j){li.addEventListener('click',function(ev){if(!fig.classList.contains('run'))return;if(ev.target.closest&&ev.target.closest('a,button'))return;halt();show(j);});});
  [].slice.call(fig.querySelectorAll('button.trace')).forEach(function(b){
    b.hidden=false;
    b.addEventListener('click',function(){
      halt();show(steps.length-1);
      [].slice.call(fig.querySelectorAll('.on')).forEach(function(el){el.classList.remove('on');});
      (b.getAttribute('data-trace')||'').split(/\s+/).forEach(function(id){if(id)all(id).forEach(function(el){el.classList.add('on');el.classList.add('s-tr');});});
      var led=fig.querySelector('.ledger');if(led&&led.scrollIntoView){try{led.scrollIntoView({block:'nearest',behavior:reduce?'auto':'smooth'});}catch(e){led.scrollIntoView();}}
    });
  });
  ctl.hidden=false;show(-1);
  if(!reduce&&'IntersectionObserver' in window){
    var seen=false,io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!seen){seen=true;io.disconnect();if(cur<0&&!timer)play();}});},{threshold:0.6});
    io.observe(svg);
  }
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting&&timer)halt();});},{threshold:0}).observe(fig);
  }
});
})();
