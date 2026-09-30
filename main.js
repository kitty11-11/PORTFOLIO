/* ==== Content: skills, statistics, project cards, scroll reveal ==== */
const P=(a)=>a.map(x=>`<span class="pill">${x}</span>`).join('');
const skills={'Data Analytics':['Python','Pandas','NumPy','EDA','Data Cleaning','Pivot Tables'],'SQL / Database':['SQL','MySQL','MySQL Workbench','Joins','Subqueries','GROUP BY / HAVING'],'Visualization / BI':['Excel','Power BI','Matplotlib','Seaborn','KPIs','Dashboards','Data Storytelling'],'Design':['Figma','Canva','UI/UX','Wireframing','Prototyping'],'Tools':['Git','GitHub','Jupyter Notebook','VS Code']};
document.getElementById('skillgrid').innerHTML=Object.entries(skills).map(([k,v])=>`<div class="card"><h3 class="fx" style="font-size:22px">${k}</h3>${P(v)}</div>`).join('');
document.getElementById('stats').innerHTML=P(['Mean','Median','Mode','Min / Max','Range','Variance','Standard deviation','Percentiles','Quartiles','IQR','Outlier detection','Distributions','Skewness','Correlation','Population vs sample','Probability basics','Normal distribution','Z-score basics','Hypothesis testing basics','Null / alternative hypotheses','p-value basics','Confidence intervals']);
const projs=[
['02','Retail Sales EDA','Python · Pandas · Seaborn','Exploratory analysis of retail sales data, from cleaning to patterns, trends and business insights.',['Data cleaning','Exploratory analysis','Statistical exploration','Visualization with Matplotlib and Seaborn in Jupyter'],'https://github.com/kitty11-11/DATA/tree/main/DataAnalytics-L1-EDARetailSales'],
['03','House Price Prediction','Python · Scikit-learn','A machine learning project alongside my analytics work, to learn the fundamentals.',['Data preprocessing and feature handling','Train/test split','Linear and Ridge Regression','Pipeline, ColumnTransformer, model evaluation'],'https://github.com/kitty11-11/DATA/tree/main/DataAnalytics-L2-HousePricePrediction'],
['04','Bookstore Management System','MySQL · SQL · CSV','A relational database for books, customers and orders, queried to answer business questions.',['Designed tables with primary and foreign keys','Imported CSV data','20+ queries: JOIN, GROUP BY, HAVING, aggregates, COALESCE','Insights on revenue, customer spending, inventory, top sellers'],'https://github.com/kitty11-11/Bookstore-Management'],
['05','iPhone Sales Analysis','Data analytics','An analysis project covering the full workflow from raw data to insights.',['Data cleaning and analysis','Visualization','KPI analysis','Business insights'],'https://github.com/kitty11-11/iphone-'],
['06','Replattr','Figma · UI/UX','A social-impact app concept that connects surplus food from events and restaurants with people in need.',['High-fidelity mobile prototype','Splash screen and user flows','Dashboard/interface concepts','Visual design'],'https://www.figma.com/proto/eTY6P8MjiUUUdnk6WY0NdF/Replattr?node-id=2015-10547&p=f&t=XnDmv4YbawG0yaZh-1&scaling=min-zoom&content-scaling=fixed&page-id=2003%3A5515&starting-point-node-id=4062%3A2053']];
document.getElementById('projgrid').innerHTML=projs.map(p=>`<div class="card"><span class="n">${p[0]}</span><h3 class="fx">${p[1]}</h3><span class="small">${p[2]}</span><p>${p[3]}</p><ul class="l">${p[4].map(x=>`<li>${x}</li>`).join('')}</ul>${p[5]?`<a class="btn fx" href="${p[5]}" target="_blank" rel="noopener">${p[1]=='Replattr'?'Figma prototype':'GitHub'} ✦</a>`:'<span class="small">Link coming soon</span>'}</div>`).join('');
const io=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('in')),{threshold:.08});
document.querySelectorAll('.rv').forEach(e=>io.observe(e));

/* ==== Text splitting, letter burst effect and the 3D bar field ==== */
// ---------- Text split + burst ----------
document.querySelectorAll('.fx').forEach(el=>{
  if(el.children.length) return;
  const t=el.textContent; el.textContent='';
  t.split(' ').forEach((w,k,arr)=>{const g=document.createElement('span');g.style.whiteSpace='nowrap';g.style.display='inline-block';[...w].forEach(c=>{const s=document.createElement('span');s.className='ch';s.textContent=c;g.appendChild(s)});el.appendChild(g);if(k<arr.length-1)el.appendChild(document.createTextNode(' '))});
});
function burst(el){
  if(!el) return;
  el.querySelectorAll('.ch').forEach((c,i)=>{
    const x=(Math.random()-.5)*160,y=(Math.random()-.5)*160,r=(Math.random()-.5)*360;
    c.animate([{transform:'none',opacity:1},
      {transform:`translate(${x}px,${y}px) rotate(${r}deg) scale(1.4)`,opacity:.15,offset:.4},
      {transform:'none',opacity:1}],
      {duration:900,delay:i*25,easing:'cubic-bezier(.2,.8,.2,1)'});
  });
}
// ---------- 3D scene ----------
const LOW=matchMedia('(max-width:760px)').matches||!matchMedia('(pointer:fine)').matches;
const cv=document.getElementById('gl');
const renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,LOW?1.25:2));
const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x0d0708,14,34);
const cam=new THREE.PerspectiveCamera(50,1,.1,100);
scene.add(new THREE.AmbientLight(0x7a4a4a,.9));
const key=new THREE.PointLight(0xe2bfa4,2.2,40);key.position.set(0,8,4);scene.add(key);
const N=LOW?11:15,GAP=1.15,COUNT=N*N;
const geo=new THREE.BoxGeometry(.85,1,.85);geo.translate(0,.5,0);
const mesh=new THREE.InstancedMesh(geo,new THREE.MeshStandardMaterial({color:0x8a2334,roughness:.45,metalness:.3}),COUNT);
scene.add(mesh);
const dummy=new THREE.Object3D(),col=new THREE.Color(),cA=new THREE.Color(0x5a1420),cB=new THREE.Color(0xe2bfa4);
const ripples=[],mouse=new THREE.Vector2(0,0),ground=new THREE.Vector3(99,0,99);
const ray=new THREE.Raycaster(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
function toGround(cx,cy,out){
  ray.setFromCamera(new THREE.Vector2(cx/innerWidth*2-1,-(cy/innerHeight)*2+1),cam);
  return ray.ray.intersectPlane(plane,out);
}
function size(){renderer.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}
addEventListener('resize',size);size();
addEventListener('pointermove',e=>{mouse.set(e.clientX/innerWidth-.5,e.clientY/innerHeight-.5);toGround(e.clientX,e.clientY,ground)||ground.set(99,0,99)});
addEventListener('click',e=>{
  const p=toGround(e.clientX,e.clientY,new THREE.Vector3());
  if(p) ripples.push({x:p.x,z:p.z,t:performance.now()/1000});
  const fx=e.target.closest('.fx');
  burst(fx||document.getElementById('title'));
});
let scrollY=0;addEventListener('scroll',()=>scrollY=window.scrollY);
let lastT=0;
function frame(ms){
  if(document.hidden||(LOW&&ms-lastT<33)){requestAnimationFrame(frame);return}
  lastT=ms;
  const t=ms/1000,off=(N-1)*GAP/2;
  cam.position.x+=((mouse.x*8)-cam.position.x)*.05;
  cam.position.y+=((9-mouse.y*3-scrollY*.004)-cam.position.y)*.05;
  cam.position.z=15;cam.lookAt(0,1,0);
  key.position.set(ground.x<90?ground.x:0,6,ground.x<90?ground.z:4);
  for(let i=0;i<N;i++)for(let j=0;j<N;j++){
    const x=i*GAP-off,z=j*GAP-off;
    let h=.5+.45*(Math.sin(i*.55+t*.9)+Math.cos(j*.45+t*.7));
    const dm=Math.hypot(x-ground.x,z-ground.z);h+=2.2*Math.exp(-dm*dm/3);
    for(const r of ripples){const age=t-r.t,d=Math.hypot(x-r.x,z-r.z);
      h+=3*Math.sin(d*1.4-age*7)*Math.exp(-age*1.1)*Math.exp(-d*.18)}
    h=Math.max(.12,h);
    const k=i*N+j;dummy.position.set(x,0,z-2);dummy.scale.set(1,h,1);dummy.updateMatrix();
    mesh.setMatrixAt(k,dummy.matrix);
    mesh.setColorAt(k,col.copy(cA).lerp(cB,Math.min(1,h/4)));
  }
  while(ripples.length&&t-ripples[0].t>4)ripples.shift();
  mesh.instanceMatrix.needsUpdate=true;mesh.instanceColor.needsUpdate=true;
  renderer.render(scene,cam);requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
setTimeout(()=>burst(document.getElementById('title')),400);

/* ==== Hero title: fit to width and letter hover ==== */
const heroEl=document.querySelector('.hero'),tt=document.getElementById('title'),chs=[...tt.querySelectorAll('.ch')];
function fit(){tt.style.fontSize='100px';const w=tt.firstChild;const k=tt.clientWidth*.97/w.offsetWidth;tt.style.fontSize=Math.min(k*100,340)+'px'}
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(fit);fit();addEventListener('resize',fit);
addEventListener('pointermove',e=>{
  if(scrollY>innerHeight||e.pointerType==='touch')return;
  
  chs.forEach(c=>{const r=c.getBoundingClientRect(),d=Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2)),k=Math.max(0,1-d/200);
    c.style.transform=`translateY(${-k*16}px) scale(${1+k*.03})`});
});

/* ==== 3D crystal cursor (desktop only) ==== */
(()=>{
if(!matchMedia('(pointer:fine)').matches||!window.THREE)return;
const c=document.createElement('canvas');c.id='cur';document.body.appendChild(c);
const r=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,2));
const sc=new THREE.Scene(),cam=new THREE.OrthographicCamera(-1,1,1,-1,-300,300);
sc.add(new THREE.AmbientLight(0xffffff,.55));
const dl=new THREE.DirectionalLight(0xe2bfa4,1.8);dl.position.set(-.5,1,1);sc.add(dl);
const g=new THREE.Group(),orb=new THREE.Mesh(new THREE.IcosahedronGeometry(1,0),new THREE.MeshStandardMaterial({color:0xa3283a,roughness:.25,metalness:.45,flatShading:true}));g.add(orb);
g.visible=false;sc.add(g);
function rs(){r.setSize(innerWidth,innerHeight,false);cam.left=-innerWidth/2;cam.right=innerWidth/2;cam.top=innerHeight/2;cam.bottom=-innerHeight/2;cam.updateProjectionMatrix()}
addEventListener('resize',rs);rs();
let mx=0,my=0,x=0,y=0,rx=0,ry=0,sz=1,tsz=1,pulse=0,down=false,ang=0,ang2=0,seen=false;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;if(!seen){seen=true;x=rx=mx;y=ry=my;g.visible=true;document.body.classList.add('nocur')}
  tsz=(e.target.closest&&e.target.closest('a,button,.fx,.card,.step,.tool'))?1.9:1});
addEventListener('pointerdown',()=>down=true);addEventListener('pointerup',()=>down=false);
addEventListener('click',()=>pulse=1);
(function loop(t){
  const px=x,py=y;x+=(mx-x)*.32;y+=(my-y)*.32;rx+=(mx-rx)*.11;ry+=(my-ry)*.11;
  const vx=x-px,vy=y-py,sp=Math.hypot(vx,vy);if(sp>.6)ang=Math.atan2(-vy,vx);
  sz+=((down?.6:tsz)-sz)*.2;pulse*=.92;
  const base=10,st=1;
  g.position.set(x-innerWidth/2,innerHeight/2-y,50);g.rotation.z=ang;g.scale.set(base*st,base/Math.sqrt(st),base);
  orb.rotation.x=t*.002;orb.rotation.y=t*.0016;
    r.render(sc,cam);requestAnimationFrame(loop);
})(0);
})();

