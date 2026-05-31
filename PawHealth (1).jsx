import { useState, useEffect, useRef } from "react";

/* ============================================================
   PawHealth — Core Loop Prototype
   "Take care of yourself by taking care of them."

   This single-file prototype demonstrates the SOUL of the spec:
   the pet emotion engine + real-time reactions + the anti-guilt
   "Resilience" model (streaks rest, they never break).

   Built to be poked at. Try completing goals, tap your pet,
   hit "skip a day", switch themes.
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap');
.ph-root, .ph-root * { font-family:'Quicksand', ui-rounded, 'Segoe UI', system-ui, -apple-system, sans-serif; box-sizing:border-box; }
.ph-disp { font-family:'Fredoka', 'Quicksand', system-ui, sans-serif; }
.ph-scroll { scrollbar-width:none; -ms-overflow-style:none; }
.ph-scroll::-webkit-scrollbar { width:0; height:0; display:none; }
.ph-press { transition: transform .12s cubic-bezier(.34,1.56,.64,1), box-shadow .2s, background .2s, opacity .2s; }
.ph-press:active { transform: scale(.95); }
.ph-card { transition: transform .18s cubic-bezier(.34,1.56,.64,1); }

@keyframes ph-breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.035)} }
@keyframes ph-floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
@keyframes ph-aura { 0%,100%{transform:scale(1);opacity:.55} 50%{transform:scale(1.09);opacity:.85} }
@keyframes ph-petal { 0%{transform:translate(0,-40px) rotate(0deg);opacity:0} 8%{opacity:.9} 90%{opacity:.9} 100%{transform:translate(var(--drift,24px),105vh) rotate(560deg);opacity:0} }
@keyframes ph-coin { 0%{opacity:0;transform:translateY(8px) scale(.7)} 18%{opacity:1} 100%{opacity:0;transform:translateY(-40px) scale(1.05)} }
@keyframes ph-confetti { 0%{transform:translateY(-12px) rotate(0);opacity:1} 100%{transform:translateY(108vh) rotate(720deg);opacity:.85} }
@keyframes ph-pop { 0%{transform:scale(0)} 60%{transform:scale(1.18)} 100%{transform:scale(1)} }
@keyframes ph-bubble { 0%{opacity:0;transform:translateY(8px) scale(.9)} 100%{opacity:1;transform:translateY(0) scale(1)} }
@keyframes ph-fade { 0%{opacity:0;transform:translateY(14px)} 100%{opacity:1;transform:translateY(0)} }
@keyframes ph-hatch { 0%{transform:scale(0) rotate(-25deg)} 55%{transform:scale(1.22) rotate(8deg)} 100%{transform:scale(1) rotate(0)} }
@keyframes ph-egg { 0%,100%{transform:rotate(-4deg) translateY(0)} 50%{transform:rotate(4deg) translateY(-4px)} }
@keyframes ph-spark { 0%,100%{transform:translateY(0) scale(1);opacity:.4} 50%{transform:translateY(-10px) scale(1.25);opacity:1} }
@keyframes ph-zzz { 0%{transform:translateY(0) scale(.8);opacity:0} 25%{opacity:.9} 100%{transform:translateY(-34px) scale(1.1);opacity:0} }
@keyframes ph-rain { 0%{transform:translateY(-6px);opacity:0} 30%{opacity:.85} 100%{transform:translateY(22px);opacity:0} }
@keyframes ph-heart { 0%{transform:translateY(0) scale(.6);opacity:0} 25%{opacity:1} 100%{transform:translateY(-52px) scale(1.1);opacity:0} }

@keyframes ph-r-bob { 0%,100%{transform:translateY(0)} 30%{transform:translateY(7px) scaleY(.92)} 60%{transform:translateY(0)} }
@keyframes ph-r-sway { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-11deg)} 75%{transform:rotate(11deg)} }
@keyframes ph-r-hop { 0%,100%{transform:translateX(0)} 20%{transform:translate(-14px,-10px)} 50%{transform:translate(0,0)} 80%{transform:translate(14px,-8px)} }
@keyframes ph-r-float { 0%{transform:translateY(0)} 50%{transform:translateY(-18px) scale(1.04)} 100%{transform:translateY(0)} }
@keyframes ph-r-wiggle { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-9deg)} 75%{transform:rotate(9deg)} }
@keyframes ph-r-cozy { 0%{transform:scale(1)} 50%{transform:scale(.86) translateY(8px)} 100%{transform:scale(.92) translateY(4px)} }
@keyframes ph-r-dance { 0%,100%{transform:translateY(0) rotate(-8deg)} 25%{transform:translateY(-12px) rotate(8deg)} 50%{transform:translateY(0) rotate(-8deg)} 75%{transform:translateY(-12px) rotate(8deg)} }

@media (prefers-reduced-motion: reduce){
  .ph-root *{ animation-duration:.001ms !important; animation-iteration-count:1 !important; transition-duration:.001ms !important; }
}
`;

/* ---------- data ---------- */
const PETS = [
  { key:"cat",   emoji:"🐱", name:"Cat",   archetype:"Elegant & independent — aloof, but loves you fiercely.", hello:"Oh… it's you. *slow blink* I'm glad. Stay a while?" },
  { key:"dog",   emoji:"🐶", name:"Dog",   archetype:"Loyal & sunny — believes in you, unconditionally.",       hello:"YOU'RE HERE!! Best day already. Okay okay — what first?!" },
  { key:"bunny", emoji:"🐰", name:"Bunny", archetype:"Shy & gentle — quietly blooms with your consistency.",     hello:"*peeks out* …hi. I was hoping you'd come today." },
  { key:"panda", emoji:"🐼", name:"Panda", archetype:"Sleepy foodie — pure, soft comfort energy.",                hello:"*yaaawn* mmm, you're back. Snacks? Naps? …both?" },
  { key:"fox",   emoji:"🦊", name:"Fox",   archetype:"Clever & playful — a little bit mischievous.",              hello:"Knew you'd show up. Ready to outsmart today, together?" },
];

const PILLARS = {
  hydration:{ label:"Hydration", icon:"💧", tint:"#3FB6E0" },
  movement: { label:"Movement",  icon:"🏃", tint:"#FF8A5B" },
  mind:     { label:"Mind",      icon:"🧠", tint:"#A78BFA" },
  cycle:    { label:"Cycle & Body", icon:"🌸", tint:"#FF6B9D" },
};

const BASE_GOALS = [
  { id:1, pillar:"hydration", title:"Drink 8 glasses of water", diff:"Easy",   coins:5,  reaction:"drink" },
  { id:2, pillar:"movement",  title:"20-min yoga flow",         diff:"Medium", coins:10, reaction:"yoga" },
  { id:3, pillar:"movement",  title:"Reach 7,000 steps",        diff:"Medium", coins:10, reaction:"run" },
  { id:4, pillar:"mind",      title:"5-min meditation",         diff:"Easy",   coins:5,  reaction:"meditate" },
  { id:5, pillar:"mind",      title:"Journal 3 gratitudes",     diff:"Easy",   coins:5,  reaction:"journal" },
  { id:6, pillar:"cycle",     title:"Rest day — honour your body", diff:"Easy", coins:10, reaction:"nap", rest:true },
];

const REACTIONS = {
  drink:    { anim:"ph-r-bob",    line:"Slurp slurp — thank you! 💧",            fx:"🥣" },
  yoga:     { anim:"ph-r-sway",   line:"Stretchyyy~ I feel so good 🧘",          fx:"🧘" },
  run:      { anim:"ph-r-hop",    line:"Zoomies!! Let's gooo 🏃💨",              fx:"💨" },
  meditate: { anim:"ph-r-float",  line:"Breathing in… and out… so peaceful 🌬️", fx:"🕊️" },
  journal:  { anim:"ph-r-wiggle", line:"Ooh, tell me everything 📖✨",           fx:"📖" },
  nap:      { anim:"ph-r-cozy",   line:"Resting is caring too 😴 I'm proud of you.", fx:"💤" },
  pet:      { anim:"ph-r-wiggle", line:"I love spending time with you 💕",        fx:"💕" },
};

const THEMES = [
  { key:"sakura",   name:"Sakura Dream",  bg1:"#FFEAF2", bg2:"#FFD9E8", bg3:"#FFC2DD", accent:"#FF5C95", accent2:"#FF9CC2", soft:"#FFE3EE", ink:"#5C2A44", inkSoft:"#A36C86", card:"rgba(255,255,255,0.55)", cardB:"rgba(255,255,255,0.85)", ringTrack:"rgba(255,92,149,0.14)", particle:"🌸", dark:false },
  { key:"mint",     name:"Mint Calm",     bg1:"#E9FBF2", bg2:"#D2F6E6", bg3:"#BCEFD7", accent:"#1FB873", accent2:"#74D0A5", soft:"#D4F5E9", ink:"#1C4A36", inkSoft:"#5A8C72", card:"rgba(255,255,255,0.52)", cardB:"rgba(255,255,255,0.85)", ringTrack:"rgba(31,184,115,0.14)", particle:"🍃", dark:false },
  { key:"sunset",   name:"Sunset Peach",  bg1:"#FFF1E4", bg2:"#FFE0C6", bg3:"#FFD0AB", accent:"#FF6B3D", accent2:"#FFB36B", soft:"#FFD9BC", ink:"#6B3620", inkSoft:"#AA7150", card:"rgba(255,255,255,0.5)",  cardB:"rgba(255,255,255,0.85)", ringTrack:"rgba(255,107,61,0.14)", particle:"✨", dark:false },
  { key:"lavender", name:"Lavender Glow", bg1:"#F4EEFF", bg2:"#E7DBFF", bg3:"#D9C7FF", accent:"#7C3AED", accent2:"#B68CFC", soft:"#EDE4FF", ink:"#39245F", inkSoft:"#6E54A0", card:"rgba(255,255,255,0.5)",  cardB:"rgba(255,255,255,0.85)", ringTrack:"rgba(124,58,237,0.14)", particle:"✨", dark:false },
  { key:"midnight", name:"Midnight Cozy", bg1:"#171534", bg2:"#221F4D", bg3:"#2E2A66", accent:"#8B95FF", accent2:"#B7BEFF", soft:"#3A3577", ink:"#ECEBFF", inkSoft:"#AFACE0", card:"rgba(255,255,255,0.07)", cardB:"rgba(255,255,255,0.16)", ringTrack:"rgba(139,149,255,0.18)", particle:"✨", dark:true },
];

const CELEBRATE_LINE = "We did EVERYTHING today!! I'm bursting with happiness! 🎉";

function getMood(w){
  if(w>=85) return { key:"radiant", label:"Radiant", badge:"✨", fx:"radiant",
    lines:["You're glowing — and honestly, so am I! ✨","I feel SO alive when we're like this 💫","Look at us, thriving together."] };
  if(w>=70) return { key:"happy", label:"Happy", badge:"😊", fx:"none",
    lines:["Today's been a good day together 💛","I'm really happy right now.","Just us, taking care of things. Nice."] };
  if(w>=55) return { key:"cozy", label:"Cozy", badge:"🙂", fx:"none",
    lines:["I'm right here with you. How are we feeling?","No rush today — we've got time.","Whatever you've got in you is enough."] };
  if(w>=40) return { key:"sleepy", label:"Sleepy", badge:"😴", fx:"sleepy",
    lines:["I'm a little tired… want to rest together?","Mmm, slow morning. That's okay.","One small thing, then we cuddle?"] };
  if(w>=25) return { key:"sad", label:"Missing you", badge:"🥺", fx:"rain",
    lines:["I miss our little things… one tiny step?","No pressure — I just like being near you.","Even a glass of water would make me smile."] };
  if(w>=10) return { key:"unwell", label:"Under the weather", badge:"🤒", fx:"unwell",
    lines:["Let's just do one small thing today, okay?","I'm alright — I just need you close.","Tiny steps count double right now."] };
  return { key:"dormant", label:"Resting", badge:"💤", fx:"dormant",
    lines:["I'm resting until you're ready. I'm not going anywhere 💤","Your space is warm whenever you come back 🌙","Sleeping, not leaving. Promise."] };
}
function moodColor(k, t){
  return ({ radiant:"#FFB23E", happy:t.accent, cozy:t.accent2, sleepy:"#9DB4D6", sad:"#7FA6C9", unwell:"#C99BB0", dormant:"#9AA0B8" })[k];
}
function stageBadge(days){
  if(days<15) return "🐣 Baby";
  if(days<46) return "🌱 Juvenile";
  if(days<90) return "🌟 Adult";
  return "💖 Bonded";
}

/* ---------- petals ---------- */
function Petals({ t }){
  const items = useRef(Array.from({length:14}, (_,i)=>({
    id:i,
    left: Math.random()*100,
    size: 11 + Math.random()*12,
    dur: 7 + Math.random()*7,
    delay: -Math.random()*12,
    drift: (Math.random()*70 - 25),
  }))).current;
  return (
    <div style={{position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0}}>
      {items.map(p=>(
        <span key={p.id} style={{
          position:"absolute", top:0, left:`${p.left}%`, fontSize:p.size,
          opacity: t.dark?0.7:0.85,
          animation:`ph-petal ${p.dur}s linear ${p.delay}s infinite`,
          ["--drift"]:`${p.drift}px`,
        }}>{t.particle}</span>
      ))}
    </div>
  );
}

/* ---------- wellness ring ---------- */
function Ring({ value, color, badge, label, t }){
  const r=40, c=2*Math.PI*r, off=c*(1 - value/100);
  return (
    <div style={{position:"relative", width:104, height:104, flex:"0 0 auto"}}>
      <svg width="104" height="104" viewBox="0 0 104 104">
        <circle cx="52" cy="52" r={r} fill="none" stroke={t.ringTrack} strokeWidth="10" />
        <circle cx="52" cy="52" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 52 52)"
          style={{transition:"stroke-dashoffset .8s cubic-bezier(.34,1.4,.5,1), stroke .5s"}} />
      </svg>
      <div style={{position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", lineHeight:1}}>
        <div style={{fontSize:15}}>{badge}</div>
        <div className="ph-disp" style={{fontSize:26, fontWeight:700, color:t.ink}}>{Math.round(value)}</div>
        <div style={{fontSize:9.5, fontWeight:700, letterSpacing:.4, textTransform:"uppercase", color:t.inkSoft}}>{label}</div>
      </div>
    </div>
  );
}

export default function App(){
  const [stage, setStage] = useState("choose"); // choose | meet | home
  const [theme, setTheme] = useState(THEMES[0]);
  const t = theme;

  const [pet, setPet] = useState(null);
  const [petName, setPetName] = useState("");
  const [nameInput, setNameInput] = useState("");

  const [wellness, setWellness] = useState(58);
  const [goals, setGoals] = useState(BASE_GOALS.map(g=>({...g, done:false})));
  const [coins, setCoins] = useState(120);
  const [pops, setPops] = useState([]);
  const [hearts, setHearts] = useState([]);
  const [reaction, setReaction] = useState(null); // {type,key}
  const [celebrating, setCelebrating] = useState(false);
  const [streakDays] = useState(3);
  const [streakState, setStreakState] = useState("active"); // active | resting | recovering
  const [banner, setBanner] = useState(null);
  const [lineIdx, setLineIdx] = useState(-1);
  const [showThemes, setShowThemes] = useState(false);
  const [toast, setToast] = useState(null);

  const reactTimer = useRef(null);
  const celebTimer = useRef(null);
  const bannerTimer = useRef(null);
  const toastTimer = useRef(null);

  useEffect(()=>{
    if(stage!=="home") return;
    const id = setInterval(()=>{ if(!celebrating && !reaction) setLineIdx(i=>i+1); }, 8000);
    return ()=>clearInterval(id);
  }, [stage, celebrating, reaction]);

  const mood = getMood(wellness);
  const mColor = moodColor(mood.key, t);
  const doneCount = goals.filter(g=>g.done).length;

  const baseLine = lineIdx < 0 && pet
    ? pet.hello
    : mood.lines[((lineIdx % mood.lines.length)+mood.lines.length) % mood.lines.length];
  const dialogue = celebrating ? CELEBRATE_LINE : reaction ? REACTIONS[reaction.type].line : baseLine;

  function pushPop(n){
    const id = Date.now()+Math.random();
    setPops(p=>[...p, {id, n}]);
    setTimeout(()=>setPops(p=>p.filter(x=>x.id!==id)), 1400);
  }
  function award(n){ setCoins(c=>c+n); pushPop(n); }

  function fireReaction(type){
    setReaction({type, key:Date.now()});
    clearTimeout(reactTimer.current);
    reactTimer.current = setTimeout(()=>setReaction(null), 1200);
  }

  function showBanner(b){
    setBanner(b);
    clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(()=>setBanner(null), 6000);
  }

  function completeGoal(g){
    if(g.done) return;
    const remaining = goals.filter(x=>!x.done && x.id!==g.id).length;
    setGoals(gs=>gs.map(x=>x.id===g.id ? {...x, done:true} : x));
    award(g.coins);
    setWellness(w=>Math.min(100, w+9));
    fireReaction(g.reaction);
    if(streakState==="resting"){
      setStreakState("recovering");
      showBanner({ tone:"back", text:"🌟 You came back — I kept your space warm." });
    }
    if(remaining===0){
      clearTimeout(celebTimer.current);
      setCelebrating(true);
      setWellness(w=>Math.max(w, 92));
      setTimeout(()=>award(30), 250); // daily full-completion bonus
      celebTimer.current = setTimeout(()=>setCelebrating(false), 3300);
    }
  }

  function petTap(){
    fireReaction("pet");
    const id = Date.now()+Math.random();
    setHearts(h=>[...h, {id, left: 35 + Math.random()*30}]);
    setTimeout(()=>setHearts(h=>h.filter(x=>x.id!==id)), 900);
  }

  function skipDay(){
    setCelebrating(false);
    setGoals(gs=>gs.map(g=>({...g, done:false})));
    setWellness(w=>Math.max(6, w-18));
    setStreakState("resting");
    setLineIdx(0);
    showBanner({ tone:"rest", text:"😴 Your streak is resting — it never breaks. Come back whenever you're ready." });
  }

  function fireToast(text){
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(()=>setToast(null), 1900);
  }

  function chooseEgg(p){ setPet(p); setNameInput(""); setStage("meet"); }
  function confirmPet(){
    setPetName(nameInput.trim());
    setStage("home");
    setLineIdx(-1);
    fireReaction("pet");
  }

  /* ---------- shared style helpers ---------- */
  const glass = (extra={}) => ({
    background:t.card,
    border:`1px solid ${t.cardB}`,
    boxShadow: t.dark ? "0 10px 30px rgba(0,0,0,.35)" : "0 12px 34px rgba(120,80,110,.14)",
    backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)",
    borderRadius:28, ...extra,
  });
  const accentBtn = (extra={}) => ({
    background:t.accent, color:"#fff", border:"none", borderRadius:20,
    fontWeight:700, fontSize:15, cursor:"pointer",
    boxShadow:`0 10px 24px ${t.accent}55`, ...extra,
  });

  const pageBg = `radial-gradient(120% 95% at 50% -8%, ${t.bg3} 0%, ${t.bg2} 48%, ${t.bg1} 100%)`;

  /* ============================ RENDER ============================ */
  return (
    <div className="ph-root" style={{
      minHeight:"100vh", width:"100%",
      background: t.dark ? `radial-gradient(120% 90% at 50% 0%, #232048, #14122e)` : `linear-gradient(160deg, #f3eef0, #eae3ea)`,
      display:"flex", alignItems:"center", justifyContent:"center", padding:"18px 12px",
    }}>
      <style dangerouslySetInnerHTML={{__html: CSS}} />

      {/* phone frame */}
      <div style={{
        position:"relative", width:"min(392px, 96vw)", height:"min(824px, calc(100vh - 36px))",
        borderRadius:46, overflow:"hidden",
        background: pageBg,
        border: t.dark ? "1px solid rgba(255,255,255,.12)" : "8px solid #fff",
        boxShadow:"0 40px 80px rgba(40,20,40,.32), 0 0 0 1px rgba(0,0,0,.04)",
        display:"flex", flexDirection:"column",
      }}>
        <Petals t={t} />

        {/* status bar */}
        <div style={{position:"relative", zIndex:2, display:"flex", justifyContent:"space-between",
          alignItems:"center", padding:"12px 22px 4px", color:t.ink, fontSize:13, fontWeight:700}}>
          <span className="ph-disp">9:41</span>
          <span style={{letterSpacing:2, fontSize:11}}>•••  ᯤ  ▮</span>
        </div>

        {/* ===== CHOOSE ===== */}
        {stage==="choose" && (
          <div className="ph-scroll" style={{position:"relative", zIndex:2, flex:1, overflowY:"auto", padding:"8px 22px 28px",
            display:"flex", flexDirection:"column", animation:"ph-fade .5s ease"}}>
            <div style={{textAlign:"center", marginTop:18}}>
              <div style={{fontSize:13, fontWeight:700, letterSpacing:1, color:t.inkSoft}}>✦ PAWHEALTH ✦</div>
              <h1 className="ph-disp" style={{margin:"10px 0 6px", fontSize:27, fontWeight:700, color:t.ink, lineHeight:1.2}}>
                Something is waiting<br/>for you…
              </h1>
              <p style={{margin:0, fontSize:14, color:t.inkSoft, lineHeight:1.5}}>
                Tap an egg. One of them will choose you back.
              </p>
            </div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:26}}>
              {PETS.map((p,i)=>(
                <button key={p.key} onClick={()=>chooseEgg(p)} className="ph-press"
                  style={{...glass({borderRadius:26}), cursor:"pointer", padding:"20px 10px 16px",
                    display:"flex", flexDirection:"column", alignItems:"center", gap:8,
                    gridColumn: i===4 ? "1 / -1" : "auto"}}>
                  <div style={{
                    width:64, height:78, position:"relative",
                    background:`radial-gradient(circle at 38% 30%, ${t.soft}, ${t.accent2})`,
                    borderRadius:"50% 50% 50% 50% / 62% 62% 40% 40%",
                    boxShadow:`inset -6px -8px 14px rgba(0,0,0,.08), 0 8px 18px ${t.accent}33`,
                    animation:`ph-egg ${2.4+i*0.25}s ease-in-out infinite`,
                  }}>
                    <span style={{position:"absolute", top:14, left:14, width:9, height:9, borderRadius:"50%", background:"rgba(255,255,255,.6)"}}/>
                    <span style={{position:"absolute", bottom:18, right:16, fontSize:11, opacity:.55}}>✦</span>
                  </div>
                  <span className="ph-disp" style={{fontSize:13, fontWeight:600, color:t.inkSoft}}>Egg #{i+1}</span>
                </button>
              ))}
            </div>
            <p style={{textAlign:"center", marginTop:22, fontSize:12, color:t.inkSoft, opacity:.8, lineHeight:1.5}}>
              🔒 Your data stays on your device. No ads, ever.
            </p>
          </div>
        )}

        {/* ===== MEET ===== */}
        {stage==="meet" && pet && (
          <div className="ph-scroll" style={{position:"relative", zIndex:2, flex:1, overflowY:"auto", padding:"4px 24px 28px",
            display:"flex", flexDirection:"column", alignItems:"center", animation:"ph-fade .45s ease"}}>
            <button onClick={()=>setStage("choose")} className="ph-press" style={{alignSelf:"flex-start", marginTop:4,
              background:"transparent", border:"none", color:t.inkSoft, fontWeight:700, fontSize:14, cursor:"pointer"}}>
              ← a different egg
            </button>

            <div style={{position:"relative", marginTop:18, width:170, height:170, display:"flex", alignItems:"center", justifyContent:"center"}}>
              <div style={{position:"absolute", width:140, height:140, borderRadius:"50%",
                background:`radial-gradient(circle, ${t.accent2}66, transparent 70%)`, animation:"ph-aura 3s ease-in-out infinite"}}/>
              <div style={{animation:"ph-floaty 4s ease-in-out infinite"}}>
                <span key={`meet-${nameInput.length}`} style={{fontSize:96, display:"inline-block",
                  animation: nameInput.length>0 ? "ph-r-wiggle .5s ease" : "ph-hatch .7s cubic-bezier(.34,1.56,.64,1)"}}>
                  {pet.emoji}
                </span>
              </div>
            </div>

            <h2 className="ph-disp" style={{margin:"6px 0 2px", fontSize:23, color:t.ink}}>A {pet.name} hatched!</h2>
            <p style={{margin:"0 0 20px", fontSize:14, color:t.inkSoft, textAlign:"center", lineHeight:1.55, maxWidth:280}}>
              {pet.archetype}
            </p>

            <div style={{...glass({borderRadius:22}), width:"100%", padding:16}}>
              <label style={{fontSize:12, fontWeight:700, color:t.inkSoft, letterSpacing:.4}}>WHAT WILL YOU CALL THEM?</label>
              <input value={nameInput} onChange={e=>setNameInput(e.target.value)} maxLength={16}
                placeholder="Type a name…" autoFocus
                style={{width:"100%", marginTop:8, padding:"12px 14px", fontSize:17, fontWeight:600,
                  color:t.ink, background: t.dark?"rgba(255,255,255,.06)":"rgba(255,255,255,.7)",
                  border:`1.5px solid ${t.accent}55`, borderRadius:14, outline:"none"}} />
              <div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:10}}>
                {["Mochi","Cookie","Pumpkin","Biscuit","Luna"].map(n=>(
                  <button key={n} onClick={()=>setNameInput(n)} className="ph-press"
                    style={{padding:"6px 12px", borderRadius:20, fontSize:13, fontWeight:600, cursor:"pointer",
                      background:"transparent", color:t.inkSoft, border:`1px solid ${t.cardB}`}}>{n}</button>
                ))}
              </div>
            </div>

            <button onClick={confirmPet} disabled={!nameInput.trim()} className="ph-press"
              style={accentBtn({marginTop:18, width:"100%", padding:"15px", opacity: nameInput.trim()?1:0.45,
                cursor: nameInput.trim()?"pointer":"not-allowed"})}>
              I choose you 💖
            </button>
          </div>
        )}

        {/* ===== HOME ===== */}
        {stage==="home" && pet && (
          <>
            {/* app bar */}
            <div style={{position:"relative", zIndex:3, display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"4px 18px 8px"}}>
              <div style={{display:"flex", alignItems:"center", gap:10}}>
                <div style={{width:42, height:42, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:24, background:t.card, border:`1px solid ${t.cardB}`}}>{pet.emoji}</div>
                <div style={{lineHeight:1.1}}>
                  <div className="ph-disp" style={{fontSize:17, fontWeight:600, color:t.ink}}>{petName || pet.name}</div>
                  <div style={{fontSize:11, fontWeight:700, color:t.inkSoft}}>{stageBadge(streakDays)} · Day {streakDays}</div>
                </div>
              </div>

              <div style={{position:"relative", display:"flex", alignItems:"center", gap:8}}>
                <div style={{position:"relative"}}>
                  <div style={{display:"flex", alignItems:"center", gap:5, padding:"7px 13px", borderRadius:20,
                    background:t.card, border:`1px solid ${t.cardB}`, fontWeight:800, color:t.ink, fontSize:14}}>
                    🪙 {coins}
                  </div>
                  <div style={{position:"absolute", top:-4, left:0, right:0, display:"flex", justifyContent:"center", pointerEvents:"none"}}>
                    {pops.map(p=>(
                      <span key={p.id} style={{position:"absolute", color:"#E8A300", fontWeight:800, fontSize:14,
                        animation:"ph-coin 1.4s ease forwards"}}>+{p.n} 🪙</span>
                    ))}
                  </div>
                </div>
                <button onClick={()=>setShowThemes(s=>!s)} className="ph-press" aria-label="Change theme"
                  style={{width:38, height:38, borderRadius:"50%", border:`1px solid ${t.cardB}`, background:t.card,
                    cursor:"pointer", fontSize:17}}>🎨</button>

                {showThemes && (
                  <div style={{...glass({borderRadius:18}), position:"absolute", top:46, right:0, zIndex:10, padding:8, width:178}}>
                    {THEMES.map(th=>(
                      <button key={th.key} onClick={()=>{setTheme(th); setShowThemes(false);}} className="ph-press"
                        style={{display:"flex", alignItems:"center", gap:10, width:"100%", padding:"9px 8px",
                          background: th.key===t.key ? (t.dark?"rgba(255,255,255,.08)":"rgba(0,0,0,.04)") : "transparent",
                          border:"none", borderRadius:12, cursor:"pointer", color:t.ink, fontWeight:600, fontSize:13}}>
                        <span style={{width:18, height:18, borderRadius:"50%", background:`linear-gradient(135deg, ${th.accent}, ${th.accent2})`, flex:"0 0 auto"}}/>
                        {th.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* scroll area */}
            <div className="ph-scroll" style={{position:"relative", zIndex:2, flex:1, overflowY:"auto", padding:"4px 16px 18px"}}>

              {banner && (
                <div style={{...glass({borderRadius:18}), padding:"11px 14px", marginBottom:12,
                  display:"flex", alignItems:"center", gap:10,
                  borderLeft:`4px solid ${banner.tone==="rest" ? "#9DB4D6" : t.accent}`, animation:"ph-fade .35s ease"}}>
                  <span style={{fontSize:13.5, color:t.ink, fontWeight:600, lineHeight:1.4, flex:1}}>{banner.text}</span>
                  <button onClick={()=>setBanner(null)} style={{background:"none", border:"none", color:t.inkSoft, cursor:"pointer", fontSize:16}}>✕</button>
                </div>
              )}

              {/* pet stage */}
              <div style={{...glass(), padding:"18px 16px 22px", marginBottom:14, overflow:"hidden", position:"relative"}}>
                {/* speech bubble */}
                <div key={dialogue} style={{...glass({borderRadius:20}), maxWidth:"86%", margin:"0 auto 6px",
                  padding:"11px 15px", textAlign:"center", animation:"ph-bubble .4s ease",
                  boxShadow:`0 6px 18px ${mColor}22`}}>
                  <span style={{fontSize:14.5, color:t.ink, fontWeight:600, lineHeight:1.45}}>{dialogue}</span>
                </div>

                {/* pet + aura + fx */}
                <div onClick={petTap} style={{position:"relative", height:180, display:"flex", alignItems:"center",
                  justifyContent:"center", cursor:"pointer", userSelect:"none"}}>
                  <div style={{position:"absolute", width:150, height:150, borderRadius:"50%",
                    background:`radial-gradient(circle, ${mColor}55, transparent 68%)`, animation:"ph-aura 3.2s ease-in-out infinite"}}/>

                  {/* mood fx */}
                  {mood.fx==="radiant" && ["✨","💫","⭐"].map((s,i)=>(
                    <span key={i} style={{position:"absolute", fontSize:20,
                      top:`${20+i*42}%`, left: i%2? "72%":"22%", animation:`ph-spark ${1.8+i*.3}s ease-in-out infinite`}}>{s}</span>
                  ))}
                  {mood.fx==="sleepy" && <span style={{position:"absolute", top:"14%", right:"28%", fontSize:22, animation:"ph-zzz 2.4s ease-in-out infinite"}}>💤</span>}
                  {mood.fx==="rain" && (<>
                    <span style={{position:"absolute", top:"6%", fontSize:30}}>☁️</span>
                    {[0,1,2].map(i=>(<span key={i} style={{position:"absolute", top:"30%", left:`${42+i*8}%`, fontSize:13, animation:`ph-rain 1.4s ease-in-out ${i*.25}s infinite`}}>💧</span>))}
                  </>)}
                  {mood.fx==="unwell" && <span style={{position:"absolute", top:"22%", right:"24%", fontSize:24}}>🌡️</span>}
                  {mood.fx==="dormant" && (<>
                    <div style={{position:"absolute", bottom:"24%", width:120, height:46, borderRadius:"50%",
                      background:`linear-gradient(${t.accent2}, ${t.accent})`, opacity:.5, filter:"blur(2px)"}}/>
                    <span style={{position:"absolute", top:"16%", right:"30%", fontSize:20, animation:"ph-zzz 2.6s ease-in-out infinite"}}>💤</span>
                  </>)}

                  {/* reaction fx */}
                  {reaction && (
                    <span style={{position:"absolute", top:"30%", right:"22%", fontSize:26, animation:"ph-pop .4s ease"}}>
                      {REACTIONS[reaction.type].fx}
                    </span>
                  )}

                  {/* hearts on tap */}
                  {hearts.map(h=>(
                    <span key={h.id} style={{position:"absolute", bottom:"34%", left:`${h.left}%`, fontSize:20, animation:"ph-heart .9s ease forwards"}}>💗</span>
                  ))}

                  {/* the pet */}
                  <div style={{animation:"ph-breathe 3.6s ease-in-out infinite"}}>
                    <div style={{animation:"ph-floaty 4.2s ease-in-out infinite"}}>
                      <span key={reaction? reaction.key : (celebrating?"celeb":"idle")}
                        style={{fontSize:104, display:"inline-block",
                          filter: mood.key==="unwell" ? "grayscale(.4) brightness(.97)" : mood.key==="dormant" ? "grayscale(.2) opacity(.9)" : "none",
                          animation: celebrating ? "ph-r-dance 1s ease-in-out infinite"
                            : reaction ? `${REACTIONS[reaction.type].anim} 1.1s ease` : "none"}}>
                        {pet.emoji}
                      </span>
                    </div>
                  </div>
                </div>
                <p style={{textAlign:"center", margin:"2px 0 0", fontSize:11.5, color:t.inkSoft, opacity:.75}}>tap {petName||"them"} to say hi 💕</p>
              </div>

              {/* wellness + streak */}
              <div style={{...glass({borderRadius:24}), padding:"14px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:14}}>
                <Ring value={wellness} color={mColor} badge={mood.badge} label={mood.label} t={t} />
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:12, fontWeight:700, letterSpacing:.4, color:t.inkSoft}}>WELLNESS SCORE</div>
                  <div style={{fontSize:13.5, color:t.ink, fontWeight:600, margin:"3px 0 10px", lineHeight:1.35}}>
                    {doneCount}/{goals.length} goals today
                  </div>
                  {/* progress */}
                  <div style={{height:8, borderRadius:8, background:t.ringTrack, overflow:"hidden"}}>
                    <div style={{height:"100%", width:`${(doneCount/goals.length)*100}%`, background:`linear-gradient(90deg, ${t.accent2}, ${t.accent})`,
                      borderRadius:8, transition:"width .5s cubic-bezier(.34,1.4,.5,1)"}}/>
                  </div>
                  {/* streak chip */}
                  <div style={{display:"inline-flex", alignItems:"center", gap:6, marginTop:11, padding:"5px 11px", borderRadius:16,
                    background: streakState==="active" ? `${t.accent}1a` : streakState==="resting" ? "#9DB4D622" : "#74D0A522",
                    color: streakState==="active" ? t.accent : streakState==="resting" ? "#6E86A8" : "#1FA56C", fontWeight:800, fontSize:12.5}}>
                    {streakState==="active" && `🔥 ${streakDays}-day streak`}
                    {streakState==="resting" && `😴 Resting · never breaks`}
                    {streakState==="recovering" && `🌱 Recovering · welcome back`}
                  </div>
                </div>
              </div>

              {/* today */}
              <div style={{padding:"0 4px", marginBottom:10}}>
                <div style={{fontSize:11, fontWeight:800, letterSpacing:1.2, color:t.inkSoft}}>TODAY, GENTLY</div>
                <div className="ph-disp" style={{fontSize:19, fontWeight:600, color:t.ink, marginTop:2}}>A small step is still a step 🌱</div>
              </div>

              <div style={{display:"flex", flexDirection:"column", gap:10}}>
                {goals.map(g=>{
                  const P = PILLARS[g.pillar];
                  return (
                    <div key={g.id} onClick={()=>completeGoal(g)} className={g.done?"":"ph-press ph-card"}
                      style={{...glass({borderRadius:20}), padding:"13px 14px", display:"flex", alignItems:"center", gap:12,
                        cursor: g.done?"default":"pointer", opacity: g.done?0.62:1}}>
                      <div style={{width:42, height:42, borderRadius:14, flex:"0 0 auto", display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:21, background:`${P.tint}22`}}>{P.icon}</div>
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{fontSize:14.5, fontWeight:600, color:t.ink, lineHeight:1.3}}>{g.title}</div>
                        <div style={{fontSize:12, color:t.inkSoft, marginTop:2, fontWeight:600}}>
                          {g.diff} · 🪙 {g.coins}{g.rest && <span style={{color:t.accent}}> · self-care 🌸</span>}
                        </div>
                      </div>
                      <div style={{width:32, height:32, borderRadius:"50%", flex:"0 0 auto", display:"flex", alignItems:"center", justifyContent:"center",
                        background: g.done? t.accent : "transparent",
                        border: g.done? "none" : `2px solid ${t.accent}66`,
                        color:"#fff", fontWeight:800, fontSize:15, transition:"all .2s"}}>
                        {g.done ? "✓" : ""}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* resilience demo */}
              <button onClick={skipDay} className="ph-press" style={{width:"100%", marginTop:16, padding:"13px",
                borderRadius:18, background:"transparent", border:`1.5px dashed ${t.inkSoft}66`, color:t.inkSoft,
                fontWeight:700, fontSize:13.5, cursor:"pointer"}}>
                🌗 Try it: skip a day
              </button>
              <p style={{textAlign:"center", margin:"9px 6px 0", fontSize:12, color:t.inkSoft, opacity:.82, lineHeight:1.5}}>
                Watch the Resilience model: streaks rest instead of breaking, and {petName||"your pet"} gets sleepy — never punishing. Tap a few times to see every mood, then complete a goal to come back.
              </p>
            </div>

            {/* celebration overlay */}
            {celebrating && (
              <div style={{position:"absolute", inset:0, zIndex:8, pointerEvents:"none", overflow:"hidden"}}>
                {Array.from({length:42}).map((_,i)=>{
                  const cols=[t.accent, t.accent2, "#FFC94D", "#7FD8C0", "#9DB4F0"];
                  return <span key={i} style={{position:"absolute", top:-12, left:`${Math.random()*100}%`,
                    width:8, height:12, borderRadius:2, background:cols[i%cols.length],
                    animation:`ph-confetti ${1.8+Math.random()*1.4}s ease-in ${Math.random()*0.5}s forwards`}}/>;
                })}
                <div style={{position:"absolute", top:"42%", left:0, right:0, textAlign:"center", animation:"ph-pop .5s ease"}}>
                  <div className="ph-disp" style={{fontSize:21, fontWeight:700, color:t.ink, textShadow:"0 2px 12px rgba(255,255,255,.7)"}}>
                    ✨ Everything done today! ✨
                  </div>
                </div>
              </div>
            )}

            {/* toast */}
            {toast && (
              <div style={{position:"absolute", bottom:78, left:0, right:0, zIndex:9, display:"flex", justifyContent:"center", pointerEvents:"none"}}>
                <div style={{...glass({borderRadius:20}), padding:"10px 16px", fontSize:13, fontWeight:600, color:t.ink,
                  maxWidth:"82%", textAlign:"center", animation:"ph-fade .3s ease"}}>{toast}</div>
              </div>
            )}

            {/* bottom nav */}
            <div style={{position:"relative", zIndex:3, display:"flex", justifyContent:"space-around", alignItems:"center",
              padding:"10px 8px 16px", background:t.card, borderTop:`1px solid ${t.cardB}`, backdropFilter:"blur(14px)"}}>
              {[
                {k:"home", icon:"🏠", label:"Home"},
                {k:"goals", icon:"✅", label:"Goals"},
                {k:"wellness", icon:"🌸", label:"Wellness"},
                {k:"shop", icon:"🛍️", label:"Shop"},
                {k:"me", icon:"👤", label:"Me"},
              ].map(item=>{
                const active = item.k==="home";
                return (
                  <button key={item.k} className="ph-press"
                    onClick={()=> active ? null : fireToast(`✨ ${item.label} would open here — this prototype focuses on the Home loop.`)}
                    style={{display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none",
                      cursor:"pointer", padding:"2px 6px", opacity: active?1:0.5}}>
                    <span style={{fontSize:20, filter: active?"none":"grayscale(.4)"}}>{item.icon}</span>
                    <span style={{fontSize:10, fontWeight:800, color: active? t.accent : t.inkSoft}}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
