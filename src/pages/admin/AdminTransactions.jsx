import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Clock, Loader2, Search, CheckCircle, XCircle } from 'lucide-react';

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    const fetchTransactions = async () => {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*, profiles(email)')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching transactions with join:", error);
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('transactions')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (fallbackError) throw fallbackError;
                if (fallbackData) setTransactions(fallbackData);
            } else {
                if (data) setTransactions(data);
            }
        } catch (err) {
            console.error("Error fetching transactions:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleAction = async (tx, status) => {
        if (actionLoading) return;
        setActionLoading(tx.id);

        try {
            // 0. Double-check status from DB
            const { data: freshTx, error: fetchError } = await supabase
                .from('transactions')
                .select('status')
                .eq('id', tx.id)
                .single();

            if (fetchError) throw fetchError;
            if (freshTx.status !== 'pending') {
                alert('This transaction has already been processed.');
                await fetchTransactions();
                return;
            }

            // 1. Fetch current balance *before* status move
            const { data: initialBalanceData } = await supabase
                .from('balances')
                .select('balance')
                .eq('user_id', tx.user_id)
                .maybeSingle();

            const initialBalance = initialBalanceData?.balance || 0;

            // 2. Update status
            const { error: txError } = await supabase
                .from('transactions')
                .update({ status })
                .eq('id', tx.id);

            if (txError) throw txError;

            // 3. Update balance if approved deposit
            if (status === 'approved' && tx.type === 'deposit') {
                // Wait for potential DB trigger
                await new Promise(r => setTimeout(r, 500));

                const { data: checkBalanceData } = await supabase
                    .from('balances')
                    .select('balance')
                    .eq('user_id', tx.user_id)
                    .maybeSingle();

                const currentBalanceAfterStatusChange = checkBalanceData?.balance || 0;

                // TRIGGER DETECTION
                if (currentBalanceAfterStatusChange >= initialBalance + Number(tx.amount)) {
                    console.log("Balance auto-updated by DB trigger.");
                } else {
                    const newBalance = initialBalance + Number(tx.amount);
                    if (checkBalanceData) {
                        await supabase
                            .from('balances')
                            .update({
                                balance: newBalance,
                                updated_at: new Date().toISOString()
                            })
                            .eq('user_id', tx.user_id);
                    } else {
                        await supabase
                            .from('balances')
                            .insert({
                                user_id: tx.user_id,
                                balance: newBalance,
                                updated_at: new Date().toISOString()
                            });
                    }
                }
                alert(`Transaction approved. Ksh. ${tx.amount} added to user balance.`);
            }

            await fetchTransactions();
        } catch (err) {
            console.error(`Error updating transaction:`, err);
            alert(`Failed: ${err.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredTransactions = transactions.filter(tx => {
        const emailMatch = tx.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const idMatch = String(tx.id || '').toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = String(tx.status || '').toLowerCase().includes(searchTerm.toLowerCase());
        const phoneMatch = String(tx.phonenumber || '').includes(searchTerm);

        return emailMatch || idMatch || statusMatch || phoneMatch;
    });

    const pendingCount = transactions.filter(tx => tx.status === 'pending').length;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                        Transaction Monitor
                        {pendingCount > 0 && (
                            <span className="bg-amber-500 text-[10px] text-[#0a0720] px-2 py-0.5 rounded-full font-black animate-pulse uppercase tracking-wider">
                                {pendingCount} Pending
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-400 text-sm">View and manage all transactions across the entire platform.</p>
                </div>
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by email, ID, or phone..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    />
                </div>
            </div>

            <div className="bg-[#0a0720] border border-white/10 rounded-2xl overflow-hidden overflow-x-auto text-white shadow-xl shadow-brand-500/5">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Source (Phone)</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredTransactions.length > 0 ? filteredTransactions.map((tx) => (
                            <tr key={tx.id} className={`hover:bg-white/[0.02] transition-colors ${tx.status === 'pending' ? 'bg-amber-500/[0.03]' : ''}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">{tx.profiles?.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-full ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {tx.type === 'deposit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                                        </div>
                                        <span className="capitalize text-xs font-medium">{tx.type}</span>
                                    </div>
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap font-bold text-sm ${tx.type === 'deposit' ? 'text-green-400' : 'text-white'}`}>
                                    Ksh. {tx.amount?.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-xs font-mono text-gray-400">{tx.phonenumber || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${tx.status === 'approved' || tx.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                        tx.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                            'bg-red-500/10 text-red-500'
                                        }`}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} />
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    {tx.status === 'pending' && (
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                disabled={actionLoading === tx.id}
                                                onClick={() => handleAction(tx, 'approved')}
                                                className="p-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors title='Approve'"
                                            >
                                                {actionLoading === tx.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                            </button>
                                            <button
                                                disabled={actionLoading === tx.id}
                                                onClick={() => handleAction(tx, 'rejected')}
                                                className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors title='Reject'"
                                            >
                                                {actionLoading === tx.id ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No transactions found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
