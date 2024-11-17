// App.js
import React from 'react';
import Landing from './pages/Landing';  // Importa el nuevo componente
import Login from './pages/Login';  // Importa el nuevo componente
import Register from './pages/Register';  // Importa el nuevo componente
import Home from './pages/Home';  // Importa el nuevo componente
import {Navigate, Routes, Route} from 'react-router-dom';
import './styles.css';

function App() {
  return (
    <div className='app-container bg-cover bg-center bg-no-repeat max-w-full h-screen'>
      
        <Routes>
          <Route path='/' element={<Landing></Landing>}> </Route>
          <Route path='/home' element={<Home></Home>}> </Route>
          
          <Route path='/login' element={<Login></Login>}> </Route>
          <Route path='/registro' element={<Register></Register>}> </Route>
          <Route path='*' element={<Navigate to="/"></Navigate>}> </Route>
        </Routes>
    </div>
  );
}

export default App;
