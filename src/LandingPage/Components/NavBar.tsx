import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 shadow-lg' : 'bg-black/80'} py-4`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-extrabold text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            FORCE GYM
          </Link>

          {/* Menú Desktop */}
          <ul className="hidden md:flex space-x-8">
            <li>
              <a 
                href="#historia" 
                className="text-white hover:text-yellow-400 transition-colors font-medium uppercase text-sm tracking-wider"
              >
                Historia
              </a>
            </li>
            <li>
              <a 
                href="#tarifas" 
                className="text-white hover:text-yellow-400 transition-colors font-medium uppercase text-sm tracking-wider"
              >
                Tarifas
              </a>
            </li>
            <li>
              <a 
                href="#galeria" 
                className="text-white hover:text-yellow-400 transition-colors font-medium uppercase text-sm tracking-wider"
              >
                Galería
              </a>
            </li>
            <li>
              <a 
                href="#contacto" 
                className="text-white hover:text-yellow-400 transition-colors font-medium uppercase text-sm tracking-wider"
              >
                Contacto
              </a>
            </li>
            <li>
            <Link 
              to="/videos-ejercicios" 
              className="text-white hover:text-yellow-400 transition-colors font-medium uppercase text-sm tracking-wider"
            >
              Videos de Ejercicios
            </Link>
            </li>
          </ul>

          {/* Botón Mobile */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Menú Mobile */}
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <ul className="pt-4 pb-6 space-y-4">
            <li>
              <a 
                href="#historia" 
                className="block text-white hover:text-yellow-400 transition-colors font-medium uppercase text-sm tracking-wider py-2"
                onClick={() => setIsOpen(false)}
              >
                Historia
              </a>
            </li>
            <li>
              <a 
                href="#tarifas" 
                className="block text-white hover:text-yellow-400 transition-colors font-medium uppercase text-sm tracking-wider py-2"
                onClick={() => setIsOpen(false)}
              >
                Tarifas
              </a>
            </li>
            <li>
              <a 
                href="#galeria" 
                className="block text-white hover:text-yellow-400 transition-colors font-medium uppercase text-sm tracking-wider py-2"
                onClick={() => setIsOpen(false)}
              >
                Galería
              </a>
            </li>
            <li>
              <a 
                href="#contacto" 
                className="block text-white hover:text-yellow-400 transition-colors font-medium uppercase text-sm tracking-wider py-2"
                onClick={() => setIsOpen(false)}
              >
                Contacto
              </a>
            </li>
            <li>
              <Link 
                to="/videos-ejercicios" 
                className="block text-white hover:text-yellow-400 transition-colors font-medium uppercase text-sm tracking-wider py-2"
                onClick={() => setIsOpen(false)}
              >
                Videos de ejercicios
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;