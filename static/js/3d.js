(function(){const box=document.getElementById('v3d');
function start(){if(!window.THREE){box.innerHTML='<p style="padding:20px">Three.js жүктелмеді. static/vendor/three.min.js қойыңыз (README қараңыз).</p>';return}
const T=THREE,sc=new T.Scene();sc.background=new T.Color(0x06101f);
const cam=new T.PerspectiveCamera(50,box.clientWidth/box.clientHeight,.1,100),r=new T.WebGLRenderer({antialias:true});
r.setSize(box.clientWidth,box.clientHeight);box.appendChild(r.domElement);
sc.add(new T.AmbientLight(0xffffff,.6));const d=new T.DirectionalLight(0xffe6b0,.9);d.position.set(5,8,5);sc.add(d);
const M=c=>new T.MeshLambertMaterial({color:c}),g=new T.Group();
const add=(geo,c,x,y,z)=>{const m=new T.Mesh(geo,M(c));m.position.set(x,y,z);g.add(m);return m};
add(new T.BoxGeometry(4,1.6,3),0xd9c08c,0,.8,0);add(new T.SphereGeometry(1,24,16,0,6.3,0,1.6),0xb8934f,0,1.6,0);
add(new T.CylinderGeometry(.18,.22,3.2,12),0xe9d8b4,2.4,1.6,1.7);add(new T.BoxGeometry(2.6,1,2),0xc9a96a,-3.4,.5,0);
add(new T.PlaneGeometry(20,20),0x8a7448,0,0,0).rotation.x=-Math.PI/2;sc.add(g);
let th=.8,ph=.9,rad=10,tg=new T.Vector3(0,1,0),drag=0;
const upd=()=>{cam.position.set(tg.x+rad*Math.sin(th)*Math.cos(ph),tg.y+rad*Math.sin(ph),tg.z+rad*Math.cos(th)*Math.cos(ph));cam.lookAt(tg)};
r.domElement.onpointerdown=e=>{drag=e.shiftKey?2:1;px=e.clientX;py=e.clientY};var px,py;
addEventListener('pointerup',()=>drag=0);
addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-px,dy=e.clientY-py;px=e.clientX;py=e.clientY;
 if(drag==1){th-=dx*.01;ph=Math.max(.1,Math.min(1.5,ph+dy*.01))}else{tg.x-=dx*.02;tg.y+=dy*.02}upd()});
r.domElement.onwheel=e=>{e.preventDefault();rad=Math.max(4,Math.min(25,rad+e.deltaY*.01));upd()};
document.getElementById('reset').onclick=()=>{th=.8;ph=.9;rad=10;tg.set(0,1,0);upd()};
document.getElementById('full').onclick=()=>box.requestFullscreen&&box.requestFullscreen();
addEventListener('resize',()=>{r.setSize(box.clientWidth,box.clientHeight);cam.aspect=box.clientWidth/box.clientHeight;cam.updateProjectionMatrix()});
upd();(function a(){requestAnimationFrame(a);r.render(sc,cam)})()}
function ld(u,ok,bad){const s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=bad;document.body.appendChild(s)}
ld('/static/vendor/three.min.js',start,()=>ld('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',start,start));})();
