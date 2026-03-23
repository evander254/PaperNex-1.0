import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Mail, Wallet, Shield, ShieldAlert, Loader2 } from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            // Join profile and wallet
            const { data, error } = await supabase
                .from('profiles')
                .select('*, wallets(balance)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setUsers(data);
        } catch (err) {
            console.error("Error fetching admin users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleRole = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!confirm(`Are you sure you want to make this user a ${newRole}?`)) return;
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', id);

            if (error) throw error;
            fetchUsers();
        } catch (err) {
            alert('Error updating role: ' + err.message);
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
                <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
                <p className="text-gray-400 text-sm">Monitor all platform users and their balances.</p>
            </div>

            <div className="bg-[#0a0720] border border-white/10 rounded-2xl overflow-hidden overflow-x-auto text-white">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Wallet Balance</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.length > 0 ? users.map((user) => (
                            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="avatar" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-sm">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{user.first_name ? `${user.first_name} ${user.last_name || ''}` : 'No Name'}</span>
                                            <span className="text-xs text-gray-500">{user.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                                        }`}>
                                        {user.role === 'admin' ? <Shield size={12} /> : <Users size={12} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Wallet size={16} className="text-green-400" />
                                        <span className="font-mono text-sm">Ksh. {user.wallets?.[0]?.balance?.toFixed(2) || '0.00'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button
                                        onClick={() => toggleRole(user.id, user.role)}
                                        className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 py-1.5 px-3 rounded-md transition-all uppercase tracking-tight"
                                    >
                                        Change Role
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No users found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
