import { useState, useMemo } from 'react';
import { CategoryFilter } from './components/CategoryFilter';
import { SearchBar } from './components/SearchBar';
import { videos } from './data/videos';
import { VideoCategory } from './types/video';
import { FaArrowLeft } from 'react-icons/fa';
import YouTubeVideoCard from './components/YouTubeVideoCard';
import Pagination from './components/Pagination';

const allCategories: VideoCategory[] = [
  'gluteos', 'femoral', 'cuadriceps', 'pecho',
  'triceps', 'hombro', 'espalda', 'biceps', 'pantorrilla'
];

export default function VideoSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Puedes ajustar este valor

  // Función para normalizar texto (elimina tildes y convierte a minúsculas)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const filteredVideos = useMemo(() => {
    let result = videos;

    // Filtrado por categoría
    if (selectedCategory) {
      result = result.filter(video => video.category === selectedCategory);
    }

    // Búsqueda con normalización de tildes
    if (searchTerm.trim()) {
      const normalizedSearch = normalizeText(searchTerm);
      result = result.filter(video => 
        normalizeText(video.title).includes(normalizedSearch) ||
        normalizeText(video.description).includes(normalizedSearch)
      );
    }

    return result;
  }, [searchTerm, selectedCategory]);

  // Calcular videos para la página actual
  const indexOfLastVideo = currentPage * itemsPerPage;
  const indexOfFirstVideo = indexOfLastVideo - itemsPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);

  // Resetear a la primera página cuando cambian los filtros
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="bg-black min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado con logo y botón de regreso */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            {/* Botón Regresar */}
            <div className="w-8 sm:w-10 md:w-12 flex justify-start">
              <a
                href="/"
                className="flex items-center text-gray-400 hover:text-yellow transition-colors duration-300"
                title="Regresar"
              >
                <FaArrowLeft className="text-xl sm:text-2xl" />
              </a>
            </div>

            {/* Logo centrado */}
            <div className="flex-grow flex justify-center px-2">
              <img
                src="/LogoBlack.jpg"
                alt="Logo de Force GYM"
                className="w-32 sm:w-40 md:w-52 lg:w-60 h-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Espacio vacío para balancear */}
            <div className="w-8 sm:w-10 md:w-12"></div>
          </div>

          <h1 className="text-3xl font-bold text-yellow mb-2">Sección de Videos de Ejercicios</h1>
          <p className="text-white">Encuentra todos los ejercicios que se realizan en FORCE GYM</p>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Filtro de categorías */}
        <div className="mb-8">
          <CategoryFilter
            categories={allCategories}
            activeCategory={selectedCategory || undefined}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Contador de resultados */}
        <div className="text-white mb-4">
          {filteredVideos.length} {filteredVideos.length === 1 ? 'resultado' : 'resultados'} encontrados
        </div>

        {/* Grid de videos */}
        {currentVideos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {currentVideos.map(video => (
                <YouTubeVideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* Paginación */}
            <div className="mt-8">
              <Pagination
                totalItems={filteredVideos.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No se encontraron videos. Prueba con otros términos de búsqueda.</p>
            <button
              className="mt-4 px-4 py-2 bg-yellow text-black rounded-md hover:bg-yellow-dark transition-colors"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(null);
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}