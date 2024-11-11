import React, { useState } from 'react';
import './Navbar.css';
import { Menu, User, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false); // Cerrar el menú de usuario si está abierto
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isOpen) setIsOpen(false); // Cerrar el menú de hamburguesa si está abierto
  };

  return (
    <nav className='bg-[#000000] opacity-85'>
      <div className='max-w-7xl mx-auto px-4 sm:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <a href="/" className='text-white font-montserrat font-semibold'>
                LOGO
              </a>
            </div>
          </div>

          {/* Contenedor de botones y enlaces (para pantallas grandes y pequeñas) */}
          <div className="flex items-center gap-4">  {/* Asegúrate de usar gap-4 o un valor más pequeño */}
            {/* Enlaces de navegación (para pantallas grandes) */}
            <div className="hidden md:flex space-x-4 opacity-100">
              <a href="/" className='navbar-custom'>Cómo Funciona</a>
              <a href="/" className='navbar-custom'>Beneficios</a>
              <a href="/" className='navbar-custom'>Acerca de</a>
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
                className="p-2 rounded-md text-white"
              >
                <User className="h-8 w-8" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menú de navegación (para pantallas pequeñas) */}
      {isOpen && (
        <div className="absolute top-16 right-0 bg-[#fffdfd] m-2 rounded-md shadow-lg opacity-95">
          <nav className="flex flex-col space-y-2 px-4 py-2">
            <a href="/" className="hover:bg-white hover:text-[#000000] rounded-md p-2">
              Cómo Funciona
            </a>
            <a href="/" className="hover:bg-white hover:text-[#000000] rounded-md p-2">
              Beneficios
            </a>
            <a href="/" className="hover:bg-white hover:text-[#000000] rounded-md p-2">
              Acerca de
            </a>
          </nav>
        </div>
      )}

      {/* Menú de Usuario (Login/Registro) */}
      {isUserMenuOpen && (
        <div className="absolute top-16 right-0 bg-[#ffffff] m-2 rounded-md shadow-lg opacity-95 z-10">
          <nav className="flex flex-col space-y-2 px-4 py-2">
            <a href="/login" className="hover:bg-white hover:text-[#000000] rounded-md p-2">
              Iniciar sesión
            </a>
            <a href="/registro" className="hover:bg-white hover:text-[#000000] rounded-md p-2">
              Registro
            </a>
          </nav>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
