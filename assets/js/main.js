// Script mínimo para futuras interacciones (galería, modales, etc.)
document.addEventListener('DOMContentLoaded', ()=>{
  console.log('Biblioteca visual cargada');

  // Añade clase temporal 'is-pressed' al hacer click/touch para animaciones
  const interactive = document.querySelectorAll('.card, .btn, .thumb, .nav a');

  function addPressHandlers(el){
    const start = ()=> el.classList.add('is-pressed');
    const end = ()=> el.classList.remove('is-pressed');
    el.addEventListener('mousedown', start);
    el.addEventListener('touchstart', start, {passive:true});
    ['mouseup','mouseleave','touchend','touchcancel'].forEach(evt=> el.addEventListener(evt, end));

    // keyboard activation for accessibility
    el.addEventListener('keydown', (e)=>{
      if(e.key === ' ' || e.key === 'Enter'){
        el.classList.add('is-pressed');
        setTimeout(()=> el.classList.remove('is-pressed'), 160);
      }
    });
  }

  interactive.forEach(addPressHandlers);
});

// Page transition overlay and navigation handling
document.addEventListener('DOMContentLoaded', ()=>{
  // create overlay element
  let overlay = document.createElement('div');
  overlay.className = 'page-overlay';
  document.body.appendChild(overlay);

  // fade-in content wrapper if present
  const root = document.getElementById('page-root');
  if(root){
    root.classList.add('page-fade-in');
    // allow next tick then mark ready to trigger transition
    requestAnimationFrame(()=> setTimeout(()=> root.classList.add('ready'), 20));
  }

  function navigateWithOverlay(href){
    overlay.classList.add('show');
    setTimeout(()=> { window.location.href = href; }, 420);
  }

  // intercept clicks on internal links to animate
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href');
    if(!href) return;
    // ignore external or targets that open new tab
    if(a.target === '_blank' || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    // same-page anchor
    if(href.startsWith('#')){
      e.preventDefault();
      const id = href.slice(1);
      const target = document.getElementById(id);
      if(target){
        target.scrollIntoView({behavior:'smooth', block:'start'});
        target.focus({preventScroll:true});
      }
      return;
    }

    // relative or absolute same-origin links
    const isInternal = !/^(https?:)?\/\//i.test(href) || href.indexOf(location.origin) === 0 || href.startsWith('/');
    if(isInternal){
      e.preventDefault();
      // small delay to show press feedback
      setTimeout(()=> navigateWithOverlay(href), 80);
    }
  });
});
