<<<<<<< HEAD
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated');

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
=======
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated');

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
>>>>>>> 0c793ad (4.0 version)
