(()=>{
  const style=document.createElement('style');
  style.textContent='.lw-arcade-toggle{display:block;width:100%;max-width:760px;margin:18px auto;padding:16px 22px;border:2px solid #00eaff;border-radius:28px;background:linear-gradient(90deg,#11152a,#25102d);color:#fff;font-weight:900;font-size:18px;cursor:pointer;box-shadow:0 0 18px rgba(0,234,255,.28);text-align:center}.lw-arcade-toggle:hover{transform:translateY(-1px)}';
  document.head.appendChild(style);
  const find=()=>document.querySelector('.extras-section .lwmore')?.closest('.extras-section');
  const setup=()=>{
    const sec=find();
    const hero=document.querySelector('.extras-hero');
    if(!sec||!hero||document.querySelector('.lw-arcade-toggle')) return !!sec;
    sec.style.display='none';
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='lw-arcade-toggle';
    btn.textContent='🎮⚡ OPEN THE NEW LIVE WIRE ARCADE';
    hero.insertAdjacentElement('afterend',btn);
    btn.addEventListener('click',()=>{
      const open=sec.style.display!=='none';
      sec.style.display=open?'none':'block';
      btn.textContent=open?'🎮⚡ OPEN THE NEW LIVE WIRE ARCADE':'🎮⚡ CLOSE THE NEW LIVE WIRE ARCADE';
      if(!open) sec.scrollIntoView({behavior:'smooth',block:'start'});
    });
    return true;
  };
  if(!setup()){
    let tries=0;
    const timer=setInterval(()=>{if(setup()||++tries>40) clearInterval(timer)},100);
  }
})();
