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
 ['🪑 VIP Table Generator','vip']
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