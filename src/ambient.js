// Plays the video's own audio, synced to scroll (forward and reversed).
const Amb=(()=>{
let ctx,master,fwd,rev,D=10,on=true,unl=false,lis=[],ready=false,src=null,last=null,lastMove=0,lastT=0,rate=1,pos=0;
async function build(){
  ctx=new (window.AudioContext||window.webkitAudioContext)();
  master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
  const u8=await (await fetch(import.meta.env.BASE_URL+'audio.mp3')).arrayBuffer();
  fwd=await ctx.decodeAudioData(u8);D=fwd.duration;
  rev=ctx.createBuffer(fwd.numberOfChannels,fwd.length,fwd.sampleRate);
  for(let c=0;c<fwd.numberOfChannels;c++){const a=fwd.getChannelData(c),b=rev.getChannelData(c),n=a.length;for(let i=0;i<n;i++)b[i]=a[n-1-i];}
  ready=true;
}
function emit(){lis.forEach(f=>f({on,run:!!ctx&&ctx.state==='running'}));}
function stop(){
  if(!src)return;const s=src;src=null;
  try{s.g.gain.setTargetAtTime(0,ctx.currentTime,.03);s.n.stop(ctx.currentTime+.2);}catch(e){}
}
function start(d,q){
  stop();
  const n=ctx.createBufferSource(),g=ctx.createGain();
  n.buffer=d>0?fwd:rev;g.gain.value=0;g.gain.setTargetAtTime(1,ctx.currentTime,.03);
  n.connect(g);g.connect(master);
  const off=Math.min(Math.max(d>0?q*D:(1-q)*D,0),D-.05);
  n.playbackRate.value=rate;n.start(0,off);src={n,g,d};pos=off;
}
return{
  init(){
    if(ctx)return;
    ctx=new (window.AudioContext||window.webkitAudioContext)();
    build();
    const ev=['pointerdown','keydown','touchend','click'];
    const g=()=>{if(ctx.state!=='running'){unl=true;setTimeout(()=>{unl=false},700);}ctx.resume();};
    ev.forEach(n=>window.addEventListener(n,g,{passive:true}));
    ctx.onstatechange=()=>{if(ctx.state==='running')ev.forEach(n=>window.removeEventListener(n,g));last=null;emit();};
    ctx.resume().catch(()=>{});
  },
  subscribe(f){lis.push(f);f({on,run:!!ctx&&ctx.state==='running'});return()=>{lis=lis.filter(x=>x!==f);};},
  toggle(){
    if(!ctx||unl)return;
    if(!on){on=true;ctx.resume();last=null;}
    else if(ctx.state!=='running'){ctx.resume();}
    else{on=false;master.gain.setTargetAtTime(0,ctx.currentTime,.1);stop();}
    emit();
  },
  // q = scroll-synced video progress 0..1, called every frame
  update(q){
    if(!on||!ready||ctx.state!=='running')return;
    const now=ctx.currentTime,dt=Math.max(now-lastT,.001);lastT=now;
    if(last===null){last=q;return;}
    const dq=q-last;last=q;
    if(Math.abs(dq)>1e-5){
      lastMove=now;const d=dq>0?1:-1;
      const inst=Math.abs(dq)*D/dt;
      rate+=(Math.min(Math.max(inst,.6),2.2)-rate)*.15;
      if(!src||src.d!==d)start(d,q);
      else{
        src.n.playbackRate.value=rate;pos+=rate*dt;
        if(Math.abs(pos-(d>0?q*D:(1-q)*D))>.5)start(d,q);
      }
      master.gain.setTargetAtTime(1,now,.05);
    }else if(now-lastMove>.12){
      master.gain.setTargetAtTime(0,now,.06);
      if(src&&now-lastMove>.5)stop();
    }
  }
};})();

export default Amb;
