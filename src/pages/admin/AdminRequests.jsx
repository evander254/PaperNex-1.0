import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Loader2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const statusConfig = {
    pending: { label: 'Pending', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    'in_progress': { label: 'In Progress', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    completed: { label: 'Completed', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
};

export default function AdminRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('requests')
                .select('*, profiles(email), services(title)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setRequests(data);
        } catch (err) {
            console.error("Error fetching admin requests:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllRequests();

        const sub = supabase
            .channel('admin_requests')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, () => fetchAllRequests())
            .subscribe();

        return () => supabase.removeChannel(sub);
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('requests')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            alert('Error updating status: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Manage Requests</h1>
                <p className="text-gray-400 text-sm">View and update status for all user requests.</p>
            </div>

            <div className="bg-[#0a0720] border border-white/10 rounded-2xl overflow-hidden overflow-x-auto text-white">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Service</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Details</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {requests.length > 0 ? requests.map((req, i) => {
                            const config = statusConfig[req.status] || statusConfig.pending;
                            return (
                                <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{req.profiles?.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-sm">{req.services?.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{req.details || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
                                            <config.icon size={14} />
                                            {config.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">{new Date(req.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                        <button
                                            onClick={() => updateStatus(req.id, 'in_progress')}
                                            className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-[10px] hover:bg-blue-500/20"
                                        >
                                            In Progress
                                        </button>
                                        <button
                                            onClick={() => updateStatus(req.id, 'completed')}
                                            className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md text-[10px] hover:bg-green-500/20"
                                        >
                                            Complete
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
