import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { StationDetailsPage } from './pages/StationDetailsPage';
import { BookingPage } from './pages/BookingPage';
import { BookingConfirmedPage } from './pages/BookingConfirmedPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { AssistantPage } from './pages/AssistantPage';
import { ImpactPage } from './pages/ImpactPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-[#111827]">
        {/* Desktop & Mobile Header Navbar */}
        <Navbar />

        {/* Main Routed Page Content */}
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/stations/:id" element={<StationDetailsPage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/booking-confirmed" element={<BookingConfirmedPage />} />
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Reusable Footer */}
        <Footer />

        {/* Mobile Fixed Bottom Navigation Bar */}
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}
