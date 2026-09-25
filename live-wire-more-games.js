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
.lw-arcade-panel .lw-dartboard-wrap{display:flex;justify-content:center;margin:12px auto;max-width:360px}.lw-arcade-panel .lw-dartboard{width:100%;height:auto;touch-action:manipulation;border-radius:50%;background:#111;box-shadow:0 0 18px rgba(255,212,59,.2)}.lw-arcade-panel .lw-dart-seg{cursor:pointer;stroke:#111;stroke-width:1}.lw-arcade-panel .lw-dart-seg:hover{filter:brightness(1.2)}.lw-arcade-panel .lw-dart-score{text-align:center;font-size:22px;margin-bottom:5px}.lw-arcade-panel .lw-dart-msg{text-align:center;min-height:24px;font-weight:800}.lw-arcade-panel .lw-dart-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.lw-arcade-panel .lw-dart-actions button{border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:10px;cursor:pointer}.lw-arcade-panel .lw-dart-actions button:disabled{opacity:.45;cursor:not-allowed}.lw-arcade-panel .lw-skittle-lane{margin:12px auto;max-width:360px;border:2px solid #00eaff;border-radius:18px;padding:12px;background:linear-gradient(180deg,#17121b,#07151d);overflow:hidden}.lw-arcade-panel .lw-skittle-stage{position:relative;height:360px;border-radius:12px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.035) 0 24px,rgba(0,0,0,.08) 24px 48px);border:1px solid rgba(255,255,255,.12)}.lw-arcade-panel .lw-skittle-stage:before{content:"";position:absolute;left:7%;right:7%;top:7%;height:68%;border:2px solid rgba(255,212,59,.55);border-radius:50% 50% 18px 18px}.lw-arcade-panel .lw-skittle-pins{position:absolute;inset:7% 7% 25%}.lw-arcade-panel .lw-skittle-pin{position:absolute;transform:translate(-50%,-50%);width:38px;height:38px;padding:0;border:0;background:transparent;font-size:28px;cursor:pointer;transition:transform .18s,opacity .18s;filter:drop-shadow(0 2px 2px rgba(0,0,0,.5))}.lw-arcade-panel .lw-skittle-pin.down{transform:translate(-50%,-20%) rotate(78deg);opacity:.28}.lw-arcade-panel .lw-skittle-ball{position:absolute;left:50%;bottom:5%;transform:translateX(-50%);font-size:42px;transition:transform .42s ease}.lw-arcade-panel .lw-skittle-ball.rolling{transform:translate(-50%,-275px) rotate(720deg)}.lw-arcade-panel .lw-skittle-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.lw-arcade-panel .lw-skittle-actions button{border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:10px;cursor:pointer}.lw-arcade-panel .lw-skittle-actions button:disabled{opacity:.45;cursor:not-allowed}.lw-arcade-panel .lw-shuffle-lane{position:relative;margin:12px auto;max-width:360px;height:460px;border:2px solid #00eaff;border-radius:18px;padding:12px;box-sizing:border-box;background:linear-gradient(90deg,#5b321d,#9b5d2d 8%,#b8793f 50%,#9b5d2d 92%,#5b321d);box-shadow:inset 0 0 20px rgba(0,0,0,.45);overflow:hidden;touch-action:none}.lw-arcade-panel .lw-shuffle-zones{position:absolute;top:7%;bottom:7%;left:8%;right:8%;border:2px solid rgba(255,255,255,.55);border-radius:12px;overflow:hidden;display:flex;flex-direction:column-reverse}.lw-arcade-panel .lw-shuffle-zone{display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;text-shadow:0 2px 3px #000;border-top:1px solid rgba(255,255,255,.55);font-size:20px}.lw-arcade-panel .lw-shuffle-zone.z10{height:17%;background:rgba(30,80,55,.45)}.lw-arcade-panel .lw-shuffle-zone.z20{height:17%;background:rgba(40,70,130,.42)}.lw-arcade-panel .lw-shuffle-zone.z30{height:21%;background:rgba(120,70,25,.42)}.lw-arcade-panel .lw-shuffle-zone.z50{height:45%;background:rgba(170,25,45,.4)}.lw-arcade-panel .lw-shuffle-puck{position:absolute;left:28px;bottom:7%;width:44px;height:44px;margin-left:-22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:36px;cursor:grab;touch-action:none;user-select:none;filter:drop-shadow(0 3px 4px rgba(0,0,0,.55))}.lw-arcade-panel .lw-shuffle-puck.dragging{cursor:grabbing;transform:scale(1.12)}.lw-arcade-panel .lw-shuffle-end{position:absolute;top:1%;left:0;right:0;text-align:center;font-size:22px}.lw-arcade-panel .lw-football-table{display:flex;align-items:stretch;gap:4px;margin:12px auto;max-width:420px;height:420px;border:3px solid #00eaff;border-radius:18px;padding:10px;background:#5b321d;box-sizing:border-box}.lw-arcade-panel .lw-football-pitch{position:relative;flex:1;border:3px solid #fff;border-radius:10px;background:repeating-linear-gradient(90deg,#187a45 0 28px,#14683b 28px 56px);overflow:hidden}.lw-arcade-panel .lw-football-row{position:absolute;left:5%;right:5%;height:34px;display:flex;align-items:center;justify-content:space-around;z-index:3;cursor:grab;touch-action:none;transition:top .18s}.lw-arcade-panel .lw-football-row:nth-child(2){top:15%}.lw-arcade-panel .lw-football-row:nth-child(3){top:38%}.lw-arcade-panel .lw-football-row:nth-child(4){top:62%}.lw-arcade-panel .lw-football-row:nth-child(5){top:85%}.lw-arcade-panel .lw-football-row.dragging{cursor:grabbing;filter:brightness(1.25)}.lw-arcade-panel .lw-football-row span{font-size:25px}.lw-arcade-panel .lw-football-ball{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:4;font-size:34px;transition:transform .45s}.lw-arcade-panel .lw-football-ball.kick{transform:translate(90px,-110px) rotate(540deg)}.lw-arcade-panel .lw-football-goal{display:flex;align-items:center;font-size:32px;width:34px;overflow:hidden}.lw-arcade-panel .lw-football-controls{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;max-width:420px;margin:0 auto}.lw-arcade-panel .lw-football-controls button{border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:10px;cursor:pointer}.lw-arcade-panel .lw-football-controls button:disabled{opacity:.45;cursor:not-allowed}.lw-arcade-panel .lw-bowling-lane{position:relative;margin:12px auto;max-width:360px;height:460px;border:3px solid #00eaff;border-radius:18px;padding:10px;box-sizing:border-box;background:linear-gradient(90deg,#6b3e22,#c08a4c 8%,#d6a765 50%,#c08a4c 92%,#6b3e22);overflow:hidden;touch-action:none}.lw-arcade-panel .lw-bowling-lane:before{content:"";position:absolute;left:12%;right:12%;top:4%;bottom:5%;border:2px solid rgba(255,255,255,.35);border-radius:8px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.04) 0 20px,rgba(0,0,0,.03) 20px 40px)}.lw-arcade-panel .lw-bowling-arrow{position:absolute;top:3%;left:0;right:0;text-align:center;font-size:22px;z-index:2}.lw-arcade-panel .lw-bowling-pins{position:absolute;left:12%;right:12%;top:11%;height:55%;z-index:3}.lw-arcade-panel .lw-bowl-pin{position:absolute;transform:translate(-50%,-50%);font-size:28px;transition:transform .35s,opacity .35s;filter:drop-shadow(0 2px 2px rgba(0,0,0,.5))}.lw-arcade-panel .lw-bowl-pin.down{opacity:.25;transform:translate(-50%,-15%) rotate(75deg)}.lw-arcade-panel .lw-bowling-ball{position:absolute;left:50%;bottom:5%;transform:translateX(-50%);font-size:42px;z-index:4;cursor:grab;touch-action:none;user-select:none;transition:left .12s,transform .65s cubic-bezier(.2,.8,.2,1)}.lw-arcade-panel .lw-bowling-ball.aiming{cursor:grabbing;transform:translateX(-50%) scale(1.12)}.lw-arcade-panel .lw-bowling-ball.rolling{transform:translate(-50%,-330px) rotate(900deg)}.lw-arcade-panel .lw-bowling-controls{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:360px;margin:0 auto}.lw-arcade-panel .lw-bowling-controls button{border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:10px;cursor:pointer}.lw-arcade-panel .lw-bowling-controls button:disabled{opacity:.45;cursor:not-allowed}.lw-arcade-panel .lw-bagatelle-board{position:relative;margin:12px auto;max-width:360px;height:470px;border:3px solid #00eaff;border-radius:20px;background:linear-gradient(180deg,#172044,#080b18);overflow:hidden;touch-action:none;box-shadow:inset 0 0 35px rgba(0,234,255,.12)}.lw-arcade-panel .lw-bagatelle-board:before{content:"";position:absolute;left:7%;right:7%;top:5%;bottom:12%;border:2px solid rgba(255,255,255,.25);border-radius:45% 45% 12px 12px}.lw-arcade-panel .lw-bagatelle-pegs{position:absolute;left:8%;right:8%;top:9%;height:70%;z-index:2}.lw-arcade-panel .lw-bagatelle-pegs i{position:absolute;width:10px;height:10px;border-radius:50%;background:#fff;box-shadow:0 0 8px #00eaff;transform:translate(-50%,-50%)}.lw-arcade-panel .lw-bagatelle-slots{position:absolute;left:4%;right:4%;bottom:2%;height:22%;display:grid;grid-template-columns:repeat(7,1fr);align-items:end;z-index:3}.lw-arcade-panel .lw-bagatelle-slots span{height:82%;display:flex;align-items:center;justify-content:center;border:1px solid rgba(0,234,255,.55);border-bottom:0;border-radius:8px 8px 0 0;font-weight:800;font-size:14px;background:rgba(0,234,255,.08)}.lw-arcade-panel .lw-bagatelle-ball{position:absolute;left:50%;top:3%;width:24px;height:24px;margin:-12px;border-radius:50%;background:#ffd21f;color:#111;text-align:center;line-height:24px;font-weight:900;z-index:5;box-shadow:0 0 14px rgba(255,210,31,.75);cursor:grab;touch-action:none;transition:left .12s}.lw-arcade-panel .lw-bagatelle-ball.aiming{cursor:grabbing;transform:scale(1.15)}.lw-arcade-panel .lw-bagatelle-ball.falling{animation:lwBagFall .85s cubic-bezier(.18,.7,.25,1) forwards}.lw-arcade-panel .lw-bagatelle-launcher{position:absolute;top:0;transform:translateX(-50%);font-size:22px;z-index:4;pointer-events:none;left:50%;transition:left .12s}.lw-arcade-panel .lw-bagatelle-controls{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:360px;margin:0 auto}.lw-arcade-panel .lw-bagatelle-controls button{border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:10px;cursor:pointer}.lw-arcade-panel .lw-bagatelle-controls button:disabled{opacity:.45;cursor:not-allowed}@keyframes lwBagFall{0%{top:3%;left:var(--drop-x,50%);transform:scale(1)}18%{top:18%;left:calc(var(--drop-x,50%) + 5%);transform:scale(.9)}38%{top:35%;left:calc(var(--drop-x,50%) - 7%);transform:scale(.82)}58%{top:53%;left:calc(var(--drop-x,50%) + 6%);transform:scale(.76)}78%{top:72%;left:calc(var(--drop-x,50%) - 4%);transform:scale(.72)}100%{top:88%;left:var(--drop-x,50%);transform:scale(.68)}}.lw-arcade-panel .lw-card-table{max-width:390px;margin:12px auto;padding:18px;border:2px solid #00eaff;border-radius:20px;background:radial-gradient(circle,#182449,#070914);min-height:330px;display:flex;align-items:center;justify-content:center}.lw-arcade-panel .lw-card-deck{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;width:100%;max-width:330px}.lw-arcade-panel .lw-mystery-card{position:relative;height:145px;border:0;border-radius:12px;background:transparent;padding:0;cursor:pointer;perspective:700px;touch-action:manipulation}.lw-arcade-panel .lw-mystery-card span{position:absolute;inset:0;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;backface-visibility:hidden;transition:transform .55s,box-shadow .2s}.lw-arcade-panel .lw-card-back{background:linear-gradient(145deg,#10152d,#24165b);border:2px solid #00eaff;color:#ffd21f;font-size:34px;box-shadow:0 0 10px rgba(0,234,255,.2)}.lw-arcade-panel .lw-card-back small{font-size:10px;letter-spacing:2px;color:#fff;margin-top:8px}.lw-arcade-panel .lw-card-front{background:linear-gradient(145deg,#fff,#d9e9ff);border:2px solid #ffd21f;color:#111;font-size:38px;transform:rotateY(180deg)}.lw-arcade-panel .lw-mystery-card:hover .lw-card-back{box-shadow:0 0 18px rgba(0,234,255,.55);transform:translateY(-3px)}.lw-arcade-panel .lw-mystery-card.flipped .lw-card-back{transform:rotateY(180deg)}.lw-arcade-panel .lw-mystery-card.flipped .lw-card-front{transform:rotateY(0)}.lw-arcade-panel .lw-mystery-card.picked{z-index:5;transform:scale(1.06);transition:transform .3s}.lw-arcade-panel .lw-mystery-card:disabled{cursor:default}.lw-arcade-panel .lw-pickcard-reset{display:block;margin:10px auto;border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:10px 18px;cursor:pointer}.lw-arcade-panel .lw-fruit-machine{max-width:390px;margin:12px auto;padding:18px;border:3px solid #00eaff;border-radius:22px;background:linear-gradient(145deg,#27104b,#090b18);box-shadow:0 0 25px rgba(0,234,255,.15),inset 0 0 30px rgba(255,0,180,.08)}.lw-arcade-panel .lw-fruit-top{text-align:center;font-weight:900;letter-spacing:3px;color:#ffd21f;margin-bottom:12px;text-shadow:0 0 8px rgba(255,210,31,.65)}.lw-arcade-panel .lw-fruit-reels{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;background:#050509;padding:12px;border:2px solid #ffd21f;border-radius:14px}.lw-arcade-panel .lw-fruit-reel{height:105px;display:flex;align-items:center;justify-content:center;background:linear-gradient(#fff,#d8d8d8);border-radius:9px;color:#111;font-size:52px;overflow:hidden;box-shadow:inset 0 0 10px rgba(0,0,0,.35)}.lw-arcade-panel .lw-fruit-reel.spinning{animation:lwFruitSpin .12s linear infinite}.lw-arcade-panel .lw-fruit-reel.winner{animation:lwFruitWin .18s ease-in-out infinite alternate;box-shadow:0 0 20px #ffd21f,inset 0 0 10px rgba(0,0,0,.35)}.lw-arcade-panel .lw-fruit-paytable{margin-top:12px;text-align:center;font-size:12px;line-height:1.6;color:#fff}.lw-arcade-panel .lw-fruit-lights{text-align:center;color:#ffd21f;letter-spacing:7px;margin-top:10px;text-shadow:0 0 8px #ffd21f}.lw-arcade-panel .lw-fruit-controls{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:390px;margin:0 auto}.lw-arcade-panel .lw-fruit-controls button{border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:11px;cursor:pointer}.lw-arcade-panel .lw-fruit-controls button:disabled{opacity:.45;cursor:not-allowed}.lw-arcade-panel .lw-bouncer-game{position:relative;max-width:390px;height:330px;margin:12px auto;border:3px solid #00eaff;border-radius:20px;overflow:hidden;background:linear-gradient(180deg,#182044 0 60%,#161616 60%);box-shadow:inset 0 0 35px rgba(0,234,255,.1)}.lw-arcade-panel .lw-bouncer-sign{position:absolute;top:14px;left:50%;transform:translateX(-50%);padding:8px 18px;text-align:center;font-weight:900;letter-spacing:2px;color:#ffd21f;background:#11152a;border:2px solid #ffd21f;border-radius:8px;z-index:3}.lw-arcade-panel .lw-bouncer-sign small{font-size:9px;color:#fff}.lw-arcade-panel .lw-bouncer-door{position:absolute;right:12%;bottom:0;width:34%;height:66%;background:linear-gradient(90deg,#291b16,#6c4528,#291b16);border:4px solid #0b0b0b;border-bottom:0;border-radius:10px 10px 0 0;display:flex;align-items:center;justify-content:center;font-size:72px;transform-origin:left center;transition:transform .45s}.lw-arcade-panel .lw-bouncer-door.open{transform:perspective(400px) rotateY(-62deg)}.lw-arcade-panel .lw-bouncer-person{position:absolute;left:31%;bottom:5%;font-size:82px;z-index:2;transition:transform .55s,left .55s,opacity .55s}.lw-arcade-panel .lw-bouncer-person.allowed{left:72%;transform:translateY(-8px)}.lw-arcade-panel .lw-bouncer-person.bounced{left:5%;transform:translateX(-35px) rotate(-12deg)}.lw-arcade-panel .lw-bouncer-person.wrong{animation:lwBounceWrong .35s 2}.lw-arcade-panel .lw-bouncer-badge{position:absolute;left:8%;bottom:10px;background:#11152a;border:2px solid #00eaff;border-radius:50%;width:52px;height:52px;display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;z-index:4}.lw-arcade-panel .lw-bouncer-controls{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:390px;margin:0 auto}.lw-arcade-panel .lw-bouncer-controls button{border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:11px;cursor:pointer}.lw-arcade-panel .lw-bouncer-controls .lw-bouncer-reset{grid-column:1/-1}.lw-arcade-panel .lw-bouncer-controls button:disabled{opacity:.45;cursor:not-allowed}@keyframes lwBounceWrong{50%{transform:translateX(8px) rotate(4deg)}}.lw-arcade-panel .lw-temu-shop{max-width:390px;margin:12px auto;padding:16px;border:3px solid #ff5bbd;border-radius:20px;background:linear-gradient(145deg,#32114d,#10152a);box-shadow:inset 0 0 25px rgba(255,91,189,.12)}.lw-arcade-panel .lw-temu-header{text-align:center;font-weight:900;letter-spacing:2px;color:#ffd21f;margin-bottom:14px}.lw-arcade-panel .lw-temu-item{min-height:185px;border-radius:15px;background:linear-gradient(145deg,#fff,#e8e8ff);color:#111;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 5px 16px rgba(0,0,0,.35)}.lw-arcade-panel .lw-temu-icon{font-size:65px}.lw-arcade-panel .lw-temu-name{font-weight:900;font-size:20px;margin-top:5px}.lw-arcade-panel .lw-temu-price{font-size:24px;font-weight:900;color:#d90068;margin-top:6px}.lw-arcade-panel .lw-temu-cart{margin-top:12px;padding:9px;border-radius:10px;background:#11152a;border:1px solid #ff5bbd;text-align:center;font-weight:800}.lw-arcade-panel .lw-temu-controls{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:390px;margin:0 auto}.lw-arcade-panel .lw-temu-controls button{border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:11px;cursor:pointer}.lw-arcade-panel .lw-temu-controls .lw-temu-reset{grid-column:1/-1}.lw-arcade-panel .lw-temu-controls button:disabled{opacity:.45;cursor:not-allowed}.lw-arcade-panel .lw-dadbod-machine{max-width:390px;margin:12px auto;padding:18px;border:3px solid #00eaff;border-radius:20px;background:linear-gradient(145deg,#10152a,#25112d);box-shadow:inset 0 0 25px rgba(0,234,255,.1)}.lw-arcade-panel .lw-dadbod-title{text-align:center;font-weight:900;letter-spacing:2px;color:#ffd21f;margin-bottom:20px}.lw-arcade-panel .lw-dadbod-meter{position:relative;height:90px;border-radius:14px;background:linear-gradient(90deg,#272727 0 35%,#7d4a18 35% 43%,#ffd21f 43% 57%,#7d4a18 57% 65%,#272727 65%);border:2px solid #fff;overflow:hidden}.lw-arcade-panel .lw-dadbod-zone{position:absolute;left:43%;right:43%;top:5px;bottom:5px;font-size:8px;line-height:80px;text-align:center;color:#111;font-weight:900;writing-mode:vertical-rl;transform:rotate(180deg);z-index:1}.lw-arcade-panel .lw-dadbod-needle{position:absolute;top:0;bottom:0;left:0;width:5px;background:#ff3b30;box-shadow:0 0 12px #ff3b30;z-index:3;transition:left .03s}.lw-arcade-panel .lw-dadbod-readout{text-align:center;margin-top:15px;padding:10px;border-radius:10px;background:#080b18;border:1px solid #00eaff;font-weight:900;min-height:20px}.lw-arcade-panel .lw-dadbod-controls{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:390px;margin:0 auto}.lw-arcade-panel .lw-dadbod-controls button{border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:11px;cursor:pointer}.lw-arcade-panel .lw-dadbod-controls button:disabled{opacity:.45;cursor:not-allowed}.lw-arcade-panel .lw-request-deck{max-width:390px;margin:12px auto;padding:18px;border:3px solid #00eaff;border-radius:20px;background:radial-gradient(circle,#182449,#080b18);min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center}.lw-arcade-panel .lw-request-ticket{width:86%;min-height:190px;border:2px dashed #ffd21f;border-radius:14px;background:linear-gradient(135deg,#fff,#e8f4ff);color:#111;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;box-shadow:0 8px 18px rgba(0,0,0,.3);transform:rotate(-1deg)}.lw-arcade-panel .lw-request-ticket:before,.lw-arcade-panel .lw-request-ticket:after{content:"";position:absolute;top:50%;width:18px;height:18px;background:#10152a;border-radius:50%;transform:translateY(-50%)}.lw-arcade-panel .lw-request-ticket:before{left:-10px}.lw-arcade-panel .lw-request-ticket:after{right:-10px}.lw-arcade-panel .lw-request-icon{font-size:48px}.lw-arcade-panel .lw-request-text{font-weight:900;text-align:center;font-size:18px;line-height:1.25;padding:12px}.lw-arcade-panel .lw-request-lights{color:#ffd21f;letter-spacing:7px;margin-top:15px;text-shadow:0 0 8px #ffd21f}.lw-arcade-panel .lw-request-ticket.flash{animation:lwRequestFlash .45s ease-out}.lw-arcade-panel .lw-request-controls{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:390px;margin:0 auto}.lw-arcade-panel .lw-request-controls button{border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:11px;cursor:pointer}.lw-arcade-panel .lw-request-controls .lw-request-reset{grid-column:1/-1}.lw-arcade-panel .lw-phoenix-stage{position:relative;max-width:390px;height:340px;margin:12px auto;padding:18px;box-sizing:border-box;border:3px solid #00eaff;border-radius:20px;overflow:hidden;background:radial-gradient(circle at 50% 70%,#26315e,#080b18 70%);box-shadow:inset 0 0 35px rgba(0,234,255,.1)}.lw-arcade-panel .lw-phoenix-neon{position:absolute;top:15px;left:50%;transform:translateX(-50%);text-align:center;font-weight:900;letter-spacing:3px;color:#ffd21f;text-shadow:0 0 10px rgba(255,210,31,.8)}.lw-arcade-panel .lw-phoenix-neon small{font-size:9px;color:#fff;letter-spacing:2px}.lw-arcade-panel .lw-phoenix-character{position:absolute;left:9%;bottom:12%;font-size:78px;transition:transform .4s}.lw-arcade-panel .lw-phoenix-speech{position:absolute;left:34%;right:7%;top:34%;padding:16px;border-radius:16px;background:#fff;color:#111;font-weight:800;line-height:1.25;box-shadow:0 8px 16px rgba(0,0,0,.35)}.lw-arcade-panel .lw-phoenix-speech:before{content:"";position:absolute;left:-18px;bottom:24px;border-width:10px 18px 10px 0;border-style:solid;border-color:transparent #fff transparent transparent}.lw-arcade-panel .lw-phoenix-machine{position:absolute;right:7%;bottom:5%;font-size:35px;opacity:.7}.lw-arcade-panel .lw-phoenix-controls{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:390px;margin:0 auto}.lw-arcade-panel .lw-phoenix-controls button{border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:11px;cursor:pointer}.lw-arcade-panel .lw-phoenix-controls .lw-phoenix-reset{grid-column:1/-1}.lw-arcade-panel .lw-phoenix-controls button:disabled{opacity:.45;cursor:not-allowed}.lw-arcade-panel .lw-bartab-board{position:relative;max-width:390px;height:330px;margin:12px auto;padding:18px;box-sizing:border-box;border:3px solid #00eaff;border-radius:20px;overflow:hidden;background:linear-gradient(145deg,#20132e,#080b18);box-shadow:inset 0 0 35px rgba(0,234,255,.1)}.lw-arcade-panel .lw-bartab-sign{text-align:center;font-weight:900;letter-spacing:3px;color:#ffd21f;text-shadow:0 0 10px rgba(255,210,31,.7)}.lw-arcade-panel .lw-bartab-receipt{position:absolute;left:16%;right:16%;top:23%;padding:18px;background:linear-gradient(#fff,#eee);color:#111;border-radius:3px;min-height:160px;box-shadow:0 8px 18px rgba(0,0,0,.4);transform:rotate(-1deg);display:flex;flex-direction:column;gap:8px}.lw-arcade-panel .lw-bartab-receipt hr{width:100%;border:0;border-top:1px dashed #777}.lw-arcade-panel .lw-bartab-items{font-size:13px;line-height:1.5}.lw-arcade-panel .lw-bartab-total{margin-top:auto;text-align:right;font-size:24px}.lw-arcade-panel .lw-bartab-mystery{position:absolute;right:7%;bottom:7%;font-size:42px;opacity:.7}.lw-arcade-panel .lw-bartab-controls{max-width:390px;margin:0 auto;display:grid;gap:8px}.lw-arcade-panel .lw-bartab-controls label{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;padding:10px;border:1px solid #00eaff;border-radius:14px;background:#11152a}.lw-arcade-panel .lw-bartab-controls input{width:100%;accent-color:#ffd21f}.lw-arcade-panel .lw-bartab-controls output{font-weight:900;color:#ffd21f}.lw-arcade-panel .lw-bartab-controls button{border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:11px;cursor:pointer}.lw-arcade-panel .lw-bartab-controls button:disabled{opacity:.45;cursor:not-allowed}.lw-arcade-panel .lw-customer-scene{position:relative;max-width:390px;min-height:360px;margin:12px auto;padding:18px;box-sizing:border-box;border:3px solid #00eaff;border-radius:20px;overflow:hidden;background:radial-gradient(circle at 50% 75%,#26315e,#080b18 72%);box-shadow:inset 0 0 35px rgba(0,234,255,.1)}.lw-arcade-panel .lw-customer-neon{position:absolute;top:15px;left:50%;transform:translateX(-50%);text-align:center;font-weight:900;letter-spacing:3px;color:#ffd21f;text-shadow:0 0 10px rgba(255,210,31,.7)}.lw-arcade-panel .lw-customer-neon small{font-size:9px;color:#fff;letter-spacing:2px}.lw-arcade-panel .lw-customer-avatar{position:absolute;left:50%;top:27%;transform:translateX(-50%);font-size:88px;filter:drop-shadow(0 8px 8px rgba(0,0,0,.45))}.lw-arcade-panel .lw-customer-name{position:absolute;top:57%;left:8%;right:8%;text-align:center;font-weight:900;color:#ffd21f;letter-spacing:2px}.lw-arcade-panel .lw-customer-clues{position:absolute;left:8%;right:8%;bottom:8%;display:grid;gap:5px}.lw-arcade-panel .lw-customer-clues span{padding:7px 9px;border-radius:10px;background:#11152a;border:1px solid rgba(0,234,255,.5);font-size:12px}.lw-arcade-panel .lw-customer-answers{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:390px;margin:0 auto}.lw-arcade-panel .lw-customer-answers button{border:1px solid #00eaff;border-radius:16px;background:#11152a;color:#fff;padding:11px;cursor:pointer}.lw-arcade-panel .lw-customer-answers button.correct{border-color:#2cff88;box-shadow:0 0 14px rgba(44,255,136,.45)}.lw-arcade-panel .lw-customer-answers button.wrong{border-color:#ff3b30;box-shadow:0 0 14px rgba(255,59,48,.45)}.lw-arcade-panel .lw-customer-answers button:disabled{opacity:.55;cursor:not-allowed}.lw-arcade-panel .lw-customer-reset{display:block;margin:9px auto;border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:11px 18px;cursor:pointer}.lw-arcade-panel .lw-lastorders-scene{position:relative;max-width:390px;height:330px;margin:12px auto;border:3px solid #00eaff;border-radius:20px;overflow:hidden;background:linear-gradient(#090d1b 0 62%,#2a1720 62%);box-shadow:inset 0 0 40px rgba(0,234,255,.12)}.lw-arcade-panel .lw-lastorders-sign{position:absolute;top:18px;left:50%;transform:translateX(-50%);text-align:center;padding:8px 16px;border:2px solid #ffd21f;border-radius:8px;color:#ffd21f;font-weight:1000;letter-spacing:3px;text-shadow:0 0 10px rgba(255,210,31,.7);box-shadow:0 0 18px rgba(255,210,31,.2)}.lw-arcade-panel .lw-lastorders-bell{position:absolute;top:100px;left:18%;font-size:44px;animation:lwBell .8s ease-in-out infinite alternate}.lw-arcade-panel .lw-lastorders-customer{position:absolute;left:50%;top:42%;transform:translateX(-50%);font-size:90px;filter:drop-shadow(0 10px 8px rgba(0,0,0,.45));animation:lwCustomerBounce 1.2s ease-in-out infinite}.lw-arcade-panel .lw-lastorders-counter{position:absolute;left:6%;right:6%;bottom:7%;padding:16px;text-align:center;border-radius:12px;background:#11152a;border:2px solid rgba(0,234,255,.5);font-weight:900;letter-spacing:2px}.lw-arcade-panel .lw-lastorders-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:390px;margin:auto}.lw-arcade-panel .lw-lastorders-actions button{border:1px solid #00eaff;border-radius:16px;background:#11152a;color:#fff;padding:13px 8px;font-weight:800;cursor:pointer}.lw-arcade-panel .lw-lastorders-actions button.correct{border-color:#2cff88;box-shadow:0 0 16px rgba(44,255,136,.45)}.lw-arcade-panel .lw-lastorders-actions button.wrong{border-color:#ff3b30;box-shadow:0 0 16px rgba(255,59,48,.45)}.lw-arcade-panel .lw-lastorders-actions button:disabled{opacity:.55;cursor:not-allowed}.lw-arcade-panel .lw-lastorders-timer{text-align:center;font-weight:900;margin:8px}.lw-arcade-panel .lw-lastorders-reset{display:block;margin:9px auto;border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:11px 18px;cursor:pointer}.lw-arcade-panel .lw-toomany-scene{position:relative;max-width:390px;height:330px;margin:12px auto;border:3px solid #00eaff;border-radius:20px;overflow:hidden;background:radial-gradient(circle at 50% 60%,#29233c,#090d1b 70%);box-shadow:inset 0 0 40px rgba(0,234,255,.12)}.lw-arcade-panel .lw-toomany-neon{position:absolute;top:14px;left:50%;transform:translateX(-50%);text-align:center;color:#ffd21f;font-weight:1000;letter-spacing:3px;text-shadow:0 0 10px rgba(255,210,31,.7)}.lw-arcade-panel .lw-toomany-neon small{font-size:9px;color:#fff;letter-spacing:2px}.lw-arcade-panel .lw-toomany-avatar{position:absolute;top:23%;left:50%;transform:translateX(-50%);font-size:95px;animation:lwTooManyWobble 1.3s ease-in-out infinite}.lw-arcade-panel .lw-toomany-meter{position:absolute;left:9%;right:9%;bottom:25%;height:22px;border:2px solid #00eaff;border-radius:15px;background:#11152a;display:flex;align-items:center;justify-content:space-between;padding:0 7px;font-size:8px;font-weight:900}.lw-arcade-panel .lw-toomany-meter i{position:absolute;left:10%;width:10px;height:30px;background:#ffd21f;border-radius:5px;transition:left .4s ease;box-shadow:0 0 12px rgba(255,210,31,.8)}.lw-arcade-panel .lw-toomany-clue{position:absolute;left:8%;right:8%;bottom:8%;padding:10px;text-align:center;border-radius:12px;background:#11152a;border:1px solid rgba(0,234,255,.5);font-weight:800}.lw-arcade-panel .lw-toomany-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:390px;margin:auto}.lw-arcade-panel .lw-toomany-actions button{border:1px solid #00eaff;border-radius:16px;background:#11152a;color:#fff;padding:13px 8px;font-weight:800;cursor:pointer}.lw-arcade-panel .lw-toomany-actions button.correct{border-color:#2cff88;box-shadow:0 0 16px rgba(44,255,136,.45)}.lw-arcade-panel .lw-toomany-actions button.wrong{border-color:#ff3b30;box-shadow:0 0 16px rgba(255,59,48,.45)}.lw-arcade-panel .lw-toomany-actions button:disabled{opacity:.55;cursor:not-allowed}.lw-arcade-panel .lw-toomany-reset{display:block;margin:9px auto;border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:11px 18px;cursor:pointer}.lw-arcade-panel .lw-jukebox{position:relative;max-width:390px;height:350px;margin:12px auto;padding:18px;box-sizing:border-box;border:3px solid #00eaff;border-radius:24px;background:linear-gradient(#171c35,#080b18);box-shadow:inset 0 0 35px rgba(0,234,255,.12),0 0 20px rgba(0,234,255,.12);text-align:center;overflow:hidden}.lw-arcade-panel .lw-jukebox-top{font-weight:1000;letter-spacing:3px;color:#ffd21f;text-shadow:0 0 10px rgba(255,210,31,.7)}.lw-arcade-panel .lw-jukebox-screen{margin:20px auto 10px;max-width:270px;padding:18px;border:3px solid #00eaff;border-radius:12px;background:#050914;color:#2cff88;font-family:monospace;font-weight:900;box-shadow:inset 0 0 18px rgba(44,255,136,.12)}.lw-arcade-panel .lw-jukebox-screen small{color:#fff;font-family:inherit}.lw-arcade-panel .lw-jukebox-disc{font-size:60px;animation:lwJukeboxSpin 2s linear infinite}.lw-arcade-panel .lw-jukebox-slots{display:flex;justify-content:center;gap:12px;margin:8px}.lw-arcade-panel .lw-jukebox-slots span{display:grid;place-items:center;width:52px;height:42px;border:2px solid #00eaff;border-radius:10px;background:#11152a;font-size:22px}.lw-arcade-panel .lw-jukebox-lights{letter-spacing:8px;color:#ffd21f;animation:lwJukeboxFlash .7s infinite alternate}.lw-arcade-panel .lw-jukebox-options{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:390px;margin:auto}.lw-arcade-panel .lw-jukebox-options button{border:1px solid #00eaff;border-radius:16px;background:#11152a;color:#fff;padding:14px 8px;font-weight:900;cursor:pointer}.lw-arcade-panel .lw-jukebox-options button.correct{border-color:#2cff88;box-shadow:0 0 16px rgba(44,255,136,.45)}.lw-arcade-panel .lw-jukebox-options button.wrong{border-color:#ff3b30;box-shadow:0 0 16px rgba(255,59,48,.45)}.lw-arcade-panel .lw-jukebox-options button:disabled{opacity:.55;cursor:not-allowed}.lw-arcade-panel .lw-jukebox-reset{display:block;margin:9px auto;border:1px solid #00eaff;border-radius:20px;background:#11152a;color:#fff;padding:11px 18px;cursor:pointer}@keyframes lwJukeboxSpin{to{transform:rotate(360deg)}}@keyframes lwJukeboxFlash{to{opacity:.35}}@keyframes lwTooManyWobble{50%{transform:translateX(-50%) rotate(3deg)}}@keyframes lwBell{to{transform:rotate(14deg)}}@keyframes lwCustomerBounce{50%{transform:translateX(-50%) translateY(-8px)}}@keyframes lwPhoenixShake{25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}.lw-arcade-panel .lw-phoenix-stage:has(.lw-phoenix-speech){animation:none}@keyframes lwFruitSpin{0%{transform:translateY(-12px);filter:blur(1px)}50%{transform:translateY(12px);filter:blur(2px)}100%{transform:translateY(-12px);filter:blur(1px)}}@keyframes lwFruitWin{from{transform:scale(1)}to{transform:scale(1.08)}}
@media(max-width:900px){.lw-arcade-panel .lwmore{grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}}
@media(max-width:600px){.lw-arcade-panel{padding:0}.lw-arcade-panel .lwmore{grid-template-columns:minmax(0,1fr);gap:16px}.lw-arcade-panel .lwgame{padding:16px}.lw-arcade-panel .lwgame h2{font-size:23px}.lw-arcade-panel .lwgame p{font-size:15px;line-height:1.45}.lw-arcade-panel .lwb{gap:4px}.lw-arcade-panel .lwb button{font-size:clamp(7px,2.4vw,9px);padding:3px 1px}.lw-arcade-panel .lwc button,.lw-arcade-panel .lwgo{font-size:15px;padding:11px 12px}}
`;
style.textContent+=`
.lw-arcade-panel .lw-visual-controls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}.lw-visual-controls button{min-height:44px}.lw-visual-meter{height:12px;border-radius:999px;background:#151a2d;overflow:hidden;margin:10px 0;border:1px solid rgba(0,234,255,.35)}.lw-visual-meter span{display:block;height:100%;width:50%;background:linear-gradient(90deg,#ff2bd6,#ffd21f,#00eaff);transition:width .08s linear}.lw-visual-suspects{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:10px}.lw-visual-suspects button{font-size:28px;padding:10px 4px}.lw-visual-stage.lw-result-win{border-color:#ffd21f;box-shadow:0 0 25px rgba(255,212,59,.45),inset 0 0 28px rgba(0,234,255,.12)}.lw-visual-stage.lw-result-lose{border-color:#ff2bd6;box-shadow:0 0 22px rgba(255,43,214,.35),inset 0 0 28px rgba(0,234,255,.12)}@media(max-width:600px){.lw-visual-controls{grid-template-columns:1fr}.lw-visual-suspects button{min-height:52px}}
.lw-visual-stage,.lw-arcade-panel .lw-quiz-machine,.lw-arcade-panel .lw-card-game,.lw-arcade-panel .lw-dice-game,.lw-arcade-panel .lw-lucky-game,.lw-arcade-panel .lw-jackpot-game,.lw-arcade-panel .lw-bull-game{max-width:390px;margin:12px auto;padding:16px;border:3px solid #00eaff;border-radius:20px;background:radial-gradient(circle at 50% 35%,#202a50,#080b18 72%);box-shadow:inset 0 0 28px rgba(0,234,255,.12),0 0 16px rgba(0,234,255,.1);box-sizing:border-box;overflow:hidden}
.lw-visual-neon,.lw-quiz-lights,.lw-card-neon,.lw-dice-neon,.lw-jackpot-neon,.lw-bull-neon{text-align:center;font-weight:1000;letter-spacing:2px;color:#ffd21f;text-shadow:0 0 10px rgba(255,210,31,.7)}
.lw-visual-screen,.lw-quiz-screen,.lw-dice-screen,.lw-lucky-screen,.lw-jackpot-screen,.lw-bull-screen{margin:12px auto;padding:14px;border:2px solid #00eaff;border-radius:12px;background:#050914;color:#fff;text-align:center;box-shadow:inset 0 0 18px rgba(0,234,255,.08)}
.lw-visual-icon,.lw-lucky-wheel{font-size:58px;text-align:center;margin:8px}.lw-visual-label{font-weight:900;color:#58eaff;text-align:center}.lw-visual-output{margin-top:10px;min-height:42px;font-weight:900}.lw-visual-lights{display:flex;justify-content:center;gap:9px}.lw-visual-lights i{width:8px;height:8px;border-radius:50%;background:#ffd21f;box-shadow:0 0 9px #ffd21f;animation:lwArcadeBlink .7s infinite alternate}
.lw-quiz-question{font-size:17px;font-weight:900;line-height:1.35}.lw-quiz-meter{height:8px;margin-top:12px;background:#151a2d;border-radius:9px;overflow:hidden}.lw-quiz-meter span{display:block;height:100%;width:12%;background:#00eaff;transition:width .35s}.lw-quiz-answer{margin-top:10px;color:#ffd21f;font-weight:900}.lw-quiz-screen.correct{box-shadow:0 0 22px rgba(44,255,136,.5)}.lw-quiz-screen.wrong{box-shadow:0 0 22px rgba(255,59,48,.45)}
.lw-card-game,.lw-dice-game,.lw-lucky-game,.lw-jackpot-game,.lw-bull-game{min-height:210px}.lw-big-playing-card{width:130px;height:155px;margin:14px auto;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:14px;background:#fff;color:#111;font-size:28px;box-shadow:0 8px 20px rgba(0,0,0,.4);transform:rotate(-2deg)}.lw-big-playing-card strong{font-size:62px}.lw-card-table-line{text-align:center;color:#58eaff;font-weight:900}.lw-dice-pair{display:flex;justify-content:center;gap:18px;font-size:58px;margin:16px}.lw-dice-screen,.lw-lucky-screen,.lw-jackpot-screen,.lw-bull-screen{font-weight:900;min-height:24px}.lw-lucky-wheel{width:100px;height:100px;margin:16px auto;border-radius:50%;display:grid;place-items:center;border:4px solid #ffd21f;background:radial-gradient(circle,#27315c,#10152a);box-shadow:0 0 20px rgba(255,212,59,.35);animation:lwLuckySpin 3s linear infinite}.lw-jackpot-pot{font-size:42px;text-align:center;color:#ffd21f;font-weight:1000;text-shadow:0 0 12px #ffd21f;margin:16px}.lw-bull-target{width:150px;height:150px;margin:15px auto;border-radius:50%;display:grid;place-items:center;background:repeating-radial-gradient(circle,#fff 0 16px,#d33 16px 32px,#fff 32px 48px,#111 48px 64px);box-shadow:0 0 18px rgba(255,212,59,.25)}.lw-bull-target span{font-size:35px}
@keyframes lwArcadeBlink{to{opacity:.35}}@keyframes lwLuckySpin{to{transform:rotate(360deg)}}
`;
style.textContent+=' .lw-killer-game,.lw-coinpusher-game{max-width:390px;margin:12px auto;padding:16px;border:3px solid #00eaff;border-radius:20px;background:radial-gradient(circle at 50% 35%,#202a50,#080b18 72%);box-shadow:inset 0 0 28px rgba(0,234,255,.12);box-sizing:border-box}.lw-killer-neon,.lw-coinpusher-neon{text-align:center;font-weight:1000;letter-spacing:2px;color:#ffd21f;text-shadow:0 0 10px #ffd21f}.lw-killer-board{height:210px;margin:14px auto;border-radius:50%;display:flex;align-items:center;justify-content:center;background:repeating-radial-gradient(circle,#171b2d 0 18px,#00eaff 18px 21px,#171b2d 21px 39px,#ff2bd6 39px 42px,#171b2d 42px 62px);box-shadow:0 0 25px rgba(0,234,255,.3)}.lw-killer-ring{font-size:55px}.lw-killer-target-display,.lw-coin-screen{padding:10px 14px;border:2px solid #00eaff;border-radius:10px;background:#050914;color:#58eaff;font-weight:900;text-align:center}.lw-coinpusher-machine{position:relative;height:210px;margin:14px auto;border:2px solid #ffd21f;border-radius:15px;background:linear-gradient(#17213d,#090b18);overflow:hidden}.lw-coin-shelf{position:absolute;left:8%;right:8%;bottom:24%;height:5px;background:#ffd21f;box-shadow:0 0 10px #ffd21f}.lw-coin-pile{position:absolute;left:50%;bottom:29%;transform:translateX(-50%);font-size:26px;font-weight:900;color:#ffd21f}.lw-pusher{position:absolute;left:0;right:0;bottom:8%;text-align:center;color:#58eaff;font-weight:900;animation:lwPusherMove 1.5s ease-in-out infinite}.lw-coin-screen{margin-top:12px}@keyframes lwPusherMove{50%{transform:translateX(8px)}}';
document.head.appendChild(style);

const hero=document.querySelector('.extras-hero');
if(!hero)return;
const toggle=document.createElement('button');
toggle.type='button';toggle.className='lw-arcade-toggle';toggle.textContent='🎮⚡ OPEN THE NEW LIVE WIRE ARCADE';
toggle.setAttribute('aria-expanded','false');
hero.insertAdjacentElement('afterend',toggle);

const panel=document.createElement('section');
panel.className='extras-section lw-arcade-panel';panel.style.display='none';
panel.innerHTML='<div class="wrap"><h1>🎮⚡ New Live Wire Arcade</h1><p>50 games with proper visual gameplay, fresh content and no constant repeat rotation. 🎮⚡</p><div class="lwmore"></div></div>';
toggle.insertAdjacentElement('afterend',panel);

document.addEventListener('click',event=>{
  const button=event.target.closest('[data-open-arcade]');
  if(!button)return;
  event.preventDefault();
  toggle.click();
});

let built=false;
const qs=id=>panel.querySelector('#'+id);
const clear=x=>{while(x.firstChild)x.removeChild(x.firstChild)};

function card(i,title,desc){
  const d=document.createElement('div');d.className='lwgame';
  d.innerHTML='<div class="mini-label">FRESH POOL ⚡</div><h2>'+title+'</h2><p>'+desc+'</p><div id="lo'+i+'" class="lwout">READY?</div><div id="lc'+i+'" class="lwc"></div><button type="button" class="lwgo" id="lg'+i+'">⚡ PLAY</button>';
  return d;
}
function showSimple(i,text){
  const o=qs('lo'+i),c=qs('lc'+i);if(!o||!c)return;
  clear(c);
  const data={
    2:['🔀','DECADE SHUFFLE','Choose the decade the machine is hiding.'],
    4:['🥁','DRUMROLL REVEAL','Stop the moving meter as close to the centre as you can.'],
    5:['🎸','ROCK OR POP?','Pick a side before the genre scanner reveals the answer.'],
    8:['🚨','WHO WOULD DO IT?','Pick the Live Wire suspect you think did it.'],
    12:['📢','DJ ANNOUNCEMENT','Choose the mood and fire the studio mic.'],
    13:['🕺','DANCEFLOOR DECISION','Choose the move that should fill the floor.'],
    14:['🎫','TICKET CHECKER','Pick the gate and see if your ticket gets through.'],
    15:['🚉','STATION MASTER','Choose the platform before the train arrives.'],
    16:['🎵','TRAIN PLAYLIST BUILDER','Build a three-stop playlist for the Music Train.'],
    17:['🚦','SIGNAL BOX CHALLENGE','Set the signal before the train reaches the junction.'],
    18:['🍹','LIVE WIRE COCKTAIL','Build your cocktail from three bar ingredients.'],
    19:['🪩','BAR JUKEBOX','Pick the tune the Live Wire crowd wants next.'],
    20:['🎵','PLAY NEXT','Vote for the next track and reveal the crowd choice.'],
    21:['🪑','VIP TABLE','Choose your table and see what VIP bonus is waiting.']
  }[i]||['⚡','LIVE WIRE ARCADE','Interactive game ready.'];
  o.innerHTML='<div class="lw-visual-stage"><div class="lw-visual-neon">'+data[0]+' '+data[1]+'</div><div class="lw-visual-screen"><div class="lw-visual-icon">'+data[0]+'</div><div class="lw-visual-label">'+data[2]+'</div><div class="lw-visual-output">READY?</div><div class="lw-visual-meter" style="display:none"><span></span></div></div><div class="lw-visual-controls"></div><div class="lw-visual-lights"><i></i><i></i><i></i><i></i><i></i></div></div>';
  const stage=o.querySelector('.lw-visual-stage'),screen=o.querySelector('.lw-visual-screen'),out=o.querySelector('.lw-visual-output'),controls=o.querySelector('.lw-visual-controls'),meter=o.querySelector('.lw-visual-meter'),bar=meter.querySelector('span');
  const add=(label,fn)=>{const b=document.createElement('button');b.type='button';b.className='lwgo';b.textContent=label;b.addEventListener('click',fn);controls.appendChild(b);return b};
  const finish=(win,msg)=>{out.textContent=msg;stage.classList.remove('lw-result-win','lw-result-lose');stage.classList.add(win?'lw-result-win':'lw-result-lose');controls.querySelectorAll('button').forEach(b=>b.disabled=true);};
  const rnd=n=>Math.floor(Math.random()*n);

  if(i===2){
    const choices=['70s','80s','90s','00s','10s'];const target=choices[rnd(choices.length)];
    choices.forEach(x=>add('🎵 '+x,()=>finish(x===target,x===target?'🔥 BULLSEYE! '+target+' was hiding in the machine.':'😂 WRONG DECADE — it was '+target+'.')));
  }else if(i===4){
    meter.style.display='block';let pos=0,dir=1;const timer=setInterval(()=>{pos+=dir*3;if(pos>=100){pos=100;dir=-1}if(pos<=0){pos=0;dir=1}bar.style.width=pos+'%'},35);
    add('🥁 STOP THE DRUMROLL',()=>{clearInterval(timer);const distance=Math.abs(pos-50);finish(distance<=10,'🏆 PERFECT DRUMROLL! '+Math.round(100-distance*2)+'/100');if(distance>10)out.textContent='😂 '+Math.round(100-distance*2)+'/100 — '+(distance<25?'SO CLOSE!':'THE DRUMMER PANICKED!');});
  }else if(i===5){
    const target=Math.random()<.5?'ROCK':'POP';['🎸 ROCK','🎤 POP'].forEach(x=>add(x,()=>finish(x.includes(target),'🎶 THE SCANNER SAYS '+target+'! '+(x.includes(target)?'You nailed it!':'Wrong side of the stage!'))));
  }else if(i===8){
    const suspects=[['😎','Dan'],['🚂','Phoenix'],['🍺','The Bar Stool']];const target=rnd(3);
    const wrap=document.createElement('div');wrap.className='lw-visual-suspects';controls.appendChild(wrap);suspects.forEach((x,n)=>{const b=document.createElement('button');b.type='button';b.textContent=x[0]+' '+x[1];b.addEventListener('click',()=>finish(n===target,n===target?'🚨 CASE SOLVED! '+x[1]+' did it!':'😂 WRONG SUSPECT! It was '+suspects[target][1]+'.'));wrap.appendChild(b)});
  }else if(i===12){
    ['🔥 HYPE','😂 CHEEKY','🎉 PARTY'].forEach(x=>add(x,()=>{const lines={ '🔥 HYPE':'LIVE WIRE FAMILY, MAKE SOME NOISE!','😂 CHEEKY':'Right then, behave yourselves... or absolutely don’t.','🎉 PARTY':'THE LIVE WIRE PARTY HAS OFFICIALLY STARTED!' };finish(true,'🎙️ '+lines[x])}));
  }else if(i===13){
    ['🕺 MOONWALK','💃 DISCO','🪩 CHAOS','🕴️ DAD DANCE'].forEach(x=>add(x,()=>finish(true,x+' selected — '+['🔥 FLOOR PACKED!','😂 Someone has lost a shoe!','⚡ DJ TURN IT UP!'][rnd(3)])));
  }else if(i===14){
    const gate=rnd(3)+1;['🚪 GATE 1','🚪 GATE 2','🚪 GATE 3'].forEach((x,n)=>add(x,()=>finish(n+1===gate,n+1===gate?'🎟️ TICKET ACCEPTED — COME ON IN!':'🚫 DENIED — Try another gate!')));
  }else if(i===15){
    const platform=rnd(3)+1;['🚉 PLATFORM 1','🚉 PLATFORM 2','🚉 PLATFORM 3'].forEach((x,n)=>add(x,()=>finish(n+1===platform,n+1===platform?'🚂 TRAIN ARRIVING! ALL ABOARD!':'😂 WRONG PLATFORM — THE TRAIN LEFT WITHOUT YOU!')));
  }else if(i===16){
    const stops=[];['🎸 ROCK','🪩 DISCO','🎤 POP','🎧 90s','⚡ BANGERS'].forEach(x=>add(x,()=>{if(stops.length>=3)return;stops.push(x);out.textContent='🚂 '+stops.join(' → ');if(stops.length===3){finish(true,'🚂 PLAYLIST BUILT! '+stops.join(' → '));}}));
  }else if(i===17){
    const safe=Math.random()<.5?'GREEN':'RED';['🟢 GREEN','🔴 RED'].forEach(x=>add(x,()=>finish(x.includes(safe),x.includes(safe)?'🚂 SAFE SIGNAL! Train through.':'💥 WRONG SIGNAL! Emergency stop!')));
  }else if(i===18){
    const ingredients=[];['🍓 STRAWBERRY','🍋 LEMON','🍍 PINEAPPLE','🍊 ORANGE','🧊 ICE'].forEach(x=>add(x,()=>{if(ingredients.length>=3)return;ingredients.push(x);out.textContent=ingredients.join(' + ');if(ingredients.length===3)finish(true,'🍹 COCKTAIL SERVED! '+ingredients.join(' + '));}));
  }else if(i===19||i===20){
    const tracks=['🎵 80s BANGER','🎵 90s FLOOR FILLER','🎵 00s THROWBACK','🎵 FORGOTTEN GEM'];const target=tracks[rnd(tracks.length)];
    tracks.forEach(x=>add(x,()=>finish(x===target,x===target?'🔥 CROWD CHOICE! '+x+' wins!':'😂 Not this one — the crowd picked '+target+'.')));
  }else if(i===21){
    const perks=['🍹 Free cocktail','🎧 DJ dedication','🍿 Snack mountain','⚡ VIP neon table'];['🪑 TABLE 1','🪑 TABLE 2','🪑 TABLE 3'].forEach((x,n)=>add(x,()=>finish(true,x+' booked — '+perks[rnd(perks.length)]+' unlocked!')));
  }
}
function mc(i,data){
  const o=qs('lo'+i),c=qs('lc'+i);if(!o||!c)return;
  const x=P('quiz-'+i,data);clear(c);
  o.innerHTML='<div class="lw-quiz-machine"><div class="lw-quiz-lights">● ● ● ● ●</div><div class="lw-quiz-screen"><div class="lw-quiz-question">'+x[0]+'</div><div class="lw-quiz-meter"><span></span></div></div></div>';
  shuffle(x[1]).forEach(v=>{
    const b=document.createElement('button');b.type='button';b.textContent=v;
    b.addEventListener('click',()=>{
      const screen=o.querySelector('.lw-quiz-screen');screen.classList.add(v===x[2]?'correct':'wrong');o.querySelector('.lw-quiz-meter span').style.width=v===x[2]?'100%':'35%';
      const answer=document.createElement('div');answer.className='lw-quiz-answer';answer.textContent=v===x[2]?'⚡ CORRECT! 🔥':'😂 NOT QUITE — '+x[2];screen.appendChild(answer);
      Array.from(c.children).forEach(q=>q.disabled=true);setTimeout(()=>mc(i,data),850);
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
    const card=rand(13),suits=['♥️','♦️','♣️','♠️'],s=suits[rand(4)-1];
    o.innerHTML='<div class="lw-card-game"><div class="lw-card-neon">'+(type==='higher'?'⬆️ HIGHER OR LOWER':'♠️ RED OR BLACK')+'</div><div class="lw-big-playing-card">'+s+'<strong>'+card+'</strong></div><div class="lw-card-table-line">MAKE YOUR CALL</div></div>';
    const judge=type==='higher'?(v=>result(rand(13)>=card?'🔥 CORRECT CALL!':'😂 WRONG — THE PUB TAKES THE POINT!')):(v=>result(rand(2)===1?'🔥 RED!':'🖤 BLACK!'));
    if(type==='higher'){btn('⬆️ Higher',judge);btn('⬇️ Lower',judge);}else{btn('❤️♦️ Red',judge);btn('♣️♠️ Black',judge);}
  } else if(type==='dice'){
    o.innerHTML='<div class="lw-dice-game"><div class="lw-dice-neon">🎲 HI-LO DICE</div><div class="lw-dice-pair"><span>⚀</span><span>⚄</span></div><div class="lw-dice-screen">PREDICT THE TOTAL</div></div>';
    [2,4,6,8,10,12].forEach(n=>btn('TOTAL '+n,()=>{const a=rand(6),b=rand(6);o.querySelector('.lw-dice-pair').innerHTML='<span>'+['⚀','⚁','⚂','⚃','⚄','⚅'][a-1]+'</span><span>'+['⚀','⚁','⚂','⚃','⚄','⚅'][b-1]+'</span>';result(a+b===n?'🎉 BULLSEYE TOTAL!':'😂 THE DICE HAD OTHER PLANS!');}));
  } else if(type==='luckynum'){
    o.innerHTML='<div class="lw-lucky-game"><div class="lw-lucky-wheel">🍀</div><div class="lw-lucky-screen">PICK A NUMBER 1–20</div></div>';
    for(let n=1;n<=10;n++)btn('PICK '+n,()=>{const drawn=rand(20);o.querySelector('.lw-lucky-screen').textContent='DRAW: '+drawn;result(drawn===n?'🍀 LUCKY! JACKPOT!':'😂 NOT YOUR LUCKY NUMBER!');});
  } else if(type==='pubjackpot'){
    const qs2=[['Capital of Wales?',['Cardiff','Swansea','Newport'],'Cardiff'],['Beatles album?',['Abbey Road','Rumours','Thriller'],'Abbey Road'],['How many sides on a hexagon?',['6','7','8'],'6'],['Which decade was 1990 in?',['90s','80s','00s'],'90s']];const q=P('pubjackpot-questions',qs2);
    o.innerHTML='<div class="lw-jackpot-game"><div class="lw-jackpot-neon">🏆 PUB QUIZ JACKPOT</div><div class="lw-jackpot-screen">'+q[0]+'</div><div class="lw-jackpot-pot">£000</div></div>';
    q[1].forEach(v=>btn(v,()=>{const ok=v===q[2];o.querySelector('.lw-jackpot-pot').textContent=ok?'£'+(rand(9)*10):'£0';result(ok?'💷 JACKPOT BUILDS!':'😂 JACKPOT ESCAPES!');}));
  } else if(type==='bull'){
    let shots=0,best=999,total=0,drag=false;
    o.innerHTML='<div class="lw-dart-score">🎯 <strong>NEAREST THE BULL</strong> · 3 throws · Best: —</div><div class="lw-dart-msg">Drag the dart around the board and release as close to the bull as you can!</div><div class="lw-bull-board"><div class="lw-bull-ring r1"></div><div class="lw-bull-ring r2"></div><div class="lw-bull-ring r3"></div><div class="lw-bull-centre">🎯</div><div class="lw-aim-dart">🎯</div></div><div class="lw-bull-actions"><button type="button" class="lw-bull-throw">🎯 THROW DART</button><button type="button" class="lw-bull-reset">↻ NEW GAME</button></div>';
    c.innerHTML='';const board=o.querySelector('.lw-bull-board'),dart=o.querySelector('.lw-aim-dart'),box=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),throwBtn=o.querySelector('.lw-bull-throw'),reset=o.querySelector('.lw-bull-reset');
    const place=e=>{const r=board.getBoundingClientRect();dart.style.left=Math.max(8,Math.min(r.width-8,e.clientX-r.left))+'px';dart.style.top=Math.max(8,Math.min(r.height-8,e.clientY-r.top))+'px';};
    board.addEventListener('pointermove',e=>{if(drag)place(e);});board.addEventListener('pointerdown',e=>{drag=true;board.setPointerCapture?.(e.pointerId);place(e);});board.addEventListener('pointerup',e=>{if(drag){drag=false;place(e);}});
    throwBtn.addEventListener('click',()=>{if(shots>=3)return;shots++;const r=board.getBoundingClientRect(),x=parseFloat(dart.style.left)||r.width/2,y=parseFloat(dart.style.top)||r.height/2,d=Math.round(Math.hypot(x-r.width/2,y-r.height/2)/(r.width/2)*100);best=Math.min(best,d);total+=d;msg.textContent=d<=10?'🔥 BULLSEYE!':d<=25?'🎯 VERY CLOSE!':'😂 That dart has gone on holiday!';box.innerHTML='🎯 <strong>NEAREST THE BULL</strong> · '+shots+'/3 throws · Best: '+best+' · Avg: '+Math.round(total/shots);if(shots>=3){msg.textContent+=' 🏆 FINAL!';throwBtn.disabled=true;}});
    reset.addEventListener('click',()=>{shots=0;best=999;total=0;throwBtn.disabled=false;dart.style.left='50%';dart.style.top='50%';box.innerHTML='🎯 <strong>NEAREST THE BULL</strong> · 3 throws · Best: —';msg.textContent='Drag the dart around the board and release as close to the bull as you can!';});
  }
  else if(type==='darts301'){
    let you=301,cpu=301,darts=0,turn=0,over=false;
    o.innerHTML='<div class="lw-dart-score">🎯 <strong>YOU 301 — CPU 301</strong> · Dart 1/3</div><div class="lw-dart-msg">Beat the computer! Aim for trebles and finish on a double.</div><div class="lw-dart-match"><div class="lw-dart-player you"><b>⚡ YOU</b><strong class="lw-you-score">301</strong><small>YOUR TURN</small></div><div class="lw-dart-vs">VS<br>🤖</div><div class="lw-dart-player cpu"><b>🤖 CPU</b><strong class="lw-cpu-score">301</strong><small>WAITING</small></div></div><div class="lw-dartboard-wrap"><svg class="lw-dartboard" viewBox="0 0 400 400" role="img" aria-label="Interactive dartboard"></svg></div><div class="lw-dart-actions"><button type="button" class="lw-dart-new">↻ NEW MATCH</button><button type="button" class="lw-dart-next" disabled>➡️ NEXT TURN</button></div>';
    c.innerHTML='';
    const svg=o.querySelector('.lw-dartboard'),next=o.querySelector('.lw-dart-next'),fresh=o.querySelector('.lw-dart-new'),msg=o.querySelector('.lw-dart-msg'),scoreBox=o.querySelector('.lw-dart-score'),youEl=o.querySelector('.lw-you-score'),cpuEl=o.querySelector('.lw-cpu-score');
    const nums=[20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5],cx=200,cy=200;
    const polar=(r,a)=>[cx+Math.cos(a)*r,cy+Math.sin(a)*r];
    const path=(r1,r2,a1,a2)=>{const p1=polar(r1,a1),p2=polar(r1,a2),p3=polar(r2,a2),p4=polar(r2,a1);return 'M '+p1[0]+' '+p1[1]+' L '+p2[0]+' '+p2[1]+' L '+p3[0]+' '+p3[1]+' L '+p4[0]+' '+p4[1]+' Z'};
    const add=(tag,attrs)=>{const el=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));svg.appendChild(el);return el};
    add('circle',{cx,cy,r:190,fill:'#17121b',stroke:'#ffd43b','stroke-width':5});
    for(let i=0;i<20;i++){const a0=-Math.PI/2+i*Math.PI*2/20-Math.PI/40,a1=-Math.PI/2+i*Math.PI*2/20+Math.PI/40,n=nums[i];add('path',{d:path(42,88,a0,a1),class:'lw-dart-seg',fill:i%2?'#e9e9e9':'#202020','data-value':n,'data-mult':1});add('path',{d:path(128,168,a0,a1),class:'lw-dart-seg',fill:i%2?'#e9e9e9':'#202020','data-value':n,'data-mult':1});add('path',{d:path(88,98,a0,a1),class:'lw-dart-seg',fill:i%2?'#b51f2a':'#1d6f54','data-value':n,'data-mult':3});add('path',{d:path(168,178,a0,a1),class:'lw-dart-seg',fill:i%2?'#b51f2a':'#1d6f54','data-value':n,'data-mult':2})}
    add('circle',{cx,cy,r:34,fill:'#202020','data-value':25,'data-mult':1,class:'lw-dart-seg'});
    add('circle',{cx,cy,r:17,fill:'#c52b38','data-value':25,'data-mult':2,class:'lw-dart-seg'});
    for(let i=0;i<20;i++){const p=polar(187,-Math.PI/2+(i+.5)*Math.PI*2/20),t=add('text',{x:p[0],y:p[1]+5,'text-anchor':'middle','font-size':13,fill:'#fff','font-weight':900});t.textContent=nums[i]}
    const update=()=>{youEl.textContent=you;cpuEl.textContent=cpu;scoreBox.innerHTML='🎯 <strong>YOU '+you+' — CPU '+cpu+'</strong> · '+(turn?'🤖 COMPUTER TURN':'⚡ YOUR DART '+Math.min(darts+1,3)+'/3')};
    const mark=(el,who)=>{const m=document.createElementNS('http://www.w3.org/2000/svg','circle');const p=el.tagName.toLowerCase()==='circle'?[+el.getAttribute('cx'),+el.getAttribute('cy')]:polar(135,0);m.setAttribute('cx',p[0]);m.setAttribute('cy',p[1]);m.setAttribute('r',5);m.setAttribute('class','lw-dart-mark');m.setAttribute('fill',who==='cpu'?'#5ee7ff':'#ffd43b');m.setAttribute('stroke','#111');svg.appendChild(m)};
    const finish=()=>{if(over)return;turn=1;darts=0;next.disabled=true;update();msg.textContent='🤖 Computer is throwing...';let n=0;const go=()=>{if(over)return;if(n++>=3){turn=0;darts=0;next.disabled=false;update();msg.textContent='🎯 Your turn — choose your target!';return}setTimeout(()=>{const target=cpu>170?20:Math.max(2,Math.ceil(cpu/2)),mult=Math.random()<.3?3:(Math.random()<.2?2:1),pts=Math.min(cpu,target*mult);if(cpu-pts===0&&mult!==2){n--;go();return}cpu-=pts;const seg=svg.querySelectorAll('.lw-dart-seg')[Math.floor(Math.random()*svg.querySelectorAll('.lw-dart-seg').length)];mark(seg,'cpu');msg.textContent='🤖 CPU scores '+pts+' — '+cpu+' left.';update();if(cpu===0){over=true;next.disabled=true;msg.textContent='🤖 CHECKOUT! COMPUTER WINS!';return}go()},450)};go()};
    svg.addEventListener('click',e=>{const el=e.target.closest('.lw-dart-seg');if(!el||over||turn)return;const pts=Number(el.dataset.value)*Number(el.dataset.mult);if(you-pts<0){darts=3;msg.textContent='💥 BUST! Turn lost.';next.disabled=false;update();return}if(you-pts===0&&Number(el.dataset.mult)!==2){darts=3;msg.textContent='💥 You hit zero without a double — bust!';next.disabled=false;update();return}you-=pts;darts++;mark(el,'you');msg.textContent='🎯 '+(Number(el.dataset.mult)===3?'TRIPLE ':Number(el.dataset.mult)===2?'DOUBLE ':'')+el.dataset.value+' = '+pts;update();if(you===0){over=true;next.disabled=true;msg.textContent='🏆 CHECKOUT! YOU WIN!';return}if(darts>=3)next.disabled=false});
    next.addEventListener('click',()=>{if(!over&&turn===0&&darts>=3)finish()});
    fresh.addEventListener('click',()=>{you=301;cpu=301;darts=0;turn=0;over=false;next.disabled=true;svg.querySelectorAll('.lw-dart-mark').forEach(x=>x.remove());msg.textContent='Beat the computer! Aim for trebles and finish on a double.';update()});
    update();
  }
  else if(type==='killer'){
    let claimed=new Set(),score=0,active=false,hits=0,target=20;
    o.innerHTML='<div class="lw-dart-score">☠️ <strong>KILLER DARTS</strong> · Score 0 · Targets claimed 0</div><div class="lw-dart-msg">Claim a number, then throw at it. Three hits makes you a KILLER!</div><div class="lw-killer-board"><div class="lw-killer-ring"></div><div class="lw-killer-numbers"></div><div class="lw-killer-dart">🎯</div></div><div class="lw-killer-controls"><button type="button" class="lw-killer-claim">☠️ CLAIM TARGET</button><button type="button" class="lw-killer-throw">🎯 THROW</button><button type="button" class="lw-killer-reset">↻ NEW GAME</button></div>';
    c.innerHTML='';const box=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),nums=o.querySelector('.lw-killer-numbers'),dart=o.querySelector('.lw-killer-dart'),claim=o.querySelector('.lw-killer-claim'),throwBtn=o.querySelector('.lw-killer-throw'),reset=o.querySelector('.lw-killer-reset');
    [20,19,18,17,16,15,14,13].forEach(n=>{const b=document.createElement('button');b.type='button';b.className='lw-killer-number';b.textContent=n;b.addEventListener('click',()=>{if(active||claimed.has(n))return;target=n;active=true;claim.disabled=true;throwBtn.disabled=false;msg.textContent='🎯 Target '+n+' selected — hit it!';});nums.appendChild(b);});
    const update=()=>{box.innerHTML='☠️ <strong>KILLER DARTS</strong> · Score '+score+' · Targets claimed '+claimed.size;};
    claim.addEventListener('click',()=>{if(active)return;const a=[20,19,18,17,16,15,14,13].filter(n=>!claimed.has(n));if(!a.length){msg.textContent='🏆 ALL TARGETS CLAIMED!';return;}target=a[Math.floor(Math.random()*a.length)];active=true;claim.disabled=true;throwBtn.disabled=false;msg.textContent='☠️ '+target+' claimed — throw!';});
    throwBtn.addEventListener('click',()=>{if(!active)return;throwBtn.disabled=true;dart.classList.remove('fly');void dart.offsetWidth;dart.classList.add('fly');setTimeout(()=>{const hit=Math.random()<.68;if(hit){hits++;score++;if(hits>=3){claimed.add(target);hits=0;msg.textContent='☠️ KILLER! '+target+' is yours!';}else msg.textContent='🔥 HIT! '+(3-hits)+' more hit(s)!';}else msg.textContent='😂 MISS!';active=false;claim.disabled=false;update();},500);});
    reset.addEventListener('click',()=>{claimed=new Set();score=0;hits=0;active=false;claim.disabled=false;throwBtn.disabled=true;msg.textContent='Claim a number, then throw at it!';update();});throwBtn.disabled=true;update();
  }
  else if(type==='coinpusher'){
    let credits=12,payout=0,coins=[],moving=false;
    o.innerHTML='<div class="lw-coinpusher-game"><div class="lw-dart-score">🪙 <strong>COIN PUSHER</strong> · Coins '+credits+' · Payout 0</div><div class="lw-dart-msg">Aim the drop, then watch the shelf push coins toward the payout edge!</div><div class="lw-coinpusher-machine"><div class="lw-coin-slot">⚡ DROP ZONE</div><div class="lw-coin-shelf"><div class="lw-coin-pile"></div><div class="lw-coin-pusher-arm">▰</div></div><div class="lw-coin-payout">💰 PAYOUT TRAY</div></div><div class="lw-coin-aim"><input class="lw-coin-range" type="range" min="10" max="90" value="50"><button type="button" class="lw-coin-drop">🪙 DROP COIN</button><button type="button" class="lw-coin-reset">↻ REFILL</button></div></div>';
    c.innerHTML='';const box=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),pile=o.querySelector('.lw-coin-pile'),range=o.querySelector('.lw-coin-range'),drop=o.querySelector('.lw-coin-drop'),reset=o.querySelector('.lw-coin-reset');
    const render=()=>{pile.innerHTML='';coins.forEach((x,i)=>{const el=document.createElement('span');el.className='lw-loose-coin';el.textContent='🪙';el.style.left=x+'%';el.style.bottom=(8+(i%4)*11)+'px';pile.appendChild(el);});box.innerHTML='🪙 <strong>COIN PUSHER</strong> · Coins '+credits+' · Payout '+payout;};
    const dropCoin=()=>{if(moving||credits<=0)return;credits--;moving=true;const x=Number(range.value);const el=document.createElement('span');el.className='lw-loose-coin lw-falling-coin';el.textContent='🪙';el.style.left=x+'%';pile.appendChild(el);msg.textContent='🪙 Coin dropping...';setTimeout(()=>{el.remove();coins.push(Math.max(8,Math.min(92,x+(Math.random()*10-5))));let pushed=Math.random()<.35?1:0;if(coins.length>10){pushed+=Math.min(3,Math.floor(coins.length/9));coins.splice(0,pushed);payout+=pushed;}moving=false;msg.textContent=pushed?'🔥 PUSH! '+pushed+' coin'+(pushed>1?'s':'')+' paid out!':'🪙 Coins wobble on the shelf...';render();},520);};
    drop.addEventListener('click',dropCoin);reset.addEventListener('click',()=>{credits=12;payout=0;coins=[];moving=false;msg.textContent='Machine refilled — find the sweet spot!';render();});render();
  }
  else if(type==='skittles'){
    let you=0,cpu=0,round=0,rolling=false,aim=50;
    o.innerHTML='<div class="lw-dart-score">🎳 <strong>SKITTLES</strong> · YOU 0 — CPU 0 · Round 1/5</div><div class="lw-dart-msg">Drag the ball sideways to aim at the pins, then roll. First to the best score wins!</div><div class="lw-skittle-lane"><div class="lw-skittle-stage"><div class="lw-skittle-pins"></div><div class="lw-skittle-ball">🎳</div></div></div><div class="lw-skittle-actions"><button type="button" class="lw-skittle-roll">🎳 ROLL BALL</button><button type="button" class="lw-skittle-reset">↻ NEW MATCH</button></div>';
    c.innerHTML='';const stage=o.querySelector('.lw-skittle-stage'),pins=o.querySelector('.lw-skittle-pins'),ball=o.querySelector('.lw-skittle-ball'),box=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),roll=o.querySelector('.lw-skittle-roll'),reset=o.querySelector('.lw-skittle-reset');
    const spots=[[50,12],[39,28],[61,28],[28,45],[50,45],[72,45],[17,64],[39,64],[61,64],[83,64]];
    const draw=()=>{pins.innerHTML='';spots.forEach((p)=>{const el=document.createElement('span');el.className='lw-skittle-pin';el.style.left=p[0]+'%';el.style.top=p[1]+'%';el.textContent='🎳';pins.appendChild(el);});ball.style.left=aim+'%';};
    stage.addEventListener('pointermove',e=>{if(rolling)return;const r=stage.getBoundingClientRect();aim=Math.max(12,Math.min(88,(e.clientX-r.left)/r.width*100));ball.style.left=aim+'%';});
    stage.addEventListener('pointerdown',e=>{const r=stage.getBoundingClientRect();aim=Math.max(12,Math.min(88,(e.clientX-r.left)/r.width*100));ball.style.left=aim+'%';});
    roll.addEventListener('click',()=>{if(rolling||round>=5)return;rolling=true;ball.classList.remove('rolling');void ball.offsetWidth;ball.classList.add('rolling');const hit=Math.max(1,Math.min(10,Math.round(5-Math.abs(aim-50)/11+Math.random()*3)));setTimeout(()=>{you+=hit;const cpuHit=Math.max(1,Math.min(10,Math.round(5+Math.random()*4)));cpu+=cpuHit;round++;box.innerHTML='🎳 <strong>SKITTLES</strong> · YOU '+you+' — CPU '+cpu+' · Round '+Math.min(round,5)+'/5';msg.textContent='💥 You knocked '+hit+' down! CPU knocked '+cpuHit+' down!';rolling=false;draw();if(round>=5){roll.disabled=true;msg.textContent=you>cpu?'🏆 YOU WIN THE SKITTLES MATCH!':you<cpu?'😂 CPU WINS — REMATCH!':'🤝 DEAD HEAT!';}},520);});
    reset.addEventListener('click',()=>{you=0;cpu=0;round=0;rolling=false;roll.disabled=false;aim=50;draw();box.innerHTML='🎳 <strong>SKITTLES</strong> · YOU 0 — CPU 0 · Round 1/5';msg.textContent='Drag the ball sideways to aim at the pins, then roll.';});
    draw();
  }
  else if(type==='shuffleboard'){
    let shots=0,total=0,active=false;
    o.innerHTML='<div class="lw-dart-score">🟠 <strong>Shuffleboard</strong> · 3 pucks</div><div class="lw-dart-msg">Drag the puck along the table, then release to shoot.</div><div class="lw-shuffle-lane"><div class="lw-shuffle-zones"><div class="lw-shuffle-zone z10">10</div><div class="lw-shuffle-zone z20">20</div><div class="lw-shuffle-zone z30">30</div><div class="lw-shuffle-zone z50">50</div></div><div class="lw-shuffle-puck" role="button" aria-label="Shuffleboard puck" tabindex="0">🟠</div><div class="lw-shuffle-end">🏁</div></div><div class="lw-shuffle-actions"><button type="button" class="lw-shuffle-reset">↻ NEW GAME</button></div>';
    c.innerHTML='';
    const lane=o.querySelector('.lw-shuffle-lane'),puck=o.querySelector('.lw-shuffle-puck'),msg=o.querySelector('.lw-dart-msg'),scoreBox=o.querySelector('.lw-dart-score'),reset=o.querySelector('.lw-shuffle-reset');
    const laneRect=()=>lane.getBoundingClientRect();
    const setPuck=(x,animate)=>{
      puck.style.transition=animate?'left .55s cubic-bezier(.2,.8,.2,1)':'none';
      const w=lane.clientWidth,clamp=Math.max(12,Math.min(w-12,x));puck.style.left=clamp+'px';
    };
    const scoreFor=(x)=>{
      const pct=x/Math.max(1,lane.clientWidth);
      if(pct>.88)return 50;if(pct>.72)return 30;if(pct>.55)return 20;if(pct>.38)return 10;return 0;
    };
    const shoot=(clientX)=>{
      if(active||shots>=3)return;
      active=true;shots++;
      const r=laneRect(),x=Math.max(12,Math.min(r.width-12,clientX-r.left));
      setPuck(x,true);
      const points=scoreFor(x);total+=points;
      setTimeout(()=>{
        active=false;
        scoreBox.innerHTML='🟠 <strong>'+total+'</strong> points · Puck '+shots+'/3';
        msg.textContent=points?'🔥 '+points+' points! Total: '+total+' — '+(shots<3?'Shoot again!':'Final score!'):'😂 Bit short — 0 points! '+(shots<3?'Have another go.':'Final score: '+total);
        if(shots>=3){msg.textContent='🏆 FINAL SCORE: '+total+' points from 3 pucks!';}
      },580);
    };
    let dragging=false;
    const pointerStart=e=>{if(active||shots>=3)return;dragging=true;puck.setPointerCapture?.(e.pointerId);puck.classList.add('dragging');};
    const pointerMove=e=>{if(!dragging)return;const r=laneRect();setPuck(Math.max(12,Math.min(r.width-12,e.clientX-r.left)),false);};
    const pointerEnd=e=>{if(!dragging)return;dragging=false;puck.classList.remove('dragging');shoot(e.clientX);};
    puck.addEventListener('pointerdown',pointerStart);
    puck.addEventListener('pointermove',pointerMove);
    puck.addEventListener('pointerup',pointerEnd);
    puck.addEventListener('pointercancel',()=>{dragging=false;puck.classList.remove('dragging');});
    puck.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();shoot(laneRect().left+lane.clientWidth*.7);}});
    reset.addEventListener('click',()=>{
      shots=0;total=0;active=false;setPuck(28,false);scoreBox.innerHTML='🟠 <strong>Shuffleboard</strong> · 3 pucks';msg.textContent='Drag the puck along the table, then release to shoot!';
    });
    setPuck(28,false);
  }
  else if(type==='tablefootball'){
    let you=0,cpu=0,active=false;
    o.innerHTML='<div class="lw-dart-score">⚽ <strong>YOU 0 — CPU 0</strong> · First to 5</div><div class="lw-dart-msg">Drag the player rows into position, then shoot. The computer can counter-attack!</div><div class="lw-football-scoreboard"><span>⚡ YOU <b class="lw-fb-you">0</b></span><span>🤖 CPU <b class="lw-fb-cpu">0</b></span></div><div class="lw-football-table"><div class="lw-football-goal">🥅</div><div class="lw-football-pitch"><div class="lw-football-ball">⚽</div><div class="lw-football-row"><span>🔴</span><span>🔴</span><span>🔴</span></div><div class="lw-football-row"><span>🔵</span><span>🔵</span><span>🔵</span></div><div class="lw-football-row"><span>🔴</span><span>🔴</span><span>🔴</span></div><div class="lw-football-row"><span>🔵</span><span>🔵</span><span>🔵</span></div></div><div class="lw-football-goal">🥅</div></div><div class="lw-football-controls"><button type="button" class="lw-football-move">↕️ MOVE PLAYERS</button><button type="button" class="lw-football-shoot">⚽ SHOOT!</button><button type="button" class="lw-football-reset">↻ NEW MATCH</button></div>';
    c.innerHTML='';
    const scoreBox=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),ball=o.querySelector('.lw-football-ball'),rows=[...o.querySelectorAll('.lw-football-row')],move=o.querySelector('.lw-football-move'),shoot=o.querySelector('.lw-football-shoot'),reset=o.querySelector('.lw-football-reset'),youEl=o.querySelector('.lw-fb-you'),cpuEl=o.querySelector('.lw-fb-cpu');
    const update=()=>{scoreBox.innerHTML='⚽ <strong>YOU '+you+' — CPU '+cpu+'</strong> · First to 5';youEl.textContent=you;cpuEl.textContent=cpu};
    rows.forEach((row,i)=>{row.dataset.pos=i%2?'60':'40';row.style.top=row.dataset.pos+'%';});
    const kick=()=>{if(active||you>=5||cpu>=5)return;active=true;ball.classList.remove('kick');void ball.offsetWidth;ball.classList.add('kick');setTimeout(()=>{const attack=Math.abs(parseFloat(rows[0].style.top)-parseFloat(rows[1].style.top));const chance=Math.min(.82,.42+attack/180);if(Math.random()<chance){you++;msg.textContent='⚽ GOAL! Your formation found the gap!'}else{msg.textContent='🧤 CPU BLOCK! The computer read your attack.';if(Math.random()<.4){cpu++;msg.textContent='🤖 COUNTER-ATTACK! CPU SCORES!'}}update();active=false;if(you>=5||cpu>=5){shoot.disabled=true;move.disabled=true;msg.textContent=you>=5?'🏆 YOU WIN THE TABLE FOOTBALL MATCH!':'🤖 CPU WINS THE MATCH!'}},500)};
    rows.forEach(row=>{let drag=false,start=0,base=0;row.addEventListener('pointerdown',e=>{if(active||you>=5||cpu>=5)return;drag=true;start=e.clientY;base=parseFloat(row.dataset.pos);row.setPointerCapture?.(e.pointerId);row.classList.add('dragging')});row.addEventListener('pointermove',e=>{if(!drag)return;const p=Math.max(15,Math.min(85,base+(e.clientY-start)/3));row.dataset.pos=p;row.style.top=p+'%'});row.addEventListener('pointerup',()=>{drag=false;row.classList.remove('dragging')});row.addEventListener('pointercancel',()=>{drag=false;row.classList.remove('dragging')})});
    move.addEventListener('click',()=>{if(active)return;rows.forEach(row=>{const p=30+Math.random()*40;row.dataset.pos=p;row.style.top=p+'%'});msg.textContent='↕️ Formation shifted — line up your next attack!'});
    shoot.addEventListener('click',kick);
    reset.addEventListener('click',()=>{you=0;cpu=0;active=false;shoot.disabled=false;move.disabled=false;rows.forEach((row,i)=>{row.dataset.pos=i%2?'60':'40';row.style.top=row.dataset.pos+'%'});ball.classList.remove('kick');update();msg.textContent='Kick-off! First to 5 — beat the computer!'});
    update();
  }
  else if(type==='bowling'){
    let frame=1,roll=1,you=0,cpu=0,active=false,pins=new Set([...Array(10).keys()]);
    o.innerHTML='<div class="lw-dart-score">🎳 <strong>YOU 0 — CPU 0</strong> · Frame 1</div><div class="lw-dart-msg">Drag the ball sideways to aim. Beat the computer over 10 frames!</div><div class="lw-bowling-match"><div>⚡ YOU <b class="lw-bowl-you">0</b></div><div>VS</div><div>🤖 CPU <b class="lw-bowl-cpu">0</b></div></div><div class="lw-bowling-lane"><div class="lw-bowling-arrow">⬆️</div><div class="lw-bowling-pins"></div><div class="lw-bowling-ball">🎳</div></div><div class="lw-bowling-controls"><button type="button" class="lw-bowling-roll">🎳 ROLL</button><button type="button" class="lw-bowling-reset">↻ NEW MATCH</button></div>';
    c.innerHTML='';
    const scoreBox=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),lane=o.querySelector('.lw-bowling-lane'),ball=o.querySelector('.lw-bowling-ball'),pinsEl=o.querySelector('.lw-bowling-pins'),rollBtn=o.querySelector('.lw-bowling-roll'),reset=o.querySelector('.lw-bowling-reset'),youEl=o.querySelector('.lw-bowl-you'),cpuEl=o.querySelector('.lw-bowl-cpu');
    const spots=[[50,12],[42,25],[58,25],[34,39],[50,39],[66,39],[26,55],[42,55],[58,55],[74,55]];
    const draw=()=>{pinsEl.innerHTML='';spots.forEach((p,i)=>{const e=document.createElement('span');e.className='lw-bowl-pin'+(pins.has(i)?'':' down');e.style.left=p[0]+'%';e.style.top=p[1]+'%';e.textContent='🎳';pinsEl.appendChild(e)})};
    let aim=50;const setAim=x=>{aim=Math.max(18,Math.min(82,x));ball.style.left=aim+'%'};
    const update=()=>{scoreBox.innerHTML='🎳 <strong>YOU '+you+' — CPU '+cpu+'</strong> · Frame '+frame;youEl.textContent=you;cpuEl.textContent=cpu};
    const cpuTurn=()=>{const hit=Math.max(1,Math.min(10,Math.floor(Math.random()*8)+2));cpu+=hit;update();msg.textContent='🤖 CPU knocked '+hit+' pins!';};
    const endFrame=()=>{setTimeout(()=>{cpuTurn();if(frame>=10){rollBtn.disabled=true;msg.textContent='🏆 MATCH COMPLETE! YOU '+you+' — CPU '+cpu+(you>cpu?' — YOU WIN!':' — CPU TAKES IT!');return}frame++;roll=1;pins=new Set([...Array(10).keys()]);setAim(50);draw();active=false;update();msg.textContent='🎳 Frame '+frame+' — your turn.'},650)};
    ball.addEventListener('pointerdown',e=>{if(active||rollBtn.disabled)return;ball.setPointerCapture?.(e.pointerId);ball.classList.add('aiming')});
    ball.addEventListener('pointermove',e=>{if(!ball.hasPointerCapture?.(e.pointerId))return;const r=lane.getBoundingClientRect();setAim((e.clientX-r.left)/r.width*100)});
    ball.addEventListener('pointerup',()=>ball.classList.remove('aiming'));ball.addEventListener('pointercancel',()=>ball.classList.remove('aiming'));
    rollBtn.addEventListener('click',()=>{if(active||rollBtn.disabled)return;active=true;ball.classList.remove('rolling');void ball.offsetWidth;ball.classList.add('rolling');setTimeout(()=>{const remaining=[...pins],bonus=Math.abs(aim-50)<8?3:Math.abs(aim-50)<18?1:0,hit=Math.min(remaining.length,Math.max(1,Math.floor(Math.random()*5)+1+bonus));shuffle(remaining).slice(0,hit).forEach(i=>pins.delete(i));you+=hit;draw();update();if(pins.size===0){msg.textContent=roll===1?'🔥 STRIKE!':'🔥 SPARE!';if(roll===1)you+=2;endFrame()}else if(roll===2){msg.textContent='🎳 '+hit+' down — frame over.';endFrame()}else{roll=2;active=false;msg.textContent='🎳 '+hit+' down! '+pins.size+' left — roll again.';update()}},650)});
    reset.addEventListener('click',()=>{frame=1;roll=1;you=0;cpu=0;active=false;pins=new Set([...Array(10).keys()]);rollBtn.disabled=false;setAim(50);ball.classList.remove('rolling');draw();update();msg.textContent='Match reset — beat the computer!'});
    draw();setAim(50);update();
  }
  else if(type==='bagatelle'){
    let score=0,balls=5,active=false,aim=50;
    o.innerHTML='<div class="lw-dart-score">🟡 <strong>Bagatelle</strong> · Balls 5 · Score 0</div><div class="lw-dart-msg">Drag the ball sideways to aim, then drop it!</div><div class="lw-bagatelle-board"><div class="lw-bagatelle-slots"><span>10</span><span>25</span><span>50</span><span>100</span><span>50</span><span>25</span><span>10</span></div><div class="lw-bagatelle-pegs"></div><div class="lw-bagatelle-ball">●</div><div class="lw-bagatelle-launcher">⬇️</div></div><div class="lw-bagatelle-controls"><button type="button" class="lw-bagatelle-drop">🟡 DROP BALL</button><button type="button" class="lw-bagatelle-reset">↻ NEW GAME</button></div>';
    c.innerHTML='';
    const scoreBox=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),board=o.querySelector('.lw-bagatelle-board'),ball=o.querySelector('.lw-bagatelle-ball'),drop=o.querySelector('.lw-bagatelle-drop'),reset=o.querySelector('.lw-bagatelle-reset'),pegs=o.querySelector('.lw-bagatelle-pegs'),launcher=o.querySelector('.lw-bagatelle-launcher');
    const values=[10,25,50,100,50,25,10];
    for(let row=0;row<7;row++)for(let col=0;col<5;col++){const p=document.createElement('i');p.style.left=(18+col*16+(row%2?8:0))+'%';p.style.top=(16+row*10)+'%';pegs.appendChild(p);}
    const update=()=>{scoreBox.innerHTML='🟡 <strong>Bagatelle</strong> · Balls '+balls+' · Score '+score;};
    const setAim=x=>{aim=Math.max(12,Math.min(88,x));ball.style.left=aim+'%';launcher.style.left=aim+'%';};
    ball.addEventListener('pointerdown',e=>{if(active||balls<=0)return;ball.setPointerCapture?.(e.pointerId);ball.classList.add('aiming');});
    ball.addEventListener('pointermove',e=>{if(!ball.hasPointerCapture?.(e.pointerId))return;const r=board.getBoundingClientRect();setAim((e.clientX-r.left)/r.width*100);});
    ball.addEventListener('pointerup',()=>ball.classList.remove('aiming'));
    ball.addEventListener('pointercancel',()=>ball.classList.remove('aiming'));
    drop.addEventListener('click',()=>{
      if(active||balls<=0)return;
      active=true;balls--;update();ball.classList.remove('falling');void ball.offsetWidth;
      const target=Math.max(0,Math.min(6,Math.round((aim/100)*6+(Math.random()-.5)*2)));
      ball.style.setProperty('--drop-x',(12+target*12.7)+'%');ball.classList.add('falling');
      setTimeout(()=>{const pts=values[target];score+=pts;update();msg.textContent='🟡 Ball landed in '+pts+' points! '+(balls?'Aim again for the next ball.':'All balls used — final score '+score+'!');active=false;if(!balls)drop.disabled=true;setAim(50);},850);
    });
    reset.addEventListener('click',()=>{score=0;balls=5;active=false;drop.disabled=false;setAim(50);update();msg.textContent='Drag the ball sideways to aim, then drop it!';});
    setAim(50);update();
  }
  else if(type==='pickcard'){
    const prizes=['🍺 FREE ROUND (virtual!)','🎵 ONE MORE TUNE','😂 BANTER BONUS','💎 FORGOTTEN GEM','🚂 MUSIC TRAIN PASS','⚡ LIVE WIRE WILDCARD','🕺 DANCEFLOOR TOKEN','🎤 SINGALONG CARD','🪩 DISCO BONUS'];
    let chosen=false;
    o.innerHTML='<div class="lw-dart-score">🃏 <strong>Pick a Card</strong> · Choose one mystery card!</div><div class="lw-dart-msg">Pick a card and see what the Live Wire deck has dealt you.</div><div class="lw-card-table"><div class="lw-card-deck"></div></div><button type="button" class="lw-pickcard-reset">↻ SHUFFLE DECK</button>';
    c.innerHTML='';
    const deck=o.querySelector('.lw-card-deck'),scoreBox=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),reset=o.querySelector('.lw-pickcard-reset');
    const build=()=>{
      chosen=false;deck.innerHTML='';
      prizes.forEach((_,i)=>{
        const card=document.createElement('button');card.type='button';card.className='lw-mystery-card';card.innerHTML='<span class="lw-card-back">⚡<small>LIVE WIRE</small></span><span class="lw-card-front">🃏</span>';
        card.addEventListener('click',()=>{
          if(chosen)return;chosen=true;
          deck.querySelectorAll('.lw-mystery-card').forEach(x=>x.disabled=true);
          card.classList.add('picked');setTimeout(()=>card.classList.add('flipped'),280);
          scoreBox.innerHTML='🃏 <strong>Card '+(i+1)+'</strong> · DECK REVEALED';
          msg.textContent=prizes[i];
        });
        deck.appendChild(card);
      });
      shuffle([...deck.children]).forEach((card,i)=>deck.appendChild(card));
      msg.textContent='Pick one of the mystery cards!';
    };
    reset.addEventListener('click',build);build();
  }
  else if(type==='fruitmachine'){
    const icons=['🍒','🍋','🔔','⭐','💎','⚡'];
    let credits=10,spinning=false;
    o.innerHTML='<div class="lw-dart-score">🍒 <strong>LIVE WIRE FRUIT MACHINE</strong> · Credits 10</div><div class="lw-dart-msg">Three reels. One big jackpot. Spin the machine!</div><div class="lw-fruit-machine"><div class="lw-fruit-top">⚡ LIVE WIRE ⚡</div><div class="lw-fruit-reels"><div class="lw-fruit-reel">🍒</div><div class="lw-fruit-reel">🍋</div><div class="lw-fruit-reel">🔔</div></div><div class="lw-fruit-paytable">🍒🍒🍒 ×5 &nbsp; ⭐⭐⭐ ×10 &nbsp; 💎💎💎 ×20 &nbsp; ⚡⚡⚡ JACKPOT ×50</div><div class="lw-fruit-lights">● ● ● ● ● ● ● ● ●</div></div><div class="lw-fruit-controls"><button type="button" class="lw-fruit-spin">🍒 SPIN</button><button type="button" class="lw-fruit-reset">↻ REFILL 10</button></div>';
    c.innerHTML='';
    const scoreBox=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),reels=[...o.querySelectorAll('.lw-fruit-reel')],spinBtn=o.querySelector('.lw-fruit-spin'),reset=o.querySelector('.lw-fruit-reset');
    const update=()=>{scoreBox.innerHTML='🍒 <strong>LIVE WIRE FRUIT MACHINE</strong> · Credits '+credits;spinBtn.disabled=spinning||credits<=0;};
    const spin=()=>{
      if(spinning||credits<=0)return;
      credits--;spinning=true;update();msg.textContent='🎰 Reels spinning...';
      reels.forEach((r,i)=>{r.classList.remove('spinning','winner');void r.offsetWidth;r.classList.add('spinning');});
      const final=[0,1,2].map(()=>icons[rand(icons.length)-1]);
      setTimeout(()=>{reels.forEach((r,i)=>{r.textContent=final[i];r.classList.remove('spinning');});
        let win=0;
        if(final[0]===final[1]&&final[1]===final[2]){const mult=final[0]==='⚡'?50:final[0]==='💎'?20:final[0]==='⭐'?10:5;win=mult;msg.textContent=final[0]==='⚡'?'⚡⚡⚡ JACKPOT! +50 CREDITS!':'🎉 THREE '+final[0]+'! +'+mult+' CREDITS!';reels.forEach(r=>r.classList.add('winner'));setTimeout(()=>reels.forEach(r=>r.classList.remove('winner')),900);}
        else if(final[0]===final[1]||final[1]===final[2]||final[0]===final[2]){win=2;msg.textContent='✨ TWO MATCH! +2 CREDITS!';}
        else msg.textContent='😂 No match — spin again!';
        credits+=win;spinning=false;update();
      },950);
    };
    spinBtn.addEventListener('click',spin);
    reset.addEventListener('click',()=>{credits=10;spinning=false;reels.forEach((r,i)=>r.textContent=icons[i]);msg.textContent='Machine refilled with 10 credits!';update();});
    update();
  }
  else if(type==='bouncer'){
    let score=0,round=1,active=false;
    const people=['🧑‍🎤','🕺','🎸','🍺','🎤','😎','🧔','🪩','🚂','🎧'];
    o.innerHTML='<div class="lw-dart-score">🚪 <strong>BOUNCER DAN</strong> · Score 0 · Round 1/5</div><div class="lw-dart-msg">Watch the customer, then decide: LET IN or BOUNCE!</div><div class="lw-bouncer-game"><div class="lw-bouncer-sign">LIVE WIRE<br><small>DOOR POLICY</small></div><div class="lw-bouncer-person">🕺</div><div class="lw-bouncer-door">🚪</div><div class="lw-bouncer-badge">DAN</div></div><div class="lw-bouncer-controls"><button type="button" class="lw-bouncer-in">🚪 LET IN</button><button type="button" class="lw-bouncer-out">🚫 BOUNCE</button><button type="button" class="lw-bouncer-reset">↻ NEW GAME</button></div>';
    c.innerHTML='';
    const scoreBox=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),person=o.querySelector('.lw-bouncer-person'),door=o.querySelector('.lw-bouncer-door'),inBtn=o.querySelector('.lw-bouncer-in'),outBtn=o.querySelector('.lw-bouncer-out'),reset=o.querySelector('.lw-bouncer-reset');
    let wantsIn=false;
    const update=()=>{scoreBox.innerHTML='🚪 <strong>BOUNCER DAN</strong> · Score '+score+' · Round '+round+'/5';};
    const next=()=>{
      if(round>5){inBtn.disabled=true;outBtn.disabled=true;msg.textContent='🏆 DOORS CLOSED! Final score: '+score+'/5';return;}
      wantsIn=Math.random()>.4;person.textContent=people[rand(people.length)-1];person.className='lw-bouncer-person';door.classList.remove('open');active=true;inBtn.disabled=false;outBtn.disabled=false;msg.textContent='🤔 Customer at the door... make your call!';
    };
    const decide=choice=>{
      if(!active)return;active=false;inBtn.disabled=true;outBtn.disabled=true;
      if(choice===wantsIn){score++;msg.textContent=wantsIn?'✅ IN! Good judgement, Dan!':'🚫 OUT! You spotted trouble!';person.classList.add(wantsIn?'allowed':'bounced');if(wantsIn)door.classList.add('open');}
      else{msg.textContent=wantsIn?'😂 OI! You bounced a perfectly good customer!':'🚨 DAN SAYS NO! You let them in!';person.classList.add('wrong');}
      update();round++;setTimeout(next,850);
    };
    inBtn.addEventListener('click',()=>decide(true));outBtn.addEventListener('click',()=>decide(false));
    reset.addEventListener('click',()=>{score=0;round=1;active=false;next();update();});
    next();update();
  }
  else if(type==='temuboss'){
    let cash=50,score=0,round=1,active=false,current=null;
    const items=[['🧦','Socks','£2'],['💡','LED Light','£4'],['📱','Phone Stand','£3'],['🎧','Mystery Earbuds','£7'],['🪩','Mini Disco Ball','£5'],['🧸','Tiny Gadget','£6'],['☕','Cup Warmer','£9'],['🔌','USB Gadget','£4']];
    o.innerHTML='<div class="lw-dart-score">🛍️ <strong>TEMU BOSS CHALLENGE</strong> · Cash £50 · Score 0</div><div class="lw-dart-msg">Will you buy it, or admit you absolutely do not need it?</div><div class="lw-temu-shop"><div class="lw-temu-header">🛍️ TEMU BOSS MARKET</div><div class="lw-temu-item"><div class="lw-temu-icon">🛍️</div><div class="lw-temu-name">Loading...</div><div class="lw-temu-price"></div></div><div class="lw-temu-cart">🛒 Cart: 0 items</div></div><div class="lw-temu-controls"><button type="button" class="lw-temu-buy">🛒 ADD TO BASKET</button><button type="button" class="lw-temu-skip">🚫 I DON’T NEED IT</button><button type="button" class="lw-temu-reset">↻ NEW GAME</button></div>';
    c.innerHTML='';
    const scoreBox=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),icon=o.querySelector('.lw-temu-icon'),name=o.querySelector('.lw-temu-name'),price=o.querySelector('.lw-temu-price'),cart=o.querySelector('.lw-temu-cart'),buy=o.querySelector('.lw-temu-buy'),skip=o.querySelector('.lw-temu-skip'),reset=o.querySelector('.lw-temu-reset');
    const update=()=>{scoreBox.innerHTML='🛍️ <strong>TEMU BOSS CHALLENGE</strong> · Cash £'+cash+' · Score '+score;};
    const next=()=>{
      if(round>6){buy.disabled=true;skip.disabled=true;msg.textContent='🏆 TEMU BOSS ROUND COMPLETE! You scored '+score+'/6 and have £'+cash+' left.';return;}
      current=items[rand(items.length)-1];icon.textContent=current[0];name.textContent=current[1];price.textContent=current[2];active=true;buy.disabled=false;skip.disabled=false;msg.textContent='🤔 Do you NEED it? Be honest...';
    };
    const decide=want=>{
      if(!active)return;active=false;buy.disabled=true;skip.disabled=true;
      const cost=Number(current[2].replace('£',''));
      if(want&&cash>=cost){cash-=cost;score++;cart.textContent='🛒 Cart: '+(6-round+1)+' items';msg.textContent='😂 TEMU BOSS APPROVES! You absolutely did not need it!';}
      else if(want){msg.textContent='💳 Not enough cash! The Temu Boss is disappointed.';}
      else{score++;msg.textContent='👏 RESISTED! You actually closed the basket!';}
      update();round++;setTimeout(next,750);
    };
    buy.addEventListener('click',()=>decide(true));skip.addEventListener('click',()=>decide(false));
    reset.addEventListener('click',()=>{cash=50;score=0;round=1;cart.textContent='🛒 Cart: 0 items';next();update();});
    next();update();
  }
  else if(type==='dadbod'){
    let score=0,round=1,active=false,needle=0;
    o.innerHTML='<div class="lw-dart-score">🍺 <strong>DAD BOD DETECTOR</strong> · Score 0 · Round 1/5</div><div class="lw-dart-msg">Stop the scanner in the GOLDEN DAD BOD zone! 🎯</div><div class="lw-dadbod-machine"><div class="lw-dadbod-title">DAD BOD SCANNER 3000</div><div class="lw-dadbod-meter"><div class="lw-dadbod-zone">🔥 PLATINUM CHEST PACKAGE 🔥</div><div class="lw-dadbod-needle"></div></div><div class="lw-dadbod-readout">SCANNING...</div></div><div class="lw-dadbod-controls"><button type="button" class="lw-dadbod-stop">🛑 STOP SCANNER</button><button type="button" class="lw-dadbod-reset">↻ NEW GAME</button></div>';
    c.innerHTML='';
    const scoreBox=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),needleEl=o.querySelector('.lw-dadbod-needle'),readout=o.querySelector('.lw-dadbod-readout'),stop=o.querySelector('.lw-dadbod-stop'),reset=o.querySelector('.lw-dadbod-reset');
    const update=()=>{scoreBox.innerHTML='🍺 <strong>DAD BOD DETECTOR</strong> · Score '+score+' · Round '+round+'/5';};
    const start=()=>{if(round>5)return;active=true;needle=0;needleEl.style.left='0%';stop.disabled=false;msg.textContent='🔎 Scanner moving... STOP IT!';let dir=1;clearInterval(window.lwDadBodTimer);window.lwDadBodTimer=setInterval(()=>{needle+=dir*2.8;if(needle>=100){needle=100;dir=-1}if(needle<=0){needle=0;dir=1}needleEl.style.left=needle+'%';},30);};
    const decide=()=>{if(!active)return;active=false;clearInterval(window.lwDadBodTimer);stop.disabled=true;const distance=Math.abs(needle-50);let pts=distance<6?3:distance<14?2:distance<26?1:0;score+=pts;readout.textContent=pts===3?'🔥 PLATINUM CHEST PACKAGE! +3':pts===2?'💪 ELITE DAD BOD! +2':pts===1?'😂 DECENT DAD BOD! +1':'🚨 DAD BOD MISSED! +0';msg.textContent=pts===3?'🔥 Absolutely nailed the platinum zone!':pts===2?'💪 Very respectable dad bod detection!':pts===1?'😂 Detector got something...':'🚨 The dad bod escaped the scanner!';update();round++;setTimeout(start,850);};
    stop.addEventListener('click',decide);
    reset.addEventListener('click',()=>{clearInterval(window.lwDadBodTimer);score=0;round=1;active=false;readout.textContent='SCANNING...';start();update();});
    start();update();
  }
  else if(type==='dodgyrequest'){
    let score=0,round=1,active=false;
    const requests=[['🎤','Can you play Wonderwall?','🟢'],['🎵','Can you play that song from the advert?','🟢'],['⏱️','Can you play my request… NOW?!','🔴'],['📱','Can you play this TikTok sound for 8 minutes?','🔴'],['🔊','Can you turn it up? My ears are broken.','🟢'],['🎶','Can you play the same song again?','🔴'],['🕺','Can you put on something everyone knows?','🟢'],['🎧','Can you play a song I only remember goes “la la la”?','🔴'],['🍺','Can you play one more before last orders?','🟢'],['📣','CAN YOU PLAY MY FRIEND’S BAND?!','🔴']];
    o.innerHTML='<div class="lw-dart-score">🎧 <strong>DODGY REQUEST MACHINE</strong> · Score 0 · Round 1/5</div><div class="lw-dart-msg">Is this request reasonable or absolutely dodgy?</div><div class="lw-request-deck"><div class="lw-request-ticket">🎟️<div class="lw-request-icon">🎧</div><div class="lw-request-text">Loading request...</div></div><div class="lw-request-lights">● ● ●</div></div><div class="lw-request-controls"><button type="button" class="lw-request-accept">🎵 ACCEPT</button><button type="button" class="lw-request-deny">🚫 DENY</button><button type="button" class="lw-request-reset">↻ NEW GAME</button></div>';
    c.innerHTML='';
    const scoreBox=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),icon=o.querySelector('.lw-request-icon'),textEl=o.querySelector('.lw-request-text'),ticket=o.querySelector('.lw-request-ticket'),accept=o.querySelector('.lw-request-accept'),deny=o.querySelector('.lw-request-deny'),reset=o.querySelector('.lw-request-reset');
    let current=null;
    const update=()=>{scoreBox.innerHTML='🎧 <strong>DODGY REQUEST MACHINE</strong> · Score '+score+' · Round '+round+'/5';};
    const next=()=>{
      if(round>5){accept.disabled=true;deny.disabled=true;msg.textContent='🏆 REQUEST DESK CLOSED! Final score: '+score+'/5';return;}
      current=requests[rand(requests.length)-1];icon.textContent=current[0];textEl.textContent=current[1];ticket.classList.remove('flash');void ticket.offsetWidth;ticket.classList.add('flash');active=true;accept.disabled=false;deny.disabled=false;msg.textContent='🤔 Reasonable request... or absolute chaos?';
    };
    const decide=wantAccept=>{
      if(!active)return;active=false;accept.disabled=true;deny.disabled=true;
      const reasonable=current[2]==='🟢',correct=wantAccept===reasonable;
      if(correct){score++;msg.textContent=reasonable?'✅ ACCEPTED! Sensible enough.':'🚫 DENIED! Dodgy request detected!';}
      else{msg.textContent=reasonable?'😂 OI! That one was actually reasonable!':'🚨 NOOO! You just approved the dodgiest request in the pub!';}
      update();round++;setTimeout(next,850);
    };
    accept.addEventListener('click',()=>decide(true));deny.addEventListener('click',()=>decide(false));
    reset.addEventListener('click',()=>{score=0;round=1;active=false;next();update();});
    next();update();
  }
  else if(type==='phoenixexcuse'){
    let score=0,round=1,active=false,current=null;
    const excuses=[['🚂','The Music Train was delayed by a signal box malfunction!','🚂'],['🎧','I was testing one more tune for the playlist!','🎧'],['📦','A Temu parcel needed immediate security clearance!','🛍️'],['🐕','The dog walked across the keyboard and changed the whole set!','🐕'],['☕','I was making a brew and accidentally started a full DJ set!','☕'],['📡','The Wi-Fi had a spiritual disagreement with the jukebox!','📡'],['🎤','I was warming up my vocals. For three hours.','🎤'],['🕺','The dancefloor was too good. I got trapped!','🕺'],['🔌','Someone unplugged the Music Train!','🔌'],['🚪','I got stuck at the pub door talking about tunes!','🚪']];
    o.innerHTML='<div class="lw-dart-score">😂 <strong>PHOENIX EXCUSE GENERATOR</strong> · Score 0 · Round 1/5</div><div class="lw-dart-msg">Is that a genuine Phoenix excuse or complete nonsense? 🚂</div><div class="lw-phoenix-stage"><div class="lw-phoenix-neon">MR PHOENIX<br><small>EXCUSE HQ</small></div><div class="lw-phoenix-character">🚂</div><div class="lw-phoenix-speech">Loading excuse...</div><div class="lw-phoenix-machine">⚙️</div></div><div class="lw-phoenix-controls"><button type="button" class="lw-phoenix-believe">👍 BELIEVE IT</button><button type="button" class="lw-phoenix-call">😂 CALL BULLSHIT</button><button type="button" class="lw-phoenix-reset">↻ NEW GAME</button></div>';
    c.innerHTML='';
    const scoreBox=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),character=o.querySelector('.lw-phoenix-character'),speech=o.querySelector('.lw-phoenix-speech'),believe=o.querySelector('.lw-phoenix-believe'),call=o.querySelector('.lw-phoenix-call'),reset=o.querySelector('.lw-phoenix-reset');
    const update=()=>{scoreBox.innerHTML='😂 <strong>PHOENIX EXCUSE GENERATOR</strong> · Score '+score+' · Round '+round+'/5';};
    const next=()=>{
      if(round>5){believe.disabled=true;call.disabled=true;msg.textContent='🏆 EXCUSE HQ CLOSED! Final score: '+score+'/5';return;}
      current=excuses[rand(excuses.length)-1];character.textContent=current[0];speech.textContent='“'+current[1]+'”';active=true;believe.disabled=false;call.disabled=false;msg.textContent='🤔 Genuine excuse... or Phoenix fiction?';
    };
    const decide=believable=>{
      if(!active)return;active=false;believe.disabled=true;call.disabled=true;
      const genuine=current[2]!=='🐕'&&current[2]!=='📦'&&current[2]!=='📡'&&current[2]!=='🚪';
      const correct=believable===genuine;
      if(correct){score++;msg.textContent=genuine?'🚂 Sounds suspiciously believable! Point to you.':'😂 BUSTED! Absolute Phoenix nonsense!';}
      else{msg.textContent=genuine?'😂 You called bullshit on a genuine excuse!':'🚨 You believed THAT?! Phoenix is laughing!';}
      update();round++;setTimeout(next,900);
    };
    believe.addEventListener('click',()=>decide(true));call.addEventListener('click',()=>decide(false));
    reset.addEventListener('click',()=>{score=0;round=1;active=false;next();update();});
    next();update();
  }
  else if(type==='bartab'){
    let score=0,round=1,active=false,estimate=0,guess=25;
    o.innerHTML='<div class="lw-dart-score">💷 <strong>BAR TAB CHALLENGE</strong> · Score 0 · Round 1/5</div><div class="lw-dart-msg">The tab is hidden. Can you estimate it within £5?</div><div class="lw-bartab-board"><div class="lw-bartab-sign">LIVE WIRE BAR</div><div class="lw-bartab-receipt"><div>🍺 LIVE WIRE TAB</div><hr><span class="lw-bartab-items">Loading...</span><strong class="lw-bartab-total">???</strong></div><div class="lw-bartab-mystery">💷</div></div><div class="lw-bartab-controls"><label>Your guess: £<input class="lw-bartab-guess" type="range" min="5" max="80" value="25" step="1"><output>£25</output></label><button type="button" class="lw-bartab-lock">🔒 LOCK GUESS</button><button type="button" class="lw-bartab-reset">↻ NEW GAME</button></div>';
    c.innerHTML='';
    const scoreBox=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),items=o.querySelector('.lw-bartab-items'),total=o.querySelector('.lw-bartab-total'),range=o.querySelector('.lw-bartab-guess'),out=o.querySelector('output'),lock=o.querySelector('.lw-bartab-lock'),reset=o.querySelector('.lw-bartab-reset');
    const itemSets=[['2 lagers','chips','cola'],['3 ciders','nachos','2 lemonades'],['4 pints','crisps','a packet of nuts'],['2 cocktails','3 lagers','chips'],['5 drinks','loaded fries','2 soft drinks'],['3 pints','wings','2 shots'],['2 burgers','4 pints','chips']];
    const update=()=>{scoreBox.innerHTML='💷 <strong>BAR TAB CHALLENGE</strong> · Score '+score+' · Round '+round+'/5';out.textContent='£'+guess;};
    range.addEventListener('input',()=>{guess=Number(range.value);out.textContent='£'+guess;});
    const next=()=>{
      if(round>5){lock.disabled=true;msg.textContent='🏆 TAB CHALLENGE COMPLETE! Final score: '+score+'/5';return;}
      estimate=rand(56)+9;items.textContent=itemSets[rand(itemSets.length)-1].join(' · ');total.textContent='???';active=true;lock.disabled=false;msg.textContent='🤔 What do you reckon the damage is?';
      guess=Math.min(80,Math.max(5,Math.round(estimate/5)*5));range.value=guess;out.textContent='£'+guess;
    };
    lock.addEventListener('click',()=>{
      if(!active)return;active=false;lock.disabled=true;total.textContent='£'+estimate;
      const diff=Math.abs(guess-estimate);
      if(diff<=3){score++;msg.textContent='🔥 Nailed it! Only £'+diff+' out!';}
      else if(diff<=5){score++;msg.textContent='🎯 Close enough! Within a fiver!';}
      else{msg.textContent='😂 The tab got away from you! Actual: £'+estimate;}
      update();round++;setTimeout(next,1000);
    });
    reset.addEventListener('click',()=>{score=0;round=1;active=false;next();update();});
    next();update();
  }
  else if(type==='jukeboxgamble'){
    let score=0,round=1,active=false;
    const tracks=[
      ['🎵','80s CLASSIC','Take a chance on a massive 80s floor-filler.','⭐','£8'],
      ['🎶','90s FLOOR FILLER','Could be the tune that gets the whole bar singing.','💿','£10'],
      ['🎧','00s THROWBACK','A nostalgic gamble from the noughties.','🔥','£12'],
      ['🪩','FORGOTTEN GEM','A deep cut that might secretly be brilliant.','💎','£15'],
      ['⚡','WILDCARD','Nobody knows what the jukebox will serve up!','⚡','£20']
    ];
    o.innerHTML='<div class="lw-dart-score">🎰 <strong>JUKEBOX GAMBLE</strong> · Score 0 · Round 1/5</div><div class="lw-dart-msg">Put your virtual coins in and gamble on the next tune!</div><div class="lw-jukebox"><div class="lw-jukebox-top">LIVE WIRE JUKEBOX</div><div class="lw-jukebox-screen">INSERT COIN<br><small>🎵 PICK YOUR GAMBLE 🎵</small></div><div class="lw-jukebox-disc">💿</div><div class="lw-jukebox-slots"><span>🍒</span><span>🎵</span><span>⚡</span></div><div class="lw-jukebox-lights">● ● ● ● ● ● ●</div></div><div class="lw-jukebox-options"></div><button type="button" class="lw-jukebox-reset">↻ NEW NIGHT</button>';
    c.innerHTML='';
    const scoreBox=o.querySelector('.lw-dart-score'),msg=o.querySelector('.lw-dart-msg'),screen=o.querySelector('.lw-jukebox-screen'),disc=o.querySelector('.lw-jukebox-disc'),slots=[...o.querySelectorAll('.lw-jukebox-slots span')],options=o.querySelector('.lw-jukebox-options'),reset=o.querySelector('.lw-jukebox-reset');
    const update=()=>scoreBox.innerHTML='🎰 <strong>JUKEBOX GAMBLE</strong> · Score '+score+' · Round '+round+'/5';
    const next=()=>{
      if(round>5){options.innerHTML='';msg.textContent='🏆 JUKEBOX CLOSED! Final score: '+score+'/5';screen.innerHTML='NIGHT COMPLETE<br><small>THANKS FOR PLAYING</small>';return;}
      options.innerHTML='';
      const q=tracks[rand(tracks.length)-1];
      screen.innerHTML=q[0]+' '+q[1]+'<br><small>Gamble value: '+q[4]+'</small>';
      const picks=[['PLAY IT','play'],['SKIP IT','skip']];
      picks.forEach(([label,action])=>{const b=document.createElement('button');b.type='button';b.textContent=action==='play'?'▶ '+label:'⏭ '+label;b.addEventListener('click',()=>decide(action==='play',b,q));options.appendChild(b);});
      msg.textContent='🤔 Would you play this tune or skip the gamble?';active=true;update();
    };
    const decide=(play,b,q)=>{
      if(!active)return;active=false;options.querySelectorAll('button').forEach(x=>x.disabled=true);
      slots.forEach((x,i)=>{x.textContent=i===0?q[0]:i===1?q[2]:q[3];});
      b.classList.add(play?'correct':'wrong');
      const jackpot=play&&q[3]==='⚡';
      if(jackpot){score+=2;msg.textContent='⚡ JACKPOT! The wildcard absolutely smashed it!';}
      else if(play){score++;msg.textContent='🎶 BANGER! Your gamble paid off!';}
      else{msg.textContent='😂 SKIPPED! You may have just skipped a classic!';}
      disc.textContent=play?'🎶':'💿';round++;update();setTimeout(next,1000);
    };
    reset.addEventListener('click',()=>{score=0;round=1;active=false;disc.textContent='💿';slots.forEach(x=>x.textContent='•');next();update();});
    next();update();
  }
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