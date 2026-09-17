(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .lwmore{width:100%;max-width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,270px),1fr));gap:20px;box-sizing:border-box}
    .lwgame{width:100%;min-width:0;max-width:100%;box-sizing:border-box;overflow:hidden}
    .lwgame *{max-width:100%;box-sizing:border-box}
    .lwgame h2,.lwgame p,.lwout{overflow-wrap:anywhere;word-break:break-word}
    .lwc{width:100%;min-width:0;max-width:100%}
    .lwc button,.lwgo{width:auto;max-width:100%;white-space:normal;overflow-wrap:anywhere}
    .lwb{width:100%;max-width:100%;min-width:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;overflow:hidden}
    .lwb button{width:100%;min-width:0;max-width:100%;aspect-ratio:1/1;padding:4px 2px;font-size:clamp(8px,1.8vw,10px);line-height:1.08;white-space:normal;overflow-wrap:anywhere;word-break:break-word;overflow:hidden}
    @media(max-width:600px){
      .lwmore{grid-template-columns:minmax(0,1fr);gap:16px}
      .lwgame{padding:16px!important}
      .lwb{gap:4px}
      .lwb button{font-size:clamp(7px,2.5vw,9px);padding:3px 1px}
      .lwgame h2{font-size:clamp(22px,6vw,30px);line-height:1.12}
      .lwgame p{font-size:15px;line-height:1.45}
      .lwgo{display:block;width:100%;margin-left:0;margin-right:0}
    }
    @media(min-width:601px){
      .lwmore{grid-template-columns:repeat(auto-fit,minmax(270px,1fr))}
    }
  `;
  document.head.appendChild(style);
})();
