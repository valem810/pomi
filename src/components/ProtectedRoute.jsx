import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser; // Obtén el usuario autenticado

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
