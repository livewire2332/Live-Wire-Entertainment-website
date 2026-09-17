(()=>{
'use strict';
if(window.__liveWireArcadeV2)return;
window.__liveWireArcadeV2=true;

const P=a=>a[Math.floor(Math.random()*a.length)];
const games=[
 ['🎟️ Live Wire Music Bingo','bingo'],['🎼 Song Intro Challenge','intro'],['🔀 Shuffle The Decade','decade'],['🎤 Finish The Lyric','lyric'],['🥁 Drumroll Reveal','drum'],['🎸 Rock or Pop?','rock'],['💿 Album Cover Detective','album'],['🏆 Music Hall of Fame Quiz','hall'],['🚨 Who Would Do It?','who'],['🤣 Banter Bingo','bbingo'],['⏱️ Chaos Countdown','count'],['🧠 Live Wire Brain Test','brain'],['📢 DJ Announcement Generator','dj'],['🕺 Dancefloor Decision Maker','dance'],['🎫 Ticket Checker','ticket'],['🚉 Station Master','station'],['🎵 Train Playlist Builder','playlist'],['🚦 Signal Box Challenge','signal'],['🍹 Build Your Live Wire Cocktail','cocktail'],['🪩 Bar Jukebox','juke'],['🎵 What Should The Bar Play Next?','barplay'],['🪑 VIP Table Generator','vip']
];
const songs=['ABBA — Dancing Queen','Queen — Don’t Stop Me Now','Oasis — Wonderwall','The Killers — Mr. Brightside','Bon Jovi — Livin’ on a Prayer','The Beatles — Twist and Shout','Whitney Houston — I Wanna Dance with Somebody','Spice Girls — Wannabe','Shakira — Hips Don’t Lie','Tears for Fears — Everybody Wants to Rule the World','Elton John — Crocodile Rock','Madonna — Like a Prayer','Wham! — Wake Me Up Before You Go-Go','Fleetwood Mac — Go Your Own Way','Bee Gees — Stayin’ Alive','Michael Jackson — Billie Jean','The Police — Every Breath You Take','Cyndi Lauper — Girls Just Want to Have Fun','George Michael — Faith','Soft Cell — Tainted Love','Snap! — Rhythm Is a Dancer','Franz Ferdinand — Take Me Out','Blur — Song 2','Coldplay — Viva la Vida'];
const banter=['DAN SAYS ONE MORE SONG','WILL MENTIONS NICKELBACK','SOMEONE IS LATE','RADIO FACT APPEARS','MUSIC TRAIN MENTIONED','SAVAGE BANTER','SOMEONE SINGS ALONG','QUIZ QUESTION APPEARS','DAN LAUGHS','WILL BLAMES THE TRAIN','ONE MORE TUNE','LIVE WIRE BAR MENTIONED','FORGOTTEN GEM','DANCEFLOOR CHAOS','TOP OF THE POPS MENTIONED','DJ MODE ACTIVATED','BANTER LEVEL RISES','THE CHAT GOES MAD','DAN REMEMBERS A FACT','WILL MAKES A ONE-LINER','PHOENIX IS LATE','ELVIS LIP ACTION APPEARS','SERIOUS JOCKIN MENTIONED','MIDNIGHT MAGIC MENTIONED','SOMEONE SHOUTS TURN IT UP','DAN STARTS A MUSIC QUIZ','WILL DEFENDS NICKELBACK','ANOTHER DECADE IS MENTIONED','SOMEONE REQUESTS A CLASSIC','SOMEONE SAYS THAT’S MY SONG','THE CHAT PICKS A FAVOURITE','A FORGOTTEN GEM RETURNS','SOMEONE SINGS THE WRONG WORDS','THE DJ CHANGES THE TUNE','SOMEONE SHOUTS ONE MORE','BANTER GETS SAVAGE','LIVE WIRE GOES MAD','MUSIC NOSTALGIA HITS','SOMEONE MENTIONS VINYL','THE BAR GETS BUSY'];
const quiz={
 intro:[['Which song matches the clue “Mr Brightside”?',['Mr. Brightside','Take Me Out','Wonderwall'],'Mr. Brightside'],['Which song matches “Dancing Queen”?',['Dancing Queen','Waterloo','Mamma Mia'],'Dancing Queen']],
 lyric:[['Finish it: “Girls just wanna…”',['have fun','dance','rock'],'have fun'],['Finish it: “Don’t stop…”',['me now','believing','the music'],'me now']],
 album:[['Manchester 90s Britpop album?',['(What’s the Story) Morning Glory?','Definitely Maybe','Be Here Now'],'(What’s the Story) Morning Glory?'],['Iconic 80s album linked to “Purple rain”?',['Purple Rain','1999','Sign o’ the Times'],'Purple Rain']],
 hall:[['Who recorded Don’t Stop Me Now?',['Queen','ABBA','Bee Gees'],'Queen'],['Who sang I Wanna Dance with Somebody?',['Whitney Houston','Madonna','Cyndi Lauper'],'Whitney Houston']],
 brain:[['Which decade gave us Dancing Queen?',['1970s','1960s','1980s'],'1970s'],['Who sang Mr Brightside?',['The Killers','Oasis','Blur'],'The Killers'],['Which band had Wonderwall?',['Oasis','Blur','Pulp'],'Oasis']]
};
const simpleText=[
 ['50s','60s','70s','80s','90s','00s','10s'],
 ['🥁🥁🥁 A forgotten 80s gem!','🥁🥁🥁 Nickelback detected! 🎸😂','🥁🥁🥁 Music Train cleared! 🚂','🥁🥁🥁 Serious Jockin approaching! 🔥'],
 ['🎸 ROCK','🎤 POP'],['Dan 😂','Will 😂','Definitely Dan.','Definitely Will.'],
 ['📢 GOOD EVENING LIVE WIRE! THE BAR IS OPEN!','📢 ONE MORE TUNE HAS BEEN AUTHORISED!','📢 THE MUSIC TRAIN IS NOW BOARDING! 🚂'],
 ['YES — GET DANCING! 🕺🔥','ABSOLUTELY! 🔥','SIT DOWN FOR 30 SECONDS 😂'],
 ['🎫 VALID — FEEL GOOD FRIDAY','🎫 VALID — MUSIC TRAIN','😂 INVALID — PRINTED ON A NAPKIN'],
 ['1','2','3','4','5','80s','90s'],['GREEN — TRAIN MOVING! 🚂','RED — STOP!','AMBER — GET READY!'],
 ['Electric Sunset','Neon Memory','Disco Thunder','Vinyl Voltage','Phoenix Fire'],
 ['80s CLASSIC — TURN IT UP!','90s DANCE FLOOR!','70s DISCO!','00s THROWBACK!','FORGOTTEN GEM!'],
 ['A BIG 80s ANTHEM! 🎧','A 90s FLOOR FILLER! 🕺','A 70s DISCO CLASSIC! 💿','A 00s SINGALONG! 🎤','A FORGOTTEN GEM! 💎'],
 ['VIP Table 1 — Speakers 🔊','VIP Table 2 — Banter view 😂','VIP Table 3 — Train side 🚂','VIP Table 4 — Nickelback danger 🎸']
];

const style=document.createElement('style');
style.textContent=`
.lw-arcade-panel{width:100%;box-sizing:border-box;overflow:hidden}
.lw-arcade-panel .lwmore{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;width:100%;max-width:1050px;margin:24px auto 0;box-sizing:border-box}
.lw-arcade-panel .lwgame{width:100%;min-width:0;max-width:100%;box-sizing:border-box;overflow:hidden;background:linear-gradient(145deg,rgba(12,14,27,.97),rgba(25,7,31,.94));border:1px solid rgba(0,234,255,.48);border-radius:18px;padding:22px;box-shadow:0 0 14px rgba(0,234,255,.16)}
.lw-arcade-panel .lwgame h2{margin-top:0;font-size:clamp(20px,2.2vw,27px);line-height:1.15;overflow-wrap:anywhere}
.lw-arcade-panel .lwgame p,.lw-arcade-panel .lwout{overflow-wrap:anywhere;word-break:break-word}
.lw-arcade-panel .lwout{text-align:center;min-height:48px;margin:15px 0;font-weight:900}
.lw-arcade-panel .lwc{display:grid;gap:8px;width:100%;min-width:0}
.lw-arcade-panel .lwc button,.lw-arcade-panel .lwgo{width:100%;max-width:100%;box-sizing:border-box;cursor:pointer;border:1px solid #00eaff;border-radius:22px;background:#11152a;color:#fff;padding:11px 14px;font-size:15px;line-height:1.25;white-space:normal;overflow-wrap:anywhere}
.lw-arcade-panel .lwgo{margin-top:4px}
.lw-arcade-panel .lwb{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;width:100%;min-width:0;overflow:hidden}
.lw-arcade-panel .lwb button{width:100%;min-width:0;max-width:100%;aspect-ratio:1/1;padding:4px 2px;font-size:clamp(8px,1.25vw,10px);line-height:1.08;white-space:normal;overflow-wrap:anywhere;word-break:break-word;overflow:hidden}
.lw-arcade-panel .lwb .on{background:rgba(255,43,214,.35);border-color:#ffd43b}
@media(max-width:900px){.lw-arcade-panel .lwmore{grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}}
@media(max-width:600px){.lw-arcade-panel{padding:0}.lw-arcade-panel .lwmore{grid-template-columns:minmax(0,1fr);gap:16px}.lw-arcade-panel .lwgame{padding:16px}.lw-arcade-panel .lwgame h2{font-size:23px}.lw-arcade-panel .lwgame p{font-size:15px;line-height:1.45}.lw-arcade-panel .lwb{gap:4px}.lw-arcade-panel .lwb button{font-size:clamp(7px,2.4vw,9px);padding:3px 1px}.lw-arcade-panel .lwc button,.lw-arcade-panel .lwgo{font-size:15px;padding:11px 12px}}
`;
document.head.appendChild(style);

const hero=document.querySelector('.extras-hero');
if(!hero)return;
const toggle=document.createElement('button');
toggle.type='button';toggle.className='lw-arcade-toggle';toggle.textContent='🎮⚡ OPEN THE NEW LIVE WIRE ARCADE';
toggle.setAttribute('aria-expanded','false');
hero.insertAdjacentElement('afterend',toggle);

const panel=document.createElement('section');panel.className='extras-section lw-arcade-panel';panel.style.display='none';panel.innerHTML='<div class="wrap"><h1>🎮⚡ New Live Wire Arcade</h1><p>22 new games of music, banter and complete Live Wire chaos! 😂⚡</p><div class="lwmore"></div></div>';
toggle.insertAdjacentElement('afterend',panel);
let built=false;
const qs=id=>panel.querySelector('#'+id);
const clear=x=>{while(x.firstChild)x.removeChild(x.firstChild)};
function card(i,title,desc){const d=document.createElement('div');d.className='lwgame';d.innerHTML='<div class="mini-label">NEW ⚡</div><h2>'+title+'</h2><p>'+desc+'</p><div id="lo'+i+'" class="lwout">READY?</div><div id="lc'+i+'" class="lwc"></div><button type="button" class="lwgo" id="lg'+i+'">⚡ PLAY</button>';return d}
function showSimple(i,text){const o=qs('lo'+i),c=qs('lc'+i);if(o)o.textContent=text;if(c)clear(c)}
function mc(i,data){const o=qs('lo'+i),c=qs('lc'+i);if(!o||!c)return;const x=P(data);o.textContent=x[0];clear(c);x[1].slice().sort(()=>Math.random()-.5).forEach(v=>{const b=document.createElement('button');b.type='button';b.textContent=v;b.addEventListener('click',()=>{o.textContent=v===x[2]?'⚡ CORRECT! 🔥':'😂 NOT QUITE — '+x[2];Array.from(c.children).forEach(q=>q.disabled=true);setTimeout(()=>mc(i,data),750)});c.appendChild(b)})}
function bingo(i,arr,msg){const o=qs('lo'+i),c=qs('lc'+i);if(!o||!c)return;c.className='lwb';clear(c);const v=arr.slice().sort(()=>Math.random()-.5).slice(0,24);let k=0;for(let r=0;r<5;r++)for(let col=0;col<5;col++){const b=document.createElement('button');b.type='button';b.textContent=r===2&&col===2?'FREE':v[k++];if(r===2&&col===2)b.classList.add('on');b.addEventListener('click',()=>{if(r===2&&col===2)return;b.classList.toggle('on');const z=[...c.children],m=n=>z[n].classList.contains('on');const win=[0,1,2,3,4].some(row=>[0,1,2,3,4].every(col2=>m(row*5+col2)))||[0,1,2,3,4].some(col2=>[0,1,2,3,4].every(row=>m(row*5+col2)))||[0,6,12,18,24].every(m)||[4,8,12,16,20].every(m);if(win)o.textContent=msg});c.appendChild(b)}o.textContent='NEW CARD READY!'}
function build(){if(built)return;built=true;const grid=panel.querySelector('.lwmore');games.forEach((g,i)=>grid.appendChild(card(i,g[0],g[1]+' — have a go!')));
qs('lg0').addEventListener('click',()=>bingo(0,songs,'🎉 MUSIC BINGO! ⚡🔥'));qs('lg1').addEventListener('click',()=>mc(1,quiz.intro));qs('lg3').addEventListener('click',()=>mc(3,quiz.lyric));qs('lg6').addEventListener('click',()=>mc(6,quiz.album));qs('lg7').addEventListener('click',()=>mc(7,quiz.hall));qs('lg9').addEventListener('click',()=>bingo(9,banter,'🎉 BANTER BINGO! 😂⚡'));qs('lg11').addEventListener('click',()=>mc(11,quiz.brain));
qs('lg2').addEventListener('click',()=>showSimple(2,P(simpleText[0])+' 🎵'));qs('lg4').addEventListener('click',()=>showSimple(4,P(simpleText[1])));qs('lg5').addEventListener('click',()=>showSimple(5,P(simpleText[2])));qs('lg8').addEventListener('click',()=>showSimple(8,P(simpleText[3])));qs('lg10').addEventListener('click',()=>{let n=10,o=qs('lo10');clearInterval(window.lwChaosTimer);o.textContent=n;window.lwChaosTimer=setInterval(()=>{n--;o.textContent=n;if(n<=0){clearInterval(window.lwChaosTimer);o.textContent='💥 CHAOS WINS! 😂'}},400)});qs('lg12').addEventListener('click',()=>showSimple(12,P(simpleText[4])));qs('lg13').addEventListener('click',()=>showSimple(13,P(simpleText[5])));qs('lg14').addEventListener('click',()=>showSimple(14,P(simpleText[6])));qs('lg15').addEventListener('click',()=>showSimple(15,'PLATFORM '+P(simpleText[7])+' 🚂'));qs('lg16').addEventListener('click',()=>showSimple(16,[1,2,3].map(n=>n+'. '+P(['80s Avenue','90s Junction','70s Disco Street','00s Boulevard','Vinyl Village'])).join(' • ')));qs('lg17').addEventListener('click',()=>showSimple(17,'🚦 '+P(simpleText[8])));qs('lg18').addEventListener('click',()=>showSimple(18,P(simpleText[9])+' ⚡'));qs('lg19').addEventListener('click',()=>showSimple(19,P(simpleText[10])));qs('lg20').addEventListener('click',()=>showSimple(20,P(simpleText[11])));qs('lg21').addEventListener('click',()=>showSimple(21,P(simpleText[12])));
}
toggle.addEventListener('click',()=>{const open=panel.style.display==='none';if(open)build();panel.style.display=open?'block':'none';toggle.textContent=open?'🎮⚡ CLOSE THE NEW LIVE WIRE ARCADE':'🎮⚡ OPEN THE NEW LIVE WIRE ARCADE';toggle.setAttribute('aria-expanded',String(open));if(open)panel.scrollIntoView({behavior:'smooth',block:'start'})});
})();