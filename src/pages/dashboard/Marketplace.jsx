import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceCard from '../../components/dashboard/ServiceCard';

const servicesData = [
    { id: 1, title: 'Turnitin AI Report', description: 'Get a comprehensive AI similarity report from Turnitin.', price: 100.00, iconKey: 'Turnitin', category: 'Analysis' },
    { id: 2, title: 'Plagiarism Report', description: 'Check your document for unintentional plagiarism.', price: 50, iconKey: 'Plagiarism', category: 'Analysis' },
    { id: 3, title: 'Course Hero Unlock', description: 'Unlock a specific document or solution from Course Hero.', price: 40.00, iconKey: 'CourseHero', category: 'Unlocks' },
    { id: 4, title: 'Chegg Unlock', description: 'Get step-by-step solutions unlocked from Chegg.', price: 20.00, iconKey: 'Chegg', category: 'Unlocks' },
    { id: 5, title: 'Scribd Access', description: 'Full access to a specific Scribd book or document.', price: 25.00, iconKey: 'Scribd', category: 'Unlocks' },
    { id: 6, title: 'Studypool Q&A', description: 'Unlock answers from Studypool experts.', price: 30.00, iconKey: 'Studypool', category: 'Unlocks' },
    { id: 7, title: 'AI Content Refinement', description: 'Humanize AI generated text to bypass detectors and improve flow.', price: 50.00, iconKey: 'AI', category: 'Refinement' },
    { id: 8, title: 'Proxy Services', description: 'Secure and anonymous proxy for research.', price: 600.00, iconKey: 'Proxy', category: 'Other' },
];

const categories = ['All', 'Analysis', 'Unlocks', 'Refinement', 'Other'];

export default function Marketplace() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedService, setSelectedService] = useState(null);

    const filteredServices = servicesData.filter(service => {
        const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
        const matchesSearch = service.title.toLowerCase().includes(search.toLowerCase()) ||
            service.description.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Service Marketplace</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Browse and order our premium academic and professional services.</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white dark:bg-[#0a0720] border border-gray-200 dark:border-white/10 p-4 rounded-2xl shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-gray-900 dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar fade-edge-right">
                    <Filter size={16} className="text-gray-400 shrink-0 ml-1" />
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                ? 'bg-brand-600 dark:bg-brand-500 text-white shadow-md shadow-brand-500/20'
                                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            >
                <AnimatePresence>
                    {filteredServices.map((service, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            key={service.id}
                        >
                            <ServiceCard service={service} onSelect={setSelectedService} />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredServices.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <Search size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium">No services found.</p>
                        <p className="text-sm">Try adjusting your search or category filter.</p>
                    </div>
                )}
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {selectedService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedService(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="relative w-full max-w-lg bg-white dark:bg-[#0a0720] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 mb-2">
                                            {selectedService.category}
                                        </span>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Request {selectedService.title}</h2>
                                    </div>
                                    <button
                                        onClick={() => setSelectedService(null)}
                                        className="p-1 rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{selectedService.description}</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload File or Link</label>
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 dark:border-white/10 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-black/20 dark:hover:bg-white/5 transition-colors">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold text-brand-600 dark:text-brand-400">Click to upload</span> or drag and drop</p>
                                                </div>
                                                <input type="file" className="hidden" />
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Instructions</label>
                                        <textarea
                                            className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-gray-900 dark:text-white placeholder-gray-400 resize-none h-24"
                                            placeholder="E.g., Which specific questions to uncover?"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-black/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 dark:border-white/10">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Total</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">Ksh{selectedService.price.toFixed(2)}</p>
                                </div>
                                <div className="flex w-full sm:w-auto gap-3">
                                    <button
                                        onClick={() => setSelectedService(null)}
                                        className="flex-1 sm:flex-none px-4 py-2 bg-transparent text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button className="flex-1 sm:flex-none px-6 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-500 shadow-lg shadow-brand-500/20 transition-all text-sm">
                                        Submit Request
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
