import React, { useState, useEffect } from 'react';
import { User, Mail, Camera, Save, UserCheck, Shield, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function Profile() {
    const { user, profile, fetchProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (profile) {
            setFirstName(profile.first_name || '');
            setLastName(profile.last_name || '');
            setAvatarUrl(profile.avatar_url);
        }
    }, [profile]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    first_name: firstName,
                    last_name: lastName
                })
                .eq('id', user.id);

            if (error) throw error;
            alert('Profile updated successfully!');
            if (fetchProfile) fetchProfile(user.id);
        } catch (err) {
            console.error("Error updating profile:", err);
            alert('Failed to update profile: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const uploadAvatar = async (e) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const { error: profileError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrlData.publicUrl })
                .eq('id', user.id);

            if (profileError) throw profileError;

            setAvatarUrl(publicUrlData.publicUrl);
            if (fetchProfile) fetchProfile(user.id);
            alert('Avatar uploaded successfully!');
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const email = user?.email || 'user@example.com';
    const initial = firstName ? firstName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase();

    return (
        <div className="space-y-6 sm:space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2"
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account information and preferences.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1 space-y-6"
                >
                    <div className="bg-white dark:bg-[#0a0720] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col items-center">
                        <div className="relative mb-6">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-xl shadow-brand-500/20" />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 text-white flex items-center justify-center font-bold text-3xl shadow-xl shadow-brand-500/20">
                                    {initial}
                                </div>
                            )}
                            <label className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                                <input type="file" className="hidden" accept="image/*" onChange={uploadAvatar} disabled={uploading} />
                            </label>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate w-full text-center">{firstName} {lastName}</h2>
                        <p className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400 capitalize">{profile?.role || 'User'}</p>

                        <div className="w-full mt-6 space-y-3 border-t border-gray-100 dark:border-white/5 pt-6">
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <Mail size={18} className="text-gray-400 dark:text-gray-500" />
                                <span className="truncate">{email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <UserCheck size={18} className="text-gray-400 dark:text-gray-500" />
                                <span>Account Verified</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="bg-white dark:bg-[#0a0720] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Information</h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                                        <div className="relative flex items-center">
                                            <User size={18} className="absolute left-3 text-gray-400" />
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                placeholder="John"
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                                        <div className="relative flex items-center">
                                            <User size={18} className="absolute left-3 text-gray-400" />
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder="Doe"
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                    <div className="relative flex items-center">
                                        <Mail size={18} className="absolute left-3 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            readOnly
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 !mb-4">Internal account identifier.</p>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-75 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-brand-500/20"
                                    >
                                        {loading ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
