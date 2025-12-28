import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import BusManagement from './pages/BusManagement';
import AdminBookings from './pages/AdminBookings';
import RouteManagement from './pages/RouteManagement';
import ScheduleManagement from './pages/ScheduleManagement';
import SearchBuses from './pages/SearchBuses';
import BookingHistory from './pages/BookingHistory';
import SeatSelection from './pages/SeatSelection';
import BookingConfirmation from './pages/BookingConfirmation';

import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/buses" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <BusManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/routes" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <RouteManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/schedules" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ScheduleManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/bookings" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminBookings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/search" 
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <SearchBuses />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <BookingHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/seats/:scheduleId" 
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <SeatSelection />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/booking-confirmation/:bookingId" 
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <BookingConfirmation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user" 
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;