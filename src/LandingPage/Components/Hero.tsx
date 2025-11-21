import { useState, useEffect } from "react";

const Hero = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIfDesktop();
    window.addEventListener('resize', checkIfDesktop);

    return () => window.removeEventListener('resize', checkIfDesktop);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Capa de video desde YouTube (solo desktop) */}
      {isDesktop && (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <iframe
      className="w-full h-full object-cover"
      src="https://www.youtube.com/embed/xVQZaeBqI5A?autoplay=1&loop=1&playlist=xVQZaeBqI5A&mute=1&controls=0&modestbranding=1&rel=0&vq=hd1080"
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
)}
      {/* Capa de imagen para móviles */}
      <div className="md:hidden absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/LandingPage/forcegym.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </div>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/50 z-1"></div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
          DESAFÍA TU <span className="text-yellow-500">CUERPO</span>,<br />
          CONQUISTA TU <span className="text-yellow-500">MENTE</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
          Bienvenido a <span className="font-bold text-yellow-500">Force Gym</span>: donde la fuerza física y mental se forjan juntas.
        </p>
      </div>
    </section>
  );
};

export default Hero;