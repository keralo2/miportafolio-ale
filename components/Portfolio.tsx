"use client";

import { FormEvent, useMemo, useState } from "react";
import HotspotsDemo from "./HotspotsDemo";
import MazeDemo from "./MazeDemo";

type Project = { id: string; icon: string; title: string; summary: string; detail: string; tools: string; };
const projects: Project[] = [
  { id:"maze", icon:"🐶🧩", title:"Snoopy Maze Adventure", summary:"Un juego de laberintos interactivo con generación aleatoria y búsqueda de caminos mediante BFS.", detail:"Juego creado originalmente con Python y Pygame. Incluye generación de laberintos mediante DFS, movimiento con teclado, recolección de galletas, contador de pasos y pistas calculadas con búsqueda en anchura (BFS).", tools:"Python · Pygame · DFS · BFS" },
  { id:"reg", icon:"📈", title:"Regresión Lineal", summary:"Predicción de resultados a partir de horas de estudio y análisis de datos.", detail:"Modelo de regresión lineal aplicado a un conjunto de 30 observaciones de ejemplo para explorar la relación entre horas de estudio y puntuación. La demostración usa datos ilustrativos.", tools:"Python · Pandas · Matplotlib · Scikit-learn" },
  { id:"ai", icon:"🤖", title:"K-Means y KNN", summary:"Agrupamiento y clasificación con un conjunto simulado de 500 estudiantes.", detail:"K-Means permite explorar agrupamientos con tres y cuatro grupos. KNN se utiliza para practicar la clasificación de estudiantes a partir de variables académicas. Los datos son sintéticos y no representan estudiantes reales.", tools:"Python · Pandas · NumPy · Matplotlib · Scikit-learn" },
  { id:"hot", icon:"🗺️", title:"Hotspots Comerciales", summary:"Análisis geográfico exploratorio de zonas comerciales en Chalatenango.", detail:"Prototipo que utiliza datos de OpenStreetMap para explorar puntos comerciales, limpiar ubicaciones, agrupar coordenadas y visualizar resultados. Es un análisis exploratorio: no predice ventas ni garantiza demanda.", tools:"Python · OSMnx · OpenStreetMap · Pandas · Folium" },
  { id:"web", icon:"💻", title:"Desarrollo web", summary:"Diseño y construcción de este portafolio digital adaptable.", detail:"Este portafolio presenta mi trayectoria, formación y proyectos en una experiencia responsive. Esta versión está construida con Next.js, React y TypeScript, y preparada para publicarse en Vercel.", tools:"Next.js · React · TypeScript · CSS · GitHub" },
];

export default function Portfolio() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hours, setHours] = useState("12");
  const [regResult, setRegResult] = useState("");
  const [ai, setAi] = useState({ hours:"4", attendance:"75", tasks:"80", score:"65" });
  const [aiResult, setAiResult] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeError, setNoticeError] = useState(false);

  const regression = () => {
    const h = Number(hours);
    if (!Number.isFinite(h) || h < 1 || h > 30) { setRegResult("Ingresa un valor entre 1 y 30 horas."); return; }
    const ys = [20,25,28,32,35,38,42,45,48,50,53,56,59,62,65,67,70,73,75,78,80,82,85,87,89,91,93,95,97,100];
    const xs = Array.from({length:30}, (_,i)=>i+1);
    const mx = 15.5, my = ys.reduce((a,b)=>a+b,0)/ys.length;
    const slope = xs.reduce((s,x,i)=>s+(x-mx)*(ys[i]-my),0)/xs.reduce((s,x)=>s+(x-mx)**2,0);
    const intercept = my - slope*mx;
    setRegResult(`Puntuación estimada: ${(slope*h+intercept).toFixed(1)} / 100. Es una estimación del conjunto ilustrativo.`);
  };
  const classify = () => {
    const v = Object.values(ai).map(Number);
    if (v.some(x=>!Number.isFinite(x)) || v[0]<0 || v[0]>10 || v.slice(1).some(x=>x<0||x>100)) { setAiResult("Revisa los rangos: horas 0–10 y los demás valores 0–100."); return; }
    const score = .18*(v[0]*10)+.22*v[1]*.45+.2*v[2]*.45+.4*v[3];
    setAiResult(`${score>=60?"Aprobación":"Reprobación"} estimada · índice didáctico ${score.toFixed(1)}/100. Regla simplificada, no es una ejecución del modelo KNN original.`);
  };
  const onContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSending(true);
    setNotice("");
    setNoticeError(false);
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
        }),
      });
      const data = await response.json();
      setNotice(data.message || (response.ok ? "Mensaje enviado." : "No se pudo enviar el mensaje."));
      setNoticeError(!response.ok);
      if (response.ok) formElement.reset();
    } catch {
      setNotice("No se pudo conectar. Inténtalo de nuevo.");
      setNoticeError(true);
    } finally {
      setSending(false);
    }
  };

  return <>
    <header className="site-header"><div className="nav-wrap">
      <a className="brand" href="#inicio">♡ Mi Portafolio Digital</a>
      <button className="menu-button" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Abrir menú">☰</button>
      <nav className={menuOpen?"nav-links open":"nav-links"}>{[["Inicio","#inicio"],["Sobre mí","#sobre-mi"],["Formación","#formacion"],["Proyectos","#proyectos"],["Contacto","#contacto"]].map(([label,href])=><a key={href} href={href} onClick={()=>setMenuOpen(false)}>{label}</a>)}</nav>
    </div></header>

    <main>
      <section className="hero" id="inicio"><div className="hero-inner">
        <div className="portrait">
      <img
      src="/foto-keyli.jpg"
      alt="Fotografía de Keyli"
      className="portrait-photo"
      />
      </div>
        <div className="hero-copy"><span className="eyebrow">PORTAFOLIO DIGITAL · 2026</span><h1>Keyli Alejandra<br/>Arévalo Paz</h1><p className="tagline">Mi historia, mis aprendizajes y mis metas</p><p className="intro">Bienvenido/a a mi portafolio digital, un espacio donde comparto mi camino académico, mis proyectos y los sueños que me impulsan a seguir aprendiendo. ♡</p><a className="primary-button" href="#sobre-mi">Conoce más　↓</a></div>
        <div className="hero-decoration" aria-hidden="true">✦　♡　✧</div>
      </div></section>

      <section className="section projects-section" id="proyectos"><div className="container"><h2 className="section-title">Mis Proyectos</h2><p className="section-subtitle">Explora mis trabajos y descubre cómo aplico la ciencia, la tecnología y la creatividad.</p><div className="project-grid">
        {projects.map(project=><article className="project-card" key={project.id}><div className="project-art" aria-hidden="true">{project.icon}</div><h3>{project.title}</h3><p>{project.summary}</p><button className="primary-button small" onClick={()=>setSelected(project)}>Ver proyecto　→</button></article>)}
      </div></div></section>

      <section className="section" id="sobre-mi"><div className="container"><h2 className="section-title">Sobre mí</h2><p className="section-subtitle">Un poco de mi historia, mis aprendizajes y lo que me motiva.</p><div className="about-grid"><div className="paper-card"><p>¡Hola! Soy Keyli Alejandra Arévalo Paz. Soy una joven que disfruta aprender cosas nuevas, descubrir sus capacidades y trabajar para alcanzar sus metas. Me considero una persona responsable, perseverante, empática y con deseos de superación.</p><p>Durante mi formación académica he desarrollado conocimientos en informática, inglés y valores, que me han permitido fortalecer mis habilidades personales y prepararme para nuevos desafíos.</p><p>En 2026 finalicé mi bachillerato en el Complejo Educativo Capitán General Gerardo Barrios y actualmente estoy culminando mi diplomado en ¡Supérate!, Fundación Frech.</p><p>Uno de mis próximos grandes objetivos es estudiar el Técnico en Guía de Turismo Bilingüe en la Universidad Don Bosco, donde espero adquirir nuevos conocimientos y prepararme para mi futuro profesional.</p></div><aside className="quote-card">“Cada paso que doy es una oportunidad para aprender, crecer y acercarme a mis sueños”.<small>Mi propósito ♡</small></aside></div></div></section>

      <section className="section education-section" id="formacion"><div className="container"><h2 className="section-title">Formación académica</h2><p className="section-subtitle">Cada etapa representa una oportunidad para crecer.</p><div className="education-grid">
        <article className="paper-card education-card"><span className="status">Finalizado · 2026</span><h3>Bachillerato</h3><p>Complejo Educativo Capitán General Gerardo Barrios.</p></article>
        <article className="paper-card education-card"><span className="status">En proceso de finalización</span><h3>Diplomado ¡Supérate!</h3><p>Fundación Frech · Inglés, Informática y Valores · 2026.</p></article>
        <article className="paper-card education-card"><span className="status">Meta para 2027</span><h3>Técnico en Guía de Turismo Bilingüe</h3><p>Universidad Don Bosco · objetivo académico futuro.</p></article>
      </div></div></section>

      <section className="section"><div className="container"><h2 className="section-title">Mis habilidades</h2><p className="section-subtitle">Conocimientos y cualidades que sigo desarrollando.</p><div className="skills-grid"><div className="paper-card"><h3>Conocimientos técnicos</h3><ul><li>Inglés en formación</li><li>Informática y herramientas digitales</li><li>Fundamentos de programación</li><li>Organización y análisis de información</li></ul></div><div className="paper-card"><h3>Habilidades personales</h3><ul><li>Responsabilidad y compromiso</li><li>Empatía y respeto</li><li>Trabajo en equipo</li><li>Comunicación y perseverancia</li><li>Disposición para aprender</li></ul></div></div></div></section>

      <section className="section contact-section" id="contacto"><div className="container"><h2 className="section-title">Contacto</h2><p className="section-subtitle">Gracias por visitar mi portafolio. Puedes dejarme un mensaje.</p><div className="contact-grid"><div className="paper-card"><h3>¡Hablemos!</h3><p>Me interesa seguir aprendiendo, compartir mis proyectos y conocer nuevas oportunidades académicas.</p><p className="contact-quote">“Con esfuerzo, dedicación y pasión, todo es posible”.</p></div><form className="paper-card contact-form" onSubmit={onContact}><label>Nombre<input name="name" required placeholder="Tu nombre"/></label><label>Correo electrónico<input name="email" type="email" required placeholder="correo@ejemplo.com"/></label><label>Mensaje<textarea name="message" required rows={4} placeholder="Escribe tu mensaje"/></label><button className="primary-button" disabled={sending}>{sending?"Enviando…":"Enviar mensaje →"}</button><p className={noticeError?"form-notice error":"form-notice"} aria-live="polite">{notice || "¡Gracias por escribirme! Tu mensaje ha sido enviado correctamente. Me pondré en contacto contigo pronto. ♡"}</p></form></div></div></section>
    </main>
    <footer><div className="footer-inner"><p className="footer-quote">“Con esfuerzo, dedicación y pasión, todo es posible.” ♡</p><p>Keyli Alejandra Arévalo Paz · Portafolio Digital · 2026</p></div></footer>

    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><section className={selected.id==="maze" ? "project-modal maze-modal" : "project-modal"} role="dialog" aria-modal="true" aria-labelledby="project-title"><button className="modal-close" onClick={()=>setSelected(null)} aria-label="Cerrar">×</button><span className="eyebrow">PORTAFOLIO · PROYECTO</span><h2 id="project-title">{selected.title}</h2><p>{selected.detail}</p><p className="tools"><b>Tecnologías:</b> {selected.tools}</p>
      {selected.id==="reg" && <div className="mini-demo"><h3>Prueba la estimación lineal</h3><label>Horas de estudio (1–30)<input type="number" min="1" max="30" value={hours} onChange={e=>setHours(e.target.value)}/></label><button className="primary-button small" onClick={regression}>Calcular estimación</button>{regResult && <p className="demo-result">{regResult}</p>}</div>}
      {selected.id==="ai" && <div className="mini-demo"><h3>Prueba una clasificación ilustrativa</h3><div className="demo-fields">{([["hours","Horas de estudio (0–10)"],["attendance","Asistencia (%)"],["tasks","Tareas entregadas (%)"],["score","Nota de examen"]] as const).map(([key,label])=><label key={key}>{label}<input type="number" value={ai[key]} onChange={e=>setAi({...ai,[key]:e.target.value})}/></label>)}</div><button className="primary-button small" onClick={classify}>Clasificar ejemplo</button>{aiResult && <p className="demo-result">{aiResult}</p>}</div>}
      {selected.id==="hot" && <HotspotsDemo />}
      {selected.id==="maze" && <MazeDemo />}
      <p className="modal-footnote">Esta ficha presenta el proyecto académico; los datos simulados son únicamente para aprendizaje.</p></section></div>}
  </>;
}
