import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Store, Wallet, Clock, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function DashboardHome() {
    const { user, profile } = useAuth();
    const [stats, setStats] = useState([
        { title: 'Active Requests', value: '0', icon: Clock, color: 'text-brand-500', bg: 'bg-brand-500/10' },
        { title: 'Completed Orders', value: '0', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
        { title: 'Wallet Balance', value: 'Ksh. 0.00', icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    ]);
    const [recentRequests, setRecentRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                // Fetch stats
                const [activeReq, completedReq, walletData] = await Promise.all([
                    supabase.from('requests').select('*', { count: 'exact', head: true }).eq('user_id', user.id).neq('status', 'completed'),
                    supabase.from('requests').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'completed'),
                    supabase.from('wallets').select('balance').eq('user_id', user.id).single()
                ]);

                setStats([
                    { title: 'Active Requests', value: activeReq.count?.toString() || '0', icon: Clock, color: 'text-brand-500', bg: 'bg-brand-500/10' },
                    { title: 'Completed Orders', value: completedReq.count?.toString() || '0', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
                    { title: 'Wallet Balance', value: `Ksh. ${walletData.data?.balance?.toFixed(2) || '0.00'}`, icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                ]);

                // Fetch recent requests
                const { data } = await supabase
                    .from('requests')
                    .select('*, services(title)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (data) setRecentRequests(data);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const email = user?.email || 'User';
    const displayName = profile?.first_name || email.split('@')[0];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 pb-10">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Welcome back, {displayName}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your account today.</p>
                </div>

                <Link
                    to="/dashboard/marketplace"
                    className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-brand-500/20 w-fit"
                >
                    <Send size={18} />
                    New Request
                </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
            >
                {stats.map((stat, index) => (
                    <div key={index} className="card-panel p-5 sm:p-6 flex items-center justify-between group">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 group-hover:text-brand-500 transition-colors">
                                {stat.value}
                            </h3>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link to="/dashboard/marketplace" className="card-panel p-6 sm:p-8 flex flex-col items-center justify-center text-center h-full group hover:shadow-xl dark:hover:shadow-brand-500/5 cursor-pointer">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform">
                            <Store size={32} />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Browse Marketplace</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 max-w-sm">Access Turnitin, Course Hero, and more academic services seamlessly.</p>
                        <div className="flex items-center gap-1 text-brand-600 dark:text-brand-400 font-medium text-sm group-hover:gap-2 transition-all">
                            Explore Services <ArrowRight size={16} />
                        </div>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link to="/dashboard/wallet" className="card-panel p-6 sm:p-8 flex flex-col items-center justify-center text-center h-full group hover:shadow-xl dark:hover:shadow-blue-500/5 cursor-pointer">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <Wallet size={32} />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Add Funds</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 max-w-sm">Top up your wallet to easily pay for premium requests and services.</p>
                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:gap-2 transition-all">
                            Manage Wallet <ArrowRight size={16} />
                        </div>
                    </Link>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card-panel p-6 mt-8"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                    <Link to="/dashboard/requests" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">View All</Link>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {recentRequests.length > 0 ? recentRequests.map((req, i) => (
                        <div key={req.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                            <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                                <Send size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{req.services?.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{req.details || 'No details provided'}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium ${req.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400' :
                                        req.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400' :
                                            'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400'
                                    }`}>
                                    {req.status?.replace('_', ' ')}
                                </span>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{new Date(req.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-6">
                            <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity found.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
