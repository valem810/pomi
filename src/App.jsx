// App.js

import React from 'react';
import Navbar from './components/Navbar';
import MainSections from './components/MainSections';  // Importa el nuevo componente
import './styles.css';

function App() {
  return (
    <div className='app-container bg-cover bg-center bg-no-repeat max-w-full h-screen'>
      {/* Navbar */}
      <Navbar />
      {/* Sección Principal */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="h1">
                Domina tu tiempo con la Técnica Pomodoro
              </h1>
              <p className="mx-auto max-w-[700px] text-[#151313] md:text-xl dark:text-[#000000]">
                Aumenta tu productividad y mejora tu concentración con nuestro temporizador Pomodoro.
              </p>
            </div>

            <div className='mx-auto'>
              <button class=" bg-[#000000] hover:bg-gray-400 text-[#ffffff] font-bold py-2 px-4 rounded inline-flex items-center">
                Comenzar
              </button>
            </div>
          </div>
        </div>
      </section>
      {/*Informativo */}
      <MainSections />
    </div>
  );
}

export default App;
