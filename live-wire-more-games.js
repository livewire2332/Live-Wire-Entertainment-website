(()=> {
'use strict';
if(window.__liveWireArcadeV3)return;
window.__liveWireArcadeV3=true;

const STORE='lwArcadeFreshV3:';

function shuffle(a){
  const x=a.slice();
  for(let i=x.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [x[i],x[j]]=[x[j],x[i]];
  }
  return x;
}
function getUsed(key,len){
  try{
    const raw=localStorage.getItem(STORE+key);
    const v=raw?JSON.parse(raw):[];
    return Array.isArray(v)?v.filter(i=>Number.isInteger(i)&&i>=0&&i<len):[];
  }catch(_){return []}
}
function saveUsed(key,v){
  try{localStorage.setItem(STORE+key,JSON.stringify(v));}catch(_){}
}
function P(key,a){
  if(!a||!a.length)return '';
  let used=getUsed(key,a.length);
  let available=a.map((_,i)=>i).filter(i=>!used.includes(i));
  if(!available.length){used=[];available=a.map((_,i)=>i);}
  const i=available[Math.floor(Math.random()*available.length)];
  used.push(i);saveUsed(key,used);
  return a[i];
}
function freshMany(key,a,count){
  if(!a.length)return [];
  let used=getUsed(key,a.length);
  let remaining=a.map((_,i)=>i).filter(i=>!used.includes(i));
  if(remaining.length<count){
    const first=remaining.slice();
    const blocked=new Set(first);
    const reset=a.map((_,i)=>i).filter(i=>!blocked.has(i));
    const extra=shuffle(reset).slice(0,count-first.length);
    remaining=extra.length?[]:[];
    const chosen=first.concat(extra);
    saveUsed(key,chosen);
    return chosen.map(i=>a[i]);
  }
  const chosen=shuffle(remaining).slice(0,count);
  saveUsed(key,used.concat(chosen));
  return chosen.map(i=>a[i]);
}

const games=[
 ['🎟️ Live Wire Music Bingo','bingo'],['🎼 Song Intro Challenge','intro'],['🔀 Shuffle The Decade','decade'],
 ['🎤 Finish The Lyric','lyric'],['🥁 Drumroll Reveal','drum'],['🎸 Rock or Pop?','rock'],
 ['💿 Album Cover Detective','album'],['🏆 Music Hall of Fame Quiz','hall'],['🚨 Who Would Do It?','who'],
 ['🤣 Banter Bingo','bbingo'],['⏱️ Chaos Countdown','count'],['🧠 Live Wire Brain Test','brain'],
 ['📢 DJ Announcement Generator','dj'],['🕺 Dancefloor Decision Maker','dance'],['🎫 Ticket Checker','ticket'],
 ['🚉 Station Master','station'],['🎵 Train Playlist Builder','playlist'],['🚦 Signal Box Challenge','signal'],
 ['🍹 Build Your Live Wire Cocktail','cocktail'],['🪩 Bar Jukebox','juke'],['🎵 What Should The Bar Play Next?','barplay'],
 ['🪑 VIP Table Generator','vip'],
 ['🃏 Higher or Lower','higher'],['♠️ Red or Black','redblack'],['🎲 Hi-Lo Dice','dice'],['🍀 Lucky Number','luckynum'],
 ['🏆 Pub Quiz Jackpot','pubjackpot'],['🎯 Nearest the Bull','bull'],['🎯 Darts 301','darts301'],['🎯 Killer Darts','killer'],
 ['🪙 Coin Pusher','coinpusher'],['🎳 Pub Skittles','skittles'],['🟠 Shuffleboard','shuffleboard'],['⚽ Table Football','tablefootball'],
 ['🎳 Pub Bowling','bowling'],['🟡 Bagatelle','bagatelle'],['🃏 Pick a Card','pickcard'],['🍒 Live Wire Fruit Machine','fruitmachine'],
 ['🚪 Bouncer Dan','bouncer'],['🛍️ Temu Boss Challenge','temuboss'],['🍺 Dad Bod Detector','dadbod'],['🎧 Dodgy Request Machine','dodgyrequest'],
 ['😂 Phoenix Excuse Generator','phoenixexcuse'],['💷 Bar Tab Challenge','bartab'],['🕵️ Guess That Pub Customer','pubcustomer'],['🔔 Last Orders!','lastorders'],
 ['🤹 Who’s Had One Too Many?','toomany'],['🎵 Jukebox Gamble','jukeboxgamble']
];

const songs=[
'ABBA — Dancing Queen','Queen — Don’t Stop Me Now','Oasis — Wonderwall','The Killers — Mr. Brightside',
'Bon Jovi — Livin’ on a Prayer','The Beatles — Twist and Shout','Whitney Houston — I Wanna Dance with Somebody',
'Spice Girls — Wannabe','Shakira — Hips Don’t Lie','Tears for Fears — Everybody Wants to Rule the World',
'Elton John — Crocodile Rock','Madonna — Like a Prayer','Wham! — Wake Me Up Before You Go-Go',
'Fleetwood Mac — Go Your Own Way','Bee Gees — Stayin’ Alive','Michael Jackson — Billie Jean',
'The Police — Every Breath You Take','Cyndi Lauper — Girls Just Want to Have Fun','George Michael — Faith',
'Soft Cell — Tainted Love','Snap! — Rhythm Is a Dancer','Franz Ferdinand — Take Me Out','Blur — Song 2',
'Coldplay — Viva la Vida','Earth, Wind & Fire — September','a-ha — Take on Me','Duran Duran — Rio',
'The Prodigy — Firestarter','OutKast — Hey Ya!','Rihanna — Umbrella','The Killers — Somebody Told Me',
'Katrina and the Waves — Walking on Sunshine','The Human League — Don’t You Want Me','The Kinks — You Really Got Me',
'The Jacksons — Blame It on the Boogie','Stevie Wonder — Superstition','The Trammps — Disco Inferno',
'Britney Spears — Toxic','No Doubt — Don’t Speak','Gorillaz — Feel Good Inc.','Avicii — Wake Me Up',
'Dua Lipa — Don’t Start Now','Mark Ronson ft. Bruno Mars — Uptown Funk','Bruno Mars — Locked Out of Heaven',
'Pharrell Williams — Happy','Walk the Moon — Shut Up and Dance','Harry Styles — As It Was',
'Miley Cyrus — Flowers','Sabrina Carpenter — Espresso','Chappell Roan — Good Luck, Babe!',
'Tate McRae — greedy','Hozier — Too Sweet','Billie Eilish — Birds of a Feather',
'The Weeknd — Blinding Lights','Taylor Swift — Shake It Off','Ed Sheeran — Shape of You',
'Clean Bandit — Rather Be','Daft Punk ft. Pharrell Williams — Get Lucky','Kings of Leon — Sex on Fire',
'Scissor Sisters — I Don’t Feel Like Dancin’','Take That — Shine','Kaiser Chiefs — Ruby',
'The Fratellis — Chelsea Dagger','Shania Twain — Man! I Feel Like a Woman!','Vengaboys — We Like to Party!',
'The Pointer Sisters — Jump (For My Love)','Rick Astley — Never Gonna Give You Up',
'The Monkees — I’m a Believer','Aretha Franklin — Respect','The Beach Boys — Good Vibrations',
'The Temptations — My Girl','Chuck Berry — Johnny B. Goode','Elvis Presley — Jailhouse Rock',
'Buddy Holly — That’ll Be The Day','Little Richard — Tutti Frutti','Jerry Lee Lewis — Great Balls of Fire'
];

const banter=[
'DAN SAYS ONE MORE SONG','WILL MENTIONS NICKELBACK','SOMEONE IS LATE','RADIO FACT APPEARS','MUSIC TRAIN MENTIONED',
'SAVAGE BANTER','SOMEONE SINGS ALONG','QUIZ QUESTION APPEARS','DAN LAUGHS','WILL BLAMES THE TRAIN',
'ONE MORE TUNE','LIVE WIRE BAR MENTIONED','FORGOTTEN GEM','DANCEFLOOR CHAOS','TOP OF THE POPS MENTIONED',
'DJ MODE ACTIVATED','BANTER LEVEL RISES','THE CHAT GOES MAD','DAN REMEMBERS A FACT','WILL MAKES A ONE-LINER',
'PHOENIX IS LATE','ELVIS LIP ACTION APPEARS','SERIOUS JOCKIN MENTIONED','MIDNIGHT MAGIC MENTIONED',
'SOMEONE SHOUTS TURN IT UP','DAN STARTS A MUSIC QUIZ','WILL DEFENDS NICKELBACK','ANOTHER DECADE IS MENTIONED',
'SOMEONE REQUESTS A CLASSIC','SOMEONE SAYS THAT’S MY SONG','THE CHAT PICKS A FAVOURITE','A FORGOTTEN GEM RETURNS',
'SOMEONE SINGS THE WRONG WORDS','THE DJ CHANGES THE TUNE','SOMEONE SHOUTS ONE MORE','BANTER GETS SAVAGE',
'LIVE WIRE GOES MAD','MUSIC NOSTALGIA HITS','SOMEONE MENTIONS VINYL','THE BAR GETS BUSY',
'SOMEONE REQUESTS A 90s BANGER','THE 80s DEPARTMENT ARRIVES','THE 70s DEPARTMENT DEMANDS DISCO',
'THE 00s DEPARTMENT STARTS A SINGALONG','SOMEONE HAS FORGOTTEN THE ARTIST NAME',
'THE DJ FINDS A HIDDEN GEM','THE CHAT BECOMES A MUSIC QUIZ','SOMEONE CLAIMS THEY KNOW EVERY WORD',
'THE MUSIC TRAIN IS DELAYED BY BANTER','SOMEONE SAYS PLAY IT LOUDER','DAN FINDS ANOTHER CLASSIC',
'PHOENIX DEFENDS HIS TUNE CHOICE','THE JUKEBOX HAS SPOKEN','A DANCEFLOOR EMERGENCY IS DECLARED',
'THE NOSTALGIA BUTTON IS PRESSED','ONE TUNE TURNS INTO FIVE','THE CHAT PICKS A DECADE',
'SOMEONE MENTIONS A MIXTAPE','SOMEONE REMEMBERS A CASSETTE','A VINYL MEMORY RETURNS',
'THE DJ GETS TOO MUCH FREEDOM','THE BAR RUNS OUT OF SERIOUSNESS','SOMEONE SAYS ONE MORE ONE MORE',
'THE LIVE WIRE FAMILY ARRIVES','A CLASSIC IS SPOTTED','SOMEONE DISCOVERS A SONG THEY FORGOT',
'THE BANTER METER BREAKS','A SINGALONG STARTS WITHOUT WARNING','THE TRAIN CHANGES PLATFORM',
'THE DJ ANNOUNCEMENT GETS DRAMATIC','SOMEONE REQUESTS A POWER BALLAD','A FORGOTTEN 80s GEM APPEARS',
'A 90s FLOOR FILLER IS DETECTED','A 70s DISCO CLASSIC ARRIVES','A 00s THROWBACK TAKES OVER',
'A 50s ROCK ’N’ ROLL MOMENT APPEARS','THE 60s HAVE ENTERED THE CHAT','THE 20s HAVE BROUGHT A NEW HIT',
'THE CHAT ARGUES ABOUT THE BEST DECADE','THE JUKEBOX NEEDS ANOTHER COFFEE','LIVE WIRE CHAOS LEVEL: CRITICAL'
];

const quiz={
 intro:[
 ['Which song matches the clue “Mr Brightside”?',['Mr. Brightside','Take Me Out','Wonderwall'],'Mr. Brightside'],
 ['Which song matches “Dancing Queen”?',['Dancing Queen','Waterloo','Mamma Mia'],'Dancing Queen'],
 ['Which song matches “Song 2”?',['Song 2','Parklife','Coffee & TV'],'Song 2'],
 ['Which song matches “Take on Me”?',['Take on Me','Rio','Hungry Like the Wolf'],'Take on Me'],
 ['Which song matches “Sex on Fire”?',['Sex on Fire','Use Somebody','Dakota'],'Sex on Fire'],
 ['Which song matches “September”?',['September','Boogie Wonderland','Le Freak'],'September'],
 ['Which song matches “Ruby”?',['Ruby','I Predict a Riot','Naïve'],'Ruby'],
 ['Which song matches “Chelsea Dagger”?',['Chelsea Dagger','Take Me Out','The Bucket'],'Chelsea Dagger'],
 ['Which song matches “Toxic”?',['Toxic','Oops!... I Did It Again','Circus'],'Toxic'],
 ['Which song matches “Firestarter”?',['Firestarter','Breathe','Smack My Bitch Up'],'Firestarter'],
 ['Which song matches “Wonderwall”?',['Wonderwall','Supersonic','Live Forever'],'Wonderwall'],
 ['Which song matches “Wannabe”?',['Wannabe','Spice Up Your Life','Stop'],'Wannabe'],
 ['Which song matches “Faith”?',['Faith','Careless Whisper','Freedom'],'Faith'],
 ['Which song matches “Rio”?',['Rio','Hungry Like the Wolf','Ordinary World'],'Rio'],
 ['Which song matches “Umbrella”?',['Umbrella','Diamonds','Only Girl'],'Umbrella'],
 ['Which song matches “Wake Me Up”?',['Wake Me Up','Hey Brother','Levels'],'Wake Me Up'],
 ['Which song matches “Flowers”?',['Flowers','Wrecking Ball','Midnight Sky'],'Flowers'],
 ['Which song matches “Good Luck, Babe!”?',['Good Luck, Babe!','Hot to Go!','Pink Pony Club'],'Good Luck, Babe!'],
 ['Which song matches “Happy”?',['Happy','Get Lucky','Blurred Lines'],'Happy'],
 ['Which song matches “September”?',['September','Let’s Groove','Fantasy'],'September']
 ],
 lyric:[
 ['Finish it: “Girls just wanna…”',['have fun','dance','rock'],'have fun'],
 ['Finish it: “Don’t stop…”',['me now','believing','the music'],'me now'],
 ['Finish it: “I wanna dance with…”',['somebody','everybody','you tonight'],'somebody'],
 ['Finish it: “Wake me up before you…”',['go-go','leave','dance'],'go-go'],
 ['Finish it: “Livin’ on a…”',['prayer','highway','dream'],'prayer'],
 ['Finish it: “We are never ever…”',['getting back together','going home','done tonight'],'getting back together'],
 ['Finish it: “It’s raining men…”',['hallelujah','tonight','again'],'hallelujah'],
 ['Finish it: “Sweet dreams are made of…”',['this','music','you'],'this'],
 ['Finish it: “You can’t hurry…”',['love','me','tonight'],'love'],
 ['Finish it: “Everybody wants to…”',['rule the world','dance tonight','feel alive'],'rule the world'],
 ['Finish it: “Take on…”',['me','you','tonight'],'me'],
 ['Finish it: “Girls just wanna have…”',['fun','music','love'],'fun'],
 ['Finish it: “I’m walking on…”',['sunshine','air','fire'],'sunshine'],
 ['Finish it: “We built this city on…”',['rock ’n’ roll','love','music'],'rock ’n’ roll'],
 ['Finish it: “You spin me…”',['round','up','away'],'round'],
 ['Finish it: “I love rock ’n’…”',['roll','pop','music'],'roll'],
 ['Finish it: “Everybody needs…”',['somebody','some music','a hero'],'somebody'],
 ['Finish it: “I want to break…”',['free','through','away'],'free'],
 ['Finish it: “Wake me up when…”',['September ends','the music starts','the night ends'],'September ends'],
 ['Finish it: “Don’t stop believing, hold on to…”',['that feeling','the night','the music'],'that feeling']
 ],
 album:[
 ['Manchester 90s Britpop album?',['(What’s the Story) Morning Glory?','Definitely Maybe','Be Here Now'],'(What’s the Story) Morning Glory?'],
 ['Iconic album linked to “Purple Rain”?',['Purple Rain','1999','Sign o’ the Times'],'Purple Rain'],
 ['Which band released “A Rush of Blood to the Head”?',['Coldplay','Keane','Muse'],'Coldplay'],
 ['Which artist released “FutureSex/LoveSounds”?',['Justin Timberlake','Usher','Nelly Furtado'],'Justin Timberlake'],
 ['Which band released “Parklife”?',['Blur','Oasis','Pulp'],'Blur'],
 ['Which artist released “Back to Black”?',['Amy Winehouse','Adele','Duffy'],'Amy Winehouse'],
 ['Which band released “Rumours”?',['Fleetwood Mac','ABBA','Eagles'],'Fleetwood Mac'],
 ['Which artist released “21”?',['Adele','Rihanna','Pink'],'Adele'],
 ['Which band released “Definitely Maybe”?',['Oasis','Blur','Suede'],'Oasis'],
 ['Which artist released “Hounds of Love”?',['Kate Bush','Annie Lennox','Sade'],'Kate Bush'],
 ['Which band released “Brothers in Arms”?',['Dire Straits','The Police','Genesis'],'Dire Straits'],
 ['Which artist released “Like a Virgin”?',['Madonna','Cher','Cyndi Lauper'],'Madonna'],
 ['Which band released “The Dark Side of the Moon”?',['Pink Floyd','Queen','Led Zeppelin'],'Pink Floyd'],
 ['Which artist released “Jagged Little Pill”?',['Alanis Morissette','Sheryl Crow','Fiona Apple'],'Alanis Morissette'],
 ['Which band released “Hot Fuss”?',['The Killers','Keane','Franz Ferdinand'],'The Killers'],
 ['Which artist released “Future Nostalgia”?',['Dua Lipa','Lady Gaga','Katy Perry'],'Dua Lipa'],
 ['Which band released “Whatever People Say I Am, That’s What I’m Not”?',['Arctic Monkeys','Kasabian','The Strokes'],'Arctic Monkeys'],
 ['Which artist released “25”?',['Adele','Taylor Swift','Sia'],'Adele'],
 ['Which band released “Elephant”?',['The White Stripes','The Hives','The Vines'],'The White Stripes'],
 ['Which artist released “1989”?',['Taylor Swift','Katy Perry','Ariana Grande'],'Taylor Swift']
 ],
 hall:[
 ['Who recorded Don’t Stop Me Now?',['Queen','ABBA','Bee Gees'],'Queen'],
 ['Who sang I Wanna Dance with Somebody?',['Whitney Houston','Madonna','Cyndi Lauper'],'Whitney Houston'],
 ['Who recorded My Girl?',['The Temptations','The Supremes','The Four Tops'],'The Temptations'],
 ['Who recorded Go Your Own Way?',['Fleetwood Mac','Eagles','ABBA'],'Fleetwood Mac'],
 ['Who recorded Take on Me?',['a-ha','Duran Duran','Tears for Fears'],'a-ha'],
 ['Who recorded Rhythm Is a Dancer?',['Snap!','2 Unlimited','Corona'],'Snap!'],
 ['Who recorded Everybody Wants to Rule the World?',['Tears for Fears','Wham!','Duran Duran'],'Tears for Fears'],
 ['Who recorded Mr Brightside?',['The Killers','Kings of Leon','Snow Patrol'],'The Killers'],
 ['Who recorded September?',['Earth, Wind & Fire','Chic','Kool & The Gang'],'Earth, Wind & Fire'],
 ['Who recorded Wannabe?',['Spice Girls','All Saints','Sugababes'],'Spice Girls'],
 ['Who recorded Faith?',['George Michael','Elton John','Prince'],'George Michael'],
 ['Who recorded Dancing Queen?',['ABBA','Boney M.','Blondie'],'ABBA'],
 ['Who recorded Livin’ on a Prayer?',['Bon Jovi','Europe','Def Leppard'],'Bon Jovi'],
 ['Who recorded Tainted Love?',['Soft Cell','Depeche Mode','Erasure'],'Soft Cell'],
 ['Who recorded Firestarter?',['The Prodigy','The Chemical Brothers','Fatboy Slim'],'The Prodigy'],
 ['Who recorded Hips Don’t Lie?',['Shakira','Rihanna','Jennifer Lopez'],'Shakira'],
 ['Who recorded Uptown Funk?',['Mark Ronson ft. Bruno Mars','Daft Punk','Pharrell Williams'],'Mark Ronson ft. Bruno Mars'],
 ['Who recorded Flowers?',['Miley Cyrus','Dua Lipa','Sabrina Carpenter'],'Miley Cyrus'],
 ['Who recorded Good Luck, Babe!?',['Chappell Roan','Olivia Rodrigo','Billie Eilish'],'Chappell Roan'],
 ['Who recorded Too Sweet?',['Hozier','Benson Boone','Harry Styles'],'Hozier']
 ],
 brain:[
 ['Which decade gave us Dancing Queen?',['1970s','1960s','1980s'],'1970s'],
 ['Who sang Mr Brightside?',['The Killers','Oasis','Blur'],'The Killers'],
 ['Which band had Wonderwall?',['Oasis','Blur','Pulp'],'Oasis'],
 ['Which decade gave us Take on Me?',['1980s','1970s','1990s'],'1980s'],
 ['Which band had Song 2?',['Blur','Oasis','Pulp'],'Blur'],
 ['Which decade gave us Wannabe?',['1990s','1980s','2000s'],'1990s'],
 ['Which artist had Umbrella?',['Rihanna','Beyoncé','Pink'],'Rihanna'],
 ['Which decade gave us Sex on Fire?',['2000s','1990s','2010s'],'2000s'],
 ['Which band had Ruby?',['Kaiser Chiefs','Franz Ferdinand','Kasabian'],'Kaiser Chiefs'],
 ['Which artist had Faith?',['George Michael','Prince','Elton John'],'George Michael'],
 ['Which decade gave us September?',['1970s','1980s','1960s'],'1970s'],
 ['Which band had Firestarter?',['The Prodigy','Oasis','The Chemical Brothers'],'The Prodigy'],
 ['Which artist had Flowers?',['Miley Cyrus','Taylor Swift','Dua Lipa'],'Miley Cyrus'],
 ['Which decade gave us Mr Brightside?',['2000s','1990s','2010s'],'2000s'],
 ['Which band had Chelsea Dagger?',['The Fratellis','The Libertines','The Strokes'],'The Fratellis'],
 ['Which artist had Hips Don’t Lie?',['Shakira','Rihanna','Kylie Minogue'],'Shakira'],
 ['Which decade gave us Rhythm Is a Dancer?',['1990s','1980s','2000s'],'1990s'],
 ['Which artist had Shape of You?',['Ed Sheeran','Sam Smith','Lewis Capaldi'],'Ed Sheeran'],
 ['Which band had Don’t Speak?',['No Doubt','Garbage','The Cranberries'],'No Doubt'],
 ['Which decade gave us Good Luck, Babe!?',['2020s','2010s','2000s'],'2020s']
 ]
};

const simpleText=[
 ['50s','60s','70s','80s','90s','00s','10s','20s','Rock ’n’ Roll','Disco','Britpop','Dance','Pop','Soul','Indie','Synth Pop','Motown','Funk','Ballads','Chart Classics'],
 ['🥁🥁🥁 A forgotten 80s gem!','🥁🥁🥁 Nickelback detected! 🎸😂','🥁🥁🥁 Music Train cleared! 🚂','🥁🥁🥁 Serious Jockin approaching! 🔥','🥁🥁🥁 90s floor filler incoming!','🥁🥁🥁 The nostalgia department is open!','🥁🥁🥁 Cassette memories unlocked!','🥁🥁🥁 Somebody said “one more tune”!','🥁🥁🥁 Dancefloor emergency declared!','🥁🥁🥁 Vinyl has entered the chat!','🥁🥁🥁 Top of the Pops memory detected!','🥁🥁🥁 The forgotten gem cupboard is open!','🥁🥁🥁 The jukebox has opinions!','🥁🥁🥁 Big chorus approaching!','🥁🥁🥁 A singalong is forming!','🥁🥁🥁 Decade switch activated!','🥁🥁🥁 The music train is boarding!','🥁🥁🥁 Retro radar activated!','🥁🥁🥁 Live Wire nostalgia overload!','🥁🥁🥁 One more really is one more!'],
 ['🎸 ROCK','🎤 POP','🪩 DISCO','🎹 SYNTH POP','🎸 INDIE','🎤 SOUL','🥁 FUNK','💿 CLASSIC','🚂 DANCE','🎶 SINGALONG','🔥 ANTHEM','💎 FORGOTTEN GEM','📻 RADIO CLASSIC','🕺 FLOOR FILLER','🎧 MODERN THROWBACK','🎤 POWER BALLAD','🎸 BRITPOP','🪩 70s GROOVE','📀 00s THROWBACK','⚡ LIVE WIRE PICK'],
 ['Dan 😂','Will 😂','Definitely Dan.','Definitely Will.','The jukebox. 😂','The Live Wire family. 💜','Whoever touched the volume. 😂','The person who requested “one more”.','Mr Phoenix after hearing Nickelback. 🎸','Dan after finding another forgotten gem. 💎','Will when the train is mentioned. 🚂','The chat. 😂','Nobody is admitting it. 👀','The DJ. Obviously. 😂','The person at the bar. 🍹','The person singing the wrong words. 🎤','The person who arrived late. 😂','The person who said “I know this one”.','The person who asked for a quiz.','Everyone. 😂'],
 ['📢 GOOD EVENING LIVE WIRE! THE BAR IS OPEN!','📢 ONE MORE TUNE HAS BEEN AUTHORISED!','📢 THE MUSIC TRAIN IS NOW BOARDING! 🚂','📢 PLEASE KEEP ARMS AND LEGS INSIDE THE DANCEFLOOR!','📢 LIVE WIRE FAMILY, PREPARE FOR NOSTALGIA!','📢 THE JUKEBOX HAS MADE ITS DECISION!','📢 FORGOTTEN GEM DETECTED! 💎','📢 THE CHAT HAS REQUESTED ANOTHER CLASSIC!','📢 SERIOUS JOCKIN IS APPROACHING! 🔥','📢 MIDNIGHT MAGIC HAS BEEN DETECTED! 🌙','📢 THE DECADE HAS CHANGED!','📢 THE DANCEFLOOR IS NOW OPEN!','📢 SOMEONE HAS SAID ONE MORE TUNE!','📢 THE LIVE WIRE BAR IS FULL OF BANTER!','📢 TOP OF THE POPS MEMORY INCOMING!','📢 VINYL MEMORY UNLOCKED!','📢 90s NOSTALGIA ALERT!','📢 00s THROWBACK INCOMING!','📢 BIG CHORUS WARNING!','📢 LIVE WIRE CHAOS LEVEL: MAXIMUM!'],
 ['YES — GET DANCING! 🕺🔥','ABSOLUTELY! 🔥','SIT DOWN FOR 30 SECONDS 😂','ONLY IF THE TUNE IS GOOD!','YES, BUT BRING A SNACK. 😂','DEFINITELY — CLEAR THE FLOOR!','MAYBE — CONSULT THE JUKEBOX.','YES — THIS IS A SERIOUS MATTER.','NO — YOU’RE NOT READY. 😂','YES — THE CHAT HAS SPOKEN!','GO ON THEN!','ONLY AFTER ONE MORE TUNE!','YES — FULL SEND!','YES — NOSTALGIA DEMANDS IT!','YES — BUT NO REQUESTING NICKELBACK. 😂','ABSOLUTELY — TURN IT UP!','YES — GET YOUR DANCING SHOES!','YES — LIVE WIRE APPROVES!','YES — THE TRAIN IS WAITING!','YES — WHY ARE WE STILL ASKING? 😂'],
 ['🎫 VALID — FEEL GOOD FRIDAY','🎫 VALID — MUSIC TRAIN','🎫 VALID — LIVE WIRE BAR','🎫 VALID — NOSTALGIA EXPRESS','🎫 VALID — DANCEFLOOR CENTRAL','🎫 VALID — FORGOTTEN GEM STATION','🎫 VALID — SERIOUS JOCKIN','🎫 VALID — MIDNIGHT MAGIC','🎫 VALID — 80s AVENUE','🎫 VALID — 90s JUNCTION','🎫 VALID — 00s BOULEVARD','🎫 VALID — VINYL VILLAGE','🎫 VALID — SINGALONG SQUARE','😂 INVALID — PRINTED ON A NAPKIN','😂 INVALID — WRONG TRAIN','😂 INVALID — TICKET HAS TOO MUCH BANTER','🎫 VALID — ONE MORE TUNE EXPRESS','🎫 VALID — TOP OF THE POPS TERRACE','🎫 VALID — LIVE WIRE LANE','🎫 VALID — DJ DISCO DAN SERVICE'],
 ['1','2','3','4','5','6','7','8','9','10','80s','90s','70s','00s','Vinyl Village','Disco Street','Banter Platform','Jukebox Junction','Nostalgia North','Live Wire Lane'],
 ['GREEN — TRAIN MOVING! 🚂','RED — STOP!','AMBER — GET READY!','GREEN — MUSIC CLEARED!','RED — BANTER DELAY!','AMBER — DECADE CHANGE!','GREEN — NEXT STOP: 80s AVENUE!','RED — NICKELBACK DETECTED! 😂','GREEN — DANCEFLOOR OPEN!','AMBER — ONE MORE TUNE!','RED — CHAT DISTRACTED!','GREEN — JUKEBOX READY!','AMBER — VINYL MEMORY LOADING!','GREEN — FORGOTTEN GEM AHEAD!','RED — TOO MUCH CHAOS!','GREEN — SERIOUS JOCKIN CLEAR!','AMBER — MIDNIGHT MAGIC NEAR!','GREEN — LIVE WIRE FAMILY ABOARD!','RED — TRAIN HAS BEEN HIJACKED BY BANTER!','GREEN — FULL STEAM AHEAD!'],
 ['Electric Sunset','Neon Memory','Disco Thunder','Vinyl Voltage','Phoenix Fire','Dan’s Forgotten Gem','Midnight Spark','Jukebox Storm','Live Wire Lightning','Retro Rocket','Nostalgia Fizz','Dancefloor Thunder','Synthwave Sunset','80s Electric','90s Neon','00s Pop Rocket','Britpop Breeze','Soul Spark','Funk Flash','One More Tune'],
 ['80s CLASSIC — TURN IT UP!','90s DANCE FLOOR!','70s DISCO!','00s THROWBACK!','FORGOTTEN GEM! 💎','BIG CHORUS!','SINGALONG CLASSIC!','VINYL MEMORY!','BRITPOP BANGER!','SYNTH POP FLASHBACK!','MOTOWN MOMENT!','FUNKY THROWBACK!','POWER BALLAD!','INDIE FLOOR FILLER!','MODERN CLASSIC!','DANCE ANTHEM!','ROCK CLASSIC!','POP BELTER!','NOSTALGIA HIT!','LIVE WIRE WILDCARD!'],
 ['A BIG 80s ANTHEM! 🎧','A 90s FLOOR FILLER! 🕺','A 70s DISCO CLASSIC! 💿','A 00s SINGALONG! 🎤','A FORGOTTEN GEM! 💎','A 60s SOUL CLASSIC!','A 50s ROCK ’N’ ROLL TUNE!','A MODERN THROWBACK!','A BRITPOP BELTER!','A SYNTH POP CLASSIC!','A DANCEFLOOR STAPLE!','A BIG POWER BALLAD!','A VINYL MEMORY!','A NOSTALGIA MONSTER!','A LIVE WIRE WILDCARD!','A CHAT FAVOURITE!','A JUKEBOX CLASSIC!','A SERIOUS JOCKIN PICK!','A MIDNIGHT MAGIC TUNE!','A ONE MORE TUNE SPECIAL!'],
 ['VIP Table 1 — Speakers 🔊','VIP Table 2 — Banter view 😂','VIP Table 3 — Train side 🚂','VIP Table 4 — Nickelback danger 🎸','VIP Table 5 — Jukebox view 🎵','VIP Table 6 — Dancefloor front row 🕺','VIP Table 7 — Nostalgia corner 💿','VIP Table 8 — Lightning seat ⚡','VIP Table 9 — Bar-side banter 🍹','VIP Table 10 — DJ watch 👀','VIP Table 11 — Singalong zone 🎤','VIP Table 12 — Quiet-ish corner 😂','VIP Table 13 — Forgotten gem booth 💎','VIP Table 14 — 80s department','VIP Table 15 — 90s department','VIP Table 16 — 00s department','VIP Table 17 — Serious Jockin seat','VIP Table 18 — Midnight Magic booth','VIP Table 19 — Live Wire family table 💜','VIP Table 20 — One More Tune table']
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
.lw-arcade-panel .lw-dartboard-wrap{display:flex;justify-content:center;margin:12px auto;max-width:360px}.lw-arcade-panel .lw-dartboard{width:100%;height:auto;touch-action:manipulation;border-radius:50%;background:#111;box-shadow:0 0 18px rgba(255,212,59,.2)}.lw-arcade-panel .lw-dart-seg{cursor:pointer;stroke:#111;stroke-width:1}.lw-arcade-panel .lw-dart-seg:hover{filter:brightness(1.2)}.lw-arcade-panel .lw-dart-score{text-align:center;font-size:22px;margin-bottom:5px}.lw-arcade-panel .lw-dart-msg{text-align:center;min-height:24px;font-weight:800}.lw-arcade-panel .lw-dart-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.lw-arcade-panel .lw-dart-actions button{border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:10px;cursor:pointer}.lw-arcade-panel .lw-dart-actions button:disabled{opacity:.45;cursor:not-allowed}.lw-arcade-panel .lw-skittle-lane{margin:12px auto;max-width:360px;border:2px solid #00eaff;border-radius:18px;padding:12px;background:linear-gradient(180deg,#17121b,#07151d);overflow:hidden}.lw-arcade-panel .lw-skittle-stage{position:relative;height:360px;border-radius:12px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.035) 0 24px,rgba(0,0,0,.08) 24px 48px);border:1px solid rgba(255,255,255,.12)}.lw-arcade-panel .lw-skittle-stage:before{content:"";position:absolute;left:7%;right:7%;top:7%;height:68%;border:2px solid rgba(255,212,59,.55);border-radius:50% 50% 18px 18px}.lw-arcade-panel .lw-skittle-pins{position:absolute;inset:7% 7% 25%}.lw-arcade-panel .lw-skittle-pin{position:absolute;transform:translate(-50%,-50%);width:38px;height:38px;padding:0;border:0;background:transparent;font-size:28px;cursor:pointer;transition:transform .18s,opacity .18s;filter:drop-shadow(0 2px 2px rgba(0,0,0,.5))}.lw-arcade-panel .lw-skittle-pin.down{transform:translate(-50%,-20%) rotate(78deg);opacity:.28}.lw-arcade-panel .lw-skittle-ball{position:absolute;left:50%;bottom:5%;transform:translateX(-50%);font-size:42px;transition:transform .42s ease}.lw-arcade-panel .lw-skittle-ball.rolling{transform:translate(-50%,-275px) rotate(720deg)}.lw-arcade-panel .lw-skittle-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.lw-arcade-panel .lw-skittle-actions button{border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:10px;cursor:pointer}.lw-arcade-panel .lw-skittle-actions button:disabled{opacity:.45;cursor:not-allowed}
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

const panel=document.createElement('section');
panel.className='extras-section lw-arcade-panel';panel.style.display='none';
panel.innerHTML='<div class="wrap"><h1>🎮⚡ New Live Wire Arcade</h1><p>22 games with much larger fresh question, answer and result pools. No constant repeat rotation. 😂⚡</p><div class="lwmore"></div></div>';
toggle.insertAdjacentElement('afterend',panel);

let built=false;
const qs=id=>panel.querySelector('#'+id);
const clear=x=>{while(x.firstChild)x.removeChild(x.firstChild)};

function card(i,title,desc){
  const d=document.createElement('div');d.className='lwgame';
  d.innerHTML='<div class="mini-label">FRESH POOL ⚡</div><h2>'+title+'</h2><p>'+desc+'</p><div id="lo'+i+'" class="lwout">READY?</div><div id="lc'+i+'" class="lwc"></div><button type="button" class="lwgo" id="lg'+i+'">⚡ PLAY</button>';
  return d;
}
function showSimple(i,text){const o=qs('lo'+i),c=qs('lc'+i);if(o)o.textContent=text;if(c)clear(c)}
function mc(i,data){
  const o=qs('lo'+i),c=qs('lc'+i);if(!o||!c)return;
  const x=P('quiz-'+i,data);o.textContent=x[0];clear(c);
  shuffle(x[1]).forEach(v=>{
    const b=document.createElement('button');b.type='button';b.textContent=v;
    b.addEventListener('click',()=>{
      o.textContent=v===x[2]?'⚡ CORRECT! 🔥':'😂 NOT QUITE — '+x[2];
      Array.from(c.children).forEach(q=>q.disabled=true);
      setTimeout(()=>mc(i,data),750);
    });c.appendChild(b);
  });
}
function bingo(i,arr,msg){
  const o=qs('lo'+i),c=qs('lc'+i);if(!o||!c)return;
  c.className='lwb';clear(c);
  const v=freshMany('bingo-'+i,arr,24);let k=0;
  for(let r=0;r<5;r++)for(let col=0;col<5;col++){
    const b=document.createElement('button');b.type='button';
    b.textContent=r===2&&col===2?'FREE':v[k++];
    if(r===2&&col===2)b.classList.add('on');
    b.addEventListener('click',()=>{
      if(r===2&&col===2)return;
      b.classList.toggle('on');
      const z=[...c.children],m=n=>z[n].classList.contains('on');
      const win=[0,1,2,3,4].some(row=>[0,1,2,3,4].every(col2=>m(row*5+col2)))||
        [0,1,2,3,4].some(col2=>[0,1,2,3,4].every(row=>m(row*5+col2)))||
        [0,6,12,18,24].every(m)||[4,8,12,16,20].every(m);
      if(win)o.textContent=msg;
    });
    c.appendChild(b);
  }
  o.textContent='FRESH CARD READY!';
}
function playNew(i,type){
  const o=qs('lo'+i),c=qs('lc'+i); if(!o||!c)return;
  clear(c);
  const btn=(label,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',fn);c.appendChild(b);};
  const result=t=>{o.textContent=t;};
  const rand=(n)=>Math.floor(Math.random()*n)+1;
  if(type==='higher'||type==='redblack'){
    const card=rand(13),suits=['♥️','♦️','♣️','♠️'],s=suits[rand(4)-1]; result('CARD: '+s+' '+card+' — make your call!');
    if(type==='higher'){btn('⬆️ Higher',()=>result(rand(13)>=card?'🔥 Correct call!':'😂 Wrong — the pub takes the point!'));btn('⬇️ Lower',()=>result(rand(13)<=card?'🔥 Correct call!':'😂 Wrong — the pub takes the point!'));}
    else{btn('❤️♦️ Red',()=>result(rand(2)===1?'🔥 RED!':'🖤 BLACK!'));btn('♣️♠️ Black',()=>result(rand(2)===1?'❤️♦️ RED!':'🔥 BLACK!'));}
  } else if(type==='dice'){result('🎲 Two dice ready! Predict the total.');[2,4,6,8,10,12].forEach(n=>btn(String(n),()=>result(rand(11)+1===n?'🎉 BULLSEYE TOTAL!':'😂 The dice had other plans!')))}
  else if(type==='luckynum'){result('🍀 Pick a number from 1–20');for(let n=1;n<=10;n++)btn('Pick '+n,()=>result(rand(20)===n?'🍀 LUCKY! JACKPOT!':'😂 Not your lucky number!'))}
  else if(type==='pubjackpot'){result('🏆 Answer the pub question to build the jackpot.');const qs2=[['Capital of Wales?',['Cardiff','Swansea','Newport'],'Cardiff'],['Beatles album?',['Abbey Road','Rumours','Thriller'],'Abbey Road'],['How many sides on a hexagon?',['6','7','8'],'6'],['Which decade was 1990 in?',['90s','80s','00s'],'90s']];const q=P('pubjackpot-questions',qs2);o.textContent=q[0];q[1].forEach(v=>btn(v,()=>result(v===q[2]?'💷 JACKPOT BUILDS! £'+(rand(9)*10):'😂 Jackpot escapes!')))}
  else if(type==='bull'){result('🎯 Tap THROW and try to land closest to the bull.');btn('🎯 THROW!',()=>result('You landed '+rand(100)+'cm from bull! '+(rand(5)===1?'🔥 BULLSEYE!':'Closest pub table wins bragging rights!')))}
  else if(type==='darts301'){
    let score=301,throws=0,turnScore=0;
    o.innerHTML='<div class="lw-dart-score">🎯 <strong>301</strong> remaining</div><div class="lw-dart-msg">Tap the dartboard where you want to throw.</div><div class="lw-dartboard-wrap"><svg class="lw-dartboard" viewBox="0 0 400 400" role="img" aria-label="Interactive dartboard"></svg></div><div class="lw-dart-actions"><button type="button" class="lw-dart-new">↻ New Game</button><button type="button" class="lw-dart-next" disabled>➡️ Next Dart</button></div>';
    c.innerHTML='';
    const svg=o.querySelector('.lw-dartboard'), next=o.querySelector('.lw-dart-next'), fresh=o.querySelector('.lw-dart-new');
    const nums=[20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];
    const cx=200,cy=200;
    const polar=(r,a)=>[cx+Math.cos(a)*r,cy+Math.sin(a)*r];
    const path=(r1,r2,a1,a2)=>{const p1=polar(r1,a1),p2=polar(r1,a2),p3=polar(r2,a2),p4=polar(r2,a1),large=(a2-a1)>Math.PI?1:0;return 'M '+p1[0]+' '+p1[1]+' L '+p2[0]+' '+p2[1]+' L '+p3[0]+' '+p3[1]+' L '+p4[0]+' '+p4[1]+' Z'};
    const add=(tag,attrs)=>{const el=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));svg.appendChild(el);return el};
    add('circle',{cx,cy,r:190,fill:'#17121b',stroke:'#ffd43b','stroke-width':5});
    for(let i=0;i<20;i++){const a0=-Math.PI/2+i*Math.PI*2/20-Math.PI/40,a1=-Math.PI/2+i*Math.PI*2/20+Math.PI/40,n=nums[i];
      [['0',34],['1',88],['3',128],['1',168]].forEach(()=>{});
      add('path',{d:path(42,88,a0,a1),class:'lw-dart-seg',fill:i%2?'#e9e9e9':'#202020','data-value':n,'data-mult':1});
      add('path',{d:path(128,168,a0,a1),class:'lw-dart-seg',fill:i%2?'#e9e9e9':'#202020','data-value':n,'data-mult':1});
      add('path',{d:path(88,98,a0,a1),class:'lw-dart-seg',fill:i%2?'#b51f2a':'#1d6f54','data-value':n,'data-mult':3});
      add('path',{d:path(168,178,a0,a1),class:'lw-dart-seg',fill:i%2?'#b51f2a':'#1d6f54','data-value':n,'data-mult':2});
    }
    add('circle',{cx,cy,r:34,fill:'#202020',stroke:'#ffd43b','stroke-width':2,'data-value':25,'data-mult':1,class:'lw-dart-seg'});
    add('circle',{cx,cy,r:17,fill:'#c52b38',stroke:'#ffd43b','stroke-width':2,'data-value':25,'data-mult':2,class:'lw-dart-seg'});
    for(let i=0;i<20;i++){const a=-Math.PI/2+(i+.5)*Math.PI*2/20,p=polar(187,a),t=add('text',{x:p[0],y:p[1]+5,'text-anchor':'middle','font-size':13,fill:'#fff','font-weight':900});t.textContent=nums[i]}
    const scoreBox=()=>{const s=o.querySelector('.lw-dart-score');if(s)s.innerHTML='🎯 <strong>'+score+'</strong> remaining · Dart '+Math.min(throws+1,3)+'/3';};
    const reset=()=>{score=301;throws=0;turnScore=0;next.disabled=true;svg.querySelectorAll('.lw-dart-mark').forEach(x=>x.remove());scoreBox();o.querySelector('.lw-dart-msg').textContent='Tap the dartboard where you want to throw.'};
    const throwDart=(value,mult,el)=>{
      if(throws>=3)return;
      const points=value*mult;
      if(score-points<0){result('💥 BUST! '+points+' would go below zero. Turn lost.');throws=3;turnScore=0;next.disabled=false;return;}
      score-=points;turnScore+=points;throws++;
      const mark=document.createElementNS('http://www.w3.org/2000/svg','circle');const box=el.getBoundingClientRect(),root=svg.getBoundingClientRect();
      const pt=el.tagName.toLowerCase()==='circle'?[+el.getAttribute('cx'),+el.getAttribute('cy')]:null;
      if(pt){mark.setAttribute('cx',pt[0]);mark.setAttribute('cy',pt[1]);}else{const p=polar(130,0);mark.setAttribute('cx',p[0]);mark.setAttribute('cy',p[1]);}
      mark.setAttribute('r',5);mark.setAttribute('class','lw-dart-mark');mark.setAttribute('fill','#ffd43b');mark.setAttribute('stroke','#111');mark.setAttribute('stroke-width',2);svg.appendChild(mark);
      if(score===0){result('🏆 CHECKOUT! '+turnScore+' points this turn — YOU WIN!');throws=3;next.disabled=true;return;}
      result('🎯 '+(mult===3?'TRIPLE ':mult===2?'DOUBLE ':'')+value+' = '+points+' points');
      next.disabled=false;
      if(throws===3){result('🎯 Turn total: '+turnScore+' — '+score+' left. Tap Next Dart for another turn.');}
    };
    svg.addEventListener('click',e=>{const el=e.target.closest('.lw-dart-seg');if(!el||throws>=3)return;throwDart(Number(el.dataset.value),Number(el.dataset.mult),el)});
    next.addEventListener('click',()=>{if(throws<3)return;throws=0;turnScore=0;next.disabled=true;scoreBox();o.querySelector('.lw-dart-msg').textContent='New turn — tap the board for your next dart.'});
    fresh.addEventListener('click',reset);scoreBox();
  }
  else if(type==='killer'){let target=null;result('🎯 Choose your killer target number.');[20,19,18,17,16,15].forEach(n=>btn('Target '+n,()=>{target=n;result('☠️ Killer target: '+target+' — now hit it!');btn('🎯 THROW AT '+target,()=>result(rand(3)===1?'☠️ KILLER! Target claimed!':'😂 Missed it — keep throwing!'))}))}
  else if(type==='coinpusher'){let coins=rand(6)+4;result('🪙 '+coins+' virtual coins on the ledge.');btn('🪙 DROP COIN',()=>{const push=rand(4);coins+=push-1;result(coins>10?'🎉 COINS PUSHED! +'+push:'🪙 '+Math.max(0,coins)+' coins wobbling on the ledge!')})}
  else if(type==='skittles'){
    let knocked=new Set(),rolls=0,total=0;
    o.innerHTML='<div class="lw-dart-score">🎳 <strong>10</strong> skittles standing</div><div class="lw-dart-msg">Roll the ball down the lane and knock them over!</div><div class="lw-skittle-lane"><div class="lw-skittle-stage"><div class="lw-skittle-pins"></div><div class="lw-skittle-ball">🎳</div></div></div><div class="lw-skittle-actions"><button type="button" class="lw-skittle-roll">🎳 ROLL BALL</button><button type="button" class="lw-skittle-reset">↻ NEW GAME</button></div>';
    c.innerHTML='';
    const pins=o.querySelector('.lw-skittle-pins'),ball=o.querySelector('.lw-skittle-ball'),scoreBox=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),roll=o.querySelector('.lw-skittle-roll'),reset=o.querySelector('.lw-skittle-reset');
    const pinNames=['A','B','C','D','E','F','G','H','I','J'];
    const drawPins=()=>{
      pins.innerHTML='';
      const spots=[[50,12],[39,28],[61,28],[28,45],[50,45],[72,45],[17,64],[39,64],[61,64],[83,64]];
      spots.forEach((p,i)=>{
        const el=document.createElement('button');el.type='button';el.className='lw-skittle-pin'+(knocked.has(i)?' down':'');el.style.left=p[0]+'%';el.style.top=p[1]+'%';el.textContent='🎳';el.title='Skittle '+pinNames[i];el.addEventListener('click',()=>{if(!knocked.has(i)){knocked.add(i);total=knocked.size;drawPins();update();}});
        pins.appendChild(el);
      });
    };
    const update=()=>{const left=10-knocked.size;scoreBox.innerHTML='🎳 <strong>'+left+'</strong> skittles standing · '+knocked.size+'/10 down';if(left===0){msg.textContent='🏆 PERFECT 10! ALL SKITTLES DOWN! 🔥';roll.disabled=true;}else msg.textContent=rolls?'Roll '+(rolls+1)+' — '+left+' still standing.':'Roll the ball down the lane!';};
    const resetGame=()=>{knocked=new Set();rolls=0;total=0;roll.disabled=false;ball.classList.remove('rolling');drawPins();update();};
    roll.addEventListener('click',()=>{
      if(knocked.size===10)return;
      rolls++;
      ball.classList.remove('rolling');void ball.offsetWidth;ball.classList.add('rolling');
      setTimeout(()=>{
        const standing=[...Array(10).keys()].filter(i=>!knocked.has(i));
        const hitCount=Math.min(standing.length,Math.max(1,Math.floor(Math.random()*5)+1));
        shuffle(standing).slice(0,hitCount).forEach(i=>knocked.add(i));
        total=knocked.size;drawPins();update();
        if(knocked.size<10)msg.textContent='💥 '+hitCount+' skittle'+(hitCount===1?'':'s')+' down! '+(10-knocked.size)+' left.';
      },420);
    });
    reset.addEventListener('click',resetGame);drawPins();update();
  }
  else if(type==='shuffleboard'){btn('🟠 SLIDE',()=>{const d=rand(100);result(d>85?'🏆 PERFECT LANDING!':d>60?'🔥 Great slide!':'😂 Bit short — blame the table!')});result('🟠 Slide the puck towards the 100 zone.')}
  else if(type==='tablefootball'){let a=0,b=0;result('⚽ Kick-off!');btn('⚽ ATTACK',()=>{rand(2)===1?a++:b++;result('⚽ SCORE '+a+' - '+b+' — '+(a>=5||b>=5?'🏆 FULL TIME!':'Keep attacking!'))})}
  else if(type==='bowling'){let frame=1,pins=10;result('🎳 Frame 1 — 10 pins');btn('🎳 BOWL',()=>{const hit=rand(10);result(hit===10?'🎳 STRIKE! 🔥':'🎳 Knocked '+hit+' pins!');frame++;if(frame<=10)setTimeout(()=>result('🎳 Frame '+frame+' — roll again!'),250)})}
  else if(type==='bagatelle'){btn('🟡 DROP BALL',()=>{const slot=rand(9);result('🟡 Ball landed in slot '+slot+' — '+(slot===9?'JACKPOT!':'Nice drop!'))});result('🟡 Drop the ball and see where it lands.')}
  else if(type==='pickcard'){const cards=['🍺 FREE ROUND (virtual!)','🎵 ONE MORE TUNE','😂 BANTER BONUS','💎 FORGOTTEN GEM','🚂 MUSIC TRAIN PASS','⚡ LIVE WIRE WILDCARD','🕺 DANCEFLOOR TOKEN','🎤 SINGALONG CARD','🪩 DISCO BONUS'];result('🃏 Choose a mystery card');cards.forEach((x,n)=>btn('🃏 Card '+(n+1),()=>result(x)))}
  else if(type==='fruitmachine'){const icons=['🍒','🍋','🔔','⭐','💎','⚡'];const spin=()=>{const a=icons[rand(icons.length)-1],b=icons[rand(icons.length)-1],d=icons[rand(icons.length)-1];result(a+' '+b+' '+d+(a===b&&b===d?' — 🎉 JACKPOT!':' — 😂 No jackpot, spin again!'))};btn('🍒 SPIN',spin);result('🍒 The Live Wire Fruit Machine is ready!')}
  else {const pools={bouncer:['🚪 IN — you passed the vibe check!','🚫 OUT — too much banter at the door!','🚪 IN — DJ approved!'],temuboss:['🛍️ Ordered 4 gadgets. Needed none. 😂','📦 Your parcel has arrived… somewhere.','💳 Temu Boss says: ADD TO BASKET!'],dadbod:['💪 Elite dad bod detected!','😂 Dad bod bonus unlocked!','🔥 Platinum chest package detected!'],dodgyrequest:['🎧 Request accepted: one absolute banger!','😂 Request denied: DJ has standards!','🎵 You asked for one more. We know how this ends.'],phoenixexcuse:['🚂 The Music Train was delayed!','🎧 I was choosing the perfect tune!','😂 The jukebox distracted me!'],bartab:['💷 Tab: £'+(rand(18)+4)+' — blame the jukebox.','💷 Tab: £'+(rand(40)+20)+' — ONE MORE TUNE strikes again!','😂 Tab mysteriously disappeared.'],pubcustomer:['🍺 The one who says “I only came for one!”','🎤 The one singing every word loudly.','🎯 The darts expert who blames the board.'],lastorders:['🔔 LAST ORDERS! Finish your tune!','🔔 LAST ORDERS! The jukebox disagrees!','🔔 LAST ORDERS! One more… obviously.'],toomany:['😂 Definitely fine. Probably.','🍺 Needs the chair to stop moving.','🎵 Still knows every word somehow!'],jukeboxgamble:['🎵 80s classic!','🎵 90s floor filler!','🎵 00s throwback!','🎵 Forgotten gem!','🎵 Absolute wildcard!']};const p=pools[type]||['⚡ Live Wire chaos!'];result(P('new-'+type,p));}
}

function build(){
  if(built)return;built=true;
  const grid=panel.querySelector('.lwmore');
  games.forEach((g,i)=>grid.appendChild(card(i,g[0],g[1]+' — fresh content is pulled without repeating until the pool is used.')));

  qs('lg0').addEventListener('click',()=>bingo(0,songs,'🎉 MUSIC BINGO! ⚡🔥'));
  qs('lg1').addEventListener('click',()=>mc(1,quiz.intro));
  qs('lg3').addEventListener('click',()=>mc(3,quiz.lyric));
  qs('lg6').addEventListener('click',()=>mc(6,quiz.album));
  qs('lg7').addEventListener('click',()=>mc(7,quiz.hall));
  qs('lg9').addEventListener('click',()=>bingo(9,banter,'🎉 BANTER BINGO! 😂⚡'));
  qs('lg11').addEventListener('click',()=>mc(11,quiz.brain));

  qs('lg2').addEventListener('click',()=>showSimple(2,P('decade-shuffle',simpleText[0])+' 🎵'));
  qs('lg4').addEventListener('click',()=>showSimple(4,P('drumroll',simpleText[1])));
  qs('lg5').addEventListener('click',()=>showSimple(5,P('rock-pop',simpleText[2])));
  qs('lg8').addEventListener('click',()=>showSimple(8,P('who-would-do-it',simpleText[3])));
  qs('lg10').addEventListener('click',()=>{
    let n=10,o=qs('lo10');clearInterval(window.lwChaosTimer);o.textContent=n;
    window.lwChaosTimer=setInterval(()=>{n--;o.textContent=n;if(n<=0){clearInterval(window.lwChaosTimer);o.textContent=P('chaos-results',['💥 CHAOS WINS! 😂','⚡ BANTER OVERLOAD!','🚨 MUSIC EMERGENCY!','🎉 SOMEHOW WE SURVIVED!','😂 THE CHAT CAUSED IT!'])}},400);
  });
  qs('lg12').addEventListener('click',()=>showSimple(12,P('dj-announcements',simpleText[4])));
  qs('lg13').addEventListener('click',()=>showSimple(13,P('dance-decisions',simpleText[5])));
  qs('lg14').addEventListener('click',()=>showSimple(14,P('ticket-checker',simpleText[6])));
  qs('lg15').addEventListener('click',()=>showSimple(15,'PLATFORM '+P('station-master',simpleText[7])+' 🚂'));
  qs('lg16').addEventListener('click',()=>showSimple(16,[1,2,3].map(n=>n+'. '+P('playlist-'+n,['80s Avenue','90s Junction','70s Disco Street','00s Boulevard','Vinyl Village','Britpop Bridge','Jukebox Junction','Nostalgia North','Live Wire Lane','Dancefloor Central'])).join(' • ')));
  qs('lg17').addEventListener('click',()=>showSimple(17,'🚦 '+P('signal-box',simpleText[8])));
  qs('lg18').addEventListener('click',()=>showSimple(18,P('cocktails',simpleText[9])+' ⚡'));
  qs('lg19').addEventListener('click',()=>showSimple(19,P('bar-jukebox',simpleText[10])));
  qs('lg20').addEventListener('click',()=>showSimple(20,P('bar-play-next',simpleText[11])));
  qs('lg21').addEventListener('click',()=>showSimple(21,P('vip-tables',simpleText[12])));
  const newTypes=['higher','redblack','dice','luckynum','pubjackpot','bull','darts301','killer','coinpusher','skittles','shuffleboard','tablefootball','bowling','bagatelle','pickcard','fruitmachine','bouncer','temuboss','dadbod','dodgyrequest','phoenixexcuse','bartab','pubcustomer','lastorders','toomany','jukeboxgamble'];
  newTypes.forEach((type,n)=>qs('lg'+(22+n)).addEventListener('click',()=>playNew(22+n,type)));
}
toggle.addEventListener('click',()=>{
  const open=panel.style.display==='none';
  if(open)build();
  panel.style.display=open?'block':'none';
  toggle.textContent=open?'🎮⚡ CLOSE THE NEW LIVE WIRE ARCADE':'🎮⚡ OPEN THE NEW LIVE WIRE ARCADE';
  toggle.setAttribute('aria-expanded',String(open));
  if(open)panel.scrollIntoView({behavior:'smooth',block:'start'});
});
})();