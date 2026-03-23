import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, Mail, Camera, Save, Key, UserCheck, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
    const { session } = useOutletContext();
    const [loading, setLoading] = useState(false);
    const email = session?.user?.email || 'user@example.com';
    const initial = email.charAt(0).toUpperCase();

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate save
        setTimeout(() => setLoading(false), 1000);
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2"
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account information and preferences.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col: Avatar and basic info */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1 space-y-6"
                >
                    <div className="bg-white dark:bg-[#0a0720] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col items-center">
                        <div className="relative mb-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 text-white flex items-center justify-center font-bold text-3xl shadow-xl shadow-brand-500/20">
                                {initial}
                            </div>
                            <button
                                className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                title="Change Avatar"
                            >
                                <Camera size={16} />
                            </button>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate w-full text-center">{email}</h2>
                        <p className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">Pro Plan Member</p>

                        <div className="w-full mt-6 space-y-3 border-t border-gray-100 dark:border-white/5 pt-6">
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <UserCheck size={18} className="text-gray-400 dark:text-gray-500" />
                                <span>Account Verified</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <Shield size={18} className="text-gray-400 dark:text-gray-500" />
                                <span>Two-Factor Auth Enabled</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Col: Forms */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* General Info */}
                    <div className="bg-white dark:bg-[#0a0720] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Information</h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                                        <div className="relative flex items-center">
                                            <User size={18} className="absolute left-3 text-gray-400" />
                                            <input
                                                type="text"
                                                defaultValue=""
                                                placeholder="John"
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                                        <div className="relative flex items-center">
                                            <User size={18} className="absolute left-3 text-gray-400" />
                                            <input
                                                type="text"
                                                defaultValue=""
                                                placeholder="Doe"
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                    <div className="relative flex items-center">
                                        <Mail size={18} className="absolute left-3 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            readOnly
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 !mb-4">Use Supabase Auth to change your email address.</p>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-75 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-brand-500/20"
                                    >
                                        {loading ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
