import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/landing/LandingPage';
import GuestAppInterface from './components/app/GuestAppInterface';
import DigitalCheckIn from './components/app/DigitalCheckIn';
import DigitalKey from './components/app/DigitalKey';
import RoomService from './components/app/RoomService';
import ShuttleService from './components/app/ShuttleService';
import ConsumerDashboard from './components/dashboard/ConsumerDashboard';
import BusinessDashboard from './components/dashboard/BusinessDashboard';
import InvestorDashboard from './components/dashboard/InvestorDashboard';
import ReportingSuite from './components/dashboard/ReportingSuite';
import AuthScreen from './components/shared/AuthScreen';
import { AuthProvider } from './context/AuthContext';
import { SupabaseProvider } from './context/SupabaseContext';
import './styles/global.css';

function App() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<AuthScreen />} />
                <Route path="/register" element={<AuthScreen isRegister />} />
                
                {/* App Routes */}
                <Route path="/app" element={<GuestAppInterface />} />
                <Route path="/check-in" element={<DigitalCheckIn />} />
                <Route path="/digital-key" element={<DigitalKey />} />
                <Route path="/room-service" element={<RoomService />} />
                <Route path="/shuttle" element={<ShuttleService />} />
                
                {/* Dashboard Routes */}
                <Route path="/consumer" element={<ConsumerDashboard />} />
                <Route path="/business" element={<BusinessDashboard />} />
                <Route path="/investor" element={<InvestorDashboard />} />
                <Route path="/reporting" element={<ReportingSuite />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </SupabaseProvider>
  );
}

export default App;
