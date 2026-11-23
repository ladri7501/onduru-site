(() => {
  'use strict';
  const labels={
    ko:{title:'연대',close:'연대 닫기'},en:{title:'Solidarity',close:'Close solidarity'},
    es:{title:'Solidaridad',close:'Cerrar solidaridad'}
  };
  function mount(dialog,{onClose}={}) {
    const bar=document.createElement('header');
    bar.className='coalition-bar';
    const title=document.createElement('h2');
    title.id='coalition-title';
    const closeButton=document.createElement('button');
    closeButton.type='button';
    closeButton.textContent='×';
    const host=document.createElement('div');
    host.className='coalition-world';
    bar.append(title,closeButton);
    dialog.replaceChildren(bar,host);
    dialog.setAttribute('aria-labelledby',title.id);
    const globe=window.HorizonSky.mount(host);
    let language='ko',opener=null;
    function setLocale(lang) {
      language=Object.hasOwn(labels,lang)?lang:'ko';
      const text=labels[language];
      dialog.lang=language;title.textContent=text.title;
      closeButton.setAttribute('aria-label',text.close);
      closeButton.title=text.close;
      if(dialog.open)globe.setLocale(language);
    }
    function open(lang='ko',trigger=null) {
      setLocale(lang);
      if(dialog.open)return;
      opener=trigger || document.activeElement;
      dialog.showModal();
      dialog.scrollTop=0;
      globe.show(language);
      closeButton.focus({preventScroll:true});
    }
    function close() {if(dialog.open)dialog.close();}
    closeButton.addEventListener('click',close);
    dialog.addEventListener('click',event=>{
      if(event.target!==dialog)return;
      const r=dialog.getBoundingClientRect();
      if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)close();
    });
    dialog.addEventListener('close',()=>{
      if(dialog.open)return;
      globe.hide();
      if(opener?.isConnected)opener.focus({preventScroll:true});
      opener=null;
      onClose?.();
    });
    return {open,setLocale,close,isOpen:()=>dialog.open};
  }
  window.CoalitionRoom={mount};
})();
