(()=>{
'use strict';
const scheduleForDate=date=>{
  const d=date.getDay();
  const iso=date.toISOString().slice(0,10);
  if(d===3){
    if(iso>='2026-10-14'&&iso<='2026-10-28')return [];
    return [['The Wednesday Wire with DJ Disco Dan','8:00pm']];
  }
  if(d===4)return [['Surprise Package Thursdays with Mr Phoenix','8:00pm']];
  if(d===5){
    if(iso>='2026-10-14'&&iso<='2026-10-28')return [];
    return [['Feel Good Friday with DJ Disco Dan','7:30pm']];
  }
  if(d===6)return [['The Music Train with Mr Phoenix','8:00pm']];
  return [];
};
const minsNow=()=>{const n=new Date();return n.getHours()*60+n.getMinutes()};
const nextShow=now=>{
  for(let i=1;i<=14;i++){
    const d=new Date(now);d.setDate(now.getDate()+i);
    const s=scheduleForDate(d);
    if(s.length)return {show:s[0],days:i};
  }
  return null;
};
const setup=()=>{
  const box=document.querySelector('.status-box');
  const pill=document.getElementById('statusPill');
  const title=document.getElementById('statusTitle');
  const time=document.getElementById('statusTime');
  const note=document.getElementById('statusNote');
  if(!box||!pill||!title||!time)return false;
  let next=box.querySelector('.lw-next-up');
  if(!next){
    next=document.createElement('div');
    next.className='lw-next-up';
    next.innerHTML='<div class="lw-next-label">🚀 NEXT UP</div><div class="lw-next-title"></div><div class="lw-next-time"></div>';
    box.appendChild(next);
  }
  const nextTitle=next.querySelector('.lw-next-title');
  const nextTime=next.querySelector('.lw-next-time');
  const refresh=()=>{
    const now=new Date();
    const d=now.getDay();
    const mins=minsNow();
    const today=scheduleForDate(now);
    const show=today[0];
    const isLive=!!show && ((d===3&&mins>=1200&&mins<1320)||(d===4&&mins>=1200&&mins<1320)||(d===5&&mins>=1170&&mins<1380)||(d===6&&mins>=1200&&mins<1380));
    const startMins = show ? (d===3||d===4 ? 1200 : d===5 ? 1170 : 1200) : 0;
    const endMins = show ? (d===3||d===4 ? 1320 : d===5 ? 1380 : 1380) : 0;
    // Keep tonight's show name after the advertised start time too, so a late
    // start never makes the box jump to the next day. Once the show finishes
    // early, the real stream status can move it on; without stream detection,
    // keep the scheduled show visible rather than falsely skipping it.
    const isTonight=!!show && mins<startMins;
    const isAfterStart=!!show && mins>=startMins;
    pill.classList.toggle('live',isLive);
    if(isLive){
      pill.textContent='🔴 LIVE NOW';
      title.textContent=show[0];
      time.textContent='ON AIR NOW • Scheduled from '+show[1];
      if(note)note.textContent='On Live Wire ⚡️';
    }else if(isTonight){
      pill.textContent='🟢 TONIGHT';
      title.textContent=show[0];
      time.textContent='Tonight • '+show[1];
      if(note)note.textContent='On Live Wire ⚡️';
    }else if(isAfterStart){
      pill.textContent='🟢 TONIGHT';
      title.textContent=show[0];
      time.textContent='Tonight • '+show[1];
      if(note)note.textContent='On Live Wire ⚡️';
    }else{
      pill.textContent='🟢 NEXT UP';
      const n=nextShow(now);
      if(n){title.textContent=n.show[0];time.textContent=(n.days===1?'Tomorrow':'In '+n.days+' days')+' • '+n.show[1];}
      if(note)note.textContent='On Live Wire ⚡️';
    }
    const n=nextShow(now);
    if(n){
      next.style.display='block';
      nextTitle.textContent=n.show[0];
      nextTime.textContent=(n.days===1?'Tomorrow':'In '+n.days+' days')+' • '+n.show[1];
    }else next.style.display='none';
  };
  if(!document.getElementById('lw-status-enhancer-style')){
    const style=document.createElement('style');style.id='lw-status-enhancer-style';style.textContent='.lw-next-up{margin:26px auto 0;padding:18px 16px;border:1px solid rgba(0,234,255,.55);border-radius:18px;background:rgba(0,234,255,.045);text-align:center;box-shadow:0 0 14px rgba(0,234,255,.1)}.lw-next-label{font-weight:900;color:#ffd43b;font-size:15px;letter-spacing:1px;margin-bottom:8px}.lw-next-title{font-size:21px;font-weight:900;color:#fff}.lw-next-time{margin-top:6px;color:#58eaff;font-weight:800}';document.head.appendChild(style);
  }
  refresh();setInterval(refresh,30000);return true;
};
if(!setup()){let tries=0;const timer=setInterval(()=>{if(setup()||++tries>40)clearInterval(timer)},100)}
})();