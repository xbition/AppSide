const apps = [
 {id:"filebox",name:"FileBox",category:"tools",label:"Утилиты",emoji:"▣",bg:"#273b35",fg:"#a4f0c8",desc:"Демонстрационная карточка файлового менеджера.",version:"1.0.0"},
 {id:"pixel-run",name:"Pixel Run",category:"games",label:"Игры",emoji:"✦",bg:"#3b2b50",fg:"#e4b9ff",desc:"Демонстрационная карточка аркадной игры.",version:"1.0.0"},
 {id:"quicknote",name:"QuickNote",category:"other",label:"Другое",emoji:"✎",bg:"#4a3a25",fg:"#ffd58a",desc:"Демонстрационная карточка заметок.",version:"1.0.0"}
];
let activeFilter="all";
let saved=new Set(JSON.parse(localStorage.getItem("araik-saved")||"[]"));
const grid=document.querySelector("#appGrid"), search=document.querySelector("#searchInput");
function render(){
 const q=search.value.trim().toLowerCase();
 const shown=apps.filter(a=>(activeFilter==="all"||a.category===activeFilter)&&(`${a.name} ${a.desc} ${a.label}`).toLowerCase().includes(q));
 grid.innerHTML=shown.map(a=>`<article class="app-card">
  <div class="app-top"><div class="app-icon" style="--iconbg:${a.bg};--iconcolor:${a.fg}">${a.emoji}</div>
  <button class="favorite ${saved.has(a.id)?"saved":""}" data-fav="${a.id}" aria-label="Избранное">${saved.has(a.id)?"★":"☆"}</button></div>
  <h3>${a.name}</h3><p>${a.desc}</p>
  <div class="app-bottom"><span class="tag">${a.label} · v${a.version}</span><button class="details-btn" data-details="${a.id}">Подробнее</button></div>
 </article>`).join("");
 document.querySelector("#emptyState").hidden=shown.length!==0;
 document.querySelector("#appCount").textContent=`${shown.length} ${shown.length===1?"приложение":"приложения"}`;
 renderLibrary();
}
function renderLibrary(){
 const items=apps.filter(a=>saved.has(a.id));
 document.querySelector("#savedCount").textContent=`${items.length} сохранено`;
 document.querySelector("#libraryPanel").innerHTML=items.length?`<div class="saved-list">${items.map(a=>`<div class="saved-row"><div class="app-icon" style="--iconbg:${a.bg};--iconcolor:${a.fg}">${a.emoji}</div><div><b>${a.name}</b><small>${a.label} · v${a.version}</small></div><button class="favorite saved" data-fav="${a.id}">★</button></div>`).join("")}</div>`:`<div class="library-empty"><span>☆</span><b>Пока здесь пусто</b><small>Добавляй приложения в избранное, чтобы быстро находить их.</small></div>`;
}
document.addEventListener("click",e=>{
 const fav=e.target.closest("[data-fav]"); if(fav){const id=fav.dataset.fav;saved.has(id)?saved.delete(id):saved.add(id);localStorage.setItem("araik-saved",JSON.stringify([...saved]));render();return;}
 const det=e.target.closest("[data-details]"); if(det){const a=apps.find(x=>x.id===det.dataset.details);alert(`${a.name}\nВерсия: ${a.version}\n\nЭто демонстрационная запись каталога. IPA-файл и установка пока не подключены.`);return;}
 if(e.target.matches("[data-close]"))document.querySelector("#infoDialog").close();
});
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeFilter=b.dataset.filter;render();}));
search.addEventListener("input",render);
document.querySelector("#howBtn").addEventListener("click",()=>document.querySelector("#infoDialog").showModal());
let deferredPrompt;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;const b=document.querySelector("#installBtn");b.hidden=false;b.onclick=async()=>{deferredPrompt.prompt();deferredPrompt=null;b.hidden=true;};});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();