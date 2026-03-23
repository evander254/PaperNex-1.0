import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Settings, Plus, X, Search, Edit2, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        iconKey: ''
    });

    const fetchServices = async () => {
        try {
            const { data, error } = await supabase.from('services').select('*').order('title');
            if (error) throw error;
            if (data) setServices(data);
        } catch (err) {
            console.error("Error fetching services:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const openCreateModal = () => {
        setEditingService(null);
        setFormData({ title: '', description: '', price: '', category: '', iconKey: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (service) => {
        setEditingService(service);
        setFormData({
            title: service.title,
            description: service.description,
            price: service.price.toString(),
            category: service.category,
            iconKey: service.iconKey || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                iconKey: formData.iconKey
            };

            if (editingService) {
                const { error } = await supabase.from('services').update(payload).eq('id', editingService.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('services').insert([payload]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            fetchServices();
        } catch (err) {
            alert('Error saving service: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const deleteService = async (id) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            const { error } = await supabase.from('services').delete().eq('id', id);
            if (error) throw error;
            fetchServices();
        } catch (err) {
            alert('Error deleting service: ' + err.message);
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
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Manage Services</h1>
                    <p className="text-gray-400 text-sm">Add, edit, or remove services from the marketplace.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg"
                >
                    <Plus size={18} /> Add Service
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <div key={service.id} className="bg-[#0a0720] border border-white/10 rounded-2xl p-6 flex flex-col group hover:shadow-xl hover:shadow-brand-500/5 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-brand-500/10 text-brand-400">
                                {service.category}
                            </span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => openEditModal(service)} className="p-2 text-gray-400 hover:text-white transition-colors"><Edit2 size={16} /></button>
                                <button onClick={() => deleteService(service.id)} className="p-2 text-red-400/50 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">{service.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{service.description}</p>
                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                            <p className="text-xl font-bold text-white">Ksh. {service.price?.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-[#0a0720] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10"
                        >
                            <div className="p-6 sm:p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-2xl font-bold text-white">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-all"><X size={20} /></button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Service Title</label>
                                        <input
                                            required value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                                            placeholder="e.g., Extended Document Review"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Description</label>
                                        <textarea
                                            required value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 h-24"
                                            placeholder="Enter service details..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Price (Ksh.)</label>
                                            <input
                                                required type="number" step="0.01" value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Category</label>
                                            <input
                                                required value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                                                placeholder="e.g., Unlocks"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="w-full mt-4 bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand-500/20 disabled:opacity-50"
                                    >
                                        {submitting ? 'Progress...' : 'Save Service'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
