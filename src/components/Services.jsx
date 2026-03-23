import { motion } from 'framer-motion';
import { FileText, BookOpen, PenTool, Sparkles } from 'lucide-react';

const services = [
    {
        icon: <FileText className="w-8 h-8 text-brand-400" />,
        title: 'Report Assistance',
        description: 'Get expert help structuring, researching, and polishing your academic reports.',
    },
    {
        icon: <BookOpen className="w-8 h-8 text-blue-400" />,
        title: 'Study Resource Access',
        description: 'Unlock a comprehensive library of peer-reviewed materials and study guides.',
    },
    {
        icon: <PenTool className="w-8 h-8 text-purple-400" />,
        title: 'Homework Solutions',
        description: 'Find step-by-step solutions to complex problems across multiple disciplines.',
    },
    {
        icon: <Sparkles className="w-8 h-8 text-pink-400" />,
        title: 'AI Content Refinement',
        description: 'Enhance your writing with our proprietary AI that ensures clarity and proper tone.',
    },
];

export default function Services() {
    return (
        <section id="services" className="py-24 bg-[#05031b] relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight"
                    >
                        Premium Services
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                    >
                        Everything you need to excel academically, delivered in one seamless platform.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="glass-panel p-8 rounded-2xl flex flex-col items-start text-left hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-300 group"
                        >
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">{service.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
