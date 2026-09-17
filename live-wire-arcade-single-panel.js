(()=>{
'use strict';
function moveArcadeIntoPanel(){
  const panel=document.querySelector('.lw-arcade-panel');
  if(!panel)return false;
  const old=[...document.querySelectorAll('.extras-section')].find(section=>section.querySelector('.quirky-grid') && !section.classList.contains('lw-arcade-panel'));
  if(!old)return true;
  const heading=old.querySelector('h1');
  if(heading)heading.textContent='⚡ Live Wire Arcade Classics';
  old.style.marginTop='28px';
  const wrap=old.querySelector('.wrap');
  if(wrap)wrap.style.maxWidth='1050px';
  panel.appendChild(old);
  return true;
}
if(moveArcadeIntoPanel()){
  const panel=document.querySelector('.lw-arcade-panel');
  if(panel)panel.dataset.singleArcadePanel='true';
}else{
  let tries=0;
  const timer=setInterval(()=>{if(moveArcadeIntoPanel()||++tries>50)clearInterval(timer)},100);
}
})();
