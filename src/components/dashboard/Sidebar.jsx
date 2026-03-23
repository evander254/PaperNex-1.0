import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Store, FileText, Wallet, User, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Marketplace', path: '/dashboard/marketplace', icon: Store },
    { name: 'My Requests', path: '/dashboard/requests', icon: FileText },
    { name: 'Wallet', path: '/dashboard/wallet', icon: Wallet },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
];

export default function Sidebar({ isOpen, isMobile, toggleSidebar, setSidebarOpen }) {
    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                initial={{ x: isMobile ? '-100%' : 0, width: isOpen ? 256 : 80 }}
                animate={{
                    x: isMobile && !isOpen ? '-100%' : 0,
                    width: isMobile ? 256 : (isOpen ? 256 : 80)
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={clsx(
                    "fixed top-0 left-0 bottom-0 z-50 bg-white dark:bg-[#0a0720] border-r border-gray-200 dark:border-white/10 flex flex-col",
                    isOpen ? "w-64" : "w-20"
                )}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-white/10">
                    <div className={clsx("flex items-center gap-2 overflow-hidden", !isOpen && !isMobile && "justify-center w-full")}>
                        <div className="w-8 h-8 rounded-lg min-w-[32px] bg-gradient-to-tr from-brand-600 to-blue-600 flex items-center justify-center font-bold text-white text-xl">
                            P
                        </div>
                        {(isOpen || isMobile) && (
                            <span className="font-bold text-xl tracking-wide whitespace-nowrap text-gray-900 dark:text-white">PaperNex</span>
                        )}
                    </div>

                    {isMobile ? (
                        <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                            <X size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={toggleSidebar}
                            className="absolute -right-3 top-5 bg-white dark:bg-[#0a0720] border border-gray-200 dark:border-white/10 rounded-full p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white z-10 hidden sm:block shadow-sm"
                        >
                            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                        </button>
                    )}
                </div>

                {/* Links */}
                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            onClick={() => isMobile && setSidebarOpen(false)}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                                isActive
                                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 font-medium"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                            )}
                        >
                            <item.icon size={20} className={clsx("min-w-[20px]", !isOpen && !isMobile && "mx-auto")} />

                            {(isOpen || isMobile) && (
                                <span className="whitespace-nowrap">{item.name}</span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {!isOpen && !isMobile && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                    {item.name}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </motion.aside>
        </>
    );
}
