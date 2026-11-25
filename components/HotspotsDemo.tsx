"use client";
import { useMemo, useState } from "react";
import type { MouseEvent } from "react";
type Point = { id: number; x: number; y: number };
const points: Point[] = [
{id:1,x:18,y:22},{id:2,x:24,y:18},{id:3,x:29,y:25},{id:4,x:34,y:16},{id:5,x:39,y:24},{id:6,x:44,y:19},{id:7,x:49,y:28},{id:8,x:54,y:18},{id:9,x:59,y:25},{id:10,x:65,y:17},{id:11,x:70,y:28},{id:12,x:76,y:20},{id:13,x:82,y:29},{id:14,x:21,y:38},{id:15,x:28,y:43},{id:16,x:35,y:36},{id:17,x:42,y:45},{id:18,x:49,y:39},{id:19,x:56,y:47},{id:20,x:63,y:38},{id:21,x:70,y:46},{id:22,x:78,y:40},{id:23,x:84,y:49},{id:24,x:15,y:57},{id:25,x:23,y:65},{id:26,x:31,y:57},{id:27,x:38,y:68},{id:28,x:46,y:59},{id:29,x:53,y:69},{id:30,x:61,y:58},{id:31,x:68,y:67},{id:32,x:76,y:59},{id:33,x:84,y:70},{id:34,x:19,y:80},{id:35,x:29,y:83},{id:36,x:39,y:78},{id:37,x:49,y:85},{id:38,x:59,y:78},{id:39,x:69,y:84},{id:40,x:80,y:80},{id:41,x:31,y:31},{id:42,x:58,y:33},{id:43,x:73,y:34},{id:44,x:43,y:53},{id:45,x:66,y:53}
];
const palette = ["#d73575","#7136b7","#e58a18","#238b83","#5267c9"];
function clusterPoints(k:number) {
 let centers = Array.from({length:k},(_,i)=>({x:points[Math.floor(i*points.length/k)].x,y:points[Math.floor(i*points.length/k)].y}));
 let assignments = points.map(()=>0);
 for(let round=0;round<18;round++){
  assignments=points.map(p=>{let best=0,distance=Infinity;centers.forEach((c,i)=>{const d=(p.x-c.x)**2+(p.y-c.y)**2;if(d<distance){distance=d;best=i;}});return best;});
  centers=centers.map((c,i)=>{const members=points.filter((p,j)=>assignments[j]===i);return members.length?{x:members.reduce((s,p)=>s+p.x,0)/members.length,y:members.reduce((s,p)=>s+p.y,0)/members.length}:c;});
 }
 return {assignments,centers};
}
export default function HotspotsDemo(){
 const [k,setK]=useState(3);const [test,setTest]=useState({x:51,y:51});const [hasTest,setHasTest]=useState(false);const [tab,setTab]=useState<"map"|"knn">("map");
 const {assignments,centers}=useMemo(()=>clusterPoints(k),[k]);
 const neighbors=useMemo(()=>points.map((p,i)=>({...p,group:assignments[i],distance:Math.hypot(p.x-test.x,p.y-test.y)})).sort((a,b)=>a.distance-b.distance).slice(0,3),[assignments,test]);
 const groupCounts=Array.from({length:k},(_,i)=>assignments.filter(a=>a===i).length);
 const predicted=neighbors.reduce((best,p)=>neighbors.filter(n=>n.group===p.group).length>neighbors.filter(n=>n.group===best).length?p.group:best,neighbors[0]?.group??0);
 const choosePoint=(event:MouseEvent<SVGSVGElement>)=>{const rect=event.currentTarget.getBoundingClientRect();const x=Math.max(5,Math.min(95,((event.clientX-rect.left)/rect.width)*100));const y=Math.max(5,Math.min(95,((event.clientY-rect.top)/rect.height)*100));setTest({x,y});setHasTest(true);setTab("knn");};
 return <div className="hot-demo">
  <div className="hot-demo-heading"><div><span className="eyebrow">LABORATORIO INTERACTIVO</span><h3>Hotspots Comerciales</h3><p>Explora cómo se agrupan puntos geográficos y prueba una clasificación KNN.</p></div><span className="hot-demo-chip">✦ Demo interactiva</span></div>
  <div className="hot-demo-tabs"><button className={tab==="map"?"active":""} onClick={()=>setTab("map")}>▥ K-Means · Agrupamiento</button><button className={tab==="knn"?"active":""} onClick={()=>setTab("knn")}>◎ KNN · Clasificación</button></div>
  <div className="hot-real-map-card">
   <div className="hot-real-map-heading"><strong>Mapa geográfico de referencia</strong><span>OpenStreetMap · Chalatenango</span></div>
   <iframe
    title="Mapa de OpenStreetMap de Chalatenango, El Salvador"
    src="https://www.openstreetmap.org/export/embed.html?bbox=-89.02%2C14.08%2C-88.85%2C14.22&layer=mapnik&marker=14.143%2C-88.938"
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
   />
   <p>Mapa base real sin API key. El marcador señala la coordenada de referencia del ejercicio; los puntos de la demostración K-Means que aparece abajo son sintéticos, no comercios verificados.</p>
  </div>
  <div className="hot-demo-layout">
   <aside className="hot-controls"><h4>⌘ Configurar K-Means</h4><p>Selecciona la cantidad de grupos:</p><div className="hot-k-options">{[2,3,4,5].map(value=><button key={value} className={k===value?"chosen":""} onClick={()=>setK(value)} aria-pressed={k===value}>{value}</button>)}</div>
    <div className="hot-counts">{groupCounts.map((count,i)=><div key={i}><i style={{background:palette[i]}}/>Grupo {i+1}<b>{count}</b></div>)}</div>
    <div className="hot-explain"><strong>¿Qué estás viendo?</strong><p>K-Means organiza los puntos por cercanía. Cambia el número de grupos y observa cómo se actualizan sus colores.</p></div>
   </aside>
   <div className="hot-map-card"><div className="hot-map-label">⌖ Chalatenango, El Salvador <small>· mapa esquemático</small></div>
    <svg className="hot-map" viewBox="0 0 100 100" role="img" aria-label="Mapa esquemático interactivo con puntos agrupados" onClick={choosePoint}>
     <defs><pattern id="hotGrid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="#ffffff" strokeWidth=".35"/></pattern></defs>
     <path d="M0 17 Q18 8 31 19 T60 17 T100 20 M0 53 Q18 45 35 54 T68 50 T100 57 M0 83 Q20 72 39 84 T72 80 T100 85" fill="none" stroke="#d9c7a7" strokeWidth="2"/>
     <path d="M14 0 Q22 24 39 34 T60 66 T89 100 M75 0 Q68 20 74 40 T63 70 T56 100 M0 35 Q25 39 49 34 T100 39" fill="none" stroke="#fffaf0" strokeWidth="1.5"/>
     <path d="M0 0H100V100H0Z" fill="url(#hotGrid)"/><path d="M7 15 L20 5 L43 9 L62 5 L90 18 L96 43 L88 68 L93 87 L70 96 L45 91 L22 97 L5 77 L9 53 Z" fill="#d8e9d5" fillOpacity=".55" stroke="#8eb48b" strokeWidth=".8"/>
     {points.map((p,i)=><circle key={p.id} cx={p.x} cy={p.y} r="2.15" fill={palette[assignments[i]]} stroke="white" strokeWidth=".65"><title>{"Punto de ejemplo "+p.id+" · Grupo "+(assignments[i]+1)}</title></circle>)}
     {centers.map((c,i)=><g key={i}><circle cx={c.x} cy={c.y} r="3.7" fill={palette[i]} fillOpacity=".18" stroke={palette[i]} strokeWidth=".8" strokeDasharray="1.2 1"/><path d={"M"+(c.x-1.5)+" "+c.y+"h3 M"+c.x+" "+(c.y-1.5)+"v3"} stroke={palette[i]} strokeWidth=".8"/></g>)}
     {hasTest&&<g><circle cx={test.x} cy={test.y} r="4.8" fill="#68152f" fillOpacity=".18" stroke="#68152f" strokeWidth="1.1"/><path d={"M"+(test.x-2.2)+" "+test.y+"h4.4 M"+test.x+" "+(test.y-2.2)+"v4.4"} stroke="#68152f" strokeWidth="1.4"/></g>}
    </svg>
    <div className="hot-map-footer"><span><i style={{background:"#d73575"}}/> Grupo 1</span><span><i style={{background:"#7136b7"}}/> Grupo 2</span><span><i style={{background:"#e58a18"}}/> Grupo 3+</span><small>Toca el mapa para probar una ubicación</small></div>
   </div>
   <aside className="hot-knn-card"><h4>◎ Probar KNN</h4><p>1. Selecciona un punto del mapa para simular una nueva ubicación.</p><div className="hot-test-location">⌖ {hasTest?"Ubicación ("+test.x.toFixed(0)+", "+test.y.toFixed(0)+")":"Esperando ubicación de prueba"}</div><p>2. Resultado según los 3 vecinos más cercanos:</p>
    <div className="hot-prediction"><span>Zona asignada</span><strong>Grupo {predicted+1}</strong><small>Clasificación didáctica por mayoría</small></div>
    <div className="hot-neighbors"><b>Vecinos más cercanos</b>{neighbors.map(n=><span key={n.id}>Punto {n.id} · Grupo {n.group+1}<small>{n.distance.toFixed(1)} u.</small></span>)}</div>
    <button className="hot-reset" onClick={()=>{setTest({x:51,y:51});setHasTest(false);setTab("map");}}>Restablecer prueba</button>
   </aside>
  </div>
  <div className="hot-summary"><div><b>{points.length}</b><span>Puntos de ejemplo</span></div><div><b>{k}</b><span>Grupos K-Means</span></div><div><b>3</b><span>Vecinos KNN</span></div></div>
  <p className="hot-disclaimer">Importante: los puntos son sintéticos y el mapa es esquemático; no representan comercios ni coordenadas verificadas. Esta demo ilustra los algoritmos y no permite inferir ventas o demanda comercial.</p>
 </div>;
}
