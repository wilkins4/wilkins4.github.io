function renderQuestion(){
  const q=state.questions[state.index];if(!q)return;
  const selected=state.answers[state.index];const locked=state.submitted[state.index];
  document.getElementById("q-index").textContent=state.index+1;
  document.getElementById("q-total").textContent=state.questions.length;
  document.getElementById("answered-count").textContent=state.submitted.filter(Boolean).length;
  document.getElementById("pbar-fill").style.width=`${((state.index+1)/state.questions.length)*100}%`;
  document.getElementById("q-domain").textContent=q.domain;
  document.getElementById("q-source").textContent=`Source question ${q.sourceQuestion}`;
  document.getElementById("q-stem").textContent=q.q;
  const multi=document.getElementById("q-multi");
  if(q.correct.length>1){multi.style.display="block";multi.textContent=`Choose ${numberWord(q.correct.length)} answers.`}else multi.style.display="none";
  const opts=document.getElementById("q-options");opts.innerHTML="";
  q.order.forEach((orig,displayIndex)=>{
    const btn=document.createElement("button");btn.type="button";btn.className="opt-row";
    const isSel=selected.includes(orig);if(isSel)btn.classList.add("sel");
    if(locked){btn.classList.add("locked");if(q.correct.includes(orig))btn.classList.add("correct");else if(isSel)btn.classList.add("wrong")}
    btn.innerHTML=`<span class="key">${displayIndex+1}</span><span class="option-text">${esc(q.options[orig])}</span>`;
    btn.addEventListener("click",()=>selectOption(orig));opts.appendChild(btn);
  });
  const submit=document.getElementById("submit-btn"),next=document.getElementById("next-btn"),finish=document.getElementById("finish-btn");
  submit.style.display=locked?"none":"inline-block";submit.disabled=selected.length!==q.correct.length;
  next.style.display=locked&&state.index<state.questions.length-1?"inline-block":"none";
  finish.style.display=locked&&state.index===state.questions.length-1?"inline-block":"none";
  document.getElementById("prev-btn").disabled=state.index===0;
  const explain=document.getElementById("q-explain");
  if(locked){const ok=sameSet(selected,q.correct);explain.classList.add("show");document.getElementById("exp-verdict").className=`verdict ${ok?"ok":"no"}`;document.getElementById("exp-verdict").textContent=ok?"Correct":"Incorrect";document.getElementById("exp-text").textContent=q.explanation}
  else explain.classList.remove("show");
}
function selectOption(orig){
  if(state.submitted[state.index])return;
  const q=state.questions[state.index],arr=state.answers[state.index];
  if(q.correct.length===1)state.answers[state.index]=[orig];
  else if(arr.includes(orig))state.answers[state.index]=arr.filter(x=>x!==orig);
  else if(arr.length<q.correct.length)state.answers[state.index]=[...arr,orig];
  renderQuestion();
}
function submitAnswer(){
  const q=state.questions[state.index];if(state.answers[state.index].length!==q.correct.length)return;
  state.submitted[state.index]=true;renderQuestion();
}
function prevQuestion(){if(state.index>0){state.index--;renderQuestion();window.scrollTo({top:0,behavior:"smooth"})}}
function nextQuestion(){if(state.index<state.questions.length-1){state.index++;renderQuestion();window.scrollTo({top:0,behavior:"smooth"})}}

function startTimer(){
  updateTimer();state.timerId=setInterval(()=>{state.timeRemaining--;updateTimer();if(state.timeRemaining<=0){stopTimer();finishExam(true)}},1000)
}
function stopTimer(){if(state.timerId){clearInterval(state.timerId);state.timerId=null}}
function updateTimer(){
  const el=document.getElementById("timer");el.textContent=formatTime(state.timeRemaining);el.classList.remove("warn","danger");
  if(state.timeRemaining<=60)el.classList.add("danger");else if(state.timeRemaining<=300)el.classList.add("warn")
}

function finishExam(timedOut=false){
  stopTimer();
  const results=state.questions.map((q,i)=>({q,selected:state.answers[i],correct:sameSet(state.answers[i],q.correct)}));
  const correct=results.filter(r=>r.correct).length,total=results.length,pct=Math.round(correct/total*100),duration=Date.now()-state.startedAt;
  saveAttempt(results,pct,correct,total,duration);
  renderResults(results,pct,correct,total,duration,timedOut);go("results")
}
function saveAttempt(results,pct,correct,total,duration){
  progress.attempts.unshift({date:new Date().toISOString(),score:pct,correct,total,duration,mode:state.label});progress.attempts=progress.attempts.slice(0,50);
  const missed=new Set(progress.missed);
  results.forEach(r=>{
    const d=r.q.domain;progress.mastery[d]=progress.mastery[d]||{seen:0,correct:0};progress.mastery[d].seen++;if(r.correct)progress.mastery[d].correct++;
    if(r.correct)missed.delete(r.q.id);else missed.add(r.q.id);
  });
  progress.missed=[...missed].sort((a,b)=>a-b);saveProgress();
}
function renderResults(results,pct,correct,total,duration,timedOut){
  state.lastResults=results;state.reviewMissedOnly=false;
  document.getElementById("results-sub").textContent=`${state.label}${timedOut?" · Time expired":""}`;
  document.getElementById("score-pct").textContent=`${pct}%`;document.getElementById("score-frac").textContent=`${correct} / ${total}`;
  const ring=document.getElementById("score-ring");ring.style.setProperty("--p",pct);ring.style.setProperty("--ring",pct>=80?"var(--good)":pct>=70?"var(--warn)":"var(--bad)");
  document.getElementById("score-verdict").textContent=pct>=80?"Strong result":pct>=70?"Close, review the weak domains":"Review the missed questions before retesting";
  document.getElementById("score-time").textContent=`Completed in ${formatDuration(duration)}`;
  const tbody=document.getElementById("dom-breakdown");tbody.innerHTML="";
  DOMAINS.forEach(d=>{
    const rows=results.filter(r=>r.q.domain===d);if(!rows.length)return;const c=rows.filter(r=>r.correct).length,p=Math.round(c/rows.length*100);
    const status=p>=80?["Ready","ok"]:p>=70?["Review","mid"]:["Weak","weak"];
    tbody.insertAdjacentHTML("beforeend",`<tr><td>${esc(d)}</td><td>${c} / ${rows.length}</td><td><div class="bar"><span style="width:${p}%"></span></div></td><td><span class="pill ${status[1]}">${status[0]} ${p}%</span></td></tr>`)
  });
  document.getElementById("missed-count").textContent=results.filter(r=>!r.correct).length;document.getElementById("review-filter-btn").textContent="Show missed only";
  document.getElementById("results-missed-btn").disabled=progress.missed.length===0;renderReview();
}
function toggleReviewFilter(){state.reviewMissedOnly=!state.reviewMissedOnly;document.getElementById("review-filter-btn").textContent=state.reviewMissedOnly?"Show all":"Show missed only";renderReview()}
function renderReview(){
  const box=document.getElementById("review-list");let rows=state.lastResults||[];if(state.reviewMissedOnly)rows=rows.filter(r=>!r.correct);
  if(!rows.length){box.innerHTML='<div class="empty">No questions match this filter.</div>';return}
  box.innerHTML=rows.map(r=>{
    const yours=r.selected.length?r.selected.map(i=>r.q.options[i]).join("; "):"No answer submitted";
    const right=r.q.correct.map(i=>r.q.options[i]).join("; ");
    return `<div class="review-item"><div class="question-meta"><span class="domain-tag">${esc(r.q.domain)}</span><span class="source-tag">Source question ${r.q.sourceQuestion}</span><span class="pill ${r.correct?"ok":"weak"}">${r.correct?"Correct":"Missed"}</span></div><div class="rq">${esc(r.q.q)}</div>${r.correct?"":`<div class="ra yours"><b>Your answer:</b> ${esc(yours)}</div>`}<div class="ra right"><b>Correct answer:</b> ${esc(right)}</div><div class="rexp">${esc(r.q.explanation)}</div></div>`
  }).join("")
}
