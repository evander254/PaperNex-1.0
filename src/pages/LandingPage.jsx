import React, { useState } from 'react';
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

export default function LandingPage() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
