import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import DashboardLayout from './components/DashboardLayout';

// Admin Pages
import AdminBookings from './pages/admin/BookingsManager';
import AdminCustomers from './pages/admin/CustomersManager';
import AdminMechanics from './pages/admin/MechanicsManager';

// Customer Pages
import CustomerBookings from './pages/customer/Bookings';
import CustomerVehicles from './pages/customer/Vehicles';

// Mechanic Pages
import MechanicWork from './pages/mechanic/AssignedWork';

// Auth wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Dashboard */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout rolename="admin" />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="bookings" replace />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="mechanics" element={<AdminMechanics />} />
          </Route>
          
          {/* Customer Dashboard */}
          <Route path="/customer" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <DashboardLayout rolename="customer" />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="vehicles" replace />} />
            <Route path="vehicles" element={<CustomerVehicles />} />
            <Route path="bookings" element={<CustomerBookings />} />
          </Route>
          
          {/* Mechanic Dashboard */}
          <Route path="/mechanic" element={
            <ProtectedRoute allowedRoles={['mechanic']}>
              <DashboardLayout rolename="mechanic" />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="assigned-work" replace />} />
            <Route path="assigned-work" element={<MechanicWork />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
