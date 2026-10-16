// lyrics reader: search, artist filter, accordion, deep links (#lyric-slug)
(function(){
  var list=document.getElementById('lyric-list');if(!list)return;
  var items=[].slice.call(list.querySelectorAll('.lyric')),q=document.getElementById('lyric-q'),
      count=document.getElementById('lyric-count'),none=document.getElementById('lyric-none'),
      chips=[].slice.call(document.querySelectorAll('.chip')),filter='all',total=items.length,
      base=count?count.textContent:'';
  var norm=function(s){return s.toLowerCase().replace(/[\u2018\u2019']/g,"'").replace(/\s+/g,' ').trim()};
  function apply(){
    var term=norm(q.value||''),shown=0;
    items.forEach(function(d){
      var ok=(filter==='all'||d.dataset.artist===filter)&&(!term||norm(d.dataset.search).indexOf(term)>-1);
      d.hidden=!ok;if(ok)shown++;
    });
    none.hidden=shown>0;
    count.textContent=(term||filter!=='all')?(shown+' of '+total+' works shown'):base;
  }
  q.addEventListener('input',apply);
  chips.forEach(function(c){c.addEventListener('click',function(){
    chips.forEach(function(x){x.classList.toggle('on',x===c);x.setAttribute('aria-pressed',x===c)});
    filter=c.dataset.f;apply();
  })});
  items.forEach(function(d){d.addEventListener('toggle',function(){
    if(!d.open)return;
    items.forEach(function(o){if(o!==d&&o.open)o.open=false});
    var r=d.getBoundingClientRect();if(r.top<70||r.top>window.innerHeight*.6)d.scrollIntoView({block:'start',behavior:'smooth'});
    if(history.replaceState)history.replaceState(null,'','#'+d.id);
  })});
  function fromHash(){var t=location.hash&&document.getElementById(location.hash.slice(1));
    if(t&&t.classList.contains('lyric')){t.hidden=false;t.open=true;t.scrollIntoView({block:'start'})}}
  window.addEventListener('hashchange',fromHash);fromHash();
})();
(function(){
  var nav=document.querySelector('.nav');
  var onScroll=function(){nav.classList.toggle('scrolled',window.scrollY>40)};
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  var btn=document.querySelector('.menu-btn'),menu=document.getElementById('menu');
  btn.addEventListener('click',function(){var o=menu.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');btn.setAttribute('aria-expanded','false')})});
  var els=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
  var io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
  els.forEach(function(e){io.observe(e)});
  // count-up for stats
  var nums=document.querySelectorAll('[data-count]');
  var io2=new IntersectionObserver(function(entries){entries.forEach(function(en){if(!en.isIntersecting)return;var el=en.target,end=+el.dataset.count,t0=null;
    var step=function(t){if(!t0)t0=t;var p=Math.min((t-t0)/1400,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step)};
    requestAnimationFrame(step);io2.unobserve(el)})},{threshold:.4});
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)nums.forEach(function(n){io2.observe(n)});
})();
