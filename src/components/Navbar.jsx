import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { Menu, User, X } from "lucide-react";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const handleLinkClick = (event) => {
    event.preventDefault();
    const targetId = event.target.getAttribute("href").slice(1);
    const targetElement = document.getElementById(targetId);
  
    if (targetElement) {
      const navbarHeight = 64; // Altura del navbar en píxeles
      const offsetPosition = targetElement.offsetTop - navbarHeight;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Referencias para los menús
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false); // Cerrar el menú de usuario si está abierto
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isOpen) setIsOpen(false); // Cerrar el menú de hamburguesa si está abierto
  };

  useEffect(() => {
    // Maneja los clics fuera de los menús
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    // Agregar el event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Limpiar el event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className='bg-[#000000]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <a href="/" className='text-white font-montserrat font-semibold text-2xl'>
                Pomodorito
              </a>
            </div>
          </div>

          {/* Contenedor de botones y enlaces (para pantallas grandes y pequeñas) */}
          <div className="flex items-center gap-4">
            {/* Enlaces de navegación (para pantallas grandes) */}
            <div className="hidden md:flex space-x-4 opacity-100">
              <a href="#how-it-works" onClick={handleLinkClick} className='navbar-custom'>Cómo Funciona</a>
              <a href="#benefits" onClick={handleLinkClick}className='navbar-custom'>Beneficios</a>
              <a href="#about" onClick={handleLinkClick}className='navbar-custom'>Acerca de</a>
            </div>

            {/* Toggle button para pantallas pequeñas */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-white hover:bg-white hover:text-[#000000]"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Icono de Usuario */}
            <div>
              <button
                onClick={toggleUserMenu}
                className="p-2 rounded-md text-white hover:bg-white hover:text-[#000000]"
              >
                <User className="h-8 w-8" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menú de navegación (para pantallas pequeñas) */}
      {isOpen && (
        <div ref={menuRef} className="absolute top-16 right-0 bg-[#ffffff] m-2 rounded-md shadow-lg opacity-95">
          <nav className="flex flex-col space-y-2 px-4 py-2">
            <a href="#how-it-works" onClick={handleLinkClick}className="hover:bg-[#010000] hover:text-[#ffffff] rounded-md p-2">
              Cómo Funciona
            </a>
            <a href="#benefits" onClick={handleLinkClick}className="hover:bg-[#010000] hover:text-[#ffffff] rounded-md p-2">
              Beneficios
            </a>
            <a href="#about" onClick={handleLinkClick}className="hover:bg-[#010000] hover:text-[#ffffff] rounded-md p-2">
              Acerca de
            </a>

          </nav>
        </div>
      )}

      {/* Menú de Usuario (Login/Registro) */}
      {isUserMenuOpen && (
        <div ref={userMenuRef} className="absolute top-16 right-0 bg-[#ffffff] m-2 rounded-md shadow-lg opacity-95 z-10">
          <nav className="flex flex-col space-y-2 px-4 py-2">
            <Link to ="/login" className="hover:bg-[#010000] hover:text-[#ffffff] rounded-md p-2">
              Iniciar sesión
            </Link>
            <Link to ="/registro" className="hover:bg-[#010000] hover:text-[#ffffff] rounded-md p-2">
              Registro
            </Link>
          </nav>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
