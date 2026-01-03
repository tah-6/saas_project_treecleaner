import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">TreeCleaner</span>
            </div>

            <div className="hidden md:flex items-center gap-8 mx-8">
                <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How it works</a>
                <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
            </div>

            <div className="flex items-center gap-6">
                <Link
                    to="/sign-in"
                    className="text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors"
                >
                    Log in
                </Link>
                <Link
                    to="/sign-in"
                    className="flex items-center gap-2 bg-black text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-slate-800 transition-all hover:scale-105"
                >
                    Get Started <ArrowRight size={16} />
                </Link>
            </div>
        </nav>
    );
}
