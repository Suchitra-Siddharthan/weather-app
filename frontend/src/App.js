import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import DestinationSearch from './components/DestinationSearch';
import CreateTrip from './components/CreateTrip';
import MyTrips from './components/MyTrips';
import WeatherForecast from './pages/WeatherForecast';
import AdminDashboard from './components/AdminDashboard';
import AdminDestinations from './components/AdminDestinations';
import TripDetails from './components/TripDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/destinations"
              element={
                <PrivateRoute>
                  <DestinationSearch />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-trip"
              element={
                <PrivateRoute>
                  <CreateTrip />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-trips"
              element={
                <PrivateRoute>
                  <MyTrips />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/:tripId"
              element={
                <PrivateRoute>
                  <TripDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/destinations"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDestinations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/weather-forecast"
              element={
                <PrivateRoute>
                  <WeatherForecast />
                </PrivateRoute>
              }
            />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App; 