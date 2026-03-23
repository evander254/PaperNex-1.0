import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navbar({ onOpenAuth }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#030014]/90 backdrop-blur-lg border-b border-white/10 py-3' : 'bg-transparent py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <a href="#" className="flex items-center">
                            <img src="/logo.png" alt="PaperNex Logo" className="w-[180px] md:w-[220px] h-auto object-contain drop-shadow-lg scale-110 origin-left" />
                        </a>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#home" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Home</a>
                        <a href="#services" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Services</a>
                        <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">How It Works</a>
                        <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Pricing</a>
                        <a href="#contact" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Contact</a>
                    </div>

                    <div className="hidden md:flex">
                        <button
                            onClick={onOpenAuth}
                            className="px-6 py-2.5 rounded-full bg-white text-[#030014] font-semibold text-sm hover:bg-gray-100 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                        >
                            Get Started
                        </button>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button className="text-white hover:text-gray-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
