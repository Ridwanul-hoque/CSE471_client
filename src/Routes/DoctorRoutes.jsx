// src/Routes/DoctorRoutes.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useDoctor from '../Hooks/useDoctor';
import useAuth from '../Hooks/useAuth';

const DoctorRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const [isDoctor, isDoctorLoading] = useDoctor();
  const location = useLocation();

  if (loading || isDoctorLoading) {
    return <progress className="progress w-56"></progress>;
  }

  if (user && isDoctor) {
    return children;
  }

  return <Navigate to='/login' state={{ from: location }} replace />;
};

export default DoctorRoutes;
