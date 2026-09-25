(() => {
'use strict';

/*
  Live Wire Fun & Extras controls
  Fresh-content system:
  - Large content pools
  - No repeat until the relevant pool is exhausted
  - Remembers used items between visits with localStorage
*/

const STORAGE_PREFIX = 'lwFreshV3:';

function loadUsed(key, length) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    const used = raw ? JSON.parse(raw) : [];
    return Array.isArray(used) ? used.filter(i => Number.isInteger(i) && i >= 0 && i < length) : [];
  } catch (_) {
    return [];
  }
}

function saveUsed(key, used) {
  try { localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(used)); } catch (_) {}
}

function pickFresh(key, arr) {
  if (!Array.isArray(arr) || !arr.length) return '';
  let used = loadUsed(key, arr.length);
  let available = arr.map((_, i) => i).filter(i => !used.includes(i));
  if (!available.length) {
    used = [];
    available = arr.map((_, i) => i);
  }
  const index = available[Math.floor(Math.random() * available.length)];
  used.push(index);
  saveUsed(key, used);
  return arr[index];
}

const memories = [
  ['50s','Jukeboxes, rock ’n’ roll beginnings and the records that made people stop pretending they could sit still.'],
  ['50s','The birth of the teenager as a music fan, with radios and records becoming the soundtrack of everyday life.'],
  ['60s','Beatlemania, transistor radios and songs that still have people joining in decades later.'],
  ['60s','Motown, soul and pop hooks that somehow refuse to age.'],
  ['60s','The decade when music, fashion and youth culture decided to turn the volume up.'],
  ['70s','Disco lights, huge melodies and records that practically demand a dance floor.'],
  ['70s','Classic rock, soul and unforgettable choruses from one seriously musical decade.'],
  ['70s','The decade of vinyl sleeves, Saturday-night dancing and songs everybody seems to know.'],
  ['80s','Synths, giant choruses, Top of the Pops memories and absolutely no shame about the hair.'],
  ['80s','Power ballads, pop icons and enough neon to make Live Wire feel right at home.'],
  ['80s','Mixtapes, cassette players and the eternal battle to record the radio without the DJ talking over it.'],
  ['80s','Big drums, big hair and even bigger singalong moments.'],
  ['90s','Britpop, dance anthems, CDs and the decade that could somehow make every song nostalgic.'],
  ['90s','The golden age of music videos, chart battles and tunes everyone remembers from somewhere.'],
  ['90s','Rave culture, girl groups, boy bands and a very healthy amount of denim.'],
  ['90s','The decade when mixtapes became CDs and the bedroom stereo became mission control.'],
  ['00s','MP3 players, ringtone charts and songs that instantly transport you back to the noughties.'],
  ['00s','Pop-punk, indie nights and the era of burning a CD for absolutely every occasion.'],
  ['00s','Music videos, reality TV chart battles and the first generation of proper digital music fans.'],
  ['00s','The decade where “I’ve got that song on my iPod” solved basically every argument.'],
  ['10s','Festival anthems, streaming playlists and modern classics that quickly became singalongs.'],
  ['10s','The decade of huge collaborations, dance-pop and songs built for a packed floor.'],
  ['10s','From indie throwbacks to massive pop hooks, the 2010s had something for everyone.'],
  ['10s','The playlist era arrived properly — and suddenly everyone became their own DJ.'],
  ['20s','Streaming, viral hits and old favourites finding completely new audiences.'],
  ['20s','Modern pop meets nostalgia as new artists borrow sounds from decades gone by.'],
  ['20s','The decade where a forgotten classic can suddenly become everybody’s favourite again.'],
  ['20s','A musical world where the next big tune can appear from absolutely anywhere.']
];

const songs = {
  '50s':[
    'Chuck Berry — Johnny B. Goode','Elvis Presley — Jailhouse Rock','Buddy Holly — That’ll Be The Day',
    'Little Richard — Tutti Frutti','The Everly Brothers — Wake Up Little Susie','Jerry Lee Lewis — Great Balls of Fire',
    'Ritchie Valens — La Bamba','Fats Domino — Blueberry Hill','Eddie Cochran — Summertime Blues',
    'The Platters — The Great Pretender','Bill Haley & His Comets — Rock Around the Clock','Dion — Runaround Sue'
  ],
  '60s':[
    'The Beatles — Twist and Shout','The Supremes — You Can’t Hurry Love','The Kinks — You Really Got Me',
    'The Beach Boys — Good Vibrations','The Rolling Stones — Paint It Black','The Monkees — I’m a Believer',
    'The Animals — House of the Rising Sun','The Who — My Generation','Aretha Franklin — Respect',
    'The Foundations — Build Me Up Buttercup','The Temptations — My Girl','The Mamas & the Papas — California Dreamin’'
  ],
  '70s':[
    'ABBA — Dancing Queen','Queen — Don’t Stop Me Now','The Jacksons — Blame It on the Boogie',
    'Earth, Wind & Fire — September','Fleetwood Mac — Go Your Own Way','Elton John — Crocodile Rock',
    'David Bowie — Starman','The Bee Gees — Night Fever','Gloria Gaynor — I Will Survive',
    'The Trammps — Disco Inferno','Stevie Wonder — Superstition','The Knack — My Sharona'
  ],
  '80s':[
    'Bon Jovi — Livin’ on a Prayer','Tears for Fears — Everybody Wants to Rule the World',
    'Whitney Houston — I Wanna Dance with Somebody','a-ha — Take on Me','Duran Duran — Rio',
    'Cyndi Lauper — Girls Just Want to Have Fun','George Michael — Faith','Madonna — Into the Groove',
    'Rick Astley — Never Gonna Give You Up','The Human League — Don’t You Want Me',
    'Katrina and the Waves — Walking on Sunshine','The Pointer Sisters — Jump (For My Love)'
  ],
  '90s':[
    'Oasis — Don’t Look Back in Anger','The Spice Girls — Wannabe','Snap! — Rhythm Is a Dancer',
    'Blur — Song 2','The Prodigy — Firestarter','Shania Twain — Man! I Feel Like a Woman!',
    'Corona — The Rhythm of the Night','No Doubt — Don’t Speak','Backstreet Boys — Everybody',
    'Vengaboys — We Like to Party!','Britney Spears — ...Baby One More Time','Chumbawamba — Tubthumping'
  ],
  '00s':[
    'The Killers — Mr. Brightside','Shakira — Hips Don’t Lie','Kings of Leon — Sex on Fire',
    'OutKast — Hey Ya!','Gorillaz — Feel Good Inc.','Rihanna — Umbrella',
    'The Black Eyed Peas — I Gotta Feeling','Scissor Sisters — I Don’t Feel Like Dancin’',
    'Paolo Nutini — New Shoes','Take That — Shine','Kaiser Chiefs — Ruby','The Fratellis — Chelsea Dagger'
  ],
  '10s':[
    'Mark Ronson ft. Bruno Mars — Uptown Funk','The Weeknd — Blinding Lights','Dua Lipa — Don’t Start Now',
    'Avicii — Wake Me Up','Ed Sheeran — Shape of You','Taylor Swift — Shake It Off',
    'Walk the Moon — Shut Up and Dance','Pharrell Williams — Happy','George Ezra — Shotgun',
    'Clean Bandit — Rather Be','Daft Punk ft. Pharrell Williams — Get Lucky','Bruno Mars — Locked Out of Heaven'
  ],
  '20s':[
    'Harry Styles — As It Was','Dua Lipa — Levitating','The Weeknd — Save Your Tears',
    'Olivia Rodrigo — good 4 u','Miley Cyrus — Flowers','Sabrina Carpenter — Espresso',
    'Chappell Roan — Good Luck, Babe!','Tate McRae — greedy','Benson Boone — Beautiful Things',
    'Billie Eilish — Birds of a Feather','Lady Gaga — Abracadabra','Hozier — Too Sweet'
  ]
};

const banter = [
  'WELCOME TO THE LIVE WIRE BAR. PLEASE LEAVE YOUR SERIOUS FACE AT THE DOOR. 😂⚡',
  'ONE MORE TUNE? THAT’S HOW IT STARTS. THREE HOURS LATER… 😂',
  'THE MUSIC IS LOUD, THE BANTER IS LOUDER. 🍹⚡',
  'YOU’RE NOT LATE. YOU’RE JUST ARRIVING ON LIVE WIRE TIME. 😂',
  'SOMEONE SAY NICKELBACK? MR PHOENIX HAS ENTERED THE CHAT. 🎸😂',
  'PULL UP A STOOL, TURN IT UP AND ENJOY THE RIDE. 🍹🎶',
  'LIVE WIRE RULE #1: THERE IS ALWAYS TIME FOR ONE MORE SONG. ⚡',
  'SOMEONE HAS REQUESTED A TUNE AND NOW THE DEBATE HAS STARTED. 😂',
  'THE JUKEBOX HAS OPINIONS. WE’RE NOT RESPONSIBLE FOR THEM. 🎵',
  'DAN HAS FOUND ANOTHER SONG HE “JUST HAS TO PLAY”. 😂',
  'PHOENIX HAS ENTERED THE CHAT… HIDE THE NICKELBACK BUTTON. 🎸',
  'THE LIVE WIRE BAR IS OPEN FOR BANter. THE SPELLING IS CLOSED. 😂',
  'SOMEONE JUST SAID “I HAVEN’T HEARD THIS IN YEARS!” — NOSTALGIA ALERT. 💿',
  'THE CHAT HAS VOTED. THE DJ HAS OTHER IDEAS. 😂⚡',
  'THAT WAS SUPPOSED TO BE THE LAST TUNE. APPARENTLY NOT. 🎶',
  'A FORGOTTEN GEM HAS BEEN FOUND IN THE MUSICAL ATTIC. 💎',
  'SOMEONE IS SINGING. WHETHER THEY KNOW THE WORDS IS ANOTHER MATTER. 😂',
  'THE MUSIC TRAIN HAS LEFT THE STATION. PLEASE KEEP ARMS INSIDE THE CARRIAGE. 🚂',
  'SERIOUS JOCKIN IS APPROACHING. ALL EXCUSES WILL BE IGNORED. 🔥',
  'MIDNIGHT MAGIC HAS BEEN DETECTED. 🌙⚡',
  'SOMEONE HAS JUST USED THE PHRASE “ONE MORE”. WE ALL KNOW WHAT THAT MEANS. 😂',
  'THE LIVE WIRE FAMILY HAS ARRIVED. NOW THE CHAOS CAN BEGIN. 💜⚡',
  'WHO GAVE DAN ACCESS TO THE JUKEBOX AGAIN? 😂',
  'WHO GAVE PHOENIX THE NICKELBACK BUTTON? THIS NEEDS INVESTIGATING. 🎸',
  'THE DECADE HAS CHANGED. THE HAIR HAS NOT. 😂',
  'A TUNE FROM YOUR NAN’S ERA HAS JUST APPEARED. YOU KNOW YOU LOVE IT. ❤️',
  'SOMEONE HAS REQUESTED A CLASSIC AND EVERYONE SUDDENLY BECAME A DJ. 😂',
  'THE BAR STAFF HAVE LOST CONTROL OF THE DANCE FLOOR. 🕺',
  'THE CHAT HAS BECOME A MUSIC QUIZ WITHOUT WARNING. 🎤',
  'SOMEONE JUST SAID “THAT’S MY SONG!” AGAIN. 😂',
  'THE VOLUME IS UP. THE NEIGHBOURS HAVE BEEN INFORMED. PROBABLY. 😂',
  'A VINYL MEMORY HAS ENTERED THE BUILDING. 💿',
  'THE DJ HAS CHANGED THE TUNE. HALF THE CHAT APPROVES. THE OTHER HALF LIES. 😂',
  'THE MUSIC TRAIN IS RUNNING LATE DUE TO EXCESSIVE BANTER. 🚂',
  'THE FORGOTTEN GEM DEPARTMENT IS WORKING OVERTIME. 💎',
  'SOMEONE HAS STARTED A SINGALONG. NO ONE KNOWS WHO GAVE PERMISSION. 🎤',
  'LIVE WIRE WEATHER REPORT: 100% CHANCE OF TUNES. ⚡',
  'DAN HAS FOUND A TUNE WITH A 7-MINUTE INTRO. EVERYONE PANIC. 😂',
  'PHOENIX SAYS THIS IS THE BEST SONG EVER. THE CHAT REQUESTS EVIDENCE. 😂',
  'THE JUKEBOX HAS SPOKEN. WE ARE NOW OBLIGED TO DANCE. 🕺',
  'THE LIVE WIRE FAMILY HAVE ARRIVED IN FORCE. 💜⚡',
  'A CLASSIC HAS BEEN SPOTTED IN THE WILD. 🎶',
  'SOMEONE HAS JUST DISCOVERED A SONG THEY FORGOT THEY LOVED. 😂',
  'THE BANTER METER HAS LEFT THE BUILDING. 🔥',
  'ONE TUNE TURNED INTO FIVE. CLASSIC LIVE WIRE. 😂',
  'THE CHAT IS NOW 50% MUSIC EXPERTS AND 50% LYRIC GUESSERS. 😂',
  'THE DJ HAS BEEN GIVEN “FREEDOM”. THIS MAY HAVE BEEN A MISTAKE. ⚡',
  'A DANCE FLOOR EMERGENCY HAS BEEN DECLARED. 🚨🕺',
  'THE NOSTALGIA BUTTON HAS BEEN PRESSED. THERE IS NO GOING BACK. 💿',
  'THE LIVE WIRE BAR HAS RUN OUT OF SERIOUSNESS. 😂🍹',
  'SOMEONE HAS ASKED FOR THE SAME TUNE AGAIN. WE RESPECT THE COMMITMENT. 😂',
  'THE CHAT HAS FOUND ANOTHER 90s BANGER. 🚀',
  'THE 80s DEPARTMENT HAS REQUESTED MORE SYNTHS. 🎹',
  'THE 70s DEPARTMENT HAS REQUESTED MORE DISCO. 🪩',
  'THE 00s DEPARTMENT HAS REQUESTED MORE SINGALONGS. 🎤',
  'THE 20s DEPARTMENT HAS REQUESTED SOMETHING THE DJ HAS NEVER HEARD OF. 😂',
  'THE LIVE WIRE FAMILY HAVE SPOKEN. NOW LET THE TUNES DO THE TALKING. 💜⚡'
];

const destinations = [
  '80s Avenue','90s Junction','70s Disco Street','60s Memory Lane','00s Boulevard',
  'Rock ’n’ Roll Road','Dancefloor Central','Forgotten Gem Station','Singalong Square',
  'Vinyl Village','Neon Nights','Top of the Pops Terrace','Cassette Corner',
  'Britpop Bridge','Disco Drive','Nostalgia North','Anthem Avenue','Jukebox Junction',
  'One More Tune Way','Serious Jockin Station','Midnight Magic Central','Pop Street',
  'Soul Side','Guitar Lane','Synth City','Chartbuster Crescent','Retro Road',
  'Dancefloor Depot','Live Wire Lane','Good Vibes Gardens'
];

const fridayMoods = [
  ['FEEL-GOOD MODE: ACTIVATED 🎧','You’re ready for big tunes, good vibes and a proper Friday night in the Live Wire Bar. 🍹⚡'],
  ['NOSTALGIA MODE: ON 💿','Take a trip through the decades. Vinyl memories, Top of the Pops moments and tunes you forgot you loved.'],
  ['FORGOTTEN GEM MODE 💎','Tonight calls for a tune that has been hiding in the musical cupboard for far too long.'],
  ['SERIOUS JOCKIN MODE 🔥','It’s time for an hour of non-stop music and absolutely NO TALKING.'],
  ['MIDNIGHT MAGIC MODE 🌙','You’ve made it past midnight. Now the night gets that little bit more magical.'],
  ['LIVE WIRE BAR MODE 🍹','Pull up a stool, turn the music up and let the Live Wire Bar do what it does best.'],
  ['SINGALONG MODE 🎤','You know the words. Everyone knows you know the words. BELTER O’CLOCK! 😂'],
  ['DANCEFLOOR MODE 🕺','Clear some space. This one has absolutely no business being listened to sitting down.'],
  ['DECADE HOPPER MODE 🚂','Tonight you’re travelling from the 50s to the 20s without needing a ticket.'],
  ['CLASSIC MODE 💿','Give me a tune everybody knows before somebody starts pretending they don’t.'],
  ['BIG CHORUS MODE 🎶','The sort of song where the chorus somehow gets louder every time.'],
  ['PARTY STARTER MODE 🔥','No complicated plan required. Just press play and enjoy yourself.'],
  ['OLD SCHOOL MODE 📻','Radio memories, familiar voices and the tunes that made the old days sound brilliant.'],
  ['MODERN THROWBACK MODE 📱','A newer classic has been selected. Yes, it is already nostalgic. 😂'],
  ['DJ DISCO DAN MODE ⚡','The musical cupboards are open. Who knows what tune is coming out next?'],
  ['PHOENIX PROVOCATION MODE 🎸','Somebody mention Nickelback and stand well back. 😂'],
  ['ONE MORE TUNE MODE 🔁','You were going to call it a night. Then somebody said “one more”.'],
  ['CHAT CHOICE MODE 💬','The Live Wire family are in charge. The jukebox is taking requests from the vibes.'],
  ['HAPPY FEET MODE 🪩','If your feet start moving by themselves, that’s completely normal.'],
  ['WEEKEND COUNTDOWN MODE ⏰','The week is nearly done. Time for music that feels like freedom.']
];

const nightText = {
  Wednesday:'The Wednesday Wire with DJ Disco Dan — when this show is active. ⚡',
  Thursday:'Surprise Package with Mr Phoenix — when this show is active. 🎁',
  Friday:'Feel Good Friday with DJ Disco Dan — when this show is active. 🎧',
  Saturday:'Saturday programming depends on the current Live Wire schedule. 🚂'
};

const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
};

const setHtml = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
};

function visualHit(id, extraClass) {
  const el = document.getElementById(id);
  if (!el) return;
  const card = el.closest('.fun-card');
  if (card) {
    card.classList.remove('is-active');
    void card.offsetWidth;
    card.classList.add('is-active');
    clearTimeout(card._lwVisualTimer);
    card._lwVisualTimer = setTimeout(() => card.classList.remove('is-active'), 650);
  }
  el.classList.remove('visual-pop');
  void el.offsetWidth;
  el.classList.add('visual-pop');
  if (extraClass) {
    el.classList.remove(extraClass);
    void el.offsetWidth;
    el.classList.add(extraClass);
  }
}

function selectDecadeButton(target) {
  document.querySelectorAll('#decadeButtons .fun-btn').forEach(btn => btn.classList.remove('is-selected'));
  target.classList.add('is-selected');
}


function handleClick(event) {
  const target = event.target instanceof Element ? event.target.closest('button') : null;
  if (!target) return;

  const id = target.id;

  if (id === 'memoryBtn') {
    event.preventDefault();
    event.stopImmediatePropagation();
    const m = pickFresh('music-memory', memories);
    setHtml('memoryResult',
      '<div class="memory-year">' + m[0] + ' MUSIC MEMORY</div>' +
      '<div class="memory-song">' + m[1] + '</div>');
    visualHit('memoryResult');
    return;
  }

  if (target.parentElement && target.parentElement.id === 'decadeButtons') {
    event.preventDefault();
    event.stopImmediatePropagation();
    const dec = target.textContent.trim();
    selectDecadeButton(target);
    if (songs[dec]) {
      setHtml('songResult',
        '<div class="memory-year">LIVE WIRE JUKEBOX • ' + dec + '</div>' +
        '<div class="memory-song">' + pickFresh('jukebox-' + dec, songs[dec]) + '</div>');
      visualHit('songResult');
    }
    return;
  }

  if (id === 'fridayMoodBtn') {
    event.preventDefault();
    event.stopImmediatePropagation();
    const m = pickFresh('friday-moods', fridayMoods);
    setText('fridayMood', m[0]);
    setText('fridaySub', m[1]);
    visualHit('fridayMood');
    return;
  }

  if (id === 'banterBtn') {
    event.preventDefault();
    event.stopImmediatePropagation();
    setText('banterText', pickFresh('banter-box', banter));
    visualHit('banterText');
    return;
  }

  if (id === 'trainBtn') {
    event.preventDefault();
    event.stopImmediatePropagation();
    setText('destination', 'NEXT STOP: ' + pickFresh('train-destinations', destinations).toUpperCase());
    visualHit('destination');
    const trainLine = document.querySelector('.train-line');
    if (trainLine) { trainLine.classList.remove('visual-speed'); void trainLine.offsetWidth; trainLine.classList.add('visual-speed'); }
    return;
  }

  if (target.classList.contains('night') && target.dataset.night) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const night = target.dataset.night;
    document.querySelectorAll('.night-buttons .night').forEach(btn => btn.classList.toggle('is-selected', btn === target));
    setText('selectedNight', night + ': ' + (nightText[night] || 'Live Wire night selected. ⚡'));
    visualHit('selectedNight');
  }
}

document.addEventListener('click', handleClick, true);
})();