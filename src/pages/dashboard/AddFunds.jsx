import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Phone, DollarSign, Clock, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function AddFunds() {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(profile?.phonenumber || '');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [countdown, setCountdown] = useState(120); // 2 minutes in seconds

    useEffect(() => {
        let timer;
        if (submitted && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [submitted, countdown]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !phoneNumber || loading) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('transactions')
                .insert({
                    user_id: user.id,
                    amount: parseFloat(amount),
                    type: 'deposit',
                    status: 'pending',
                    phonenumber: phoneNumber,
                    created_at: new Date().toISOString()
                });

            if (error) throw error;
            setSubmitted(true);
        } catch (err) {
            console.error("Error submitting deposit:", err);
            alert(`Failed to submit deposit: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-xl mx-auto py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-[#0a0720] border border-brand-500/20 rounded-3xl p-8 text-center shadow-2xl shadow-brand-500/10"
                >
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Request Submitted!</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                        Your funds will be added within 2 minutes after admin approval. Please wait for the confirmation notification.
                    </p>

                    <div className="bg-brand-50 dark:bg-brand-500/5 rounded-2xl p-6 mb-8 border border-brand-100 dark:border-brand-500/10">
                        <div className="flex items-center justify-center gap-3 text-brand-600 dark:text-brand-400 mb-2">
                            <Clock size={20} className="animate-pulse" />
                            <span className="font-semibold uppercase tracking-wider text-sm">Estimated Completion</span>
                        </div>
                        <div className="text-4xl font-mono font-bold text-brand-700 dark:text-brand-400">
                            {formatTime(countdown)}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/dashboard/wallet')}
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand-500/25"
                        >
                            Back to Wallet
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link to="/dashboard/wallet" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-500 transition-colors mb-6 group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Wallet</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#0a0720] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm"
            >
                <div className="bg-brand-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <Wallet className="shrink-0" />
                            Add Funds
                        </h1>
                        <p className="text-brand-100 opacity-90">Top up your balance instantly via M-Pesa or other mobile money services.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Amount (Ksh.)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="number"
                                required
                                min="1"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount to top up"
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none transition-all font-semibold text-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="tel"
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="07XX XXX XXX / 01XX XXX XXX"
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none transition-all font-semibold text-lg"
                            />
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 flex gap-4">
                        <Clock className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="text-sm font-bold text-amber-800 dark:text-amber-400">Notice</p>
                            <p className="text-xs text-amber-700 dark:text-amber-500/80 leading-relaxed mt-0.5">
                                After submission, an admin will verify the payment. This usually takes less than 2 minutes. You will receive a notification once your balance is updated.
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                        {loading ? 'Processing...' : 'Submit Deposit'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

const Plus = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);
