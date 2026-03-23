import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const tiers = [
    {
        name: 'Unlocks',
        price: '0.50',
        period: '/Report',
        description: 'Perfect for casual assignments.',
        features: ['CourseHero', 'Chegge', 'studypool', 'Standard Delivery'],
        buttonText: 'Get Started',
        popular: false,
    },
    {
        name: 'Turnitin Reports',
        price: '1 Credit',
        period: '/Report',
        description: 'For dedicated students aiming high.',
        features: ['AI Report', 'Plagiarism Report', 'Priority 24/7 Support', 'Plagiarism Checker', 'Fast Delivery'],
        buttonText: 'Buy Now',
        popular: true,
    },
    {
        name: 'Humanier',
        price: '1.50',
        period: '/1000 words',
        description: 'Comprehensive academic AI removal.',
        features: ['AI Removal', 'Plagiarism Report', 'Priority 24/7 Support', 'Plagiarism Checker', 'Fast Delivery'],
        buttonText: 'Buy Now',
        popular: false,
    },
];

export default function Pricing({ onOpenAuth }) {
    return (
        <section id="pricing" className="py-24 bg-[#030014] relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight"
                    >
                        Simple, Transparent Pricing
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                    >
                        Choose the plan that best fits your academic needs and budget.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className={`p-8 rounded-2xl border transition-all duration-300 relative ${tier.popular
                                ? 'bg-gradient-to-b from-brand-900/40 to-black border-brand-500 shadow-[0_0_40px_rgba(139,92,246,0.2)] md:-mt-8 md:mb-8 z-10'
                                : 'bg-white/5 border-white/10 hover:border-white/20 glass-panel'
                                }`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-brand-400 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                            <p className="text-gray-400 text-sm mb-6 h-10">{tier.description}</p>

                            <div className="mb-8 flex items-baseline">
                                <span className="text-5xl font-extrabold text-white tracking-tight">{tier.price}</span>
                                {tier.period && <span className="text-gray-400 ml-1">{tier.period}</span>}
                            </div>

                            <ul className="space-y-4 mb-8">
                                {tier.features.map((feature, i) => (
                                    <li key={i} className="flex items-start text-gray-300">
                                        <CheckCircle2 className={`w-5 h-5 mr-3 shrink-0 ${tier.popular ? 'text-brand-400' : 'text-gray-500'}`} />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={onOpenAuth}
                                className={`w-full py-4 rounded-xl font-bold transition-all ${tier.popular
                                    ? 'bg-gradient-to-r from-brand-600 to-blue-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5'
                                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                {tier.buttonText}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
