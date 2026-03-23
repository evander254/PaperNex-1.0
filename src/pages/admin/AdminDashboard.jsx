import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, ListOrdered, Settings, CreditCard, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        usersCount: 0,
        requestsCount: 0,
        servicesCount: 0,
        transactionsCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, requestsRes, servicesRes, txRes] = await Promise.all([
                    supabase.from('profiles').select('id', { count: 'exact', head: true }),
                    supabase.from('requests').select('id', { count: 'exact', head: true }),
                    supabase.from('services').select('id', { count: 'exact', head: true }),
                    supabase.from('transactions').select('id', { count: 'exact', head: true })
                ]);

                setStats({
                    usersCount: usersRes.count || 0,
                    requestsCount: requestsRes.count || 0,
                    servicesCount: servicesRes.count || 0,
                    transactionsCount: txRes.count || 0,
                });
            } catch (err) {
                console.error("Error fetching admin stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
        );
    }

    const statCards = [
        { label: 'Total Users', value: stats.usersCount, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Total Requests', value: stats.requestsCount, icon: ListOrdered, color: 'text-brand-400', bg: 'bg-brand-500/10' },
        { label: 'Active Services', value: stats.servicesCount, icon: Settings, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Transactions', value: stats.transactionsCount, icon: CreditCard, color: 'text-green-400', bg: 'bg-green-500/10' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
                <p className="text-gray-400 text-sm">Overview of platform metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-[#0a0720] border border-white/10 rounded-2xl p-6 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
                        <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
