"use client";

import { FormEvent, useMemo, useState } from "react";
import HotspotsDemo from "./HotspotsDemo";
import MazeDemo from "./MazeDemo";

type Project = {
  id: string;
  icon: string;
  title: string;
  summary: string;
  problem: string;
  objective: string;
  methodology: string;
  results: string;
  learning: string;
  tools: string;
};
const projects: Project[] = [
  {
    id:"maze", icon:"🐶🧩", title:"Snoopy Maze Adventure",
    summary:"Juego de laberintos en Python y Pygame que genera recorridos aleatorios y utiliza BFS para encontrar el camino más corto.",
    problem:"Crear un juego de laberintos con distintos niveles de dificultad, movimiento controlado, búsqueda de rutas y registro de partidas.",
    objective:"Generar laberintos de 10×10, 15×15 y 21×21; permitir que el jugador llegue a la salida; calcular la ruta óptima con BFS y añadir puntuación e historial.",
    methodology:"El laberinto se genera con búsqueda en profundidad (DFS) y retroceso. Cada celda registra sus paredes. BFS utiliza una cola FIFO (deque) para encontrar una ruta mínima desde el inicio hasta la meta. El juego incorpora controles con flechas o WASD, pistas, cronómetro, contador de pasos y galletas opcionales.",
    results:"El proyecto permite jugar en tres dificultades, consultar una pista basada en BFS, contar pasos y tiempo, obtener una puntuación con bonificación por galletas y guardar registros de partidas en JSON. La versión web adapta la experiencia para jugar desde el navegador.",
    learning:"Practiqué generación de laberintos, estructuras de datos, recorridos de grafos, búsqueda de caminos mínimos y organización del estado de un juego.",
    tools:"Python · Pygame · DFS · BFS · deque · JSON · React · TypeScript"
  },
  {
    id:"reg", icon:"📈", title:"Regresión Lineal",
    summary:"Modelo supervisado que estima un puntaje a partir de las horas de estudio utilizando 30 observaciones de ejemplo.",
    problem:"Explorar la relación entre las horas de estudio y un puntaje, y evitar predicciones para valores fuera del rango utilizado por el modelo.",
    objective:"Entrenar una regresión lineal con 30 registros, permitir ingresar entre 1 y 30 horas y mostrar la predicción junto con métricas y una gráfica.",
    methodology:"Se organiza un DataFrame con HORAS_ESTUDIO (1 a 30) y SCORE (20 a 100). Scikit-learn ajusta LinearRegression; después se calculan pendiente, intercepto, R² y error cuadrático medio (MSE). Matplotlib muestra los datos, la recta y el punto estimado.",
    results:"Con los 30 datos incluidos en el código, el ajuste obtiene aproximadamente pendiente 2.687, intercepto 22.352, R² 0.9931 y MSE 3.7765. El programa valida que la entrada esté entre 1 y 30 horas. Los datos son ilustrativos, no calificaciones reales.",
    learning:"Aprendí a entrenar e interpretar un modelo de regresión, validar entradas, calcular métricas de evaluación y representar visualmente una predicción.",
    tools:"Python · Pandas · Scikit-learn · Matplotlib"
  },
  {
    id:"ai", icon:"🤖", title:"K-Means y KNN",
    summary:"Análisis de 500 registros académicos sintéticos mediante agrupamiento y clasificación.",
    problem:"Explorar perfiles de hábitos académicos y practicar la predicción de aprobación o reprobación a partir de variables de estudio.",
    objective:"Generar 500 registros, comparar agrupamientos con K-Means usando 3 y 4 grupos, y evaluar KNN con una división de 75% para entrenamiento y 25% para prueba.",
    methodology:"Se generan horas de estudio, asistencia, tareas entregadas y nota de examen. K-Means agrupa los registros y se comparan los perfiles promedio de cada grupo. Para KNN se crea la etiqueta de aprobación, se separan los datos 75/25, se aplica StandardScaler y se prueban distintos valores de k (1, 3, 5, 7, 11, 15 y 21).",
    results:"El análisis permite comparar cómo cambia la distribución y el perfil promedio de los grupos al usar K=3 o K=4. KNN calcula la exactitud para cada valor de k sobre el conjunto de prueba. Los registros son simulados y las métricas concretas dependen de la ejecución del notebook; no representan estudiantes reales.",
    learning:"Comprendí la diferencia entre aprendizaje no supervisado y supervisado, la importancia de escalar variables para métodos basados en distancias y el uso de datos de prueba para evaluar un clasificador.",
    tools:"Python · NumPy · Pandas · Matplotlib · Seaborn · Scikit-learn"
  },
  {
    id:"hot", icon:"🗺️", title:"Hotspots Comerciales",
    summary:"Análisis geoespacial exploratorio de establecimientos comerciales en Chalatenango, El Salvador.",
    problem:"Explorar la distribución espacial de establecimientos comerciales y analizar agrupaciones y la clasificación de una ubicación de referencia.",
    objective:"Obtener puntos comerciales de OpenStreetMap, depurar sus coordenadas, agruparlos con K-Means, clasificar una coordenada con KNN y generar un mapa HTML con Folium.",
    methodology:"OSMnx consulta establecimientos etiquetados como supermercados, tiendas de conveniencia y comercios de abarrotes en Chalatenango. GeoPandas calcula centroides; Pandas elimina coordenadas nulas y duplicadas. K-Means forma hasta tres grupos. KNN clasifica usando una etiqueta exploratoria basada en si la latitud está por encima o debajo de la latitud media; la coordenada de prueba del código es 14.143, -88.938.",
    results:"El notebook prepara el archivo mapa_hotspots_chalatenango.html con Folium y muestra la clasificación de la coordenada propuesta. La división por latitud es una aproximación didáctica, no una zonificación oficial ni una predicción de ventas. La vista interactiva actual del portafolio usa puntos sintéticos para explicar los algoritmos; no son comercios verificados.",
    learning:"Practiqué extracción de datos geográficos, limpieza de coordenadas, cálculo de centroides, agrupamiento espacial, clasificación por vecinos y visualización cartográfica.",
    tools:"Python · OSMnx · GeoPandas · Pandas · NumPy · Scikit-learn · Folium · OpenStreetMap"
  },
  {
    id:"web", icon:"💻", title:"Desarrollo web",
    summary:"Diseño y desarrollo de este portafolio digital con frontend interactivo y API REST para el formulario de contacto.",
    problem:"Construir un sitio público que reúna mi información académica, habilidades, proyectos y una forma funcional de recibir mensajes.",
    objective:"Crear una aplicación responsive con Next.js, React y TypeScript, publicarla en Vercel y conectar el formulario a un endpoint del servidor.",
    methodology:"Se organizaron componentes y secciones en React, se desarrollaron demostraciones interactivas y se aplicaron estilos responsive con CSS y Tailwind CSS. El endpoint POST /api/contact valida los campos y utiliza una variable de entorno protegida para enviar mensajes mediante un proveedor de correo.",
    results:"El portafolio está publicado en Vercel, conectado a GitHub y cuenta con formulario de contacto funcional, validaciones y confirmación de envío. Los cambios del repositorio activan el despliegue automático.",
    learning:"Fortalecí mis conocimientos de componentes, estado en React, tipado con TypeScript, estilos responsive, rutas API, variables de entorno, GitHub y despliegue.",
    tools:"Next.js · React · TypeScript · Tailwind CSS · CSS · API REST · Git · GitHub · Vercel"
  }
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
      <nav className={menuOpen?"nav-links open":"nav-links"}>{[["Inicio","#inicio"],["Sobre mí","#sobre-mi"],["Formación","#formacion"],["Experiencia","#experiencia"],["Proyectos","#proyectos"],["Compartir","#compartir"],["Contacto","#contacto"]].map(([label,href])=><a key={href} href={href} onClick={()=>setMenuOpen(false)}>{label}</a>)}</nav>
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

      <section className="section experience-section" id="experiencia"><div className="container"><h2 className="section-title">Experiencia</h2><p className="section-subtitle">Aprendizajes y proyectos que me han permitido desarrollar mis conocimientos y habilidades.</p><div className="experience-grid">
        <article className="paper-card experience-card"><span className="status">2026 · Formación académica</span><h3>¡Supérate! Fundación Frech</h3><h4>Participante del programa de formación integral</h4><p>Formación en las áreas de Inglés, Informática y Valores. Participación en actividades prácticas, presentaciones y trabajos colaborativos que han fortalecido mis habilidades de organización, comunicación, expresión y trabajo en equipo.</p></article>
        <article className="paper-card experience-card"><span className="status">2026 · Proyectos académicos</span><h3>Python, Machine Learning y desarrollo web</h3><h4>Desarrollo de algoritmos, análisis de datos y aplicaciones web</h4><p>Desarrollo de ejercicios y proyectos académicos con Python, incluyendo regresión lineal, resolución de laberintos mediante búsqueda BFS, agrupamiento con K-Means, clasificación con KNN y análisis geoespacial de zonas comerciales en Chalatenango. También trabajé en la creación de este portafolio con Next.js, React y TypeScript, e implementé una API para el formulario de contacto.</p></article>
      </div></div></section>

      <section className="section"><div className="container"><h2 className="section-title">Mis habilidades</h2><p className="section-subtitle">Conocimientos y cualidades que sigo desarrollando.</p><div className="skills-grid"><div className="paper-card"><h3>Conocimientos técnicos</h3><ul><li>Inglés en formación</li><li>Informática y herramientas digitales</li><li>Fundamentos de programación</li><li>Organización y análisis de información</li></ul></div><div className="paper-card"><h3>Habilidades personales</h3><ul><li>Responsabilidad y compromiso</li><li>Empatía y respeto</li><li>Trabajo en equipo</li><li>Comunicación y perseverancia</li><li>Disposición para aprender</li></ul></div></div></div></section>

      <section className="section contact-section" id="contacto"><div className="container"><h2 className="section-title">Contacto</h2><p className="section-subtitle">Gracias por visitar mi portafolio. Puedes dejarme un mensaje.</p><div className="contact-grid"><div className="paper-card"><h3>¡Hablemos!</h3><p>Me interesa seguir aprendiendo, compartir mis proyectos y conocer nuevas oportunidades académicas.</p><p className="contact-quote">“Con esfuerzo, dedicación y pasión, todo es posible”.</p></div><form className="paper-card contact-form" onSubmit={onContact}><label>Nombre<input name="name" required placeholder="Tu nombre"/></label><label>Correo electrónico<input name="email" type="email" required placeholder="correo@ejemplo.com"/></label><label>Mensaje<textarea name="message" required rows={4} placeholder="Escribe tu mensaje"/></label><button className="primary-button" disabled={sending}>{sending?"Enviando…":"Enviar mensaje →"}</button><p className={noticeError?"form-notice error":"form-notice"} aria-live="polite">{notice || "Será un gusto leerte. ¡Déjame tu mensaje y estaré encantada de responderte! ♡"}</p></form></div></div></section>
    </main>

      <section className="section share-section" id="compartir">
        <div className="container">
          <div className="share-card">
            <div className="share-copy">
              <span className="eyebrow">COMPARTE MI CAMINO</span>
              <h2>Mi portafolio, a un escaneo de distancia</h2>
              <p>Escanea el código QR para visitar mi portafolio digital desde tu celular y conocer mi formación, mis proyectos y mis aprendizajes.</p>
              <a className="primary-button" href="https://miportafolio-ale.vercel.app" target="_blank" rel="noreferrer">Visitar portafolio ↗</a>
            </div>
            <div className="share-qr-wrap">
              <img className="share-qr" src="https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=https%3A%2F%2Fmiportafolio-ale.vercel.app" alt="Código QR para visitar el portafolio digital" loading="lazy" />
              <span>Escanéame ♡</span>
            </div>
          </div>
        </div>
      </section>

    <footer><div className="footer-inner"><p className="footer-quote">“Con esfuerzo, dedicación y pasión, todo es posible.” ♡</p><p>Keyli Alejandra Arévalo Paz · Portafolio Digital · 2026</p></div></footer>

    {selected && <div className={selected.id==="maze" ? "modal-backdrop maze-backdrop" : "modal-backdrop"} role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><section className={selected.id==="maze" ? "project-modal maze-modal" : "project-modal"} role="dialog" aria-modal="true" aria-labelledby="project-title"><button className="modal-close" onClick={()=>setSelected(null)} aria-label="Cerrar">×</button><span className="eyebrow">PORTAFOLIO · PROYECTO</span><h2 id="project-title">{selected.title}</h2><div className="project-info-grid">
        <article className="project-info"><h3>Problema</h3><p>{selected.problem}</p></article>
        <article className="project-info"><h3>Objetivo</h3><p>{selected.objective}</p></article>
        <article className="project-info"><h3>Proceso de desarrollo</h3><p>{selected.methodology}</p></article>
        <article className="project-info"><h3>Resultados</h3><p>{selected.results}</p></article>
        <article className="project-info project-learning"><h3>Aprendizajes</h3><p>{selected.learning}</p></article>
      </div>
      <p className="tools"><b>Tecnologías:</b> {selected.tools}</p>
      {selected.id==="reg" && <div className="mini-demo"><h3>Prueba la estimación lineal</h3><label>Horas de estudio (1–30)<input type="number" min="1" max="30" value={hours} onChange={e=>setHours(e.target.value)}/></label><button className="primary-button small" onClick={regression}>Calcular estimación</button>{regResult && <p className="demo-result">{regResult}</p>}</div>}
      {selected.id==="ai" && <div className="mini-demo"><h3>Prueba una clasificación ilustrativa</h3><div className="demo-fields">{([["hours","Horas de estudio (0–10)"],["attendance","Asistencia (%)"],["tasks","Tareas entregadas (%)"],["score","Nota de examen"]] as const).map(([key,label])=><label key={key}>{label}<input type="number" value={ai[key]} onChange={e=>setAi({...ai,[key]:e.target.value})}/></label>)}</div><button className="primary-button small" onClick={classify}>Clasificar ejemplo</button>{aiResult && <p className="demo-result">{aiResult}</p>}</div>}
      {selected.id==="hot" && <HotspotsDemo />}
      {selected.id==="maze" && <MazeDemo />}
      <p className="modal-footnote">Esta ficha presenta el proyecto académico; los datos simulados son únicamente para aprendizaje.</p></section></div>}
  </>;
}
