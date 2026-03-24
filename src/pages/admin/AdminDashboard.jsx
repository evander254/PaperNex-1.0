import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, ListOrdered, Settings, CreditCard, Loader2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        usersCount: 0,
        requestsCount: 0,
        servicesCount: 0,
        transactionsCount: 0
    });
    const [loading, setLoading] = useState(true);

    const [pendingTransactions, setPendingTransactions] = useState([]);

    const fetchPending = async () => {
        try {
            // First try with join
            const { data, error } = await supabase
                .from('transactions')
                .select('*, profiles(email)')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) {
                console.error("Error fetching transactions with join:", error);

                // Fallback: fetch without join if the join is failing
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('transactions')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (fallbackError) {
                    console.error("Error in fallback fetch:", fallbackError);
                    return;
                }
                setPendingTransactions(fallbackData || []);
            } else {
                setPendingTransactions(data || []);
            }
        } catch (err) {
            console.error("Error in fetchPending:", err);
        }
    };

    const [actionLoading, setActionLoading] = useState(null);

    const handleAction = async (tx, status) => {
        if (actionLoading) return;
        setActionLoading(tx.id);

        try {
            // 0. Double-check status from database
            const { data: freshTx, error: fetchError } = await supabase
                .from('transactions')
                .select('status')
                .eq('id', tx.id)
                .single();

            if (fetchError) throw fetchError;
            if (freshTx.status !== 'pending') {
                alert('This transaction has already been processed.');
                fetchPending();
                return;
            }

            // 1. Fetch current balance *before* any changes
            const { data: initialBalanceData } = await supabase
                .from('balances')
                .select('balance')
                .eq('user_id', tx.user_id)
                .maybeSingle();

            const initialBalance = initialBalanceData?.balance || 0;

            // 2. Update the transaction status
            const { error: txError } = await supabase
                .from('transactions')
                .update({ status })
                .eq('id', tx.id);

            if (txError) throw txError;

            // 3. If approved and it's a deposit, update the balance BUT check if it already changed (Trigger)
            if (status === 'approved' && tx.type === 'deposit') {
                // Wait a tiny bit for potential DB trigger
                await new Promise(r => setTimeout(r, 500));

                const { data: checkBalanceData } = await supabase
                    .from('balances')
                    .select('balance')
                    .eq('user_id', tx.user_id)
                    .maybeSingle();

                const currentBalanceAfterStatusChange = checkBalanceData?.balance || 0;

                // If balance already increased by the amount, a DB trigger is active
                if (currentBalanceAfterStatusChange >= initialBalance + Number(tx.amount)) {
                    console.log("Balance already updated via DB trigger.");
                } else {
                    // No trigger detected, update manually
                    const newBalance = initialBalance + Number(tx.amount);

                    if (checkBalanceData) {
                        await supabase
                            .from('balances')
                            .update({ balance: newBalance, updated_at: new Date().toISOString() })
                            .eq('user_id', tx.user_id);
                    } else {
                        await supabase
                            .from('balances')
                            .insert({ user_id: tx.user_id, balance: newBalance, updated_at: new Date().toISOString() });
                    }
                }
                alert(`Transaction approved. Ksh. ${tx.amount} added to user's balance.`);
            } else if (status === 'rejected') {
                alert('Transaction rejected.');
            }

            // Refresh data
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
            console.error("Error updating transaction:", err);
            alert("Failed to update transaction: " + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch stats and pending approvals in parallel
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

                // Await fetchPending to ensure data is loaded before hiding initial loader
                await fetchPending();
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

            {/* Recent Transactions */}
            <div className="bg-[#0a0720] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <CreditCard className="text-brand-400" size={18} />
                        Recent Transactions
                    </h3>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={fetchPending}
                            className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1"
                        >
                            <Clock size={12} />
                            Refresh
                        </button>
                        <Link to="/admin/transactions" className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors uppercase tracking-widest">
                            View All
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-black/20">
                            <tr>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Phone</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {pendingTransactions.length > 0 ? pendingTransactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-white/[0.02]">
                                    <td className="px-6 py-4 text-sm text-gray-300">{tx.profiles?.email}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-white">Ksh. {tx.amount}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-gray-400">{tx.phonenumber}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${tx.status === 'approved' || tx.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                            tx.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-red-500/10 text-red-500'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {tx.status === 'pending' ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    disabled={actionLoading === tx.id}
                                                    onClick={() => handleAction(tx, 'approved')}
                                                    className="p-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg transition-all disabled:opacity-50"
                                                    title="Approve"
                                                >
                                                    {actionLoading === tx.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                                </button>
                                                <button
                                                    disabled={actionLoading === tx.id}
                                                    onClick={() => handleAction(tx, 'rejected')}
                                                    className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-all disabled:opacity-50"
                                                    title="Reject"
                                                >
                                                    {actionLoading === tx.id ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-600 text-[10px] uppercase font-bold tracking-widest">Processed</span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 text-sm italic">
                                        No transactions to show.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
