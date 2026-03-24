import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { Loader2 } from 'lucide-react';

export default function LandingPage() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { user, profile, loading } = useAuth();

    // Show loading state while checking session
    if (loading) {
        return (
            <div className="min-h-screen bg-[#030014] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
        );
    }

    // If already logged in, redirect to dashboard/admin
    if (user) {
        if (profile?.role === 'admin') {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="bg-[#030014] min-h-screen text-white overflow-x-hidden pt-10 font-sans selection:bg-brand-500/30">
            <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} />
            <Hero onOpenAuth={() => setIsAuthModalOpen(true)} />
            <Services />
            <HowItWorks />
            <Features />
            <Testimonials />
            <Pricing onOpenAuth={() => setIsAuthModalOpen(true)} />
            <CTA onOpenAuth={() => setIsAuthModalOpen(true)} />
            <Footer />

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
}
