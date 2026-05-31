import { useState, useEffect, useRef } from "react";

/* ============================================================
   PawHealth — Core Loop + Social Prototype
   "Take care of yourself by taking care of them."

   This single-file prototype demonstrates the SOUL of the spec:
   • the pet emotion engine + real-time reactions
   • the anti-guilt "Resilience" model (streaks rest, never break)
   • a positive-only SOCIAL layer: connect with friends, a cozy
     Lobby where your friends' pets gather, 1:1 chat, a co-op
     Wellness Circle, and an encouraging activity feed.

   Built to be poked at. Try completing goals, tapping your pet,
   "skip a day", switching themes, accepting a friend request,
   waving at a friend's pet, and sending a chat.

   NOTE: friends/messages here are simulated locally so the social
   loop is fully playable without a backend.
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

@keyframes ph-wave { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-20deg)} 60%{transform:rotate(20deg)} }
@keyframes ph-pulse { 0%{transform:scale(1);opacity:.85} 70%{transform:scale(2.4);opacity:0} 100%{opacity:0} }
@keyframes ph-typing { 0%{opacity:.3;transform:translateY(0)} 30%{opacity:1;transform:translateY(-3px)} 60%{opacity:.3;transform:translateY(0)} }
@keyframes ph-slideup { 0%{transform:translateY(60px);opacity:0} 100%{transform:translateY(0);opacity:1} }
@keyframes ph-msg { 0%{opacity:0;transform:translateY(8px) scale(.97)} 100%{opacity:1;transform:translateY(0) scale(1)} }
@keyframes ph-ffloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

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
const MY_CODE = "YOU-2K8F";

/* ---------- social seed data (simulated) ---------- */
const FRIENDS_SEED = [
  { id:"maya", name:"Maya", pet:"🐰", petName:"Clover", wellness:88, streak:12, online:true,  status:"just journaled ✍️", code:"MAYA-2207" },
  { id:"ava",  name:"Ava",  pet:"🦊", petName:"Ember",  wellness:72, streak:5,  online:true,  status:"on a sunset walk 🌇", code:"AVA-9001" },
  { id:"sara", name:"Sara", pet:"🐼", petName:"Bao",    wellness:61, streak:21, online:false, status:"resting cozy today 😌", code:"SARA-3344" },
  { id:"lily", name:"Lily", pet:"🐱", petName:"Mochi",  wellness:80, streak:8,  online:true,  status:"hydrated & happy 💧", code:"LILY-7788" },
];
const REQUESTS_SEED = [
  { id:"nina",  name:"Nina",  pet:"🐶", petName:"Sunny",  wellness:75, streak:3, mutual:2, code:"NINA-5521" },
  { id:"priya", name:"Priya", pet:"🐱", petName:"Pepper", wellness:66, streak:9, mutual:1, code:"PRIYA-1188" },
];
const SUGGESTED_SEED = [
  { id:"emi",  name:"Emi",  pet:"🐰", petName:"Peach",    wellness:83, streak:14, mutual:4, code:"EMI-4040" },
  { id:"zoe",  name:"Zoe",  pet:"🦊", petName:"Hazel",    wellness:70, streak:6,  mutual:2, code:"ZOE-6262" },
  { id:"rhea", name:"Rhea", pet:"🐼", petName:"Dumpling", wellness:58, streak:2,  mutual:3, code:"RHEA-8080" },
];
const CHAT_SEED = {
  maya: [
    { id:11, from:"them", text:"morning!! Clover and I just finished our gratitude journal ☀️" },
    { id:12, from:"them", text:"how are you and {pet} doing today?" },
  ],
  ava:  [ { id:21, from:"them", text:"Ember says hi 🦊 we hit 6k steps already lol he's exhausted" } ],
  sara: [ { id:31, from:"them", text:"taking a gentle rest day today 😌 being kind to myself 💕" } ],
  lily: [ { id:41, from:"them", text:"Mochi judged me for skipping water yesterday 😹 back on track now 💧" } ],
};
const REPLY_POOL = [
  "that's amazing 🥹 so proud of you!",
  "ahh love that for you and {pet} ✨",
  "rest days count too, always 😌",
  "yesss small steps — that's the whole thing 🌱",
  "sending you and {pet} the coziest vibes 🫶",
  "we should do a mindful minute together later 🧘",
  "honestly inspiring 🌸 keep being gentle with yourself",
  "eee okay this made my day 💕",
];
const STICKERS = ["🐾","💕","🎉","🌸","🧘","☀️","🫶","💧","🌱","😴"];
const FEED_SEED = [
  { id:1, who:"Maya", pet:"🐰", text:"completed a 5-min meditation 🧘", cheers:3, cheered:false },
  { id:2, who:"Lily", pet:"🐱", text:"reached her hydration goal 💧",   cheers:5, cheered:false },
  { id:3, who:"Sara", pet:"🐼", text:"took a kind rest day 😌",         cheers:7, cheered:false },
  { id:4, who:"Ava",  pet:"🦊", text:"grew a 5-day streak 🌱",          cheers:4, cheered:false },
];
const CIRCLE = { name:"Morning Bloom Circle", goal:60, unit:"mindful minutes", emoji:"🌸", members:["🐰","🦊","🐼","🐱"] };
const STATUS_POOL = ["sipping tea 🍵","on a mindful walk 🌿","just stretched 🧘","journaling ✍️","resting cozy 😌","hydrating 💧","feeling radiant ✨","watering plants 🪴","reading quietly 📖"];

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

/* online status dot (module scope so it never remounts mid-render) */
function Dot({ online }){
  return (
    <span style={{position:"relative", width:9, height:9, borderRadius:"50%", display:"inline-block",
      background: online ? "#39C16C" : "#C0C4D0", flex:"0 0 auto"}}>
      {online && <span style={{position:"absolute", inset:0, borderRadius:"50%", background:"#39C16C", animation:"ph-pulse 2.2s ease-out infinite"}}/>}
    </span>
  );
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
  const [celebText, setCelebText] = useState("✨ Everything done today! ✨");
  const [streakDays] = useState(3);
  const [streakState, setStreakState] = useState("active"); // active | resting | recovering
  const [banner, setBanner] = useState(null);
  const [lineIdx, setLineIdx] = useState(-1);
  const [showThemes, setShowThemes] = useState(false);
  const [toast, setToast] = useState(null);

  // ---- social state ----
  const [tab, setTab] = useState("home"); // home | lobby | chat | friends | me
  const [friends, setFriends] = useState(FRIENDS_SEED);
  const [requests, setRequests] = useState(REQUESTS_SEED);
  const [suggested, setSuggested] = useState(SUGGESTED_SEED);
  const [sentNames, setSentNames] = useState([]);
  const [convos, setConvos] = useState(()=>{ const o={}; Object.keys(CHAT_SEED).forEach(k=>{ o[k]=CHAT_SEED[k].map(m=>({...m})); }); return o; });
  const [activeChat, setActiveChat] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [typingFriend, setTypingFriend] = useState(null);
  const [unread, setUnread] = useState({ maya:1, lily:1 });
  const [feed, setFeed] = useState(FEED_SEED);
  const [circleProgress, setCircleProgress] = useState(38);
  const [actionSheet, setActionSheet] = useState(null); // friend obj
  const [waving, setWaving] = useState(null); // friend id
  const [firstChatDone, setFirstChatDone] = useState(false);
  const [cheerCount, setCheerCount] = useState(0);
  const [circleDone, setCircleDone] = useState(false);
  const [codeInput, setCodeInput] = useState("");

  const reactTimer = useRef(null);
  const celebTimer = useRef(null);
  const bannerTimer = useRef(null);
  const toastTimer = useRef(null);
  const replyTimer = useRef(null);
  const threadEnd = useRef(null);

  useEffect(()=>{
    if(stage!=="home") return;
    const id = setInterval(()=>{ if(!celebrating && !reaction) setLineIdx(i=>i+1); }, 8000);
    return ()=>clearInterval(id);
  }, [stage, celebrating, reaction]);

  // friends feel alive: rotate a random online friend's status now and then
  useEffect(()=>{
    if(stage!=="home") return;
    const id = setInterval(()=>{
      setFriends(fs=>{
        const onl = fs.map((f,i)=>({f,i})).filter(x=>x.f.online);
        if(!onl.length) return fs;
        const pick = onl[Math.floor(Math.random()*onl.length)].i;
        return fs.map((f,idx)=> idx===pick ? {...f, status: STATUS_POOL[Math.floor(Math.random()*STATUS_POOL.length)]} : f);
      });
    }, 7000);
    return ()=>clearInterval(id);
  }, [stage]);

  // autoscroll chat thread
  useEffect(()=>{ if(threadEnd.current) threadEnd.current.scrollIntoView({behavior:"smooth"}); }, [activeChat, convos, typingFriend]);

  const mood = getMood(wellness);
  const mColor = moodColor(mood.key, t);
  const doneCount = goals.filter(g=>g.done).length;
  const petLabel = petName || (pet ? pet.name : "your pet");
  const fill = (s)=> (s||"").replace(/\{pet\}/g, petLabel);
  const onlineCount = friends.filter(f=>f.online).length;
  const totalUnread = Object.values(unread).reduce((a,b)=>a+(b||0),0);

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
  function fireToast(text){
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(()=>setToast(null), 2100);
  }
  function celebrate(text){
    setCelebText(text);
    clearTimeout(celebTimer.current);
    setCelebrating(true);
    celebTimer.current = setTimeout(()=>setCelebrating(false), 3000);
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
      setWellness(w=>Math.max(w, 92));
      setTimeout(()=>award(30), 250); // daily full-completion bonus
      celebrate("✨ Everything done today! ✨");
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

  function chooseEgg(p){ setPet(p); setNameInput(""); setStage("meet"); }
  function confirmPet(){
    setPetName(nameInput.trim());
    setStage("home");
    setTab("home");
    setLineIdx(-1);
    fireReaction("pet");
  }

  /* ---------- social handlers ---------- */
  function pushMsg(fid, msg){ setConvos(c=>({...c, [fid]: [...(c[fid]||[]), msg]})); }
  function triggerReply(fid){
    setTypingFriend(fid);
    clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(()=>{
      setTypingFriend(null);
      pushMsg(fid, {id:Date.now()+1, from:"them", text: fill(REPLY_POOL[Math.floor(Math.random()*REPLY_POOL.length)]) });
      setUnread(u=> activeChat===fid ? u : ({...u, [fid]:(u[fid]||0)+1}) );
    }, 1300 + Math.random()*900);
  }
  function sendMessage(){
    const text = chatInput.trim(); if(!text || !activeChat) return;
    setFirstChatDone(true);
    pushMsg(activeChat, {id:Date.now(), from:"me", text});
    setChatInput("");
    triggerReply(activeChat);
  }
  function sendSticker(s){
    if(!activeChat) return;
    setFirstChatDone(true);
    pushMsg(activeChat, {id:Date.now(), from:"me", sticker:s});
    triggerReply(activeChat);
  }
  function openChat(fid){ setActiveChat(fid); setUnread(u=>({...u,[fid]:0})); setTab("chat"); setActionSheet(null); }

  function acceptRequest(req){
    setRequests(rs=>rs.filter(r=>r.id!==req.id));
    setFriends(fs=> fs.find(f=>f.id===req.id) ? fs : [...fs, {...req, online:true, status:"just joined your circle 🎉"}]);
    setConvos(c=> c[req.id] ? c : ({...c, [req.id]:[{id:Date.now(), from:"them", text:"yay, we're connected! 🎉 can't wait to cheer each other on 💕"}]}));
    setUnread(u=>({...u,[req.id]:1}));
    award(10);
    fireToast(`💕 You and ${req.name} are now wellness buddies!`);
  }
  function declineRequest(req){
    setRequests(rs=>rs.filter(r=>r.id!==req.id));
    fireToast("No worries — maybe another time 🌷");
  }
  function addSuggested(p){
    setSuggested(s=>s.filter(x=>x.id!==p.id));
    setSentNames(n=>[...n, p.name]);
    fireToast(`✨ Request sent to ${p.name}`);
    setTimeout(()=>{
      setSentNames(n=>n.filter(x=>x!==p.name));
      setFriends(fs=> fs.find(f=>f.id===p.id) ? fs : [...fs, {...p, online:true, status:"just joined your circle 🎉"}]);
      setConvos(c=> c[p.id] ? c : ({...c, [p.id]:[{id:Date.now(), from:"them", text:"hi!! so happy to connect 🌸"}]}));
      setUnread(u=>({...u,[p.id]:1}));
      fireToast(`🎉 ${p.name} accepted your request!`);
    }, 2400);
  }
  function sendRequestByCode(){
    const code = codeInput.trim(); if(!code) return;
    setSentNames(n=>[...n, code.toUpperCase()]);
    setCodeInput("");
    fireToast(`✨ Friend request sent to ${code.toUpperCase()}`);
  }
  function copyCode(){
    try { if(navigator.clipboard) navigator.clipboard.writeText(MY_CODE); } catch(e){}
    fireToast("📋 Your code is copied");
  }
  function waveAt(friend){
    setActionSheet(null);
    setTab("lobby");
    setWaving(friend.id);
    setTimeout(()=>setWaving(null), 750);
    const id = Date.now()+Math.random();
    setHearts(h=>[...h, {id, left: 40 + Math.random()*20}]);
    setTimeout(()=>setHearts(h=>h.filter(x=>x.id!==id)), 900);
    fireToast(`👋 ${friend.name}'s ${friend.petName} waved back!`);
  }
  function cheerFriend(friend){
    setActionSheet(null);
    setCheerCount(c=>c+1);
    pushMsg(friend.id, {id:Date.now(), from:"me", sticker:"🎉"});
    triggerReply(friend.id);
    fireToast(`🎉 You cheered ${friend.name} — kindness sent!`);
  }
  function cheerFeed(id){
    setFeed(f=>f.map(x=> x.id===id && !x.cheered ? {...x, cheered:true, cheers:x.cheers+1} : x));
    setCheerCount(c=>c+1);
  }
  function contributeCircle(){
    setCircleContributedSafe();
    fireReaction("meditate");
    setWellness(w=>Math.min(100, w+3));
    setCircleProgress(p=>{
      const np = Math.min(CIRCLE.goal, p+6);
      if(np>=CIRCLE.goal && p<CIRCLE.goal){ setTimeout(()=>celebrate("🌸 The circle bloomed together! 🌸"), 120); }
      else fireToast("🧘 +6 mindful minutes to the circle");
      return np;
    });
  }
  function setCircleContributedSafe(){ setCircleDone(true); }

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
  const softInput = {
    background: t.dark?"rgba(255,255,255,.06)":"rgba(255,255,255,.7)",
    border:`1.5px solid ${t.accent}44`, borderRadius:14, outline:"none", color:t.ink,
  };
  const pageBg = `radial-gradient(120% 95% at 50% -8%, ${t.bg3} 0%, ${t.bg2} 48%, ${t.bg1} 100%)`;

  /* ============================ TAB RENDERERS ============================ */

  function renderHome(){
    return (
      <div className="ph-scroll" style={{flex:1, minHeight:0, overflowY:"auto", padding:"4px 16px 18px"}}>
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
          <div key={dialogue} style={{...glass({borderRadius:20}), maxWidth:"86%", margin:"0 auto 6px",
            padding:"11px 15px", textAlign:"center", animation:"ph-bubble .4s ease", boxShadow:`0 6px 18px ${mColor}22`}}>
            <span style={{fontSize:14.5, color:t.ink, fontWeight:600, lineHeight:1.45}}>{dialogue}</span>
          </div>

          <div onClick={petTap} style={{position:"relative", height:180, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", userSelect:"none"}}>
            <div style={{position:"absolute", width:150, height:150, borderRadius:"50%",
              background:`radial-gradient(circle, ${mColor}55, transparent 68%)`, animation:"ph-aura 3.2s ease-in-out infinite"}}/>

            {mood.fx==="radiant" && ["✨","💫","⭐"].map((s,i)=>(
              <span key={i} style={{position:"absolute", fontSize:20, top:`${20+i*42}%`, left: i%2? "72%":"22%", animation:`ph-spark ${1.8+i*.3}s ease-in-out infinite`}}>{s}</span>
            ))}
            {mood.fx==="sleepy" && <span style={{position:"absolute", top:"14%", right:"28%", fontSize:22, animation:"ph-zzz 2.4s ease-in-out infinite"}}>💤</span>}
            {mood.fx==="rain" && (<>
              <span style={{position:"absolute", top:"6%", fontSize:30}}>☁️</span>
              {[0,1,2].map(i=>(<span key={i} style={{position:"absolute", top:"30%", left:`${42+i*8}%`, fontSize:13, animation:`ph-rain 1.4s ease-in-out ${i*.25}s infinite`}}>💧</span>))}
            </>)}
            {mood.fx==="unwell" && <span style={{position:"absolute", top:"22%", right:"24%", fontSize:24}}>🌡️</span>}
            {mood.fx==="dormant" && (<>
              <div style={{position:"absolute", bottom:"24%", width:120, height:46, borderRadius:"50%", background:`linear-gradient(${t.accent2}, ${t.accent})`, opacity:.5, filter:"blur(2px)"}}/>
              <span style={{position:"absolute", top:"16%", right:"30%", fontSize:20, animation:"ph-zzz 2.6s ease-in-out infinite"}}>💤</span>
            </>)}

            {reaction && (
              <span style={{position:"absolute", top:"30%", right:"22%", fontSize:26, animation:"ph-pop .4s ease"}}>{REACTIONS[reaction.type].fx}</span>
            )}
            {hearts.map(h=>(
              <span key={h.id} style={{position:"absolute", bottom:"34%", left:`${h.left}%`, fontSize:20, animation:"ph-heart .9s ease forwards"}}>💗</span>
            ))}

            <div style={{animation:"ph-breathe 3.6s ease-in-out infinite"}}>
              <div style={{animation:"ph-floaty 4.2s ease-in-out infinite"}}>
                <span key={reaction? reaction.key : (celebrating?"celeb":"idle")}
                  style={{fontSize:104, display:"inline-block",
                    filter: mood.key==="unwell" ? "grayscale(.4) brightness(.97)" : mood.key==="dormant" ? "grayscale(.2) opacity(.9)" : "none",
                    animation: celebrating ? "ph-r-dance 1s ease-in-out infinite" : reaction ? `${REACTIONS[reaction.type].anim} 1.1s ease` : "none"}}>
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
            <div style={{fontSize:13.5, color:t.ink, fontWeight:600, margin:"3px 0 10px", lineHeight:1.35}}>{doneCount}/{goals.length} goals today</div>
            <div style={{height:8, borderRadius:8, background:t.ringTrack, overflow:"hidden"}}>
              <div style={{height:"100%", width:`${(doneCount/goals.length)*100}%`, background:`linear-gradient(90deg, ${t.accent2}, ${t.accent})`, borderRadius:8, transition:"width .5s cubic-bezier(.34,1.4,.5,1)"}}/>
            </div>
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
                style={{...glass({borderRadius:20}), padding:"13px 14px", display:"flex", alignItems:"center", gap:12, cursor: g.done?"default":"pointer", opacity: g.done?0.62:1}}>
                <div style={{width:42, height:42, borderRadius:14, flex:"0 0 auto", display:"flex", alignItems:"center", justifyContent:"center", fontSize:21, background:`${P.tint}22`}}>{P.icon}</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:14.5, fontWeight:600, color:t.ink, lineHeight:1.3}}>{g.title}</div>
                  <div style={{fontSize:12, color:t.inkSoft, marginTop:2, fontWeight:600}}>{g.diff} · 🪙 {g.coins}{g.rest && <span style={{color:t.accent}}> · self-care 🌸</span>}</div>
                </div>
                <div style={{width:32, height:32, borderRadius:"50%", flex:"0 0 auto", display:"flex", alignItems:"center", justifyContent:"center",
                  background: g.done? t.accent : "transparent", border: g.done? "none" : `2px solid ${t.accent}66`, color:"#fff", fontWeight:800, fontSize:15, transition:"all .2s"}}>
                  {g.done ? "✓" : ""}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={skipDay} className="ph-press" style={{width:"100%", marginTop:16, padding:"13px", borderRadius:18, background:"transparent", border:`1.5px dashed ${t.inkSoft}66`, color:t.inkSoft, fontWeight:700, fontSize:13.5, cursor:"pointer"}}>
          🌗 Try it: skip a day
        </button>
        <p style={{textAlign:"center", margin:"9px 6px 0", fontSize:12, color:t.inkSoft, opacity:.82, lineHeight:1.5}}>
          Watch the Resilience model: streaks rest instead of breaking, and {petName||"your pet"} gets sleepy — never punishing. Tap a few times to see every mood, then complete a goal to come back.
        </p>
      </div>
    );
  }

  function renderLobby(){
    const cp = Math.round((circleProgress/CIRCLE.goal)*100);
    return (
      <div className="ph-scroll" style={{flex:1, minHeight:0, overflowY:"auto", padding:"4px 16px 18px"}}>
        {/* heading */}
        <div style={{padding:"2px 4px 12px"}}>
          <div className="ph-disp" style={{fontSize:22, fontWeight:600, color:t.ink}}>The Cozy Den 🌿</div>
          <div style={{fontSize:12.5, color:t.inkSoft, fontWeight:600, marginTop:2}}>
            {onlineCount} of your {friends.length} friends are here right now
          </div>
        </div>

        {/* your pet */}
        <div style={{...glass({borderRadius:22}), padding:"14px 16px", marginBottom:14, display:"flex", alignItems:"center", gap:14, position:"relative", overflow:"hidden"}}>
          <div style={{position:"relative", width:64, height:64, display:"flex", alignItems:"center", justifyContent:"center", flex:"0 0 auto"}}>
            <div style={{position:"absolute", width:60, height:60, borderRadius:"50%", background:`radial-gradient(circle, ${mColor}55, transparent 70%)`, animation:"ph-aura 3.2s ease-in-out infinite"}}/>
            <span style={{fontSize:44, animation:"ph-ffloat 4s ease-in-out infinite"}}>{pet.emoji}</span>
          </div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{display:"flex", alignItems:"center", gap:7}}>
              <span className="ph-disp" style={{fontSize:17, fontWeight:600, color:t.ink}}>{petLabel}</span>
              <span style={{fontSize:11, fontWeight:800, color:"#39C16C"}}>● you</span>
            </div>
            <div style={{fontSize:12.5, color:t.inkSoft, fontWeight:600, marginTop:2}}>{mood.badge} feeling {mood.label.toLowerCase()} · 🪙 {coins}</div>
          </div>
        </div>

        {/* friends grid */}
        <div style={{fontSize:11, fontWeight:800, letterSpacing:1.1, color:t.inkSoft, margin:"4px 4px 8px"}}>FRIENDS' PETS</div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
          {friends.map(fr=>{
            const fm = getMood(fr.wellness);
            return (
              <button key={fr.id} onClick={()=>setActionSheet(fr)} className="ph-press ph-card"
                style={{...glass({borderRadius:22}), padding:"15px 10px 12px", display:"flex", flexDirection:"column", alignItems:"center", gap:5, position:"relative", cursor:"pointer", textAlign:"center"}}>
                <span style={{position:"absolute", top:11, right:11}}><Dot online={fr.online} /></span>
                <div style={{position:"relative", marginBottom:2}}>
                  <span style={{fontSize:46, display:"inline-block", animation: waving===fr.id ? "ph-wave .7s ease" : "ph-ffloat 4s ease-in-out infinite"}}>{fr.pet}</span>
                  <span style={{position:"absolute", bottom:-2, right:-8, fontSize:16}}>{fm.badge}</span>
                </div>
                <div className="ph-disp" style={{fontSize:14.5, fontWeight:600, color:t.ink}}>{fr.petName}</div>
                <div style={{fontSize:11, color:t.inkSoft, fontWeight:700}}>{fr.name}'s</div>
                <div style={{fontSize:11, color:t.inkSoft, lineHeight:1.3, minHeight:28, opacity:.9}}>{fr.status}</div>
              </button>
            );
          })}
        </div>

        {/* Wellness Circle (co-op) */}
        <div style={{...glass({borderRadius:24}), padding:"16px", marginTop:16, position:"relative", overflow:"hidden"}}>
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:11, fontWeight:800, letterSpacing:1, color:t.inkSoft}}>WELLNESS CIRCLE</div>
              <div className="ph-disp" style={{fontSize:17, fontWeight:600, color:t.ink, marginTop:1}}>{CIRCLE.emoji} {CIRCLE.name}</div>
            </div>
            <div style={{display:"flex"}}>
              {CIRCLE.members.map((m,i)=>(
                <span key={i} style={{fontSize:20, marginLeft:i?-8:0, width:30, height:30, borderRadius:"50%", background:t.cardB, display:"flex", alignItems:"center", justifyContent:"center", border:`1.5px solid ${t.card}`}}>{m}</span>
              ))}
            </div>
          </div>
          <div style={{fontSize:12.5, color:t.inkSoft, fontWeight:600, margin:"10px 0 7px"}}>
            {circleProgress} / {CIRCLE.goal} {CIRCLE.unit} together this week — no competition, just company 💛
          </div>
          <div style={{height:10, borderRadius:10, background:t.ringTrack, overflow:"hidden"}}>
            <div style={{height:"100%", width:`${cp}%`, background:`linear-gradient(90deg, ${t.accent2}, ${t.accent})`, borderRadius:10, transition:"width .6s cubic-bezier(.34,1.4,.5,1)"}}/>
          </div>
          <button onClick={contributeCircle} className="ph-press" style={accentBtn({marginTop:13, width:"100%", padding:"12px"})}>
            🧘 Add my 5 mindful minutes
          </button>
        </div>

        {/* activity feed */}
        <div style={{fontSize:11, fontWeight:800, letterSpacing:1.1, color:t.inkSoft, margin:"18px 4px 8px"}}>GOOD THINGS HAPPENING 🌟</div>
        <div style={{display:"flex", flexDirection:"column", gap:10}}>
          {feed.map(item=>(
            <div key={item.id} style={{...glass({borderRadius:20}), padding:"12px 14px", display:"flex", alignItems:"center", gap:12}}>
              <span style={{fontSize:30, flex:"0 0 auto"}}>{item.pet}</span>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:13.5, color:t.ink, fontWeight:600, lineHeight:1.35}}><b>{item.who}</b> {item.text}</div>
                <div style={{fontSize:11.5, color:t.inkSoft, fontWeight:600, marginTop:2}}>💛 {item.cheers} cheering</div>
              </div>
              <button onClick={()=>cheerFeed(item.id)} disabled={item.cheered} className="ph-press"
                style={{flex:"0 0 auto", padding:"8px 12px", borderRadius:16, fontWeight:800, fontSize:12.5, cursor: item.cheered?"default":"pointer",
                  border:`1.5px solid ${item.cheered? "transparent" : t.accent+"66"}`,
                  background: item.cheered ? `${t.accent}1a` : "transparent", color: t.accent, opacity: item.cheered?0.75:1}}>
                {item.cheered ? "Cheered 💛" : "Cheer"}
              </button>
            </div>
          ))}
        </div>

        <p style={{textAlign:"center", margin:"16px 8px 0", fontSize:11.5, color:t.inkSoft, opacity:.7, lineHeight:1.5}}>
          Tap any pet to wave, cheer, or chat. Friends here are simulated for the prototype 🌷
        </p>
      </div>
    );
  }

  function lastPreview(fid){
    const arr = convos[fid] || [];
    if(!arr.length) return "Say hello 👋";
    const m = arr[arr.length-1];
    const who = m.from==="me" ? "You: " : "";
    return who + (m.sticker ? m.sticker : fill(m.text));
  }

  function renderChatList(){
    const list = friends.filter(f=> (convos[f.id]&&convos[f.id].length) || true);
    return (
      <div className="ph-scroll" style={{flex:1, minHeight:0, overflowY:"auto", padding:"4px 16px 18px"}}>
        <div className="ph-disp" style={{fontSize:22, fontWeight:600, color:t.ink, padding:"2px 4px 12px"}}>Messages 💬</div>
        <div style={{display:"flex", flexDirection:"column", gap:9}}>
          {list.map(fr=>{
            const u = unread[fr.id]||0;
            return (
              <button key={fr.id} onClick={()=>openChat(fr.id)} className="ph-press ph-card"
                style={{...glass({borderRadius:20}), padding:"12px 14px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", textAlign:"left"}}>
                <div style={{position:"relative", flex:"0 0 auto"}}>
                  <span style={{fontSize:34}}>{fr.pet}</span>
                  <span style={{position:"absolute", bottom:0, right:-2}}><Dot online={fr.online} /></span>
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{display:"flex", alignItems:"center", gap:6}}>
                    <span className="ph-disp" style={{fontSize:15, fontWeight:600, color:t.ink}}>{fr.name}</span>
                    <span style={{fontSize:11, color:t.inkSoft}}>· {fr.petName}</span>
                  </div>
                  <div style={{fontSize:12.5, color: u? t.ink : t.inkSoft, fontWeight: u?700:600, marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                    {lastPreview(fr.id)}
                  </div>
                </div>
                {u>0 && <span style={{flex:"0 0 auto", minWidth:20, height:20, padding:"0 6px", borderRadius:10, background:t.accent, color:"#fff", fontSize:11.5, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center"}}>{u}</span>}
              </button>
            );
          })}
        </div>
        <p style={{textAlign:"center", margin:"16px 8px 0", fontSize:11.5, color:t.inkSoft, opacity:.7, lineHeight:1.5}}>
          Send a message and your friend will reply — supportive, always 💕
        </p>
      </div>
    );
  }

  function renderThread(){
    const fr = friends.find(f=>f.id===activeChat);
    if(!fr) return null;
    const msgs = convos[activeChat] || [];
    return (
      <div style={{flex:1, minHeight:0, display:"flex", flexDirection:"column"}}>
        {/* thread header */}
        <div style={{display:"flex", alignItems:"center", gap:11, padding:"6px 14px 10px", borderBottom:`1px solid ${t.cardB}`}}>
          <button onClick={()=>setActiveChat(null)} className="ph-press" style={{background:"none", border:"none", color:t.ink, fontSize:22, cursor:"pointer", lineHeight:1}}>‹</button>
          <span style={{fontSize:30}}>{fr.pet}</span>
          <div style={{flex:1, minWidth:0}}>
            <div className="ph-disp" style={{fontSize:16, fontWeight:600, color:t.ink}}>{fr.name}</div>
            <div style={{fontSize:11.5, color:t.inkSoft, fontWeight:600, display:"flex", alignItems:"center", gap:6}}>
              <Dot online={fr.online} /> {fr.online ? "online" : "resting"} · {fr.petName}
            </div>
          </div>
        </div>

        {/* messages */}
        <div className="ph-scroll" style={{flex:1, minHeight:0, overflowY:"auto", padding:"14px 14px 8px", display:"flex", flexDirection:"column", gap:9}}>
          <div style={{textAlign:"center", fontSize:11, color:t.inkSoft, opacity:.7, marginBottom:4}}>You and {fr.name} are wellness buddies 💕</div>
          {msgs.map(m=>{
            const mine = m.from==="me";
            if(m.sticker) return (
              <div key={m.id} style={{alignSelf: mine?"flex-end":"flex-start", animation:"ph-msg .3s ease"}}>
                <span style={{fontSize:40}}>{m.sticker}</span>
              </div>
            );
            return (
              <div key={m.id} style={{alignSelf: mine?"flex-end":"flex-start", maxWidth:"78%", animation:"ph-msg .3s ease"}}>
                <div style={{padding:"10px 14px", borderRadius: mine?"18px 18px 5px 18px":"18px 18px 18px 5px",
                  background: mine ? t.accent : t.card, border: mine? "none" : `1px solid ${t.cardB}`,
                  color: mine ? "#fff" : t.ink, fontSize:14, fontWeight:600, lineHeight:1.4,
                  boxShadow: mine ? `0 6px 16px ${t.accent}44` : "0 4px 14px rgba(120,80,110,.10)"}}>
                  {fill(m.text)}
                </div>
              </div>
            );
          })}
          {typingFriend===activeChat && (
            <div style={{alignSelf:"flex-start", padding:"12px 16px", borderRadius:"18px 18px 18px 5px", background:t.card, border:`1px solid ${t.cardB}`, display:"flex", gap:5}}>
              {[0,1,2].map(i=>(<span key={i} style={{width:7, height:7, borderRadius:"50%", background:t.inkSoft, animation:`ph-typing 1.1s ease-in-out ${i*0.18}s infinite`}}/>))}
            </div>
          )}
          <div ref={threadEnd} />
        </div>

        {/* sticker bar */}
        <div className="ph-scroll" style={{display:"flex", gap:8, overflowX:"auto", padding:"6px 14px", borderTop:`1px solid ${t.cardB}`}}>
          {STICKERS.map(s=>(
            <button key={s} onClick={()=>sendSticker(s)} className="ph-press" style={{flex:"0 0 auto", fontSize:22, background:"none", border:"none", cursor:"pointer", padding:"2px 4px"}}>{s}</button>
          ))}
        </div>

        {/* input */}
        <div style={{display:"flex", alignItems:"center", gap:9, padding:"8px 12px 14px"}}>
          <input value={chatInput} onChange={e=>setChatInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter") sendMessage(); }}
            placeholder={`Message ${fr.name}…`}
            style={{...softInput, flex:1, padding:"12px 15px", fontSize:14.5, fontWeight:600}} />
          <button onClick={sendMessage} disabled={!chatInput.trim()} className="ph-press"
            style={{...accentBtn({width:44, height:44, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, padding:0}), opacity: chatInput.trim()?1:0.5}}>
            ➤
          </button>
        </div>
      </div>
    );
  }

  function renderFriends(){
    return (
      <div className="ph-scroll" style={{flex:1, minHeight:0, overflowY:"auto", padding:"4px 16px 18px"}}>
        <div className="ph-disp" style={{fontSize:22, fontWeight:600, color:t.ink, padding:"2px 4px 12px"}}>Your Circle 👫</div>

        {/* friend code card */}
        <div style={{borderRadius:24, padding:"16px 18px", marginBottom:14, color:"#fff", position:"relative", overflow:"hidden",
          background:`linear-gradient(135deg, ${t.accent}, ${t.accent2})`, boxShadow:`0 14px 30px ${t.accent}55`}}>
          <div style={{fontSize:11, fontWeight:800, letterSpacing:1, opacity:.9}}>YOUR FRIEND CODE</div>
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:6}}>
            <span className="ph-disp" style={{fontSize:26, fontWeight:700, letterSpacing:1}}>{MY_CODE}</span>
            <button onClick={copyCode} className="ph-press" style={{padding:"8px 14px", borderRadius:14, border:"none", background:"rgba(255,255,255,.25)", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer"}}>Copy</button>
          </div>
          <div style={{fontSize:12, opacity:.92, marginTop:6}}>Share it so friends can add you 🌸</div>
        </div>

        {/* add by code */}
        <div style={{...glass({borderRadius:20}), padding:"14px", marginBottom:16}}>
          <div style={{fontSize:12, fontWeight:800, color:t.inkSoft, letterSpacing:.4, marginBottom:8}}>ADD A FRIEND BY CODE</div>
          <div style={{display:"flex", gap:9}}>
            <input value={codeInput} onChange={e=>setCodeInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter") sendRequestByCode(); }}
              placeholder="e.g. MAYA-2207"
              style={{...softInput, flex:1, padding:"11px 14px", fontSize:14, fontWeight:700, letterSpacing:.5}} />
            <button onClick={sendRequestByCode} disabled={!codeInput.trim()} className="ph-press"
              style={{...accentBtn({padding:"0 16px", borderRadius:14, fontSize:13.5}), opacity: codeInput.trim()?1:0.5}}>Send</button>
          </div>
          {sentNames.length>0 && (
            <div style={{fontSize:12, color:t.inkSoft, fontWeight:600, marginTop:9}}>
              ⏳ Pending: {sentNames.join(", ")}
            </div>
          )}
        </div>

        {/* requests */}
        {requests.length>0 && (
          <>
            <div style={{fontSize:11, fontWeight:800, letterSpacing:1.1, color:t.inkSoft, margin:"2px 4px 8px"}}>
              FRIEND REQUESTS <span style={{color:t.accent}}>({requests.length})</span>
            </div>
            <div style={{display:"flex", flexDirection:"column", gap:9, marginBottom:18}}>
              {requests.map(rq=>(
                <div key={rq.id} style={{...glass({borderRadius:20}), padding:"12px 14px", display:"flex", alignItems:"center", gap:12}}>
                  <span style={{fontSize:34, flex:"0 0 auto"}}>{rq.pet}</span>
                  <div style={{flex:1, minWidth:0}}>
                    <div className="ph-disp" style={{fontSize:15, fontWeight:600, color:t.ink}}>{rq.name}</div>
                    <div style={{fontSize:12, color:t.inkSoft, fontWeight:600}}>{rq.mutual} mutual · {rq.petName} 🐾</div>
                  </div>
                  <div style={{display:"flex", gap:7, flex:"0 0 auto"}}>
                    <button onClick={()=>acceptRequest(rq)} className="ph-press" style={accentBtn({padding:"9px 13px", borderRadius:14, fontSize:13})}>Accept</button>
                    <button onClick={()=>declineRequest(rq)} className="ph-press" style={{padding:"9px 12px", borderRadius:14, border:`1.5px solid ${t.cardB}`, background:"transparent", color:t.inkSoft, fontWeight:700, fontSize:13, cursor:"pointer"}}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* my friends */}
        <div style={{fontSize:11, fontWeight:800, letterSpacing:1.1, color:t.inkSoft, margin:"2px 4px 8px"}}>FRIENDS ({friends.length})</div>
        <div style={{display:"flex", flexDirection:"column", gap:9}}>
          {friends.map(fr=>(
            <div key={fr.id} style={{...glass({borderRadius:20}), padding:"12px 14px", display:"flex", alignItems:"center", gap:12}}>
              <div style={{position:"relative", flex:"0 0 auto"}}>
                <span style={{fontSize:32}}>{fr.pet}</span>
                <span style={{position:"absolute", bottom:0, right:-2}}><Dot online={fr.online} /></span>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div className="ph-disp" style={{fontSize:15, fontWeight:600, color:t.ink}}>{fr.name}</div>
                <div style={{fontSize:12, color:t.inkSoft, fontWeight:600}}>🔥 {fr.streak}-day streak · {fr.petName}</div>
              </div>
              <button onClick={()=>openChat(fr.id)} className="ph-press" style={{flex:"0 0 auto", width:40, height:40, borderRadius:"50%", border:`1.5px solid ${t.cardB}`, background:t.card, cursor:"pointer", fontSize:17}}>💬</button>
            </div>
          ))}
        </div>

        {/* discover */}
        {suggested.length>0 && (
          <>
            <div style={{fontSize:11, fontWeight:800, letterSpacing:1.1, color:t.inkSoft, margin:"18px 4px 8px"}}>PEOPLE YOU MAY KNOW</div>
            <div style={{display:"flex", flexDirection:"column", gap:9}}>
              {suggested.map(p=>(
                <div key={p.id} style={{...glass({borderRadius:20}), padding:"12px 14px", display:"flex", alignItems:"center", gap:12}}>
                  <span style={{fontSize:32, flex:"0 0 auto"}}>{p.pet}</span>
                  <div style={{flex:1, minWidth:0}}>
                    <div className="ph-disp" style={{fontSize:15, fontWeight:600, color:t.ink}}>{p.name}</div>
                    <div style={{fontSize:12, color:t.inkSoft, fontWeight:600}}>{p.mutual} mutual friends</div>
                  </div>
                  <button onClick={()=>addSuggested(p)} className="ph-press" style={{flex:"0 0 auto", padding:"9px 15px", borderRadius:14, border:`1.5px solid ${t.accent}`, background:"transparent", color:t.accent, fontWeight:800, fontSize:13, cursor:"pointer"}}>+ Add</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  function renderMe(){
    const ach = [
      { icon:"🐣", label:"Hatched a companion", got:true },
      { icon:"👫", label:`Circle of ${friends.length}`, got: friends.length>0 },
      { icon:"💬", label:"Said hello", got: firstChatDone },
      { icon:"🎉", label:"Cheered a friend", got: cheerCount>0 },
      { icon:"🌸", label:"Bloomed together", got: circleDone },
      { icon:"🪙", label:"150+ coins", got: coins>=150 },
      { icon:"✨", label:"Reached Radiant", got: wellness>=85 },
      { icon:"😴", label:"Honoured rest", got: streakState!=="active" || goals.some(g=>g.rest&&g.done) },
    ];
    const got = ach.filter(a=>a.got).length;
    return (
      <div className="ph-scroll" style={{flex:1, minHeight:0, overflowY:"auto", padding:"4px 16px 18px"}}>
        {/* hero */}
        <div style={{...glass({borderRadius:26}), padding:"20px 16px 18px", marginBottom:14, textAlign:"center", position:"relative", overflow:"hidden"}}>
          <div style={{position:"relative", height:120, display:"flex", alignItems:"center", justifyContent:"center"}}>
            <div style={{position:"absolute", width:120, height:120, borderRadius:"50%", background:`radial-gradient(circle, ${mColor}55, transparent 68%)`, animation:"ph-aura 3.2s ease-in-out infinite"}}/>
            <span style={{fontSize:80, animation:"ph-floaty 4.2s ease-in-out infinite"}}>{pet.emoji}</span>
          </div>
          <div className="ph-disp" style={{fontSize:22, fontWeight:600, color:t.ink, marginTop:4}}>{petLabel}</div>
          <div style={{fontSize:12.5, color:t.inkSoft, fontWeight:700, marginTop:2}}>{stageBadge(streakDays)} · Day {streakDays} together</div>
        </div>

        {/* stats */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16}}>
          {[
            { v:coins, l:"coins", icon:"🪙" },
            { v:friends.length, l:"friends", icon:"👫" },
            { v:`${streakDays}d`, l:"streak", icon:"🔥" },
          ].map((s,i)=>(
            <div key={i} style={{...glass({borderRadius:18}), padding:"13px 6px", textAlign:"center"}}>
              <div style={{fontSize:18}}>{s.icon}</div>
              <div className="ph-disp" style={{fontSize:19, fontWeight:700, color:t.ink, marginTop:2}}>{s.v}</div>
              <div style={{fontSize:10.5, color:t.inkSoft, fontWeight:700, letterSpacing:.3, textTransform:"uppercase"}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* achievements */}
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", margin:"2px 4px 8px"}}>
          <span style={{fontSize:11, fontWeight:800, letterSpacing:1.1, color:t.inkSoft}}>ACHIEVEMENTS</span>
          <span style={{fontSize:12, fontWeight:800, color:t.accent}}>{got}/{ach.length}</span>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16}}>
          {ach.map((a,i)=>(
            <div key={i} style={{...glass({borderRadius:18}), padding:"13px 12px", display:"flex", alignItems:"center", gap:11, opacity: a.got?1:0.5}}>
              <div style={{width:38, height:38, borderRadius:12, flex:"0 0 auto", display:"flex", alignItems:"center", justifyContent:"center", fontSize:19,
                background: a.got? `${t.accent}1f` : "transparent", border: a.got? "none" : `1.5px dashed ${t.inkSoft}55`, filter: a.got?"none":"grayscale(1)"}}>
                {a.got ? a.icon : "🔒"}
              </div>
              <div style={{fontSize:12.5, fontWeight:700, color:t.ink, lineHeight:1.25}}>{a.label}</div>
            </div>
          ))}
        </div>

        {/* code + privacy */}
        <div style={{...glass({borderRadius:18}), padding:"13px 16px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:11, fontWeight:800, color:t.inkSoft, letterSpacing:.4}}>YOUR CODE</div>
            <div className="ph-disp" style={{fontSize:16, fontWeight:700, color:t.ink, letterSpacing:.5}}>{MY_CODE}</div>
          </div>
          <button onClick={copyCode} className="ph-press" style={{padding:"8px 14px", borderRadius:14, border:`1.5px solid ${t.accent}`, background:"transparent", color:t.accent, fontWeight:800, fontSize:13, cursor:"pointer"}}>Copy</button>
        </div>
        <p style={{textAlign:"center", margin:"14px 8px 0", fontSize:11.5, color:t.inkSoft, opacity:.72, lineHeight:1.5}}>
          🔒 Your wellness data stays on your device. No ads, no selling — ever.
        </p>
      </div>
    );
  }

  const NAV = [
    { k:"home",    icon:"🏠", label:"Home" },
    { k:"lobby",   icon:"🌿", label:"Lobby" },
    { k:"chat",    icon:"💬", label:"Chat" },
    { k:"friends", icon:"👫", label:"Friends" },
    { k:"me",      icon:"👤", label:"Me" },
  ];

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
                style={{...softInput, width:"100%", marginTop:8, padding:"12px 14px", fontSize:17, fontWeight:600, border:`1.5px solid ${t.accent}55`}} />
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

        {/* ===== HOME (app shell with tabs) ===== */}
        {stage==="home" && pet && (
          <>
            {/* app bar */}
            <div style={{position:"relative", zIndex:3, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"4px 18px 8px"}}>
              <button onClick={()=>{ setTab("me"); setActiveChat(null); }} className="ph-press"
                style={{display:"flex", alignItems:"center", gap:10, background:"none", border:"none", cursor:"pointer", padding:0}}>
                <div style={{width:42, height:42, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, background:t.card, border:`1px solid ${t.cardB}`}}>{pet.emoji}</div>
                <div style={{lineHeight:1.1, textAlign:"left"}}>
                  <div className="ph-disp" style={{fontSize:17, fontWeight:600, color:t.ink}}>{petName || pet.name}</div>
                  <div style={{fontSize:11, fontWeight:700, color:t.inkSoft}}>{stageBadge(streakDays)} · Day {streakDays}</div>
                </div>
              </button>

              <div style={{position:"relative", display:"flex", alignItems:"center", gap:8}}>
                <div style={{position:"relative"}}>
                  <div style={{display:"flex", alignItems:"center", gap:5, padding:"7px 13px", borderRadius:20, background:t.card, border:`1px solid ${t.cardB}`, fontWeight:800, color:t.ink, fontSize:14}}>🪙 {coins}</div>
                  <div style={{position:"absolute", top:-4, left:0, right:0, display:"flex", justifyContent:"center", pointerEvents:"none"}}>
                    {pops.map(p=>(<span key={p.id} style={{position:"absolute", color:"#E8A300", fontWeight:800, fontSize:14, animation:"ph-coin 1.4s ease forwards"}}>+{p.n} 🪙</span>))}
                  </div>
                </div>
                <button onClick={()=>setShowThemes(s=>!s)} className="ph-press" aria-label="Change theme"
                  style={{width:38, height:38, borderRadius:"50%", border:`1px solid ${t.cardB}`, background:t.card, cursor:"pointer", fontSize:17}}>🎨</button>

                {showThemes && (
                  <div style={{...glass({borderRadius:18}), position:"absolute", top:46, right:0, zIndex:30, padding:8, width:178}}>
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

            {/* tab content */}
            <div style={{position:"relative", zIndex:2, flex:1, minHeight:0, display:"flex", flexDirection:"column"}}>
              {tab==="home"    && renderHome()}
              {tab==="lobby"   && renderLobby()}
              {tab==="chat"    && (activeChat ? renderThread() : renderChatList())}
              {tab==="friends" && renderFriends()}
              {tab==="me"      && renderMe()}
            </div>

            {/* celebration overlay */}
            {celebrating && (
              <div style={{position:"absolute", inset:0, zIndex:14, pointerEvents:"none", overflow:"hidden"}}>
                {Array.from({length:42}).map((_,i)=>{
                  const cols=[t.accent, t.accent2, "#FFC94D", "#7FD8C0", "#9DB4F0"];
                  return <span key={i} style={{position:"absolute", top:-12, left:`${Math.random()*100}%`,
                    width:8, height:12, borderRadius:2, background:cols[i%cols.length],
                    animation:`ph-confetti ${1.8+Math.random()*1.4}s ease-in ${Math.random()*0.5}s forwards`}}/>;
                })}
                <div style={{position:"absolute", top:"42%", left:0, right:0, textAlign:"center", animation:"ph-pop .5s ease"}}>
                  <div className="ph-disp" style={{fontSize:21, fontWeight:700, color:t.ink, textShadow:"0 2px 12px rgba(255,255,255,.7)"}}>{celebText}</div>
                </div>
              </div>
            )}

            {/* toast */}
            {toast && (
              <div style={{position:"absolute", bottom:80, left:0, right:0, zIndex:15, display:"flex", justifyContent:"center", pointerEvents:"none"}}>
                <div style={{...glass({borderRadius:20}), padding:"10px 16px", fontSize:13, fontWeight:600, color:t.ink, maxWidth:"82%", textAlign:"center", animation:"ph-fade .3s ease"}}>{toast}</div>
              </div>
            )}

            {/* lobby action sheet */}
            {actionSheet && (
              <div onClick={()=>setActionSheet(null)} style={{position:"absolute", inset:0, zIndex:25, background:"rgba(20,12,28,.4)", backdropFilter:"blur(2px)", display:"flex", alignItems:"flex-end"}}>
                <div onClick={e=>e.stopPropagation()} style={{...glass({borderRadius:"28px 28px 0 0"}), width:"100%", padding:"10px 18px 24px", animation:"ph-slideup .3s cubic-bezier(.34,1.4,.5,1)"}}>
                  <div style={{width:42, height:5, borderRadius:5, background:t.inkSoft, opacity:.3, margin:"0 auto 14px"}}/>
                  {(()=>{ const fm=getMood(actionSheet.wellness); return (
                    <div style={{display:"flex", alignItems:"center", gap:13, marginBottom:16}}>
                      <div style={{position:"relative"}}>
                        <span style={{fontSize:48}}>{actionSheet.pet}</span>
                        <span style={{position:"absolute", bottom:-2, right:-6, fontSize:18}}>{fm.badge}</span>
                      </div>
                      <div style={{flex:1, minWidth:0}}>
                        <div className="ph-disp" style={{fontSize:18, fontWeight:600, color:t.ink}}>{actionSheet.petName}</div>
                        <div style={{fontSize:12.5, color:t.inkSoft, fontWeight:600}}>{actionSheet.name}'s companion · {actionSheet.status}</div>
                      </div>
                    </div>
                  ); })()}
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10}}>
                    {[
                      { icon:"👋", label:"Wave",  fn:()=>waveAt(actionSheet) },
                      { icon:"🎉", label:"Cheer", fn:()=>cheerFriend(actionSheet) },
                      { icon:"💬", label:"Chat",  fn:()=>openChat(actionSheet.id) },
                    ].map(b=>(
                      <button key={b.label} onClick={b.fn} className="ph-press"
                        style={{...glass({borderRadius:18}), padding:"14px 6px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer", border:`1px solid ${t.cardB}`}}>
                        <span style={{fontSize:24}}>{b.icon}</span>
                        <span style={{fontSize:12.5, fontWeight:700, color:t.ink}}>{b.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* bottom nav */}
            <div style={{position:"relative", zIndex:20, display:"flex", justifyContent:"space-around", alignItems:"center",
              padding:"10px 6px 16px", background:t.card, borderTop:`1px solid ${t.cardB}`, backdropFilter:"blur(14px)"}}>
              {NAV.map(item=>{
                const active = tab===item.k && !(item.k==="chat" && false);
                const showBadge = item.k==="chat" && totalUnread>0;
                return (
                  <button key={item.k} className="ph-press"
                    onClick={()=>{ setTab(item.k); if(item.k!=="chat") setActiveChat(null); setShowThemes(false); }}
                    style={{position:"relative", display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", cursor:"pointer", padding:"2px 6px", opacity: active?1:0.5}}>
                    <span style={{fontSize:20, filter: active?"none":"grayscale(.4)"}}>{item.icon}</span>
                    <span style={{fontSize:10, fontWeight:800, color: active? t.accent : t.inkSoft}}>{item.label}</span>
                    {showBadge && <span style={{position:"absolute", top:-2, right:2, minWidth:15, height:15, padding:"0 4px", borderRadius:8, background:t.accent, color:"#fff", fontSize:9.5, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center"}}>{totalUnread}</span>}
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
