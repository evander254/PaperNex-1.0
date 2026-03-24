import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Info, AlertCircle, ShoppingBag, CreditCard, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function NotificationPanel({ isOpen, onClose }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;
            if (data) setNotifications(data);
        } catch (err) {
            console.error("Error fetching notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Real-time subscription
        const sub = supabase
            .channel('notifications_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
                setNotifications(prev => [payload.new, ...prev]);
                // Play a subtle sound or trigger a toast if needed
            })
            .subscribe();

        return () => {
            supabase.removeChannel(sub);
        };
    }, [user]);

    const markAsRead = async (id) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', id);

            if (error) throw error;
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', user.id)
                .eq('read', false);

            if (error) throw error;
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error("Error marking all as read:", err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <Check size={16} className="text-green-500" />;
            case 'purchase': return <ShoppingBag size={16} className="text-brand-500" />;
            case 'deposit': return <CreditCard size={16} className="text-blue-500" />;
            case 'warning': return <AlertCircle size={16} className="text-amber-500" />;
            default: return <Info size={16} className="text-gray-400" />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/5" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0a0720] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Bell size={18} className="text-brand-500" />
                                Notifications
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <span className="bg-brand-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                        {notifications.filter(n => !n.read).length}
                                    </span>
                                )}
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={markAllAsRead}
                                    className="text-[10px] font-bold text-brand-600 dark:text-brand-400 hover:underline uppercase tracking-tight"
                                >
                                    Mark all as read
                                </button>
                                <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-400">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Clock size={24} className="animate-spin mx-auto mb-2 opacity-20" />
                                    <p className="text-xs">Loading notifications...</p>
                                </div>
                            ) : notifications.length > 0 ? (
                                <div className="divide-y divide-gray-100 dark:divide-white/5">
                                    {notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            className={`p-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer relative group ${!n.read ? 'bg-brand-500/[0.03]' : ''}`}
                                            onClick={() => !n.read && markAsRead(n.id)}
                                        >
                                            {!n.read && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-500" />}
                                            <div className="flex gap-3">
                                                <div className="mt-0.5 shrink-0">
                                                    {getIcon(n.type)}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`text-sm font-semibold mb-0.5 ${!n.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                        {n.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                                        {n.message}
                                                    </p>
                                                    <span className="text-[10px] text-gray-400 dark:text-gray-600 mt-2 block font-medium">
                                                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-gray-500">
                                    <Bell size={40} className="mx-auto mb-4 opacity-10" />
                                    <p className="text-sm font-medium">No notifications yet</p>
                                    <p className="text-xs mt-1">We'll notify you here when something happens.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-gray-100 dark:border-white/5 text-center">
                            <button className="text-xs font-semibold text-gray-500 hover:text-brand-500 transition-colors">
                                View all activity
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
