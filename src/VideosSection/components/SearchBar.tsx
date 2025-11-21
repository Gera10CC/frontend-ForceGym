import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  delay?: number; // Tiempo de debounce en ms
}

export const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = 'Buscar ejercicios...',
  delay = 300 
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(searchTerm);
  const timerRef = useRef<NodeJS.Timeout>();
  
  // Efecto para el debounce
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onSearchChange(inputValue);
    }, delay);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [inputValue, delay, onSearchChange]);
  
  // Sincronizar con cambios externos
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  return (
    <div className="relative w-full max-w-md mx-auto mb-6">
      <div className="relative flex items-center">
        <div className="absolute left-3 text-yellow">
          <svg 
            viewBox="0 0 24 24"
            width="20"
            height="20"
            className="h-5 w-5"
          >
            <path 
              fill="currentColor"
              d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full pl-10 pr-8 py-2 bg-black border border-yellow rounded-full text-white focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent transition-all duration-200"
        />
        {inputValue && (
          <button 
            className="absolute right-3 text-yellow hover:text-white transition-colors duration-200"
            onClick={() => setInputValue('')}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" className="h-4 w-4">
              <path 
                fill="currentColor"
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};