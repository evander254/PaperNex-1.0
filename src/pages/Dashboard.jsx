import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, FileText, Send, User } from 'lucide-react';

export default function Dashboard() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate('/');
            } else {
                setSession(session);
            }
            setLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (!session) {
                    navigate('/');
                } else {
                    setSession(session);
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030014] flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-[#030014] text-white">
            {/* Dashboard Nav */}
            <nav className="bg-[#0a0720] border-b border-white/10 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-blue-600 flex items-center justify-center font-bold text-xl">
                        P
                    </div>
                    <span className="font-semibold text-xl tracking-wide">PaperNex <span className="text-gray-400 font-light hidden sm:inline">| Dashboard</span></span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 hidden md:block">{session.user.email}</span>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to PaperNex</h1>
                    <p className="text-gray-400">Manage your requests and account from here.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Submit Request */}
                    <div className="bg-[#0a0720] border border-white/10 rounded-2xl p-6 shadow-lg hover:border-brand-500/50 transition-all group flex flex-col justify-between h-[200px]">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-4">
                                <Send size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-1 group-hover:text-brand-300 transition-colors">Submit Request</h3>
                            <p className="text-gray-400 text-sm">Start a new academic request.</p>
                        </div>
                        <button className="w-full mt-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-lg text-sm font-semibold transition-colors">
                            New Request
                        </button>
                    </div>

                    {/* View Requests */}
                    <div className="bg-[#0a0720] border border-white/10 rounded-2xl p-6 shadow-lg hover:border-blue-500/50 transition-all group flex flex-col justify-between h-[200px]">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-1 group-hover:text-blue-300 transition-colors">View Requests</h3>
                            <p className="text-gray-400 text-sm">Track your active and previous orders.</p>
                        </div>
                        <button className="w-full mt-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-sm font-semibold transition-colors">
                            Open History
                        </button>
                    </div>

                    {/* Account Info */}
                    <div className="bg-[#0a0720] border border-white/10 rounded-2xl p-6 shadow-lg hover:border-purple-500/50 transition-all group flex flex-col justify-between h-[200px]">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                                <User size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-1 group-hover:text-purple-300 transition-colors">Account</h3>
                            <p className="text-gray-400 text-sm overflow-hidden text-ellipsis whitespace-nowrap" title={session.user.email}>{session.user.email}</p>
                        </div>
                        <button className="w-full mt-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-sm font-semibold transition-colors">
                            Manage Account
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
