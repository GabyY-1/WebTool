const tabs=document.querySelectorAll(".tool-tab,.extra-tool");
const tools=document.querySelectorAll(".tool");

tabs.forEach(tab=>tab.addEventListener("click",()=>{
  tabs.forEach(item=>item.classList.remove("active"));
  tools.forEach(tool=>tool.classList.remove("active"));
  tab.classList.add("active");
  document.getElementById(tab.dataset.tool).classList.add("active");
  document.querySelector(".tool-panel").scrollIntoView({behavior:"smooth",block:"start"});
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

document.getElementById("calculatorRun").addEventListener("click",()=>{
  const value=document.getElementById("calculatorInput").value.replace(/,/g,".");
  if(!/^[0-9+\-*/().\s]+$/.test(value)){document.getElementById("calculatorResult").textContent="Calcul invalide.";return}
  try{const result=Function("return "+value)();document.getElementById("calculatorResult").textContent=Number.isFinite(result)?result:"Calcul invalide."}catch{document.getElementById("calculatorResult").textContent="Calcul invalide."}
});

document.getElementById("percentageRun").addEventListener("click",()=>{
  const value=Number(document.getElementById("percentageValue").value),rate=Number(document.getElementById("percentageRate").value);
  document.getElementById("percentageResult").textContent=Number.isFinite(value)&&Number.isFinite(rate)?(value*rate/100).toFixed(2):"Entre deux valeurs."
});

document.getElementById("romanRun").addEventListener("click",()=>{
  let n=Number(document.getElementById("romanValue").value),result="";
  const values=[[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
  if(!Number.isInteger(n)||n<1||n>3999){document.getElementById("romanResult").textContent="Nombre entre 1 et 3999.";return}
  values.forEach(([v,s])=>{while(n>=v){result+=s;n-=v}});
  document.getElementById("romanResult").textContent=result;
});

document.getElementById("loremRun").addEventListener("click",()=>{
  const count=Math.min(20,Math.max(1,Number(document.getElementById("loremCount").value)||1));
  const text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere, massa at consequat tincidunt, justo libero porta lorem.";
  document.getElementById("loremResult").value=Array.from({length:count},()=>text).join("\n\n");
});

document.getElementById("diceRun").addEventListener("click",()=>{
  const count=Math.min(20,Math.max(1,Number(document.getElementById("diceCount").value)||1));
  const rolls=Array.from({length:count},()=>Math.floor(Math.random()*6)+1);
  document.getElementById("diceResult").textContent=rolls.join(" · ")+" — Total : "+rolls.reduce((a,b)=>a+b,0);
});

document.getElementById("colorRun").addEventListener("click",()=>{
  const value=document.getElementById("colorValue").value.trim();
  const result=document.getElementById("colorResult");
  if(/^#?[0-9a-fA-F]{6}$/.test(value)){
    const hex=value.replace("#","").toUpperCase();
    result.textContent="#"+hex+" → RGB("+parseInt(hex.slice(0,2),16)+", "+parseInt(hex.slice(2,4),16)+", "+parseInt(hex.slice(4,6),16)+")";
  }else{
    const match=value.match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/);
    if(!match||match.some?.(()=>false)){}
    if(match&&match.slice(1).every(v=>Number(v)<=255)){const rgb=match.slice(1).map(Number);result.textContent="RGB("+rgb.join(", ")+") → #"+rgb.map(v=>v.toString(16).padStart(2,"0")).join("").toUpperCase()}else result.textContent="Couleur invalide.";
  }
});

function runConversion(inputId,typeId,resultId,map){
  document.getElementById(inputId).addEventListener("input",()=>convertExtra(inputId,typeId,resultId,map));
  document.getElementById(typeId).addEventListener("change",()=>convertExtra(inputId,typeId,resultId,map));
}
function convertExtra(inputId,typeId,resultId,map){
  const value=Number(document.getElementById(inputId).value),type=document.getElementById(typeId).value;
  document.getElementById(resultId).textContent=Number.isFinite(value)?map[type](value).toFixed(4):"Entre une valeur.";
}
runConversion("timeValue","timeType","timeResult",{"s-m":v=>v/60,"m-s":v=>v*60,"m-h":v=>v/60,"h-m":v=>v*60});
runConversion("sizeValue","sizeType","sizeResult",{"b-kb":v=>v/1024,"kb-b":v=>v*1024,"mb-gb":v=>v/1024,"gb-mb":v=>v*1024});

document.getElementById("timeRun").addEventListener("click",()=>document.getElementById("timeValue").dispatchEvent(new Event("input")));
document.getElementById("sizeRun").addEventListener("click",()=>document.getElementById("sizeValue").dispatchEvent(new Event("input")));

document.getElementById("usernameRun").addEventListener("click",()=>{
  const a=["Pixel","Nova","Shadow","Turbo","Luna","Byte","Neo","Flash","Cyber","Storm"];
  const b=["Dev","Code","Craft","Lab","Fox","Wave","Core","Zone","Play","Tech"];
  document.getElementById("usernameResult").textContent=a[Math.floor(Math.random()*a.length)]+b[Math.floor(Math.random()*b.length)]+Math.floor(Math.random()*1000);
});

generatePassword();