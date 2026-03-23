import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export default function DashboardLayout() {
    const { session, signOut, loading, user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Responsive listening
        const mql = window.matchMedia('(max-width: 768px)');
        const handleResize = (e) => {
            setIsMobile(e.matches);
            if (e.matches) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        setIsMobile(mql.matches);
        if (mql.matches) {
            setSidebarOpen(false);
        }

        mql.addEventListener('change', handleResize);
        return () => mql.removeEventListener('change', handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#030014] flex items-center justify-center text-gray-900 dark:text-white transition-colors duration-300">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen flex text-gray-900 dark:text-white transition-colors duration-300 overflow-hidden relative font-sans">
            <Sidebar
                isOpen={sidebarOpen}
                isMobile={isMobile}
                toggleSidebar={toggleSidebar}
                setSidebarOpen={setSidebarOpen}
            />

            <main
                className={`flex-1 flex flex-col transition-all duration-300 bg-gray-50 dark:bg-[#030014] h-screen overflow-hidden ${!isMobile ? (sidebarOpen ? 'ml-64' : 'ml-20') : 'ml-0'
                    }`}
            >
                <TopNavbar
                    setSidebarOpen={setSidebarOpen}
                    session={session}
                    handleSignOut={signOut}
                />

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-7xl mx-auto h-full"
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
