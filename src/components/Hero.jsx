import { motion } from 'framer-motion';

export default function Hero({ onOpenAuth }) {
    return (
        <div id="home" className="relative min-h-[100vh] flex items-center pt-24 pb-12 overflow-hidden bg-[#030014]">
            {/* Background gradients and elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-brand-300 text-sm font-semibold mb-6 tracking-wide">
                        Introducing PaperNex 2.0
                    </span>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8">
                        Next-Gen Academic Tools.<br />
                        <span className="text-gradient">Smarter. Faster. Cleaner.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
                        Access premium study tools, enhance your work, and optimize your academic performance with AI-driven insights.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onOpenAuth}
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-brand-600 to-blue-600 text-white font-semibold text-lg hover:from-brand-500 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(109,40,217,0.4)] hover:shadow-[0_0_30px_rgba(109,40,217,0.6)] hover:-translate-y-1"
                        >
                            Start Now
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                            Learn More
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* SVG Wave Bottom */}
            <div className="absolute bottom-0 w-full leading-none z-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
                    <path fill="#05031b" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,149.3C672,149,768,171,864,181.3C960,192,1056,192,1152,170.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>
        </div>
    );
}
