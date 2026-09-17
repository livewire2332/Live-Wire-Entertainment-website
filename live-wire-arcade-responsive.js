(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .lwmore{width:100%;max-width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,270px),1fr));gap:20px;box-sizing:border-box}
    .lwgame{width:100%;min-width:0;max-width:100%;box-sizing:border-box;overflow:hidden}
    .lwgame *{max-width:100%;box-sizing:border-box}
    .lwgame h2,.lwgame p,.lwout{overflow-wrap:anywhere;word-break:break-word}
    .lwc{width:100%;min-width:0;max-width:100%}
    .lwc button,.lwgo{width:auto;max-width:100%;white-space:normal;overflow-wrap:anywhere}
    .lwb{width:100%;min-width:0;max-width:100%;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;overflow:hidden}
    .lwb button{width:100%;min-width:0;max-width:100%;aspect-ratio:1/1;padding:4px 2px;font-size:clamp(8px,1.8vw,10px);line-height:1.08;white-space:normal;overflow-wrap:anywhere;word-break:break-word;overflow:hidden}
    .lw-arcade-toggle{display:block!important;width:calc(100% - 32px)!important;max-width:760px!important;min-height:64px!important;margin:22px auto!important;padding:16px 22px!important;border:2px solid #00eaff!important;border-radius:34px!important;background:linear-gradient(90deg,#11152a,#25102d)!important;color:#fff!important;font-weight:900!important;font-size:clamp(17px,4.5vw,22px)!important;line-height:1.2!important;cursor:pointer!important;box-shadow:0 0 18px rgba(0,234,255,.28)!important;text-align:center!important;white-space:normal!important;overflow-wrap:anywhere!important;appearance:none!important;-webkit-appearance:none!important}
    .lw-arcade-toggle:hover{transform:translateY(-1px)}
    @media(max-width:600px){
      .lwmore{grid-template-columns:minmax(0,1fr);gap:16px}
      .lwgame{padding:16px!important}
      .lwb{gap:4px}
      .lwb button{font-size:clamp(7px,2.5vw,9px);padding:3px 1px}
      .lwgame h2{font-size:clamp(22px,6vw,30px);line-height:1.12}
      .lwgame p{font-size:15px;line-height:1.45}
      .lwgo{display:block;width:100%;margin-left:0;margin-right:0}
      .lw-arcade-toggle{width:calc(100% - 24px)!important;min-height:72px!important;margin:18px auto!important;padding:16px 14px!important;font-size:18px!important;border-radius:36px!important}
    }
    @media(min-width:601px){
      .lwmore{grid-template-columns:repeat(auto-fit,minmax(270px,1fr))}
    }
  `;
  document.head.appendChild(style);

  const moveArcadeIntoPanel=()=>{
    const panel=document.querySelector('.lw-arcade-panel');
    if(!panel)return false;
    const old=[...document.querySelectorAll('.extras-section')].find(section=>section.querySelector('.quirky-grid')&&!section.classList.contains('lw-arcade-panel'));
    if(!old)return true;
    const heading=old.querySelector('h1');
    if(heading)heading.textContent='⚡ Live Wire Arcade Classics';
    old.style.marginTop='28px';
    const wrap=old.querySelector('.wrap');
    if(wrap)wrap.style.maxWidth='1050px';
    panel.appendChild(old);
    return true;
  };
  if(!moveArcadeIntoPanel()){
    let tries=0;
    const timer=setInterval(()=>{if(moveArcadeIntoPanel()||++tries>50)clearInterval(timer)},100);
  }
})();