// App.js
import React from 'react';
import Landing from './pages/Landing';  
import Login from './pages/Login';  
import Register from './pages/Register';  
import Home from './pages/Home';  
import { Navigate, Routes, Route } from 'react-router-dom';

import Layout from './pages/Layout'; 
import Profile from './pages/Profile';
import Clock from './pages/Clock';
import Tasks from './pages/Tasks';
import NavbarLayout from './pages/NavbarLayout';
import './styles.css';

function App() {
  return (
    <div className='app-container bg-cover bg-center bg-no-repeat max-w-full h-screen'>

      <Routes>
        <Route path='/' element={<Landing></Landing>}> </Route>

        <Route path='/login' element={<Login></Login>}> </Route>
        <Route path='/registro' element={<Register></Register>}> </Route>

        <Route path='*' element={<Navigate to="/"></Navigate>}> </Route>

        <Route path="/profile" element={<NavbarLayout><Profile /></NavbarLayout>} />
        <Route path="/clock" element={<Layout><Clock /></Layout>} />
        <Route path="/tasks" element={<Layout><Tasks /></Layout>} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
      </Routes>
    </div>
  );
}

export default App;
