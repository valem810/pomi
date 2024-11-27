import React from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Clock from './pages/Clock';
import Tasks from './pages/Tasks';
import NavbarLayout from './pages/NavbarLayout';
import Layout from './pages/Layout';
import { Navigate, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // Importa el componente
import './styles.css';

function App() {
  return (
    <div className='app-container bg-cover bg-center bg-no-repeat max-w-full h-screen'>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registro' element={<Register />} />
        <Route path='*' element={<Navigate to="/" />} />

        {/* Rutas protegidas */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <NavbarLayout>
                <Profile />
              </NavbarLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clock"
          element={
            <ProtectedRoute>
              <Layout>
                <Clock />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Layout>
                <Tasks />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
