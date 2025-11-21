import React, { useCallback, useEffect, useMemo, useState } from 'react';

type CardItem = {
  images: string[];
  title: string;
  descriptions: string[];
};

const WhyUs = () => {
  const cardsData: CardItem[] = useMemo(
    () => [
      {
        title: 'INSTALACIONES PREMIUM',
        images: [
          '/LandingPage/gym.webp',
          '/LandingPage/bicicleta.webp',
          '/LandingPage/mancuerna.webp'
        ],
        descriptions: [
          'Equipos de última generación para todos los niveles',
          'Espacios diseñados para el alto rendimiento',
          'Áreas especializadas para cada disciplina'
        ]
      },
      {
        title: 'ENTRENADORES ÉLITE',
        images: [
          '/LandingPage/coach.webp',
          '/LandingPage/andrea.webp',
          '/LandingPage/kimberly.webp',
          '/LandingPage/gypsy.webp'
        ],
        descriptions: [
          '',
          'Andrea Chacón: Especialista en entrenamiento funcional',
          'Kimberly Chacón: Experta en consultas personalizadas',
          'Gipsy López: Nutricionista y entrenadora certificada'
        ]
      },
      {
        title: 'RESULTADOS GARANTIZADOS',
        images: [
          '/LandingPage/resultados.webp',
          '/LandingPage/resultados-2.webp',
          '/LandingPage/resultados-3.webp'
        ],
        descriptions: [
          'Seguimiento personalizado de tu progreso',
          'Tecnología para medir tus avances',
          'Planes adaptados a tus objetivos'
        ]
      }
    ],
    []
  );

  const [currentIndices, setCurrentIndices] = useState(
    cardsData.map(() => 0)
  );
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const navigate = useCallback((cardIndex: number, direction: 'next' | 'prev') => {
    setCurrentIndices(prev => {
      const newIndices = [...prev];
      const currentMax = cardsData[cardIndex].images.length - 1;
      
      if (direction === 'next') {
        newIndices[cardIndex] = newIndices[cardIndex] === currentMax ? 0 : newIndices[cardIndex] + 1;
      } else {
        newIndices[cardIndex] = newIndices[cardIndex] === 0 ? currentMax : newIndices[cardIndex] - 1;
      }
      
      return newIndices;
    });
  }, [cardsData]);

  const goToImage = useCallback((cardIndex: number, imgIndex: number) => {
    setCurrentIndices(prev => {
      const newIndices = [...prev];
      newIndices[cardIndex] = imgIndex;
      return newIndices;
    });
  }, []);

  // Efecto para el carrusel automático solo en hover
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    
    cardsData.forEach((_, cardIndex) => {
      if (hoveredCard === cardIndex) {
        const interval = setInterval(() => {
          navigate(cardIndex, 'next');
        }, 3000); // 3 segundos
        intervals.push(interval);
      }
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [cardsData, navigate, hoveredCard]);

  return (
    <section className="py-12 md:py-20 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3">
            ¿POR QUÉ <span className="text-yellow-500">FORCE GYM</span>?
          </h2>
          <div className="w-14 md:w-16 h-1 bg-yellow-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cardsData.map((card, cardIndex) => (
            <div 
              key={cardIndex} 
              className="relative h-80 sm:h-96 rounded-xl overflow-hidden bg-gray-900 shadow-lg hover:shadow-yellow-500/30 transition-shadow"
              onMouseEnter={() => setHoveredCard(cardIndex)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Contenedor de imágenes con transición */}
              <div className="relative w-full h-full overflow-hidden">
                {card.images.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={image}
                    alt={`${card.title} ${imgIndex + 1}`}
                    className={`absolute w-full h-full object-cover brightness-75 transition-opacity duration-700 ${currentIndices[cardIndex] === imgIndex ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
              </div>

              {/* Overlay de texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end pb-8 pt-4 px-4">
                <h3 className="text-xl md:text-2xl font-bold text-yellow-400 mb-1">
                  {card.title}
                </h3>
                <p className="text-white text-sm md:text-base mb-4">
                  {card.descriptions[currentIndices[cardIndex]]}
                </p>

                {/* Indicadores de posición (puntos de navegación) */}
                <div className="flex justify-center space-x-2 mt-2">
                  {card.images.map((_, imgIndex) => (
                    <button
                      key={imgIndex}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToImage(cardIndex, imgIndex);
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndices[cardIndex] === imgIndex ? 'bg-yellow-500 w-6' : 'bg-white/50 hover:bg-white/70'}`}
                      aria-label={`Ir a imagen ${imgIndex + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;