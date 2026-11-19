{
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

// Fotos: fehlt ein Bild, bleibt die Illustration im Bogen sichtbar
$$('.arch img').forEach(i=>{const m=()=>i.parentNode.classList.add('miss');i.addEventListener('error',m);if(i.complete&&!i.naturalWidth)m();});

// Header
const hd=$('.hd');
const onScroll=()=>{hd.classList.toggle('solid',scrollY>40);
  if(!reduce){const y=scrollY;$$('[data-par]').forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
    el.style.transform=`translateY(${((r.top+r.height/2-innerHeight/2)*-parseFloat(el.dataset.par)).toFixed(1)}px) scale(1.12)`;});}};
addEventListener('scroll',onScroll,{passive:true});onScroll();

// Menü
const bg=$('.burger');
bg&&bg.addEventListener('click',()=>{const o=hd.classList.toggle('open');bg.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''});
addEventListener('keydown',e=>{if(e.key==='Escape'&&hd.classList.contains('open'))bg.click()});

// Einblenden beim Scrollen
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});
$$('.reveal').forEach(el=>io.observe(el));

// Seitenübergang
const cur=$('.curtain');
$$('a[href$=".html"],a[href*=".html#"]').forEach(a=>a.addEventListener('click',e=>{
  if(reduce||e.metaKey||e.ctrlKey||a.target)return;
  const href=a.getAttribute('href');if(href.startsWith('#'))return;
  e.preventDefault();cur.classList.add('go');setTimeout(()=>{location.href=href},480);}));
addEventListener('pageshow',e=>{if(e.persisted)cur.classList.remove('go')});

// Kontaktformular
const f=$('#form');
if(f){
  const set=v=>{f.classList.toggle('is-biz',v==='biz');};
  $$('input[name=typ]',f).forEach(r=>r.addEventListener('change',()=>set(r.value)));
  const h=location.hash.slice(1), sel=$('#f-art');
  const map={hochzeit:'Hochzeit',familie:'Familie & Baby',portrait:'Portrait & Fashion',business:'Business Foto',film:'Film & Video'};
  if(map[h]){sel.value=map[h];}
  if(h==='business'||h==='film'){$('#t-biz').checked=true;set('biz');}
  f.addEventListener('submit',e=>{e.preventDefault();
    const v=id=>($('#'+id)?.value||'').trim(), note=$('#note');
    if(!v('f-name')||!/^\S+@\S+\.\S+$/.test(v('f-mail'))){note.textContent='Bitte gib deinen Namen und eine gültige Mailadresse an.';return;}
    const biz=f.classList.contains('is-biz');
    const body=[`Name: ${v('f-name')}`,biz?`Firma: ${v('f-firma')}`:'',`Mail: ${v('f-mail')}`,`Telefon: ${v('f-tel')}`,`Anliegen: ${v('f-art')}`,`Wunschtermin: ${v('f-date')}`,'',v('f-msg')].filter((x,i)=>x||i>5).join('\n');
    note.textContent='Dein Mailprogramm öffnet sich mit der fertigen Anfrage. Falls nicht, schreib uns direkt an info@nigrofamily.de.';
    location.href='mailto:info@nigrofamily.de?subject='+encodeURIComponent('Anfrage: '+v('f-art')+(biz?' (Business)':''))+'&body='+encodeURIComponent(body);});
}
$$('.yr').forEach(y=>y.textContent=new Date().getFullYear());
}
