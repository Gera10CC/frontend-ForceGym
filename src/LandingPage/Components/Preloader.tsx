import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Desaparece después de 3 segundos o al hacer scroll
    const timer = setTimeout(() => setIsLoading(false), 3000);
    const handleScroll = () => {
      if (window.scrollY > 10) setIsLoading(false);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-black z-[9999]"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.2,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {/* Contenedor principal de la imagen */}
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Imagen del logo - Reemplaza con tu imagen */}
            <motion.img
              src="/LogoBlack.jpg" // Cambia esta ruta
              alt="Force Gym Logo"
              className="w-64 md:w-80 h-auto mb-8" // Ajusta el tamaño
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            />
          </motion.div>

          {/* Indicador de scroll (flecha animada) */}
          <motion.div
            className="absolute bottom-10 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <motion.p className="text-white mb-2 text-sm">
              Scroll para continuar
            </motion.p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;