import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTA({ onOpenAuth }) {
    return (
        <section className="relative py-24 bg-[#0a0624] overflow-hidden z-10">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-brand-600/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center glass-panel p-12 md:p-16 rounded-3xl border-t border-white/20">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight"
                >
                    Take Your Academic Performance to the <span className="text-gradient">Next Level</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10"
                >
                    Join thousands of students who have already upgraded their study workflow. Start your journey with PaperNex today.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <button
                        onClick={onOpenAuth}
                        className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[#0a0624] font-bold text-lg hover:bg-gray-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:-translate-y-1"
                    >
                        Get Started Today
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>

            <div className="absolute bottom-0 w-full leading-none z-0 mt-20 rotate-180 opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
                    <path fill="#05031b" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,149.3C672,149,768,171,864,181.3C960,192,1056,192,1152,170.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>
        </section>
    );
}
