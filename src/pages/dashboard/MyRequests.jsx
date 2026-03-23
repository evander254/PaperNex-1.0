import React, { useState, useEffect } from 'react';
import { FileText, ChevronRight, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const statusConfig = {
    pending: { label: 'Pending', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    'in_progress': { label: 'In Progress', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    completed: { label: 'Completed', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
};

export default function MyRequests() {
    const { user } = useAuth();
    const [filter, setFilter] = useState('all');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchRequests = async () => {
            try {
                const { data, error } = await supabase
                    .from('requests')
                    .select('*, services(title, price)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) setRequests(data);
            } catch (err) {
                console.error("Error fetching requests:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();

        // Subscribe to changes
        const subscription = supabase
            .channel('requests_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'requests',
                filter: `user_id=eq.${user.id}`
            }, () => {
                fetchRequests();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [user]);

    const filteredRequests = requests.filter(req => filter === 'all' || req.status === filter);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Requests</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Track the status of your service requests.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white dark:bg-[#0a0720] border border-gray-200 dark:border-white/10 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar wrap">
                    {['all', 'pending', 'in_progress', 'completed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap capitalize transition-colors ${filter === status
                                ? 'bg-brand-600 dark:bg-brand-500 text-white shadow-md shadow-brand-500/20'
                                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Requests List */}
            <div className="bg-white dark:bg-[#0a0720] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden text-gray-900 dark:text-white">
                {filteredRequests.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {filteredRequests.map((req, index) => {
                            const statusConf = statusConfig[req.status] || statusConfig.pending;
                            const StatusIcon = statusConf.icon;

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={req.id}
                                    className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
                                >
                                    <div className="flex items-start sm:items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 flex items-center justify-center shrink-0">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                                {req.services?.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                <span className="font-mono text-[10px] sm:text-xs">ID: {req.id.substring(0, 8)}...</span>
                                                <span>•</span>
                                                <span>{new Date(req.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConf.bg} ${statusConf.color}`}>
                                            <StatusIcon size={14} />
                                            {statusConf.label}
                                        </span>

                                        <ChevronRight size={20} className="text-gray-300 dark:text-gray-600 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <FileText size={48} className="mb-4 opacity-30" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No requests found</h3>
                        <p className="text-sm">You haven't made any requests that match this filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
