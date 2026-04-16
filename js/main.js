/* ============================================================
   MAZE — Main JS (Fullpage + Interactions)
   ============================================================ */
'use strict';

/* ── AUTH ── */
const AUTH = {
  ADMIN_EMAIL:'yhkwon2004@gmail.com', ADMIN_PW:'procmd0802',
  USER_KEY:'maze_user',
  get(){ try{return JSON.parse(localStorage.getItem(this.USER_KEY))}catch{return null} },
  set(u){ localStorage.setItem(this.USER_KEY,JSON.stringify(u)) },
  clear(){ localStorage.removeItem(this.USER_KEY) },
  isAdmin(){ const u=this.get(); return u&&u.isAdmin===true },
  isLoggedIn(){ return !!this.get() }
};

/* ── FULLPAGE SCROLL ── */
let currentSlide = 0;
const TOTAL_SLIDES = 8;
let isScrolling = false;
let startY = 0, startX = 0;
const fp = document.getElementById('fullpage');

function goSlide(idx){
  if(idx<0||idx>=TOTAL_SLIDES) return;
  currentSlide = idx;
  if(fp){
    fp.scrollTo({ top: idx * window.innerHeight, behavior:'smooth' });
  }
  updateIndicator();
  updateNavActive();
  triggerSlideAnims(idx);
}

function updateIndicator(){
  document.querySelectorAll('.si-dot').forEach((d,i)=>{
    d.classList.toggle('active', i===currentSlide);
  });
}

function updateNavActive(){
  // [data-slide] 링크 active (도트 네비 & 모바일 슬라이드링크 포함)
  document.querySelectorAll('[data-slide]').forEach(a=>{
    a.classList.toggle('active', parseInt(a.dataset.slide)===currentSlide);
  });
  // 상단 nav-btn active (Awards/CEO/Community/Contact는 항상 inactive)
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  // Contact(slide 7) 이동 시 Contact 버튼 active
  const contactBtn = document.querySelector('.nav-btn-contact');
  if(contactBtn) contactBtn.classList.toggle('active', currentSlide===7);
}

/* ── SLIDE ANIMATIONS ── */
function triggerSlideAnims(idx){
  const slide = document.getElementById(`slide-${idx}`);
  if(!slide) return;
  slide.querySelectorAll('[data-anim]').forEach(el=>{
    el.classList.remove('animated');
    const delay = parseInt(el.dataset.delay||0);
    setTimeout(()=>el.classList.add('animated'), delay + 80);
  });
  // counters
  slide.querySelectorAll('.count-num[data-target]').forEach(el=>{
    if(el.dataset.animated) return;
    el.dataset.animated = '1';
    animateCount(el);
  });
}

function animateCount(el){
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix||'';
  const dur = 1400;
  const start = performance.now();
  (function tick(now){
    const p = Math.min((now-start)/dur,1);
    const ease = 1-Math.pow(1-p,3);
    el.textContent = Math.round(ease*target)+suffix;
    if(p<1) requestAnimationFrame(tick);
  })(start);
}

/* ── WHEEL ── */
function onWheel(e){
  e.preventDefault();
  if(isScrolling) return;
  if(window.innerWidth<=768) return; // mobile: native scroll
  const dir = e.deltaY>0?1:-1;
  const next = currentSlide+dir;
  if(next<0||next>=TOTAL_SLIDES) return;
  isScrolling=true;
  goSlide(next);
  setTimeout(()=>isScrolling=false, 900);
}

/* ── TOUCH (touch-only slide navigation — no mouse drag) ── */
function onTouchStart(e){ startY=e.touches[0].clientY; startX=e.touches[0].clientX; }
function onTouchEnd(e){
  // Touch-guided slide change (tablet / mobile only for slide nav above 768px too)
  const dy=startY-e.changedTouches[0].clientY;
  const dx=Math.abs(startX-e.changedTouches[0].clientX);
  if(Math.abs(dy)<50||dx>Math.abs(dy)*0.8) return; // tighter threshold
  if(isScrolling) return;
  isScrolling=true;
  goSlide(currentSlide+(dy>0?1:-1));
  setTimeout(()=>isScrolling=false,900);
}

/* ── MOUSE DRAG PREVENTION (no drag-to-slide) ── */
// Disable mouse drag navigation — only wheel & keyboard allowed for desktop
let _mouseDown=false;
function initMouseDragPrevention(){
  const container = document.getElementById('fullpage');
  if(!container) return;
  // Prevent any text-drag / element-drag from triggering navigation
  container.addEventListener('mousedown', e=>{ _mouseDown=true; });
  container.addEventListener('mouseup',   e=>{ _mouseDown=false; });
  container.addEventListener('mouseleave',e=>{ _mouseDown=false; });
  // Block native drag events on slides
  container.addEventListener('dragstart', e=>{ e.preventDefault(); showMainTouchToast(); });
  container.addEventListener('dragover',  e=>{ e.preventDefault(); });
  container.addEventListener('drop',      e=>{ e.preventDefault(); showMainTouchToast(); });
}

/* ── MAIN TOUCH TOAST ── */
function showMainTouchToast(){
  let toast = document.getElementById('mainTouchToast');
  if(!toast){
    toast = document.createElement('div');
    toast.id = 'mainTouchToast';
    toast.style.cssText=[
      'position:fixed','bottom:32px','left:50%','transform:translateX(-50%) translateY(80px)',
      'background:rgba(45,122,58,0.92)','color:#fff',
      'padding:10px 22px','border-radius:40px','font-size:0.83rem','font-weight:600',
      'display:flex','align-items:center','gap:8px',
      'backdrop-filter:blur(10px)','box-shadow:0 8px 24px rgba(0,0,0,0.4)',
      'transition:transform .4s cubic-bezier(.34,1.56,.64,1),opacity .4s',
      'opacity:0','pointer-events:none','z-index:9999','font-family:Inter,sans-serif'
    ].join(';');
    toast.innerHTML='<i class="fas fa-hand-pointer" style="font-size:1rem"></i><span>터치 또는 스크롤로 이동하세요</span>';
    document.body.appendChild(toast);
    // Load FA if not present
    if(!document.querySelector('link[href*="fontawesome"]')){
      const l=document.createElement('link');
      l.rel='stylesheet';
      l.href='https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css';
      document.head.appendChild(l);
    }
  }
  toast.style.opacity='1';
  toast.style.transform='translateX(-50%) translateY(0)';
  clearTimeout(window._mainToastTimer);
  window._mainToastTimer=setTimeout(()=>{
    toast.style.opacity='0';
    toast.style.transform='translateX(-50%) translateY(80px)';
  },2800);
}
window.showMainTouchToast = showMainTouchToast;

/* ── KEYBOARD ── */
function onKeyDown(e){
  if(window.innerWidth<=768) return;
  if(e.key==='ArrowDown'||e.key==='PageDown'){e.preventDefault();if(!isScrolling){isScrolling=true;goSlide(currentSlide+1);setTimeout(()=>isScrolling=false,900)}}
  if(e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();if(!isScrolling){isScrolling=true;goSlide(currentSlide-1);setTimeout(()=>isScrolling=false,900)}}
}

/* ── SLIDE INDICATOR BUILD ── */
function buildIndicator(){
  const si = document.getElementById('slideIndicator');
  if(!si) return;
  const labels=['Home','About','Problem','Solution','Products','Projects','Impact','Contact'];
  for(let i=0;i<TOTAL_SLIDES;i++){
    const d=document.createElement('div');
    d.className='si-dot'+(i===0?' active':'');
    d.title=labels[i]||`Slide ${i+1}`;
    d.addEventListener('click',()=>goSlide(i));
    si.appendChild(d);
  }
}

/* ── NAV DATA-SLIDE ── */
function initNavSlides(){
  document.querySelectorAll('[data-slide]').forEach(a=>{
    a.addEventListener('click',e=>{
      e.preventDefault();
      const idx=parseInt(a.dataset.slide);
      goSlide(idx);
      // close mobile
      document.getElementById('mobileOverlay')?.classList.remove('open');
    });
  });
}

/* ── HAMBURGER ── */
function initHamburger(){
  const btn=document.getElementById('hamburger');
  const overlay=document.getElementById('mobileOverlay');
  const close=document.getElementById('overlayClose');
  if(!btn||!overlay) return;
  btn.addEventListener('click',()=>overlay.classList.toggle('open'));
  close?.addEventListener('click',()=>overlay.classList.remove('open'));
}

/* ── HERO CANVAS ── */
function initHeroCanvas(){
  const canvas=document.getElementById('heroCanvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  let W,H,particles=[];

  function resize(){ W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; }
  resize();
  window.addEventListener('resize',resize);

  for(let i=0;i<60;i++){
    particles.push({
      x:Math.random()*2000, y:Math.random()*2000,
      r:Math.random()*2+0.5,
      vx:(Math.random()-0.5)*0.3,
      vy:(Math.random()-0.5)*0.3,
      a:Math.random()*0.6+0.1
    });
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(107,255,133,${p.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── CONTACT FORM ── */
function initContactForm(){
  const form=document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const name=document.getElementById('cfName')?.value.trim();
    const phone=document.getElementById('cfPhone')?.value.trim();
    const type=document.getElementById('cfType')?.value||'기타';
    const msg=document.getElementById('cfMsg')?.value.trim();
    const result=document.getElementById('cfResult');
    if(!name||!phone||!msg){
      result.className='cf-error'; result.textContent='필수 항목을 모두 입력해주세요.'; return;
    }
    const btn=form.querySelector('button[type=submit]');
    btn.disabled=true; btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> 전송 중...';
    try{
      const res=await fetch('tables/contact_inquiries',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name,phone,type,message:msg,submitted_at:new Date().toISOString()})
      });
      if(res.ok||res.status===201){
        result.className='cf-success'; result.textContent='✓ 문의가 접수되었습니다! 빠른 시일 내 연락드리겠습니다.';
        form.reset();
      } else throw new Error();
    }catch{
      result.className='cf-success'; result.textContent='✓ 접수 완료! 인스타 DM(@dydgus_.0802)으로도 문의 가능합니다.';
      form.reset();
    } finally{
      btn.disabled=false; btn.innerHTML='<i class="fas fa-paper-plane"></i> 문의 보내기';
    }
  });
}

/* ── NAV LOGIN STATE ── */
function updateNavLoginState(){
  const btn=document.getElementById('navLoginBtn');
  const txt=document.getElementById('navLoginText');
  if(!btn) return;
  const user=AUTH.get();
  if(user){
    txt && (txt.textContent=AUTH.isAdmin()?'관리자':'마이페이지');
    btn.href='community.html';
  } else {
    txt && (txt.textContent='Login');
    btn.href='login.html';
  }
}

/* ── SCROLL OBSERVER (mobile) ── */
function initMobileObserver(){
  if(window.innerWidth>768) return;
  const slides=document.querySelectorAll('.slide');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const idx=parseInt(e.target.dataset.index||0);
        currentSlide=idx;
        updateIndicator(); updateNavActive();
        e.target.querySelectorAll('[data-anim]').forEach(el=>{
          const d=parseInt(el.dataset.delay||0);
          setTimeout(()=>el.classList.add('animated'),d+80);
        });
        e.target.querySelectorAll('.count-num[data-target]').forEach(el=>{
          if(!el.dataset.animated){ el.dataset.animated='1'; animateCount(el); }
        });
      }
    });
  },{threshold:0.4});
  slides.forEach(s=>obs.observe(s));
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded',()=>{
  buildIndicator();
  initNavSlides();
  initHamburger();
  initHeroCanvas();
  initContactForm();
  updateNavLoginState();
  triggerSlideAnims(0); // first slide

  if(fp && window.innerWidth>768){
    fp.addEventListener('wheel',onWheel,{passive:false});
    // Touch navigation enabled for ALL widths above mobile
    fp.addEventListener('touchstart',onTouchStart,{passive:true});
    fp.addEventListener('touchend',onTouchEnd,{passive:true});
    document.addEventListener('keydown',onKeyDown);

    // detect scroll position for indicator sync
    fp.addEventListener('scroll',()=>{
      const idx=Math.round(fp.scrollTop/window.innerHeight);
      if(idx!==currentSlide){ currentSlide=idx; updateIndicator(); updateNavActive(); }
    },{passive:true});
  } else {
    initMobileObserver();
  }

  // Always init mouse-drag prevention
  initMouseDragPrevention();

  // Global drag prevention (outside fp too)
  document.addEventListener('dragover', e=>e.preventDefault());
  document.addEventListener('drop',     e=>{ e.preventDefault(); showMainTouchToast(); });
});

/* ── GLOBAL EXPORTS ── */
window.goSlide=goSlide;
window.AUTH=AUTH;
