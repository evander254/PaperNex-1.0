import { motion } from 'framer-motion';
import { Send, Settings, Truck, MessageSquare } from 'lucide-react';

const steps = [
    {
        icon: <Send className="w-8 h-8 text-indigo-400" />,
        title: 'Submit Request',
        description: 'Provide details about your academic needs and requirements.',
    },
    {
        icon: <Settings className="w-8 h-8 text-blue-400" />,
        title: 'Processing',
        description: 'Our system pairs you with the best tools and experts available.',
    },
    {
        icon: <Truck className="w-8 h-8 text-brand-400" />,
        title: 'Delivery',
        description: 'Receive your refined work and insights promptly.',
    },
    {
        icon: <MessageSquare className="w-8 h-8 text-purple-400" />,
        title: 'Review & Support',
        description: 'We ensure 100% satisfaction with 24/7 dedicated support.',
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-[#080614] relative z-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-900/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight"
                    >
                        How It Works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                    >
                        A simple, streamlined process to boost your academic performance.
                    </motion.p>
                </div>

                <div className="relative">
                    {/* Horizontal Line for Desktop */}
                    <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative flex flex-col items-center text-center group"
                            >
                                <div className="w-24 h-24 rounded-full bg-[#0d0a21] border border-white/10 flex items-center justify-center mb-6 z-10 shadow-[0_0_20px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] group-hover:border-brand-500/50 transition-all duration-300">
                                    <div className="relative">
                                        {step.icon}
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full animate-ping opacity-75" />
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-gray-400 text-sm max-w-[250px]">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
