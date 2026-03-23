import { motion } from 'framer-motion';
import { Zap, Lock, ShieldCheck, Clock } from 'lucide-react';

const features = [
    {
        icon: <Zap className="w-8 h-8 text-yellow-400" />,
        title: 'Fast Delivery',
        description: 'Get your tailored academic resources and reports ahead of schedule.',
    },
    {
        icon: <Lock className="w-8 h-8 text-green-400" />,
        title: 'Secure & Private',
        description: 'We respect your confidentiality with end-to-end data encryption.',
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-blue-400" />,
        title: 'High Accuracy',
        description: 'Expert-verified solutions to ensure top-notch quality.',
    },
    {
        icon: <Clock className="w-8 h-8 text-pink-400" />,
        title: '24/7 Support',
        description: 'Around-the-clock assistance available whenever you need it.',
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-[#030014] relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight"
                    >
                        Core Features
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                    >
                        Everything you need for an optimized academic workflow.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer"
                        >
                            <div className="mb-4">
                                <div className="w-16 h-16 rounded-full bg-[#0a0628] flex items-center justify-center group-hover:bg-[#120a3a] transition-colors border border-white/5 shadow-inner">
                                    {feature.icon}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
