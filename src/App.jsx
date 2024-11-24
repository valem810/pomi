// App.js
import React from 'react';
import Landing from './pages/Landing';  // Importa el nuevo componente
import Login from './pages/Login';  // Importa el nuevo componente
import Register from './pages/Register';  // Importa el nuevo componente
import Home from './pages/Home';  // Importa el nuevo componente
import { Navigate, Routes, Route } from 'react-router-dom';

import Layout from './pages/Layout'; // Asegúrate de importar el Layout
import Profile from './pages/Profile';
import Schedule from './pages/Schedule';
import Tasks from './pages/Tasks';

import './styles.css';

function App() {
  return (
    <div className='app-container bg-cover bg-center bg-no-repeat max-w-full h-screen'>

      <Routes>
        <Route path='/' element={<Landing></Landing>}> </Route>

        <Route path='/login' element={<Login></Login>}> </Route>
        <Route path='/registro' element={<Register></Register>}> </Route>

        <Route path='*' element={<Navigate to="/"></Navigate>}> </Route>

        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/schedule" element={<Layout><Schedule /></Layout>} />
        <Route path="/tasks" element={<Layout><Tasks /></Layout>} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
      </Routes>
    </div>
  );
}

export default App;
