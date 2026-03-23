import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function Wallet() {
    const { user } = useAuth();
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                // Fetch wallet
                const { data: walletData, error: walletError } = await supabase
                    .from('wallets')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (walletError && walletError.code !== 'PGRST116') throw walletError;
                if (walletData) setWallet(walletData);

                // Fetch transactions
                const { data: txData, error: txError } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (txError) throw txError;
                if (txData) setTransactions(txData);
            } catch (err) {
                console.error("Error fetching wallet data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Subscriptions
        const walletSub = supabase
            .channel('wallet_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets', filter: `user_id=eq.${user.id}` }, () => fetchData())
            .subscribe();

        const txSub = supabase
            .channel('tx_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` }, () => fetchData())
            .subscribe();

        return () => {
            supabase.removeChannel(walletSub);
            supabase.removeChannel(txSub);
        };
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Wallet</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your funds and view transaction history.</p>
                </div>
            </motion.div>

            {/* Balance Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="col-span-1 md:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-blue-600 shadow-xl shadow-brand-500/20 text-white p-6 sm:p-8 flex flex-col justify-between"
                >
                    {/* Decorative shapes */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-brand-400/20 rounded-full blur-xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-brand-100 mb-2">
                            <WalletIcon size={20} />
                            <span className="font-medium">Available Balance</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">
                            Ksh. {wallet?.balance?.toFixed(2) || '0.00'}
                        </h2>
                    </div>

                    <div className="relative z-10 flex gap-3">
                        <button className="flex items-center gap-2 bg-white text-brand-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-lg text-sm sm:text-base">
                            <Plus size={18} /> Add Funds
                        </button>
                    </div>
                </motion.div>

                {/* Quick Help */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="col-span-1 bg-white dark:bg-[#0a0720] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-center"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How it works</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                        Adding funds to your wallet allows you to checkout faster without entering payment details for every request.
                    </p>
                    <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-500" /> Instant deposits</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-500" /> Secure payments</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-500" /> Refundable balance</li>
                    </ul>
                </motion.div>
            </div>

            {/* Transaction History */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-[#0a0720] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden"
            >
                <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction History</h3>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {transactions.length > 0 ? transactions.map((txn, i) => (
                        <div key={txn.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${txn.type === 'deposit' ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                                    }`}>
                                    {txn.type === 'deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white capitalize">{txn.type === 'deposit' ? 'Deposit Funds' : (txn.description || 'Payment')}</h4>
                                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        <span className="font-mono">{txn.id.substring(0, 8)}...</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(txn.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold text-base sm:text-lg ${txn.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                    {txn.type === 'deposit' ? '+' : '-'}Ksh. {txn.amount.toFixed(2)}
                                </p>
                                <span className={`text-[10px] sm:text-xs font-semibold capitalize ${txn.status === 'completed' ? 'text-green-600 dark:text-green-500' : 'text-amber-500 dark:text-amber-400'
                                    }`}>
                                    {txn.status}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <div className="p-12 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <Clock size={48} className="mb-4 opacity-30" />
                            <h3 className="text-lg font-medium">No transactions yet</h3>
                            <p className="text-sm text-center">Your transaction history will appear here once you add funds or make a purchase.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
