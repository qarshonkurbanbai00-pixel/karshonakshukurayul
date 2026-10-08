window.addEventListener('load',()=>setTimeout(()=>document.getElementById('loader').classList.add('hide'),400));
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
$('#burger').onclick=()=>$('#menu').classList.toggle('open');
const top=$('#top');top.onclick=()=>scrollTo({top:0,behavior:'smooth'});
addEventListener('scroll',()=>top.style.display=scrollY>400?'block':'none');
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('on')));$$('.reveal').forEach(e=>io.observe(e));
$$('.search').forEach(i=>i.oninput=()=>$$(i.dataset.filter).forEach(c=>c.style.display=c.textContent.toLowerCase().includes(i.value.toLowerCase())?'':'none'));
$$('.cat').forEach(b=>b.onclick=()=>$$('.item').forEach(c=>c.style.display=!b.dataset.cat||c.dataset.cat===b.dataset.cat?'':'none'));
const ba=$('#ba');if(ba)ba.oninput=()=>$('#old').style.clipPath=`inset(0 ${100-ba.value}% 0 0)`;
if(window.STOPS){let i=0;const show=()=>{const p=STOPS[i];$('#tour').innerHTML=`<h3>${i+1}/${STOPS.length}. ${p.name}</h3><p>${p.text}</p><small>Дереккөз: ${p.source}</small>`};
$('#next').onclick=()=>{i=(i+1)%STOPS.length;show()};$('#prev').onclick=()=>{i=(i-1+STOPS.length)%STOPS.length;show()};show()}
