import { BarChart3, Bell, Lock } from 'lucide-react';

export default function Features() {
    const features = [
        {
            title: "Real-time Tracking",
            description: "Monitor all your recurring payments in one dashboard.",
            icon: <BarChart3 className="w-6 h-6 text-white" />,
            color: "bg-indigo-500",
            className: "md:col-span-2 md:row-span-2"
        },
        {
            title: "Smart Alerts",
            description: "Get notified before free trials convert to paid.",
            icon: <Bell className="w-6 h-6 text-white" />,
            color: "bg-rose-500",
            className: "md:col-span-1 md:row-span-1"
        },
        {
            title: "Bank Security",
            description: "256-bit encryption keeps your data safe.",
            icon: <Lock className="w-6 h-6 text-white" />,
            color: "bg-emerald-500",
            className: "md:col-span-1 md:row-span-1"
        },
    ];

    return (
        <section id="features" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
                        Everything you need to <br />control your spending.
                    </h2>
                    <p className="text-lg text-slate-600">
                        Powerful features designed to help you identify, track, and manage all your subscription services effortlessly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className={`group relative p-8 rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 ${feature.className}`}
                        >
                            <div className={`inline-flex items-center justify-center p-3 rounded-2xl ${feature.color} shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{feature.description}</p>

                            <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                {feature.icon} {/* Decorative Background Icon */}
                            </div>
                        </div>
                    ))}

                    {/* CTA Card */}
                    <div className="md:col-span-3 rounded-[2rem] bg-black p-8 md:p-12 flex flex-col md:flex-row items-center justify-between text-white overflow-hidden relative">
                        <div className="relative z-10 max-w-xl">
                            <h3 className="text-2xl font-bold mb-2">Ready to save money?</h3>
                            <p className="text-slate-400">Join 10,000+ users optimizing their subscriptions today.</p>
                        </div>
                        <div className="relative z-10 mt-6 md:mt-0">
                            <a href="/sign-in" className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-black transition-all duration-200 bg-white rounded-full hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                                Get Started Now
                            </a>
                        </div>

                        {/* Decorative gradients */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 translate-y-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}
