import { ArrowRight, CheckCircle2, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-[#F9F9F0] pt-16 pb-32 sm:pt-24 sm:pb-40">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-purple-200/50 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-green-200/50 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in-up">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Now in Public Beta</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl leading-[1.1]">
                    Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Subscriptions</span> with Confidence.
                </h1>

                <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
                    Stop losing money to forgotten trials and unused services. TreeCleaner brings clarity to your financial life.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mx-auto mb-16">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full px-5 py-3.5 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-black/5 bg-white shadow-sm"
                    />
                    <Link to="/sign-in" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-black text-white font-semibold hover:bg-slate-800 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 whitespace-nowrap">
                        Start Free <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Floating Cards Visual */}
                <div className="relative w-full max-w-5xl mx-auto h-[300px] md:h-[400px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-grid-slate-50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>

                    {/* Decorative mock UI elements */}
                    <div className="relative z-10 flex flex-col gap-4 animate-float-slow">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-lg border border-slate-100 w-[280px]">
                            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600"><Zap size={20} /></div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase">Alert</p>
                                <p className="text-sm font-bold text-slate-900">Netflix Trial Ending</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-lg border border-slate-100 w-[320px] translate-x-12">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><CheckCircle2 size={20} /></div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase">Savings</p>
                                <p className="text-sm font-bold text-slate-900">$45.00 Saved this month</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-lg border border-slate-100 w-[260px] -translate-x-8">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Shield size={20} /></div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase">Security</p>
                                <p className="text-sm font-bold text-slate-900">Bank-Grade Encryption</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
