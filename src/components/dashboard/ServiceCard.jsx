import React from 'react';
import { FileText, Cpu, BookOpen, GraduationCap, Unlock, Library, Edit3, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const categoryIconMap = {
    'Unlocks': Unlock,
    'Academic Writing': FileText,
    'Research': BookOpen,
    'Editing': Edit3,
    'Coding': Cpu,
    'Plagiarism Check': ShieldAlert,
    'Others': Library
};

export default function ServiceCard({ service, onSelect }) {
    const Icon = categoryIconMap[service.category] || FileText;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="card-panel group relative flex flex-col justify-between overflow-hidden cursor-pointer h-full"
            onClick={() => onSelect(service)}
        >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/0 via-brand-500/0 to-brand-500/0 group-hover:from-brand-500/5 group-hover:via-brand-500/10 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>

            <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 shadow-sm">
                        <Icon size={24} />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 pointer-events-none select-none">
                        {service.category}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {service.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {service.description}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-2 font-mono">
                    /{service.slug}
                </p>
            </div>

            <div className="p-6 pt-0 mt-auto relative z-10 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Starting at</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">Ksh. {service.price?.toFixed(2)}</p>
                </div>
                <button
                    className="bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white hover:bg-brand-600 hover:text-white dark:hover:bg-brand-500 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm group-hover:shadow-brand-500/25"
                    onClick={(e) => { e.stopPropagation(); onSelect(service); }}
                >
                    Select
                </button>
            </div>
        </motion.div>
    );
}
