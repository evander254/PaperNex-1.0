import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Users,
    Mail,
    Wallet,
    Shield,
    ShieldAlert,
    Loader2,
    Search,
    UserPlus,
    MoreVertical,
    CheckCircle2,
    XCircle,
    ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    const fetchData = async () => {
        try {
            setLoading(true);

            // 1. Fetch all profiles
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (profileError) throw profileError;

            // 2. Fetch all balances
            const { data: wallets, error: walletError } = await supabase
                .from('balances')
                .select('user_id, balance');

            if (walletError && walletError.code !== 'PGRST116') {
                console.error("Error fetching balances:", walletError);
            }

            // 3. Combine data
            const enrichedUsers = profiles.map(p => ({
                ...p,
                wallet: wallets?.find(w => w.user_id === p.id) || { balance: 0 }
            }));

            setUsers(enrichedUsers);
        } catch (err) {
            console.error("Error fetching admin users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleRole = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    role: newRole,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;

            // Local update for snappiness
            setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
        } catch (err) {
            alert('Error updating role: ' + err.message);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = filterRole === 'all' || user.role === filterRole;

        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-96 space-y-4">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
                    <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-400 w-5 h-5" />
                </div>
                <p className="text-gray-400 text-sm animate-pulse">Loading platform users...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <Users className="text-brand-400" />
                        User Management
                    </h1>
                    <p className="text-gray-400 mt-2 text-base max-w-xl leading-relaxed">
                        Complete overview of all registered users, their roles, and current wallet balances.
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4 min-w-[160px]">
                        <div className="p-2.5 bg-brand-500/10 rounded-xl">
                            <Users className="w-5 h-5 text-brand-400" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Users</p>
                            <p className="text-xl font-bold text-white">{users.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-[#0a0720]/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all outline-none"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all outline-none appearance-none cursor-pointer pr-10 relative"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '1rem'
                        }}
                    >
                        <option value="all">All Roles</option>
                        <option value="user">Regular Users</option>
                        <option value="admin">Administrators</option>
                    </select>

                    <button
                        onClick={fetchData}
                        className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        title="Refresh data"
                    >
                        <ArrowUpDown size={18} />
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#0a0720] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto overflow-y-visible">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">User Details</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Role Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wallet Balance</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registration</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="group hover:bg-white/[0.03] transition-all"
                                    >
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} className="w-11 h-11 rounded-2xl object-cover border-2 border-white/5 shadow-lg group-hover:border-brand-500/50 transition-colors" alt="avatar" />
                                                    ) : (
                                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500/20 to-blue-500/20 text-brand-400 flex items-center justify-center font-bold text-base border-2 border-white/5 group-hover:border-brand-500/50 transition-colors">
                                                            {user.first_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0a0720] bg-green-500"></div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm text-white group-hover:text-brand-300 transition-colors">
                                                        {user.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Pending Setup'}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                                                        <Mail size={12} className="shrink-0" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${user.role === 'admin'
                                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_-5px_rgba(168,85,247,0.4)]'
                                                : 'bg-brand-500/10 text-brand-400 border-brand-500/20'
                                                }`}>
                                                {user.role === 'admin' ? <ShieldAlert size={12} className="shrink-0" /> : <Users size={12} className="shrink-0" />}
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                                    <Wallet size={16} className="text-green-400" />
                                                </div>
                                                <div>
                                                    <p className="font-mono text-sm font-black text-white">
                                                        Ksh. {(user.wallet?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </p>
                                                    <p className="text-[9px] text-gray-500 uppercase tracking-tighter">Available Credits</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-gray-300">
                                                    {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="text-[10px] text-gray-500 font-medium">Joined Platform</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => toggleRole(user.id, user.role)}
                                                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider bg-white/5 hover:bg-brand-500/20 text-gray-400 hover:text-brand-300 border border-white/10 hover:border-brand-500/30 py-2.5 px-4 rounded-xl transition-all active:scale-95 group/btn"
                                                >
                                                    {user.role === 'admin' ? <Users size={14} className="group-hover/btn:rotate-12 transition-transform" /> : <Shield size={14} className="group-hover/btn:scale-110 transition-transform" />}
                                                    {user.role === 'admin' ? 'Demote' : 'Promote'}
                                                </button>

                                                <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-500 hover:text-white transition-all">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center opacity-40">
                                                <Search size={48} className="mb-4 text-gray-500" />
                                                <h3 className="text-xl font-bold text-gray-400">No users found</h3>
                                                <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
                                                    {searchTerm ? `We couldn't find any results matching "${searchTerm}"` : "The platform currently has no registered users."}
                                                </p>
                                                {searchTerm && (
                                                    <button
                                                        onClick={() => { setSearchTerm(''); setFilterRole('all'); }}
                                                        className="mt-6 text-brand-400 hover:text-brand-300 text-sm font-bold uppercase tracking-widest border-b border-brand-500/30 pb-1 flex items-center gap-2"
                                                    >
                                                        Clear all filters
                                                        <XCircle size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Footer Info */}
                <div className="px-6 py-4 bg-white/[0.02] border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="text-green-500/50" size={12} /> Sync Active</span>
                        <span className="flex items-center gap-1.5"><ArrowUpDown className="text-brand-500/50" size={12} /> Live Sorting</span>
                    </div>
                    <div>
                        Showing {filteredUsers.length} of {users.length} Platform Entities
                    </div>
                </div>
            </div>
        </div>
    );
}

