const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(node=>revealObserver.observe(node));

const menu=document.querySelector('#site-nav'),toggle=document.querySelector('.menu-toggle');
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));menu.classList.toggle('open',open)});
menu.addEventListener('click',event=>{if(event.target.closest('a')){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false')}});

const extensionCards=[...document.querySelectorAll('.extension-grid article')];
function fitExtensionRows(){const visible=extensionCards.filter(card=>!card.hidden);extensionCards.forEach(card=>card.classList.remove('last-visible'));visible.at(-1)?.classList.add('last-visible')}
document.querySelector('.extension-filters').addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;document.querySelectorAll('.extension-filters button').forEach(item=>item.classList.toggle('active',item===button));const filter=button.dataset.filter;extensionCards.forEach(card=>card.hidden=filter!=='all'&&!card.dataset.category.split(' ').includes(filter));fitExtensionRows();});
fitExtensionRows();

const screenData={
 kubernetes:['Kubernetes','Current-context resource management with live data, pod actions and infinite scrolling.'],
 schedules:['Schedules','Cron-managed actions with a weekly success and failure heatmap.'],
 extensions:['Extensions','A modular catalogue for enabling only the workspaces your environment needs.'],
 system:['System','Host inventory, services, processes, network state, logs, metrics and terminal access.']
};
document.querySelector('.screen-tabs').addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;document.querySelectorAll('.screen-tabs button').forEach(item=>item.classList.toggle('active',item===button));const key=button.dataset.screen,stage=document.querySelector('.screen-stage');stage.querySelector('img').src=`assets/screenshots/${key}.png`;stage.querySelector('img').alt=`Nodavex ${screenData[key][0]} workspace`;stage.querySelector('strong').textContent=screenData[key][0];stage.querySelector('span').textContent=screenData[key][1];});
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();

/* The app's slow, outward-moving 24px dot grid. */
const grid=document.querySelector('#ripple-grid'),context=grid?.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
if(context){
 const spacing=24,lifetime=18000;
 let width=0,height=0,scale=1,frame=0,elapsed=0,previous=null,lastPaint=-Infinity;
 const dot=(x,y)=>{let ox=0,oy=0,energy=0,dx=x-width*.5,dy=y-height*.4,distance=Math.hypot(dx,dy),reach=Math.hypot(width,height)*.75;if(!reduced.matches)for(const phase of [0,lifetime/2]){const age=((elapsed+phase)%lifetime+lifetime)%lifetime,front=distance-age/lifetime*reach,envelope=Math.exp(-(front*front)/18000)*Math.sin(Math.PI*age/lifetime),displacement=Math.sin(front/48)*envelope*3;ox+=dx/(distance||1)*displacement;oy+=dy/(distance||1)*displacement;energy+=envelope}return{x:x+ox,y:y+oy,r:1+Math.min(energy,1)*.7,a:Math.min(.55,.18+energy*.28)}};
 function draw(){context.clearRect(0,0,width,height);context.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#7ebfb1';for(let y=spacing/2;y<height;y+=spacing)for(let x=spacing/2;x<width;x+=spacing){const point=dot(x,y);context.globalAlpha=point.a;context.beginPath();context.arc(point.x,point.y,point.r,0,Math.PI*2);context.fill()}context.globalAlpha=1}
 function tick(now){frame=0;if(document.hidden||reduced.matches){previous=null;return}if(previous!==null)elapsed+=now-previous;previous=now;if(now-lastPaint>=1000/30){draw();lastPaint=now}frame=requestAnimationFrame(tick)}
 function sync(){cancelAnimationFrame(frame);previous=null;lastPaint=-Infinity;width=innerWidth;height=innerHeight;scale=Math.min(devicePixelRatio||1,1.5);grid.width=Math.round(width*scale);grid.height=Math.round(height*scale);context.setTransform(scale,0,0,scale,0,0);draw();if(!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick)}
 addEventListener('resize',sync,{passive:true});document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);sync();
}

const orbitWidgets=[...document.querySelectorAll('[data-orbit-widget]')],orbitVisual=document.querySelector('.hero-visual');
let orbitFrame=0;
function animateOrbit(time){
 if(!orbitVisual||reduced.matches){orbitFrame=0;return}
 const radiusX=Math.min(orbitVisual.clientWidth*.36,220),radiusY=Math.min(orbitVisual.clientHeight*.39,205),turn=time/52000*Math.PI*2;
 orbitWidgets.forEach((widget,index)=>{const angle=turn+index/orbitWidgets.length*Math.PI*2,fadeWave=(Math.sin(angle*1.5+.7)+1)/2,opacity=Math.max(0,Math.min(1,(fadeWave-.18)/.45));widget.style.setProperty('--orbit-x',`${Math.cos(angle)*radiusX}px`);widget.style.setProperty('--orbit-y',`${Math.sin(angle)*radiusY}px`);widget.style.opacity=opacity.toFixed(3);widget.style.zIndex=Math.sin(angle)>0?'3':'1'});
 orbitFrame=requestAnimationFrame(animateOrbit);
}
function syncOrbit(){cancelAnimationFrame(orbitFrame);orbitWidgets.forEach(widget=>{widget.style.removeProperty('opacity');widget.style.removeProperty('--orbit-x');widget.style.removeProperty('--orbit-y')});if(!reduced.matches)orbitFrame=requestAnimationFrame(animateOrbit)}
reduced.addEventListener('change',syncOrbit);syncOrbit();
