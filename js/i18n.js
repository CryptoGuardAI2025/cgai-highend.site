
function getBasePath(){
  const host = location.hostname;
  if(host.endsWith('github.io')){
    const parts = location.pathname.split('/').filter(Boolean);
    if(parts.length>0) return '/' + parts[0];
  }
  return '';
}
let currentLang = localStorage.getItem('lang') || (navigator.language.startsWith('de') ? 'de' : 'en');
async function loadLanguage(lang){
  const base = getBasePath();
  const res = await fetch(`${base}/locales/${lang}/common.json`);
  const t = await res.json();
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const path = el.getAttribute('data-i18n').split('.');
    let val = t;
    for(const k of path){ val = (val||{})[k]; }
    if(typeof val==='string') el.innerHTML = val;
  });
  document.querySelectorAll('.lang button').forEach(b=>b.classList.remove('active'));
  const btn = document.querySelector(`.lang button[data-lang="${lang}"]`);
  if(btn) btn.classList.add('active');
  localStorage.setItem('lang', lang);
  currentLang = lang;
}
function switchLang(lang){ loadLanguage(lang); }
document.addEventListener('DOMContentLoaded',()=>{
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a[data-match]').forEach(a=>{
    if(here.startsWith(a.getAttribute('data-match'))) a.classList.add('active');
  });
  loadLanguage(currentLang);
});
document.addEventListener('DOMContentLoaded', ()=>{
  if(!localStorage.getItem('cookieAccepted')){
    const c = document.getElementById('cookie');
    if(c) c.style.display = 'block';
  }
});
function acceptCookies(){
  localStorage.setItem('cookieAccepted','1');
  const c = document.getElementById('cookie'); if(c) c.style.display='none';
}
