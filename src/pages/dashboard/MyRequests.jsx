import React, { useState } from 'react';
import { FileText, ChevronRight, Filter, Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const requestsData = [
    { id: 'REQ-1029', service: 'Turnitin AI Report', status: 'completed', date: '2026-03-21', price: 5.00 },
    { id: 'REQ-1030', service: 'Course Hero Unlock', status: 'in-progress', date: '2026-03-22', price: 2.00 },
    { id: 'REQ-1031', service: 'AI Content Refinement', status: 'pending', date: '2026-03-23', price: 10.00 },
];

const statusConfig = {
    pending: { label: 'Pending', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    'in-progress': { label: 'In Progress', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    completed: { label: 'Completed', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
};

export default function MyRequests() {
    const [filter, setFilter] = useState('all');

    const filteredRequests = requestsData.filter(req => filter === 'all' || req.status === filter);

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
                    {['all', 'pending', 'in-progress', 'completed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap capitalize transition-colors ${filter === status
                                    ? 'bg-brand-600 dark:bg-brand-500 text-white shadow-md shadow-brand-500/20'
                                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                                }`}
                        >
                            {status.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Requests List */}
            <div className="bg-white dark:bg-[#0a0720] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                {filteredRequests.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {filteredRequests.map((req, index) => {
                            const statusConf = statusConfig[req.status];
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
                                                {req.service}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                <span>{req.id}</span>
                                                <span>•</span>
                                                <span>{new Date(req.date).toLocaleDateString()}</span>
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
