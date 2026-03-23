import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Send, Store, Wallet, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardHome() {
    const { session } = useOutletContext();
    const email = session?.user?.email || 'User';

    const stats = [
        { title: 'Active Requests', value: '3', icon: Clock, color: 'text-brand-500', bg: 'bg-brand-500/10' },
        { title: 'Completed Orders', value: '12', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
        { title: 'Wallet Balance', value: '$45.00', icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    ];

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
                        Welcome back, {email.split('@')[0]}
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
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 group-hover:text-brand-500 transition-colors">
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

            {/* Recent Activity minimal section */}
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

                <div className="space-y-4">
                    {[1, 2].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent dark:hover:border-white/5">
                            <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                                <Send size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Turnitin AI Report Request</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Document analysis in progress...</p>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400">
                                    Pending
                                </span>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
