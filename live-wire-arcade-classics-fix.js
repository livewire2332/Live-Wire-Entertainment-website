(()=>{
'use strict';
const q=s=>document.querySelector(s);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const set=(id,v)=>{const e=q('#'+id);if(e)e.textContent=v;};
const wire=(id,fn)=>{const e=q('#'+id);if(!e)return;e.type='button';e.onclick=null;e.addEventListener('click',fn);};

const wireClassics=()=>{
  if(!q('#savageBtn'))return false;

  wire('savageBtn',()=>set('savageResult',pick([
    'MILD — YOU\'RE SAFE. FOR NOW. 😂','CHEEKY — SOMEONE\'S GETTING WOUND UP. ⚡','SAVAGE — HIDE THE COMMENT SECTION. 😂','ABSOLUTELY UNCALLED FOR — PHOENIX HAS BEEN WARNED. 🚨😂','MAXIMUM LIVE WIRE — THERE WILL BE NO SURVIVORS. ⚡😂'
  ])));
  wire('slotBtn',()=>set('slotResult',[pick(['⚡','🎵','😂','🔥','🚂','🍹']),' | ',pick(['🎸','🎤','📻','⚡','😂','🎶']),' | ',pick(['DAN','WILL','NICKELBACK','ONE MORE TUNE','LIVE WIRE','CHAOS'])].join('')));
  wire('chaosBtn',()=>set('chaosResult',pick(['DAN — TOO MUCH RADIO KNOWLEDGE. 😂','WILL — LEFT THE MUSIC TRAIN UNATTENDED. 🚂','BOTH — CLEARLY A JOINT OPERATION. 😂⚡','THE NICKELBACK BUTTON — IT KNEW WHAT IT WAS DOING. 🎸😂','NO COMMENT — THE EVIDENCE HAS DISAPPEARED. 🚨'])));
  wire('excuseBtn',()=>set('excuseResult',pick(['THE MUSIC TRAIN WAS STUCK AT THE STATION. 🚂😂','ONE MORE TUNE TURNED INTO TWENTY MORE. 🎶','NICKELBACK CAUSED A TECHNICAL DELAY. 🎸😂','DAN GOT DISTRACTED BY A MUSICAL FACT. 📻','WILL WAS BUSY BEING FLASH GORDON. 😂⚡'])));
  wire('karaokeBtn',()=>set('karaokeResult',pick(['CONFIDENCE: 110% — TALENT: CURRENTLY UNDER INVESTIGATION. 😂','BELTER O\'CLOCK HAS BEEN DECLARED. 🎤⚡','MICROPHONE READY. NEIGHBOURS NOT READY. 😂','SINGING LIKE NOBODY IS LISTENING — BECAUSE THEY\'VE LEFT. 😂','FULL LIVE WIRE MODE — ABSOLUTELY NO SHAME. ⚡🎤'])));
  wire('djBtn',()=>set('djResult',pick(['DJ DISCO DAN — RADIO BRAIN ACTIVATED. 📻⚡','MR PHOENIX — NICKELBACK GUARANTEE INCLUDED. 🎸😂','BOTH — BECAUSE ONE DJ WAS NEVER ENOUGH CHAOS. 😂⚡'])));
  wire('oneMoreBtn',()=>set('oneMoreResult',pick(['ONE MORE 80s CLASSIC. 🎶','ONE MORE ROCK ANTHEM. 🎸','ONE MORE FOR THE LIVE WIRE BAR. 🍹⚡','ONE MORE FOR THE MUSIC TRAIN. 🚂','ONE MORE… AND THEN WE\'LL PRETEND WE\'RE FINISHED. 😂'])));
  wire('ticketBtn',()=>set('ticketResult',`PASSENGER: YOU • DESTINATION: ${pick(['80s AVENUE','ROCK & ROLL JUNCTION','NOSTALGIA CENTRAL','LIVE WIRE BAR','ONE MORE TUNE TERMINAL'])} • CLASS: ${pick(['VIP','FIRST','ABSOLUTE CHAOS'])}`));
  wire('railBtn',()=>set('railResult',pick(['ON TIME — MIRACULOUSLY. 🚂','DELAYED BY ONE MORE TUNE. 😂','PLATFORM 3 — PHOENIX IS STILL LOOKING FOR THE TRAIN. 🚂','FULL STEAM AHEAD — BANTER LEVEL CRITICAL. ⚡','SIGNAL FAILURE — DAN HAS STARTED TALKING ABOUT MUSIC AGAIN. 📻😂'])));
  wire('challengeBtn',()=>set('challengeResult',pick(['DAN: NAME FIVE SONGS FROM THE SAME DECADE. 🎶','WILL: DEFEND NICKELBACK WITHOUT USING THE WORD GREAT. 😂','DAN VS WILL: WHO CAN GO LONGEST WITHOUT BANTER? 😂','WILL: ARRIVE ON TIME FOR ONCE. 🚂😂','DAN: PLAY ONLY ONE MORE TUNE. GOOD LUCK. 😂⚡'])));
  wire('badgeBtn',()=>set('badgeResult',pick(['⚡ LIVE WIRE LEGEND','🎧 MUSIC MEMORY MASTER','😂 BANTER SURVIVOR','🚂 MUSIC TRAIN PASSENGER','🍹 LIVE WIRE BAR REGULAR','🎸 NICKELBACK RESISTANCE UNIT'])));
  wire('drinkBtn',()=>set('drinkResult',pick(['⚡ The Electric Live Wire','🎸 The Phoenix Rocker','🎧 The Disco Dan','🚂 The Music Train Cooler','😂 The One More Tune','🍹 The Neon Chaos'])));
  wire('orderBtn',()=>set('orderResult',`ORDER: ${pick(['ONE MORE TUNE','NEON CHAOS','MUSIC TRAIN SPECIAL','PHOENIX ROCKER','DISCO DAN DELUXE'])} • BANTER ON THE SIDE. 😂⚡`));
  wire('seatBtn',()=>set('seatResult',pick(['FRONT ROW — YOU LIKE THE CHAOS. ⚡','DJ BOOTH — DANGEROUS TERRITORY. 🎧😂','BAR SIDE — PERFECT VIEW OF THE BANTER. 🍹','MUSIC TRAIN CARRIAGE — ALL ABOARD. 🚂','QUIET CORNER — WRONG VENUE. 😂'])));
  wire('dailyBtn',()=>set('dailyResult',pick(['NAME THREE 80s CLASSICS IN TEN SECONDS. 🎶','FIND A SONG YOU\'VE FORGOTTEN AND BRING IT BACK. 📻','CHALLENGE SOMEONE TO A MUSIC QUIZ. 🧠','PLAY ONE MORE TUNE — YOU KNOW YOU WANT TO. 😂','SURVIVE FIVE MINUTES OF LIVE WIRE BANTER. ⚡😂'])));

  const decadeQ=[
    ['Which decade gave us “Mr. Brightside”?',['80s','90s','00s','10s'],'00s'],
    ['Which decade gave us “Bohemian Rhapsody”?',['60s','70s','80s','90s'],'70s'],
    ['Which decade gave us “...Baby One More Time”?',['80s','90s','00s','10s'],'90s'],
    ['Which decade gave us “Never Gonna Give You Up”?',['70s','80s','90s','00s'],'80s'],
    ['Which decade gave us “Wonderwall”?',['80s','90s','00s','10s'],'90s']
  ];
  let dq=0;
  const drawDecade=()=>{
    const item=decadeQ[dq%decadeQ.length];
    const game=q('#decadeGame'), choices=q('#decadeChoices'), ans=q('#decadeAnswer');
    if(!game||!choices||!ans)return;
    game.textContent=item[0];choices.innerHTML='';ans.textContent='Choose an answer...';
    item[1].forEach(v=>{const b=document.createElement('button');b.type='button';b.className='quirky-choice';b.textContent=v;b.addEventListener('click',()=>{ans.textContent=v===item[2]?`CORRECT! 🎉 ${item[2]}`:`NOPE — IT WAS ${item[2]}. 😂`;setTimeout(()=>{dq++;drawDecade()},700)});choices.appendChild(b)});
  };
  drawDecade();

  q('[data-radio="60s"]')?.addEventListener('click',()=>set('radioResult','📻 LIVE FROM THE 60s — BIG TUNES, BIG HAIR AND ABSOLUTE LIVE WIRE NOSTALGIA.'));
  q('[data-radio="70s"]')?.addEventListener('click',()=>set('radioResult','📻 LIVE FROM THE 70s — DISCO, ROCK AND A VERY QUESTIONABLE DANCEFLOOR. 😂'));
  q('[data-radio="80s"]')?.addEventListener('click',()=>set('radioResult','📻 LIVE FROM THE 80s — SYNTHS ON, VOLUME UP, COMMON SENSE OFF. ⚡'));
  q('[data-radio="90s"]')?.addEventListener('click',()=>set('radioResult','📻 LIVE FROM THE 90s — BRITPOP, DANCEFLOORS AND PURE NOSTALGIA.'));
  q('[data-radio="00s"]')?.addEventListener('click',()=>set('radioResult','📻 LIVE FROM THE 00s — POP, ROCK AND THE ERA OF THE MP3 PLAYER. 🎧'));

  const routes=[];
  document.querySelectorAll('.route').forEach(b=>b.addEventListener('click',()=>{routes.push(b.dataset.route);if(routes.length>=3){set('routeResult',`🚂 YOUR JOURNEY: ${routes.join(' → ')} — NEXT STOP: LIVE WIRE BAR! 🍹⚡`);routes.length=0}else set('routeResult',`ROUTE STOP ${routes.length}/3: ${routes.join(' → ')}...`)}));

  const quotes=[['“I only need one more tune.”','Dan'],['“Manchester is red!”','Will'],['“We need another song.”','Dan'],['“Nickelback is going on.”','Will'],['“I know that song.”','Dan']];
  let qi=0;
  document.querySelectorAll('.quotePick').forEach(b=>b.addEventListener('click',()=>{const correct=quotes[qi][1];set('quoteAnswer',b.dataset.quote===correct?`CORRECT! 😂 It was ${correct}.`:`NOPE! It was ${correct}. 😂`);setTimeout(()=>{qi=(qi+1)%quotes.length;const g=q('#quoteGame');if(g)g.textContent=quotes[qi][0];const a=q('#quoteAnswer');if(a)a.textContent='Who said it?'},700)}));
  return true;
};

if(!wireClassics()){
  let tries=0;const t=setInterval(()=>{if(wireClassics()||++tries>80)clearInterval(t)},100);
}
})();