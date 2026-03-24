import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, LogOut, Settings, User } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import NotificationPanel from './NotificationPanel';

export default function TopNavbar({ setSidebarOpen, session, handleSignOut }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const email = session?.user?.email || 'user@example.com';
    const userId = session?.user?.id;
    const initial = email.charAt(0).toUpperCase();

    const fetchUnreadCount = async () => {
        if (!userId) return;
        try {
            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('read', false);
            if (!error) setUnreadCount(count || 0);
        } catch (err) {
            console.error("Error fetching unread count:", err);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const sub = supabase
            .channel('unread_notifications')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, () => fetchUnreadCount())
            .subscribe();
        return () => supabase.removeChannel(sub);
    }, [userId]);

    return (
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0720]/80 backdrop-blur-md sticky top-0 z-30">

            {/* Left side */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 sm:hidden transition-colors"
                >
                    <Menu size={20} />
                </button>
                <img src="/logo.png" alt="PaperNex Logo" height={100} width={100} className="h-6 w-auto object-contain sm:hidden drop-shadow-sm dark:brightness-100" />

                {/* Search */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-black/30 border border-transparent dark:border-white/5 rounded-lg focus-within:ring-2 focus-within:ring-brand-500/50 transition-all">
                    <Search size={16} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none text-sm text-gray-900 dark:text-white focus:outline-none w-48 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-4 relative">
                <ThemeToggle />

                <div className="relative">
                    <button
                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                        className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors relative"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-brand-500 text-white text-[8px] font-bold rounded-full border-2 border-white dark:border-[#0a0720] flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                    <NotificationPanel
                        isOpen={notificationsOpen}
                        onClose={() => setNotificationsOpen(false)}
                    />
                </div>

                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors focus:ring-2 focus:ring-brand-500/50 outline-none"
                    >
                        <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                            {email}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                            {initial}
                        </div>
                    </button>

                    <AnimatePresence>
                        {dropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40 cursor-default"
                                    onClick={() => setDropdownOpen(false)}
                                />

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0a0720] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg dark:shadow-2xl z-50 overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5">
                                        <p className="text-sm text-gray-900 dark:text-white font-medium truncate">{email}</p>
                                        <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-0.5">Pro Plan</p>
                                    </div>

                                    <div className="py-1">
                                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition-colors">
                                            <User size={16} /> Profile
                                        </button>
                                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition-colors">
                                            <Settings size={16} /> Settings
                                        </button>

                                        <div className="h-px bg-gray-100 dark:bg-white/5 my-1 w-full"></div>

                                        <button
                                            onClick={handleSignOut}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 flex items-center gap-2 transition-colors font-medium"
                                        >
                                            <LogOut size={16} /> Sign out
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
