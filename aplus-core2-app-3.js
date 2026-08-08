function renderDrillCards(){
  const box=document.getElementById("drill-cards");if(!box)return;
  box.innerHTML=DOMAINS.map(d=>{const n=QUESTIONS.filter(q=>q.domain===d).length;return `<div class="card mode-card" data-domain="${esc(d)}"><h3>${esc(d)}</h3><p>Every source question assigned to this domain, shuffled and untimed.</p><div class="count">${n} questions</div></div>`}).join("");
  box.querySelectorAll(".mode-card").forEach(el=>el.addEventListener("click",()=>startDomainDrill(el.dataset.domain)))
}

function renderFlashSetup(){
  const box=document.getElementById("flash-dom-filter");if(!box)return;
  box.innerHTML=DOMAINS.map(d=>`<button type="button" class="filter-chip ${flash.domains.has(d)?"on":""}" data-domain="${esc(d)}">${esc(d)} (${QUESTIONS.filter(q=>q.domain===d).length})</button>`).join("");
  box.querySelectorAll(".filter-chip").forEach(el=>el.addEventListener("click",()=>{const d=el.dataset.domain;if(flash.domains.has(d)&&flash.domains.size>1)flash.domains.delete(d);else flash.domains.add(d);renderFlashSetup()}))
}
function startFlash(){
  const hide=document.getElementById("flash-hideknown").checked;
  let pool=QUESTIONS.filter(q=>flash.domains.has(q.domain)&&(!hide||!progress.known[q.id]));
  if(!pool.length){alert("No cards match those settings.");return}
  flash.deck=shuffle(pool);flash.index=0;go("flash");renderCard()
}
function renderCard(){
  const q=flash.deck[flash.index];if(!q)return;
  document.getElementById("flashcard").classList.remove("flipped");document.getElementById("fc-index").textContent=flash.index+1;document.getElementById("fc-total").textContent=flash.deck.length;
  document.getElementById("fc-known").textContent=flash.deck.filter(x=>progress.known[x.id]).length;document.getElementById("fc-left").textContent=flash.deck.filter(x=>!progress.known[x.id]).length;
  document.getElementById("fc-pbar").style.width=`${((flash.index+1)/flash.deck.length)*100}%`;document.getElementById("fc-tag").textContent=`${q.domain} · Source ${q.sourceQuestion}`;
  document.getElementById("fc-front").textContent=q.q;document.getElementById("fc-answer").textContent=q.correct.map(i=>q.options[i]).join("; ");document.getElementById("fc-back").textContent=q.explanation;
  const status=document.getElementById("fc-status");status.textContent=progress.known[q.id]?"Marked known":"Not yet marked";status.className=`known-badge ${progress.known[q.id]?"known":"unknown"}`
}
function flipCard(){document.getElementById("flashcard").classList.toggle("flipped")}
function nextCard(){if(!flash.deck.length)return;flash.index=(flash.index+1)%flash.deck.length;renderCard()}
function prevCard(){if(!flash.deck.length)return;flash.index=(flash.index-1+flash.deck.length)%flash.deck.length;renderCard()}
function markCard(known){const q=flash.deck[flash.index];if(!q)return;if(known)progress.known[q.id]=true;else delete progress.known[q.id];saveProgress();nextCard()}

function renderStats(){
  const attempts=progress.attempts||[],known=Object.keys(progress.known||{}).length;
  document.getElementById("st-attempts").textContent=attempts.length;document.getElementById("st-best").textContent=attempts.length?`${Math.max(...attempts.map(a=>a.score))}%`:"-";
  document.getElementById("st-avg").textContent=attempts.length?`${Math.round(attempts.reduce((s,a)=>s+a.score,0)/attempts.length)}%`:"-";document.getElementById("st-known").textContent=known;document.getElementById("st-missed").textContent=progress.missed.length;
  const tbody=document.getElementById("mastery-table");tbody.innerHTML=DOMAINS.map(d=>{const m=progress.mastery[d]||{seen:0,correct:0};const p=m.seen?Math.round(m.correct/m.seen*100):0;return `<tr><td>${esc(d)}</td><td>${m.seen}</td><td><div class="bar"><span style="width:${p}%"></span></div></td><td>${m.seen?p+"%":"-"}</td></tr>`}).join("");
  const history=document.getElementById("history-list");if(!attempts.length)history.innerHTML='<div class="empty">No completed sessions yet.</div>';
  else history.innerHTML=attempts.map(a=>{const date=new Date(a.date);return `<div class="history-item"><div><div class="hmain">${esc(a.mode||"Practice session")}</div><div class="hsub">${date.toLocaleDateString()} ${date.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})} · ${a.correct}/${a.total} · ${formatDuration(a.duration)}</div></div><span class="pill ${a.score>=80?"ok":a.score>=70?"mid":"weak"}">${a.score}%</span></div>`}).join("")
}
function resetProgress(){if(confirm("Delete all trainer scores, mastery, missed questions, and known-card marks?")){progress=blankProgress();saveProgress();renderStats();renderFlashSetup()}}
function refreshHome(){
  const known=Object.keys(progress.known||{}).length,missed=progress.missed.length;
  const knownEl=document.getElementById("home-known-count");if(knownEl)knownEl.textContent=known;
  const missedEl=document.getElementById("home-missed-count");if(missedEl)missedEl.textContent=`${missed} missed question${missed===1?"":"s"} saved`;
  const btn=document.getElementById("missed-drill-btn");if(btn)btn.disabled=missed===0;
  const dc=document.getElementById("home-domain-counts");if(dc)dc.textContent=DOMAINS.map(d=>`${d}: ${QUESTIONS.filter(q=>q.domain===d).length}`).join(" · ")
}

function initTheme(){const saved=localStorage.getItem(THEME_KEY);const theme=saved||(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");setTheme(theme)}
function setTheme(theme){document.documentElement.dataset.theme=theme;localStorage.setItem(THEME_KEY,theme);document.getElementById("theme-btn").textContent=theme==="dark"?"☀":"☽"}
function toggleTheme(){setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark")}

document.addEventListener("keydown",e=>{
  const exam=document.getElementById("view-exam").classList.contains("active");const flashView=document.getElementById("view-flash").classList.contains("active");
  if(exam){
    if(/^[1-9]$/.test(e.key)){const q=state.questions[state.index],di=Number(e.key)-1;if(q&&di<q.order.length)selectOption(q.order[di])}
    else if(e.key==="Enter"){e.preventDefault();if(!state.submitted[state.index])submitAnswer();else if(state.index<state.questions.length-1)nextQuestion();else finishExam()}
    else if(e.key==="ArrowLeft")prevQuestion();else if(e.key==="ArrowRight"&&state.submitted[state.index]){if(state.index<state.questions.length-1)nextQuestion()}
  }else if(flashView){
    if(e.code==="Space"){e.preventDefault();flipCard()}else if(e.key==="ArrowLeft")prevCard();else if(e.key==="ArrowRight")nextCard();else if(e.key.toLowerCase()==="k")markCard(true);else if(e.key.toLowerCase()==="j")markCard(false)
  }
});

init();
