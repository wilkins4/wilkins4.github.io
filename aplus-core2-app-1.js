const STORAGE_KEY="sw-aplus-1202-trainer-v1";
const THEME_KEY="sw-aplus-1202-theme";

let progress=loadProgress();
let setup={length:50,domain:"All"};
let state={mode:null,label:"",questions:[],index:0,answers:[],submitted:[],startedAt:0,timerId:null,timeLimit:0,timeRemaining:0,reviewMissedOnly:false};
let flash={domains:new Set(DOMAINS),deck:[],index:0};

function blankProgress(){return{attempts:[],mastery:{},known:{},missed:[]}}
function loadProgress(){
  try{
    const value=JSON.parse(localStorage.getItem(STORAGE_KEY));
    return value&&typeof value==="object"?Object.assign(blankProgress(),value):blankProgress();
  }catch(e){return blankProgress()}
}
function saveProgress(){localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));refreshHome()}
function shuffle(arr){
  const out=[...arr];
  for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}
  return out
}
function sameSet(a,b){return a.length===b.length&&[...a].sort((x,y)=>x-y).every((v,i)=>v===[...b].sort((x,y)=>x-y)[i])}
function formatTime(sec){sec=Math.max(0,Math.floor(sec));const m=Math.floor(sec/60);const s=sec%60;return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`}
function formatDuration(ms){const sec=Math.round(ms/1000);if(sec<60)return `${sec}s`;return `${Math.floor(sec/60)}m ${sec%60}s`}
function esc(s){return String(s).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]))}
function numberWord(n){return["ZERO","ONE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGHT","NINE"][n]||String(n)}
function runtimeQuestion(q,shuffleChoices=true){return{...q,order:shuffleChoices?shuffle(q.options.map((_,i)=>i)):q.options.map((_,i)=>i)}}

function go(name){
  stopTimer();
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  const target=document.getElementById(`view-${name}`);if(target)target.classList.add("active");
  if(name==="home")refreshHome();
  if(name==="setup")renderSetup();
  if(name==="drill")renderDrillCards();
  if(name==="flashsetup")renderFlashSetup();
  if(name==="stats")renderStats();
  window.scrollTo({top:0,behavior:"smooth"});
}

function init(){
  initTheme();
  document.querySelectorAll("#len-seg .opt").forEach(el=>el.addEventListener("click",()=>{
    setup.length=Number(el.dataset.len);document.querySelectorAll("#len-seg .opt").forEach(x=>x.classList.toggle("sel",x===el));
  }));
  refreshHome();renderSetup();renderDrillCards();renderFlashSetup();
}

function renderSetup(){
  const box=document.getElementById("dom-seg");
  box.innerHTML=["All",...DOMAINS].map(d=>`<div class="opt ${setup.domain===d?"sel":""}" data-domain="${esc(d)}">${esc(d)}<small>${d==="All"?QUESTIONS.length:QUESTIONS.filter(q=>q.domain===d).length} questions</small></div>`).join("");
  box.querySelectorAll(".opt").forEach(el=>el.addEventListener("click",()=>{setup.domain=el.dataset.domain;renderSetup()}));
  document.getElementById("missed-toggle").disabled=progress.missed.length===0;
  if(progress.missed.length===0)document.getElementById("missed-toggle").checked=false;
}

function startPractice(){
  let pool=QUESTIONS.filter(q=>setup.domain==="All"||q.domain===setup.domain);
  const prioritize=document.getElementById("missed-toggle").checked&&progress.missed.length>0;
  if(prioritize){
    const missedSet=new Set(progress.missed);pool=[...shuffle(pool.filter(q=>missedSet.has(q.id))),...shuffle(pool.filter(q=>!missedSet.has(q.id)))];
  }else pool=shuffle(pool);
  const count=Math.min(setup.length,pool.length);
  const timer=document.getElementById("timer-toggle").checked;
  beginSession(pool.slice(0,count),"practice",setup.domain==="All"?"Randomized practice exam":`${setup.domain} practice exam`,timer,true);
}
function startSourceReplay(){beginSession([...QUESTIONS].sort((a,b)=>a.sourceQuestion-b.sourceQuestion),"replay","90-question source replay",false,true)}
function startDomainDrill(domain){const pool=shuffle(QUESTIONS.filter(q=>q.domain===domain));beginSession(pool,"drill",`${domain} domain drill`,false,true)}
function startMissedDrill(){
  if(!progress.missed.length){alert("No missed questions are saved yet. Complete a practice session first.");return}
  const ids=new Set(progress.missed);const pool=shuffle(QUESTIONS.filter(q=>ids.has(q.id)));
  beginSession(pool,"missed","Missed-question drill",false,true);
}
function beginSession(pool,mode,label,useTimer,shuffleChoices){
  stopTimer();
  state={mode,label,questions:pool.map(q=>runtimeQuestion(q,shuffleChoices)),index:0,answers:pool.map(()=>[]),submitted:pool.map(()=>false),startedAt:Date.now(),timerId:null,timeLimit:useTimer?pool.length*72:0,timeRemaining:useTimer?pool.length*72:0,reviewMissedOnly:false};
  go("exam");renderQuestion();
  if(useTimer){document.getElementById("timer").style.display="block";startTimer()}else document.getElementById("timer").style.display="none";
}
function quitExam(){if(confirm("Quit this session? Current answers will not be saved."))go("home")}
