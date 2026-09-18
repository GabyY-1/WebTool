const tabs=document.querySelectorAll(".tool-tab");
const tools=document.querySelectorAll(".tool");

tabs.forEach(tab=>tab.addEventListener("click",()=>{
  tabs.forEach(item=>item.classList.remove("active"));
  tools.forEach(tool=>tool.classList.remove("active"));
  tab.classList.add("active");
  document.getElementById(tab.dataset.tool).classList.add("active");
}));

async function copyText(text){
  try{await navigator.clipboard.writeText(text);return true}catch{
    const input=document.createElement("textarea");
    input.value=text;document.body.appendChild(input);input.select();
    const ok=document.execCommand("copy");input.remove();return ok;
  }
}

const passwordResult=document.getElementById("passwordResult");
const passwordLength=document.getElementById("passwordLength");
const passwordLengthValue=document.getElementById("passwordLengthValue");

function generatePassword(){
  const chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
  let result="";
  for(let i=0;i<Number(passwordLength.value);i++) result+=chars[Math.floor(Math.random()*chars.length)];
  passwordResult.value=result;
}
passwordLength.addEventListener("input",()=>{passwordLengthValue.textContent=passwordLength.value;generatePassword()});
document.getElementById("generatePassword").addEventListener("click",generatePassword);

document.querySelectorAll("[data-copy-input]").forEach(button=>button.addEventListener("click",async()=>{
  if(await copyText(document.getElementById(button.dataset.copyInput).value)){button.textContent="Copié !";setTimeout(()=>button.textContent="Copier",900)}
}));

const counterText=document.getElementById("counterText");
function updateCounter(){
  const text=counterText.value;
  document.getElementById("charCount").textContent=text.length;
  document.getElementById("wordCount").textContent=text.trim()?text.trim().split(/\s+/).length:0;
  document.getElementById("lineCount").textContent=text?text.split("\n").length:0;
}
counterText.addEventListener("input",updateCounter);

const convertValue=document.getElementById("convertValue");
const convertType=document.getElementById("convertType");
function convert(){
  const value=Number(convertValue.value);
  if(!Number.isFinite(value)){document.getElementById("convertResult").textContent="Entre une valeur.";return}
  const type=convertType.value;
  let result=value;
  if(type==="km-mi")result=value*.621371;
  if(type==="mi-km")result=value/0.621371;
  if(type==="kg-lb")result=value*2.20462;
  if(type==="lb-kg")result=value/2.20462;
  if(type==="c-f")result=value*9/5+32;
  if(type==="f-c")result=(value-32)*5/9;
  document.getElementById("convertResult").textContent=result.toFixed(2);
}
convertValue.addEventListener("input",convert);convertType.addEventListener("change",convert);

let stopwatchTime=0,stopwatchInterval=null;
function formatStopwatch(ms){const total=Math.floor(ms/1000),h=Math.floor(total/3600),m=Math.floor(total%3600/60),s=total%60;return [h,m,s].map(v=>String(v).padStart(2,"0")).join(":")}
document.getElementById("stopwatchStart").addEventListener("click",function(){
  if(stopwatchInterval){clearInterval(stopwatchInterval);stopwatchInterval=null;this.textContent="Démarrer";return}
  const start=Date.now()-stopwatchTime;
  stopwatchInterval=setInterval(()=>{stopwatchTime=Date.now()-start;document.getElementById("stopwatchDisplay").textContent=formatStopwatch(stopwatchTime)},100);
  this.textContent="Pause";
});
document.getElementById("stopwatchReset").addEventListener("click",()=>{clearInterval(stopwatchInterval);stopwatchInterval=null;stopwatchTime=0;document.getElementById("stopwatchDisplay").textContent="00:00:00";document.getElementById("stopwatchStart").textContent="Démarrer"});

let timerInterval=null,timerRemaining=0;
function formatTimer(seconds){return [Math.floor(seconds/60),seconds%60].map(v=>String(v).padStart(2,"0")).join(":")}
function updateTimer(){document.getElementById("timerDisplay").textContent=formatTimer(timerRemaining)}
document.getElementById("timerStart").addEventListener("click",()=>{
  if(timerInterval){clearInterval(timerInterval);timerInterval=null;return}
  if(timerRemaining===0)timerRemaining=Number(document.getElementById("timerMinutes").value||0)*60+Number(document.getElementById("timerSeconds").value||0);
  if(timerRemaining<=0)return;
  updateTimer();
  timerInterval=setInterval(()=>{timerRemaining--;updateTimer();if(timerRemaining<=0){clearInterval(timerInterval);timerInterval=null;alert("Minuteur terminé.")}},1000);
});
document.getElementById("timerReset").addEventListener("click",()=>{clearInterval(timerInterval);timerInterval=null;timerRemaining=0;updateTimer()});

function updateDates(){
  const start=document.getElementById("dateStart").value,end=document.getElementById("dateEnd").value;
  if(!start||!end){document.getElementById("dateResult").textContent="Sélectionne deux dates.";return}
  const days=Math.round(Math.abs((new Date(end)-new Date(start))/86400000));
  document.getElementById("dateResult").textContent=days+" jour"+(days>1?"s":"")+" d'écart";
}
document.getElementById("dateStart").addEventListener("change",updateDates);document.getElementById("dateEnd").addEventListener("change",updateDates);

const caseText=document.getElementById("caseText");
document.querySelectorAll("[data-case]").forEach(button=>button.addEventListener("click",()=>{
  const type=button.dataset.case;
  if(type==="upper")caseText.value=caseText.value.toUpperCase();
  if(type==="lower")caseText.value=caseText.value.toLowerCase();
  if(type==="capitalize")caseText.value=caseText.value.replace(/(^|\s)\S/g,c=>c.toUpperCase());
}));

document.getElementById("cleanButton").addEventListener("click",()=>{
  document.getElementById("cleanText").value=document.getElementById("cleanText").value.replace(/[ \t]+/g," ").replace(/\n\s+/g,"\n").trim();
});

document.getElementById("randomGenerate").addEventListener("click",()=>{
  let min=Number(document.getElementById("randomMin").value),max=Number(document.getElementById("randomMax").value);
  if(min>max)[min,max]=[max,min];
  document.getElementById("randomResult").textContent=Math.floor(Math.random()*(max-min+1))+min;
});

document.getElementById("encodeUrl").addEventListener("click",()=>{const el=document.getElementById("urlText");el.value=encodeURIComponent(el.value)});
document.getElementById("decodeUrl").addEventListener("click",()=>{const el=document.getElementById("urlText");try{el.value=decodeURIComponent(el.value)}catch{el.value="URL invalide"}});

generatePassword();
