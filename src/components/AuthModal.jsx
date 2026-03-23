import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import OTPInput from './OTPInput';

export default function AuthModal({ isOpen, onClose }) {
    const [step, setStep] = useState('email'); // 'email', 'otp', 'success'
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            setStep('email');
            setEmail('');
            setOtp('');
            setError(null);
            setLoading(false);
        }
    }, [isOpen]);

    const handleSendCode = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email.');
            return;
        }
        setError(null);
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
            setStep('otp');
        } catch (err) {
            setError(err.message || 'Failed to send verification code.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (otp) => {
        if (otp.length < 6) {
            setError('Please enter a valid 6-digit code.');
            return;
        }
        setError(null);
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'email',
            });
            if (error) throw error;
            if (data.session) {
                setStep('success');
                setTimeout(() => {
                    onClose();
                    navigate('/dashboard');
                }, 1500);
            } else {
                setError('Verification failed, no session found.');
            }
        } catch (err) {
            setError(err.message || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError(null);
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
            setError('A new code has been sent!');
        } catch (err) {
            setError(err.message || 'Failed to resend code.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#030014]/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-md bg-[#0a0720] border border-white/10 rounded-2xl shadow-2xl overflow-hidden shadow-brand-500/20"
                >
                    {/* Top glow */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-600 to-blue-600" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {step === 'email' && (
                                <motion.div
                                    key="email"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl font-bold text-white mb-2">Login to PaperNex</h2>
                                        <p className="text-gray-400 text-sm">Enter your email to receive a secure login code.</p>
                                    </div>

                                    {error && (
                                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
                                            <AlertCircle size={16} />
                                            <p>{error}</p>
                                        </div>
                                    )}

                                    <form onSubmit={handleSendCode}>
                                        <div className="mb-4">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                                                    placeholder="you@example.com"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition-all shadow-[0_0_15px_rgba(109,40,217,0.3)] hover:shadow-[0_0_20px_rgba(109,40,217,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Send Code'}
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {step === 'otp' && (
                                <motion.div
                                    key="otp"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl font-bold text-white mb-2">Enter Verification Code</h2>
                                        <p className="text-gray-400 text-sm">We sent a 6-digit code to <br /><span className="text-brand-300 font-medium">{email}</span></p>
                                    </div>

                                    {error && (
                                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            <p>{error}</p>
                                        </div>
                                    )}

                                    <OTPInput length={6} onComplete={(code) => setOtp(code)} />

                                    <button
                                        onClick={() => handleVerifyOtp(otp)}
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition-all shadow-[0_0_15px_rgba(109,40,217,0.3)] hover:shadow-[0_0_20px_rgba(109,40,217,0.5)] mb-4 disabled:opacity-70"
                                    >
                                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Verify & Continue'}
                                    </button>

                                    <div className="text-center">
                                        <button
                                            onClick={handleResend}
                                            disabled={loading}
                                            className="text-sm text-gray-400 hover:text-white transition-colors"
                                        >
                                            Didn't receive a code? <span className="text-brand-400">Resend</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-6"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                        className="w-16 h-16 bg-brand-500/20 rounded-full flex items-center justify-center mb-6"
                                    >
                                        <CheckCircle2 className="w-10 h-10 text-brand-400" />
                                    </motion.div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Login Successful</h2>
                                    <p className="text-gray-400 text-sm">Redirecting to your dashboard...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
