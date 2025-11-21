import { useState, useMemo } from "react";

const History = () => {
  const [showFull, setShowFull] = useState(false);

  const fullContent = useMemo(() => (
    <div className="space-y-6 animate-fadeIn">
      <p className="text-white/90 text-lg md:text-xl leading-relaxed">
        Mi amigo Walter Salas me tendió su mano para hacerlo posible y hoy 
        toda mi familia forma parte de este sueño hecho realidad.
      </p>
      <div className="border-l-4 border-amber-400 pl-4 italic text-white/80">
        <p className="mb-2">"De lo único que me arrepiento es de no haberlo pensado antes, pero el tiempo de Dios es perfecto".</p>
        <p className="text-amber-400 not-italic font-medium">- Eduardo Chacón Vega</p>
      </div>
    </div>
  ), []);

  return (
    <section
      id="historia"
      className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden scroll-mt-[80px]"
    >
      {/* Fondo corregido */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/LandingPage/gyminicio.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-30 text-center px-4 md:px-20 max-w-4xl w-full">
        <div className="mb-8 md:mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-2">
            NUESTRA <span className="text-amber-400">HISTORIA</span>
          </h2>
          <div className="w-20 h-1 bg-amber-400 mx-auto mt-3 md:mt-4"></div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm p-6 md:p-8 rounded-lg border border-white/10 shadow-lg">
          <p className="text-white/90 text-base md:text-lg mb-6 leading-relaxed">
            FORCE GYM nace de la necesidad de crear para mis hijos una oportunidad 
            laboral propia que les permitiera desempeñarse en su área profesional.
            Tras valorar que todos contaban con la experiencia y el conocimiento 
            necesario para la idea del negocio, me decidí a buscar un local.
          </p>

          {showFull && fullContent}
        </div>

        <button
          onClick={() => setShowFull(!showFull)}
          className="mt-8 md:mt-10 px-8 md:px-10 py-2 md:py-3 bg-transparent border-2 border-amber-400 text-amber-400 rounded-lg font-semibold hover:bg-amber-400/10 hover:border-amber-300 transition-all duration-200"
          aria-expanded={showFull}
          aria-label={showFull ? "Mostrar menos contenido" : "Mostrar más contenido"}
        >
          {showFull ? "Mostrar menos" : "Leer más"}
        </button>
      </div>
    </section>
  );
};

export default History;