(() => {
'use strict';

/*
  Live Wire Fun & Extras controls
  This script owns the non-Arcade interactive controls only.
  The Arcade is intentionally left alone.
*/

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

const memories = [
  ['50s','Rock ’n’ roll beginnings, jukeboxes and the records that started something massive.'],
  ['60s','The sound of vinyl, transistor radios and songs that still get everyone singing.'],
  ['70s','Big melodies, disco nights and records that practically demand a dance floor.'],
  ['80s','Synths, huge choruses, Top of the Pops memories and absolutely no shame about the hair.'],
  ['90s','CDs, dance anthems, Britpop and the decade that could somehow make every song nostalgic.'],
  ['00s','MP3 players, ringtone charts and tunes that instantly transport you back to the noughties.'],
  ['10s','Festival anthems, modern classics and songs that became instant Live Wire favourites.']
];

const songs = {
  '50s':['Chuck Berry — Johnny B. Goode','Elvis Presley — Jailhouse Rock','Buddy Holly — That’ll Be The Day'],
  '60s':['The Beatles — Twist and Shout','The Supremes — You Can’t Hurry Love','The Kinks — You Really Got Me'],
  '70s':['ABBA — Dancing Queen','Queen — Don’t Stop Me Now','The Jacksons — Blame It on the Boogie'],
  '80s':['Bon Jovi — Livin’ on a Prayer','Tears for Fears — Everybody Wants to Rule the World','Whitney Houston — I Wanna Dance with Somebody'],
  '90s':['Oasis — Don’t Look Back in Anger','The Spice Girls — Wannabe','Snap! — Rhythm Is a Dancer'],
  '00s':['The Killers — Mr. Brightside','Shakira — Hips Don’t Lie','Kings of Leon — Sex on Fire'],
  '10s':['Mark Ronson ft. Bruno Mars — Uptown Funk','The Weeknd — Blinding Lights','Dua Lipa — Don’t Start Now']
};

const banter = [
  'WELCOME TO THE LIVE WIRE BAR. PLEASE LEAVE YOUR SERIOUS FACE AT THE DOOR. 😂⚡',
  'ONE MORE TUNE? THAT’S HOW IT STARTS. THREE HOURS LATER… 😂',
  'THE MUSIC IS LOUD, THE BANTER IS LOUDER. 🍹⚡',
  'YOU’RE NOT LATE. YOU’RE JUST ARRIVING ON LIVE WIRE TIME. 😂',
  'SOMEONE SAY NICKELBACK? MR PHOENIX HAS ENTERED THE CHAT. 🎸😂',
  'PULL UP A STOOL, TURN IT UP AND ENJOY THE RIDE. 🍹🎶',
  'LIVE WIRE RULE #1: THERE IS ALWAYS TIME FOR ONE MORE SONG. ⚡'
];

const destinations = [
  '80s Avenue','90s Junction','70s Disco Street','60s Memory Lane',
  '00s Boulevard','Rock ’n’ Roll Road','Dancefloor Central',
  'Forgotten Gem Station','Singalong Square'
];

const fridayMoods = [
  ['FEEL-GOOD MODE: ACTIVATED 🎧','You’re ready for big tunes, good vibes and a proper Friday night in the Live Wire Bar. 🍹⚡'],
  ['NOSTALGIA MODE: ON 💿','Take a trip through the decades. Vinyl memories, Top of the Pops moments and tunes you forgot you loved.'],
  ['FORGOTTEN GEM MODE 💎','Tonight calls for a tune that has been hiding in the musical cupboard for far too long. Ham Bag Tune Dig incoming!'],
  ['SERIOUS JOCKIN MODE 🔥','It’s 11pm somewhere… time for an hour of non-stop music and absolutely NO TALKING.'],
  ['MIDNIGHT MAGIC MODE 🌙','You’ve made it past midnight. Now the Friday night gets that little bit more magical.'],
  ['LIVE WIRE BAR MODE 🍹','Pull up a stool, turn the music up and let the Live Wire Bar do what it does best.'],
  ['SINGALONG MODE 🎤','You know the words. Everyone knows you know the words. BELTER O’CLOCK! 😂']
];

const nightText = {
  Wednesday:'The Wednesday Wire with DJ Disco Dan from around 8pm. ⚡',
  Thursday:'Surprise Package is paused while Mr Phoenix is away. 🎁',
  Friday:'Feel-good tunes, nostalgia and the weekend starting from 7:30pm. 🎧',
  Saturday:'Saturday Floor Fillers with DJ Disco Dan from 7:30pm while Mr Phoenix is away. 🚀'
};

const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
};

const setHtml = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
};

function handleClick(event) {
  const target = event.target instanceof Element ? event.target.closest('button') : null;
  if (!target) return;

  const id = target.id;

  if (id === 'memoryBtn') {
    event.preventDefault();
    event.stopImmediatePropagation();
    const m = pick(memories);
    setHtml('memoryResult',
      '<div class="memory-year">' + m[0] + ' MUSIC MEMORY</div>' +
      '<div class="memory-song">' + m[1] + '</div>');
    return;
  }

  if (target.parentElement && target.parentElement.id === 'decadeButtons') {
    event.preventDefault();
    event.stopImmediatePropagation();
    const dec = target.textContent.trim();
    if (songs[dec]) {
      setHtml('songResult',
        '<div class="memory-year">LIVE WIRE JUKEBOX • ' + dec + '</div>' +
        '<div class="memory-song">' + pick(songs[dec]) + '</div>');
    }
    return;
  }

  if (id === 'fridayMoodBtn') {
    event.preventDefault();
    event.stopImmediatePropagation();
    const m = pick(fridayMoods);
    setText('fridayMood', m[0]);
    setText('fridaySub', m[1]);
    return;
  }

  if (id === 'banterBtn') {
    event.preventDefault();
    event.stopImmediatePropagation();
    setText('banterText', pick(banter));
    return;
  }

  if (id === 'trainBtn') {
    event.preventDefault();
    event.stopImmediatePropagation();
    setText('destination', 'NEXT STOP: ' + pick(destinations).toUpperCase());
    return;
  }

  if (target.classList.contains('night') && target.dataset.night) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const night = target.dataset.night;
    setText('selectedNight', night + ': ' + (nightText[night] || 'Live Wire night selected. ⚡'));
  }
}

document.addEventListener('click', handleClick, true);
})();
