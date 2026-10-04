import React from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Package, Zap, Shield, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 relative overflow-hidden font-sans">
      {/* --- STRUCTURAL GRID BACKGROUND --- */}
      <style>
        {`
          .bg-grid-pattern {
            background-size: 40px 40px;
            background-image: 
              linear-gradient(to right, rgb(226 232 240 / 0.8) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(226 232 240 / 0.8) 1px, transparent 1px);
            mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
          }
        `}
      </style>
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0"></div>

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 md:px-8 h-16">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-md flex items-center justify-center font-bold shadow-sm">
              F
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-950">
              FlowBox
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a
              href="#features"
              className="hover:text-slate-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hover:text-slate-900 transition-colors"
            >
              Pricing
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Documentation
            </a>
          </div>
          <button
            onClick={() => navigate("/")}
            className="inline-flex h-9 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-slate-50 shadow transition-colors hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer relative z-10"
          >
            Enter Dashboard
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-24 px-4 flex flex-col items-center justify-center text-center max-w-5xl mx-auto relative z-10">
        <div className="mb-8 inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
          FlowBox API v2.0 is now generally available
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-950">
          Inventory management, <br className="hidden md:block" />
          engineered for scale.
        </h1>

        <p className="text-lg text-slate-500 max-w-2xl mb-10 font-medium">
          The headless inventory engine built for modern retail. Sync warehouses
          in real-time, route orders automatically, and never oversell again.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate("/")}
            className="inline-flex h-11 items-center justify-center rounded-md bg-indigo-600 px-8 text-base font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
          >
            Start Building Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
          <button className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-8 text-base font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            Read the Docs
          </button>
        </div>
      </section>

      {/* --- SOCIAL PROOF --- */}
      <section className="py-12 border-y border-slate-200 bg-white relative z-10">
        <p className="text-center text-sm font-medium text-slate-400 uppercase tracking-widest mb-8">
          Trusted by modern engineering teams
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 text-slate-300">
          <h2 className="text-2xl font-bold font-serif tracking-tight">
            Acme Corp
          </h2>
          <h2 className="text-2xl font-bold tracking-tighter">
            GLOBAL<span className="font-light">RETAIL</span>
          </h2>
          <h2 className="text-2xl font-black italic tracking-tight">
            Vercelons
          </h2>
          <h2 className="text-2xl font-medium tracking-widest">NEXUS</h2>
        </div>
      </section>

      {/* --- FEATURES BENTO GRID --- */}
      <section
        id="features"
        className="py-24 px-4 max-w-7xl mx-auto relative z-10"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950 mb-4">
            Everything you need to scale
          </h2>
          <p className="text-slate-500 text-lg">
            Powerful APIs and a precision-engineered dashboard to control it
            all.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="w-10 h-10 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center mb-6 shadow-sm">
              <Package className="h-5 w-5 text-slate-700" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-950 mb-2">
              Multi-Warehouse Sync
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Manage stock across dozens of physical locations. Route orders to
              the nearest warehouse automatically based on logic you control.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="w-10 h-10 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center mb-6 shadow-sm">
              <Zap className="h-5 w-5 text-slate-700" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-950 mb-2">
              Lightning Fast API
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Built on a Node.js and Express architecture that guarantees
              sub-50ms response times for critical inventory checks and
              deductions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="w-10 h-10 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center mb-6 shadow-sm">
              <Shield className="h-5 w-5 text-slate-700" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-950 mb-2">
              Strict Guardrails
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Never oversell again. Our transaction logic strictly validates
              stock counts at the database level before any order is approved.
            </p>
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section
        id="pricing"
        className="py-24 px-4 bg-slate-100/50 border-y border-slate-200 relative z-10"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-500 text-lg">
              Start for free, upgrade when you hit enterprise scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
            {/* Starter Tier */}
            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Hobby
              </h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold tracking-tight text-slate-950">
                  $0
                </span>
                <span className="text-sm font-medium text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-slate-400" /> Up to 500
                  orders/mo
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-slate-400" /> 2
                  Warehouse Locations
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-slate-400" /> Community
                  Support
                </li>
              </ul>
              <button
                onClick={() => navigate("/")}
                className="inline-flex w-full h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Tier (Accent) */}
            <div className="rounded-xl border-2 border-indigo-600 bg-white p-8 shadow-md relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                Pro
              </h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold tracking-tight text-slate-950">
                  $49
                </span>
                <span className="text-sm font-medium text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" /> Unlimited
                  orders
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" /> Unlimited
                  Locations
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" /> Priority
                  24/7 Support
                </li>
              </ul>
              <button
                onClick={() => navigate("/")}
                className="inline-flex w-full h-10 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-24 px-4 text-center max-w-3xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-950 mb-4">
          Ready to take control?
        </h2>
        <p className="text-slate-500 mb-8 text-lg">
          Join thousands of modern developers building the future of commerce on
          FlowBox.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex h-11 items-center justify-center rounded-md bg-slate-900 px-8 text-base font-medium text-white shadow transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
        >
          Open Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-slate-500 text-sm bg-white relative z-10">
        <p>© 2026 FlowBox Technologies Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
