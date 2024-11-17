// Landing Page

import React from 'react';
import Navbar from '../components/Navbar';
// Componente de Tarjeta reutilizable
const Card = ({ children }) => {
  return (
    <div className="group bg-white rounded-lg shadow-lg p-6 transition-colors duration-300 hover:bg-black">
      {children}
    </div>
  );
};

const CardTitle = ({ children }) => {
  return (
    <h3 className="text-xl font-semibold text-[#151313] transition-colors duration-300 group-hover:text-white">
      {children}
    </h3>
  );
};

const CardContent = ({ children }) => {
  return (
    <div className="text-gray-500 mt-2 transition-colors duration-300 group-hover:text-gray-300">
      {children}
    </div>
  );
};


const CardHeader = ({ children }) => {
  return <div className="text-center">{children}</div>;
};


function Landing() {
  return (
    <>
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
      {/* Sección "Cómo funciona" */}
      <section  id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Cómo funciona
          </h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>1. Elige una tarea</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Selecciona la tarea en la que quieres trabajar.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>2. Inicia el temporizador</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Configura el temporizador para 25 minutos e inicia la sesión de trabajo.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>3. Concéntrate</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Trabaja en la tarea hasta que suene el temporizador.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>4. Toma un descanso corto</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Cuando suene el temporizador, toma un descanso de 5 minutos.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>5. Repite</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Repite el proceso. Cada 4 pomodoros, toma un descanso más largo de 15-30 minutos.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sección "Beneficios" */}
      <section id="benefits" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Beneficios
          </h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Mejora la concentración</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Ayuda a mantener el enfoque en una tarea específica durante períodos cortos.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Aumenta la productividad</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Divide el trabajo en intervalos manejables, lo que aumenta la eficiencia.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Reduce la fatiga mental</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Los descansos regulares ayudan a prevenir el agotamiento y mantener la energía.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sección "Acerca de la Técnica Pomodoro" */}
      <section id="about" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Acerca de la Técnica Pomodoro
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                La Técnica Pomodoro fue desarrollada por Francesco Cirillo a finales de los años 80. Es un método de gestión del tiempo que utiliza un temporizador para dividir el trabajo en intervalos, tradicionalmente de 25 minutos de duración, separados por breves descansos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Landing;
