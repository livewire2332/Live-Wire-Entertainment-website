(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .lwgame{box-sizing:border-box;min-width:0}
    .lwmore{width:100%;box-sizing:border-box}
    .lwb{width:100%;max-width:100%;box-sizing:border-box;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;overflow:hidden}
    .lwb button{width:100%;min-width:0;max-width:100%;box-sizing:border-box;padding:4px 2px;font-size:clamp(8px,2.35vw,10px);line-height:1.12;overflow-wrap:anywhere;word-break:break-word}
    @media(max-width:600px){
      .lwgame{padding:16px}
      .lwb{gap:4px}
      .lwb button{font-size:8px;padding:3px 1px}
    }
  `;
  document.head.appendChild(style);

  const banter=[
    'DAN SAYS ONE MORE SONG','WILL MENTIONS NICKELBACK','SOMEONE IS LATE','RADIO FACT APPEARS','MUSIC TRAIN MENTIONED',
    'SAVAGE BANTER','SOMEONE SINGS ALONG','QUIZ QUESTION APPEARS','DAN LAUGHS','WILL BLAMES THE TRAIN',
    'ONE MORE TUNE','LIVE WIRE BAR MENTIONED','FORGOTTEN GEM','DANCEFLOOR CHAOS','TOP OF THE POPS MENTIONED',
    'DJ MODE ACTIVATED','BANTER LEVEL RISES','THE CHAT GOES MAD','DAN REMEMBERS A FACT','WILL MAKES A ONE-LINER',
    'PHOENIX IS LATE','ELVIS LIP ACTION APPEARS','SERIOUS JOCKIN MENTIONED','MIDNIGHT MAGIC MENTIONED',
    'SOMEONE SHOUTS TURN IT UP','DAN STARTS A MUSIC QUIZ','WILL DEFENDS NICKELBACK','ANOTHER DECADE IS MENTIONED',
    'SOMEONE REQUESTS A CLASSIC','SOMEONE SAYS THATS MY SONG','THE CHAT PICKS A FAVOURITE','A FORGOTTEN GEM RETURNS',
    'SOMEONE SINGS THE WRONG WORDS','THE DJ CHANGES THE TUNE','SOMEONE SHOUTS ONE MORE','BANTER GETS SAVAGE',
    'LIVE WIRE GOES MAD','MUSIC NOSTALGIA HITS','SOMEONE MENTIONS VINYL','THE BAR GETS BUSY'
  ];

  const fillBingo=()=>{
    document.querySelectorAll('.lwgame').forEach(card=>{
      const title=card.querySelector('h2');
      if(!title||!title.textContent.includes('Banter Bingo'))return;
      const grid=card.querySelector('.lwb');
      if(!grid)return;
      const cells=[...grid.querySelectorAll('button')];
      let used=new Set(cells.map(b=>b.textContent.trim()).filter(Boolean));
      let n=0;
      cells.forEach((b,i)=>{
        if(i===12){b.textContent='FREE';b.classList.add('on');return;}
        if(!b.textContent.trim()){
          while(n<banter.length&&used.has(banter[n]))n++;
          if(n<banter.length){b.textContent=banter[n];used.add(banter[n]);n++;}
        }
      });
      let intro=card.querySelector('.lwout');
      if(intro&&intro.textContent.includes('NEW CARD READY'))intro.setAttribute('aria-label','Tap a square when that banter happens during the show. Get five in a row to win!');
      let p=card.querySelector('h2 + p');
      if(p)p.textContent='Tap PLAY for a new card. During a Live Wire show, tap a square whenever that banter happens. Get 5 in a row — across, down or diagonal — to win! 😂⚡';
    });
  };
  fillBingo();
  new MutationObserver(fillBingo).observe(document.body,{subtree:true,childList:true,characterData:true});
})();
