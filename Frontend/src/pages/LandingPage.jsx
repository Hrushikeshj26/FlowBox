import React from "react";
import { useNavigate } from "react-router";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 selection:bg-blue-200 overflow-x-hidden relative">
      {/* --- INLINE STYLES FOR MOVING OBJECTS --- */}
      <style>
        {`
          @keyframes float {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(40px, -60px) scale(1.1); }
            66% { transform: translate(-30px, 30px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-float {
            animation: float 15s infinite ease-in-out;
          }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}
      </style>

      {/* --- MOVING BACKGROUND GRADIENT BLOBS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Blue Blob */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-blue-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-float"></div>
        {/* Purple Blob */}
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-float animation-delay-2000"></div>
        {/* Teal Blob */}
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-teal-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-float animation-delay-4000"></div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-gray-200/50 bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 md:px-8">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-lg flex items-center justify-center font-bold shadow-sm">
              F
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              FlowBox
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a
              href="#features"
              className="hover:text-gray-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hover:text-gray-900 transition-colors"
            >
              Pricing
            </a>
            <a href="#docs" className="hover:text-gray-900 transition-colors">
              Developers
            </a>
          </div>
          {/* Updated routing action here */}
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 rounded-full transition-colors shadow-sm relative z-10 cursor-pointer"
          >
            Enter Dashboard
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 px-4 flex flex-col items-center justify-center text-center max-w-5xl mx-auto relative z-10">
        <div className="mb-8 px-4 py-1.5 rounded-full border border-gray-200/60 bg-white/50 backdrop-blur-sm text-sm text-gray-600 flex items-center gap-2 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          FlowBox API v1.0 is now live
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-gray-900">
          Inventory management, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            without the chaos.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed font-medium">
          The headless inventory engine built for modern retail. Stop selling
          stock you don't have, sync warehouses in real-time, and scale your
          business with zero friction.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold text-lg transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            Start Building Free
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </button>
        </div>
      </section>

      {/* --- SOCIAL PROOF --- */}
      <section className="py-10 border-y border-gray-200/50 bg-white/40 backdrop-blur-sm relative z-10">
        <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-widest mb-8">
          Trusted by modern engineering teams
        </p>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale text-gray-800">
          <h2 className="text-2xl font-bold font-serif">Acme Corp</h2>
          <h2 className="text-2xl font-bold tracking-tighter">
            GLOBAL<span className="font-light">RETAIL</span>
          </h2>
          <h2 className="text-2xl font-black italic">Vercelons</h2>
          <h2 className="text-2xl font-medium tracking-widest">NEXUS</h2>
        </div>
      </section>

      {/* --- FEATURES BENTO GRID --- */}
      <section
        id="features"
        className="py-24 px-4 max-w-7xl mx-auto relative z-10"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
            Everything you need to scale
          </h2>
          <p className="text-gray-600 text-lg font-medium">
            Powerful APIs and a gorgeous dashboard to control it all.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 rounded-2xl hover:border-gray-300 hover:shadow-md transition-all group shadow-sm">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Multi-Warehouse Sync
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Manage stock across dozens of physical locations. Route orders to
              the nearest warehouse automatically.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 rounded-2xl hover:border-gray-300 hover:shadow-md transition-all group shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Lightning Fast API
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Built on a Node.js and Express architecture that guarantees
              sub-50ms response times for all inventory checks.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 rounded-2xl hover:border-gray-300 hover:shadow-md transition-all group shadow-sm">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Strict Guardrails
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Never oversell again. Our transaction logic strictly validates
              stock counts before any order is approved.
            </p>
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section
        id="pricing"
        className="py-24 px-4 bg-white/40 backdrop-blur-sm border-y border-gray-200/50 relative z-10"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-600 text-lg font-medium">
              Start for free, upgrade when you hit scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter Tier */}
            <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm">
              <h3 className="text-xl font-medium text-gray-600 mb-2">Hobby</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 text-gray-600">
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>{" "}
                  Up to 500 orders/mo
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>{" "}
                  2 Warehouse Locations
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>{" "}
                  Community Support
                </li>
              </ul>

              <button
                onClick={() => navigate("/")}
                className="w-full py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-900 transition-colors font-medium cursor-pointer"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Tier */}
            <div className="bg-white border-2 border-indigo-500 p-8 rounded-3xl relative shadow-xl shadow-indigo-200/50">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-medium text-indigo-600 mb-2">Pro</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold text-gray-900">$49</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 text-gray-600">
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>{" "}
                  Unlimited orders
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>{" "}
                  Unlimited Locations
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>{" "}
                  Priority 24/7 Support
                </li>
              </ul>

              <button
                onClick={() => navigate("/")}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-colors font-medium text-white shadow-md shadow-indigo-500/20 cursor-pointer"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-32 px-4 text-center max-w-3xl mx-auto relative z-10">
        <h2 className="text-4xl font-bold mb-6 text-gray-900">
          Ready to take control?
        </h2>
        <p className="text-gray-600 mb-10 text-lg font-medium">
          Join thousands of modern developers building the future of commerce on
          FlowBox.
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-gray-300 rounded-xl font-bold text-lg transition-all cursor-pointer"
        >
          Open Dashboard &rarr;
        </button>
      </section>

      <footer className="border-t border-gray-200/60 py-8 text-center text-gray-500 text-sm bg-white/80 backdrop-blur-sm relative z-10">
        <p>© 2026 FlowBox Technologies Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
