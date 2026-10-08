fetch('/api/places').then(r=>r.json()).then(P=>{
 const fb=document.getElementById('fallback');
 const card=p=>`<b>${p.name}</b><br>${p.text}<br><small>Дереккөз: ${p.source}</small><br><i>Фото кейін енгізіледі</i>`;
 function fallback(){document.getElementById('map').innerHTML='<p style="padding:20px">Карта кітапханасы (Leaflet) жүктелмеді — интернет жоқ. static/vendor/leaflet.js қойыңыз. Тізім төменде.</p>';fb.innerHTML=P.map(p=>`<div class="card">${card(p)}</div>`).join('')}
 function init(){if(!window.L)return fallback();const m=L.map('map').setView([P[0].lat,P[0].lng],11);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(m);
  P.forEach(p=>L.marker([p.lat,p.lng]).addTo(m).bindPopup(card(p)))}
 const load=(u,cb,css)=>{if(css){const l=document.createElement('link');l.rel='stylesheet';l.href=css;document.head.appendChild(l)}
  const s=document.createElement('script');s.src=u;s.onload=cb;s.onerror=cb.err;document.body.appendChild(s)};
 const cdn=()=>load('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',init,'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
 const t=()=>{};t.err=fallback;cdn.err=null;
 const s=document.createElement('script');s.src='/static/vendor/leaflet.js';s.onload=init;s.onerror=()=>{const sc=document.createElement('script');sc.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  const l=document.createElement('link');l.rel='stylesheet';l.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.appendChild(l);sc.onload=init;sc.onerror=fallback;document.body.appendChild(sc)};document.body.appendChild(s)});
