import { VideoCategory } from '../types/video';

interface CategoryFilterProps {
  categories: VideoCategory[];
  activeCategory?: VideoCategory;
  onSelectCategory: (category: VideoCategory) => void;
}

export const CategoryFilter = ({ 
  categories, 
  activeCategory, 
  onSelectCategory 
}: CategoryFilterProps) => {
  // Función para traducir los nombres de categorías a español
  const getCategoryName = (category: VideoCategory): string => {
    const categoryNames: Record<VideoCategory, string> = {
      gluteos: 'Glúteos',
      femoral: 'Femoral',
      cuadriceps: 'Cuádriceps',
      pecho: 'Pecho',
      triceps: 'Tríceps',
      hombro: 'Hombros',
      espalda: 'Espalda',
      biceps: 'Bíceps',
      pantorrilla: 'Pantorrillas'
    };
    return categoryNames[category] || category;
  };

  return (
    <div className="flex flex-wrap gap-2 md:gap-3 py-4 px-2 md:px-4 bg-black overflow-x-auto scrollbar-hide">
      <button
        className={`px-3 py-1 text-sm md:text-base rounded-full transition-all duration-200 ${
          !activeCategory 
            ? 'bg-yellow text-black font-bold' 
            : 'bg-white text-black hover:bg-yellow hover:text-black'
        }`}
        onClick={() => onSelectCategory('' as VideoCategory)}
      >
        Todos
      </button>
      
      {categories.map(category => (
        <button
          key={category}
          className={`px-3 py-1 text-sm md:text-base rounded-full transition-all duration-200 ${
            activeCategory === category 
              ? 'bg-yellow text-black font-bold' 
              : 'bg-white text-black hover:bg-yellow hover:text-black'
          }`}
          onClick={() => onSelectCategory(category)}
        >
          {getCategoryName(category)}
        </button>
      ))}
    </div>
  );
};