import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Box,
  BarChart3,
  Globe,
  Zap,
  ArrowRightLeft,
  Layers,
  Lock,
  CheckCircle2,
  Star,
  Sparkles,
  TrendingUp,
  Package,
  Warehouse,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8fafc] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* =========================================================
          GLOBAL BACKGROUND
      ========================================================== */}
      <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute -left-[20%] -top-[15%] h-[600px] w-[600px] rounded-full bg-indigo-400/20 blur-[140px]" />
        <div className="absolute right-[-15%] top-[10%] h-[600px] w-[600px] rounded-full bg-cyan-400/15 blur-[150px]" />
        <div className="absolute bottom-[-15%] left-[35%] h-[600px] w-[600px] rounded-full bg-purple-400/10 blur-[160px]" />
      </div>

      {/* =========================================================
          NAVIGATION
      ========================================================== */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105">
              <Box className="h-5 w-5 text-white" />
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-900">
              Flow<span className="text-indigo-600">Box</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
            <a
              href="#features"
              className="transition-colors hover:text-slate-900"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition-colors hover:text-slate-900"
            >
              How it works
            </a>

            <a
              href="#pricing"
              className="transition-colors hover:text-slate-900"
            >
              Pricing
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 sm:block"
            >
              Log in
            </Link>

            <Link to="/auth">
              <Button className="h-10 rounded-lg bg-slate-950 px-5 text-sm font-semibold shadow-lg shadow-slate-950/10 transition-all hover:bg-indigo-600 hover:shadow-indigo-500/20">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden pb-20 pt-36 sm:pb-28 sm:pt-44 lg:pb-36">
        {/* Hero grid */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.045) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
          }}
        />

        {/* Ambient hero gradients */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[550px] w-[850px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-cyan-400/15 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            {/* Announcement */}
            <Badge
              variant="secondary"
              className="mb-7 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur"
            >
              <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500">
                <Sparkles className="h-3 w-3 text-white" />
              </span>
              FlowBox 2.0 is now available
              <ChevronRight className="ml-1 h-4 w-4 text-indigo-400" />
            </Badge>

            {/* Heading */}
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl xl:text-[82px]">
              Your entire supply chain,
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                  beautifully connected.
                </span>

                <svg
                  className="absolute -bottom-3 left-0 h-3 w-full"
                  viewBox="0 0 500 12"
                  fill="none"
                >
                  <path
                    d="M3 8C100 2 170 11 250 6C330 1 400 8 497 3"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.35"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="500" y2="0">
                      <stop stopColor="#6366F1" />
                      <stop offset="0.5" stopColor="#8B5CF6" />
                      <stop offset="1" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
              FlowBox gives modern operations teams one intelligent workspace to
              manage inventory, warehouses, transfers, suppliers, and demand —
              all in real time.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="h-14 rounded-full bg-slate-950 px-8 text-base font-semibold shadow-2xl shadow-slate-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-indigo-500/25"
                >
                  Start for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <a href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-full border-slate-200 bg-white/80 px-8 text-base font-semibold shadow-sm backdrop-blur transition-all hover:border-slate-300 hover:bg-white"
                >
                  Explore platform
                </Button>
              </a>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              No credit card required
              <span className="mx-1">•</span>
              14-day Pro trial
            </div>
          </div>

          {/* =====================================================
              DASHBOARD PREVIEW
          ====================================================== */}
          <div className="relative mx-auto mt-20 max-w-6xl">
            {/* Glow */}
            <div className="absolute -inset-10 -z-10 rounded-[40px] bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-cyan-500/20 blur-3xl" />

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-[0_40px_100px_-30px_rgba(30,41,59,0.28)] backdrop-blur-xl">
              {/* Browser bar */}
              <div className="flex h-12 items-center justify-between border-b border-slate-200 bg-slate-50/90 px-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>

                <div className="hidden rounded-md border border-slate-200 bg-white px-8 py-1 text-[10px] text-slate-400 sm:block">
                  app.flowbox.io/dashboard
                </div>

                <div className="h-5 w-5" />
              </div>

              {/* Dashboard */}
              <div className="grid min-h-[440px] grid-cols-12 bg-slate-50">
                {/* Sidebar */}
                <div className="col-span-3 hidden border-r border-slate-200 bg-white p-4 sm:block">
                  <div className="mb-7 flex items-center gap-2 px-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
                      <Box className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-bold">FlowBox</span>
                  </div>

                  <div className="space-y-1">
                    {[
                      "Dashboard",
                      "Inventory",
                      "Warehouses",
                      "Transfers",
                      "Suppliers",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium ${
                          index === 0
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-500"
                        }`}
                      >
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${
                            index === 0 ? "bg-indigo-500" : "bg-slate-300"
                          }`}
                        />
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white">
                    <Sparkles className="mb-3 h-4 w-4" />
                    <p className="text-xs font-semibold">Inventory health</p>
                    <p className="mt-1 text-[10px] text-indigo-100">
                      Your stock levels are looking healthy.
                    </p>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
                      <div className="h-full w-[82%] rounded-full bg-white" />
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="col-span-12 p-5 sm:col-span-9 sm:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        Overview
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-slate-900">
                        Good morning, Alex
                      </h3>
                    </div>

                    <div className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-500 sm:block">
                      Last 30 days ▾
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                      {
                        label: "Total inventory",
                        value: "$482.6K",
                        change: "+12.4%",
                        icon: Package,
                        color: "indigo",
                      },
                      {
                        label: "Orders fulfilled",
                        value: "12,840",
                        change: "+8.2%",
                        icon: TrendingUp,
                        color: "emerald",
                      },
                      {
                        label: "Warehouses",
                        value: "08",
                        change: "+2",
                        icon: Warehouse,
                        color: "violet",
                      },
                      {
                        label: "Low stock",
                        value: "24",
                        change: "-18%",
                        icon: Zap,
                        color: "amber",
                      },
                    ].map((stat) => {
                      const Icon = stat.icon;

                      return (
                        <div
                          key={stat.label}
                          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                              <Icon className="h-3.5 w-3.5 text-slate-600" />
                            </div>

                            <span className="text-[9px] font-semibold text-emerald-600">
                              {stat.change}
                            </span>
                          </div>

                          <p className="mt-4 text-[9px] text-slate-400">
                            {stat.label}
                          </p>

                          <p className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                            {stat.value}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Charts */}
                  <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[9px] text-slate-400">
                            Inventory value
                          </p>
                          <p className="mt-1 text-sm font-bold">$482,620</p>
                        </div>

                        <span className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-600">
                          +12.4%
                        </span>
                      </div>

                      <div className="relative mt-6 h-32">
                        <div className="absolute inset-0 flex flex-col justify-between">
                          {[1, 2, 3, 4].map((line) => (
                            <div
                              key={line}
                              className="border-t border-dashed border-slate-100"
                            />
                          ))}
                        </div>

                        <svg
                          className="absolute inset-0 h-full w-full"
                          viewBox="0 0 600 140"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient
                              id="chartGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#6366f1"
                                stopOpacity="0.25"
                              />
                              <stop
                                offset="100%"
                                stopColor="#6366f1"
                                stopOpacity="0"
                              />
                            </linearGradient>
                          </defs>

                          <path
                            d="M0 115 C45 110 60 95 100 100 C145 106 150 70 200 78 C245 86 270 55 310 65 C350 75 370 48 410 52 C450 56 475 32 510 40 C545 48 565 18 600 25 L600 140 L0 140 Z"
                            fill="url(#chartGradient)"
                          />

                          <path
                            d="M0 115 C45 110 60 95 100 100 C145 106 150 70 200 78 C245 86 270 55 310 65 C350 75 370 48 410 52 C450 56 475 32 510 40 C545 48 565 18 600 25"
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] text-slate-400">
                          Warehouse capacity
                        </p>
                        <Globe className="h-3.5 w-3.5 text-slate-400" />
                      </div>

                      <div className="mt-5 flex items-center justify-center">
                        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-slate-100">
                          <div className="absolute inset-[-10px] rounded-full border-[10px] border-transparent border-t-indigo-500 border-r-violet-500 rotate-[-25deg]" />

                          <div className="text-center">
                            <p className="text-xl font-bold">74%</p>
                            <p className="text-[8px] text-slate-400">
                              utilized
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 space-y-2">
                        <div className="flex items-center justify-between text-[9px]">
                          <span className="text-slate-400">Bengaluru</span>
                          <span className="font-semibold">82%</span>
                        </div>

                        <div className="h-1.5 rounded-full bg-slate-100">
                          <div className="h-full w-[82%] rounded-full bg-indigo-500" />
                        </div>

                        <div className="flex items-center justify-between text-[9px]">
                          <span className="text-slate-400">Mumbai</span>
                          <span className="font-semibold">64%</span>
                        </div>

                        <div className="h-1.5 rounded-full bg-slate-100">
                          <div className="h-full w-[64%] rounded-full bg-violet-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -right-5 top-1/3 hidden w-52 rounded-xl border border-white/70 bg-white/90 p-4 shadow-2xl backdrop-blur-xl lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-slate-900">
                    Transfer completed
                  </p>
                  <p className="mt-0.5 text-[9px] text-slate-400">
                    Mumbai → Bengaluru
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TRUSTED BY
      ========================================================== */}
      <section className="border-y border-slate-200/70 bg-white/70 py-10 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="mb-7 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Trusted by modern operations teams
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-slate-400 sm:gap-x-16">
            <span className="text-lg font-black tracking-tight">NORTHSTAR</span>
            <span className="font-serif text-xl font-bold">Acme</span>
            <span className="text-lg font-black italic">LOGISTIX</span>
            <span className="text-lg font-bold tracking-[0.15em]">NEXUS</span>
            <span className="text-lg font-medium tracking-[0.3em]">AERIS</span>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================== */}
      <section id="features" className="relative py-24 sm:py-32">
        <div className="pointer-events-none absolute left-0 top-20 h-96 w-96 rounded-full bg-indigo-400/10 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-5 border border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-50">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Built for modern operations
            </Badge>

            <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Everything your inventory
              <span className="text-indigo-600"> needs.</span>
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-500 sm:text-lg">
              One connected platform to manage stock, warehouses, transfers,
              suppliers, and operational intelligence.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Globe,
                title: "Multi-Warehouse",
                description:
                  "Manage inventory across every location with complete visibility into stock, capacity, and movement.",
                color: "indigo",
              },
              {
                icon: BarChart3,
                title: "Real-Time Analytics",
                description:
                  "Turn operational data into actionable insights with live inventory, revenue, and fulfillment analytics.",
                color: "emerald",
              },
              {
                icon: ArrowRightLeft,
                title: "Smart Transfers",
                description:
                  "Move inventory between facilities with intelligent capacity checks and a complete transfer history.",
                color: "violet",
              },
              {
                icon: Zap,
                title: "Stock Intelligence",
                description:
                  "Get ahead of stockouts with intelligent alerts for products approaching their healthy inventory threshold.",
                color: "amber",
              },
              {
                icon: Layers,
                title: "Supplier Management",
                description:
                  "Centralize supplier information, lead times, purchase orders, and procurement activity.",
                color: "cyan",
              },
              {
                icon: Lock,
                title: "Secure by Design",
                description:
                  "Built with modern authentication and authorization architecture to keep operational data protected.",
                color: "slate",
              },
            ].map((feature) => {
              const Icon = feature.icon;

              const colorStyles = {
                indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
                emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
                violet: "bg-violet-50 text-violet-600 ring-violet-100",
                amber: "bg-amber-50 text-amber-600 ring-amber-100",
                cyan: "bg-cyan-50 text-cyan-600 ring-cyan-100",
                slate: "bg-slate-100 text-slate-700 ring-slate-200",
              };

              return (
                <Card
                  key={feature.title}
                  className="group relative overflow-hidden border-slate-200/80 bg-white/80 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl transition-opacity group-hover:opacity-100" />

                  <CardHeader>
                    <div
                      className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${colorStyles[feature.color]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm leading-6 text-slate-500">
                      {feature.description}
                    </p>

                    <div className="mt-5 flex items-center text-xs font-semibold text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
                      Learn more
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================== */}
      <section
        id="how-it-works"
        className="relative overflow-hidden border-y border-slate-200/70 bg-slate-950 py-24 text-white sm:py-32"
      >
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="border-white/10 bg-white/10 text-indigo-200 hover:bg-white/10">
              Simple by design
            </Badge>

            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              From inventory chaos
              <br />
              to operational clarity.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
              FlowBox brings your entire inventory workflow into one intelligent
              system.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Connect",
                text: "Set up your warehouses, products, suppliers, and inventory in minutes.",
              },
              {
                number: "02",
                title: "Control",
                text: "Monitor stock levels, transfers, capacity, and operational activity in real time.",
              },
              {
                number: "03",
                title: "Optimize",
                text: "Use intelligent analytics and alerts to make faster, better supply chain decisions.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition-colors hover:bg-white/[0.07]"
              >
                <span className="text-sm font-bold text-indigo-400">
                  {step.number}
                </span>

                <h3 className="mt-8 text-xl font-semibold">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {step.text}
                </p>

                <div className="mt-8 h-px w-full bg-gradient-to-r from-indigo-500/50 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          PRICING
      ========================================================== */}
      <section id="pricing" className="relative py-24 sm:py-32">
        <div className="absolute left-1/2 top-1/3 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-400/10 blur-[150px]" />

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-5 border border-slate-200 bg-white text-slate-600">
              Simple pricing
            </Badge>

            <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Start small.
              <span className="text-indigo-600"> Scale without limits.</span>
            </h2>

            <p className="mt-5 text-base text-slate-500 sm:text-lg">
              Choose the plan that fits your operation today. Upgrade whenever
              you're ready.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-3">
            {/* Starter */}
            <Card className="flex flex-col border-slate-200 bg-white/80 shadow-sm backdrop-blur">
              <CardHeader className="p-7">
                <p className="text-sm font-semibold text-slate-500">Starter</p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tight">
                    $0
                  </span>
                  <span className="text-sm text-slate-400">/ forever</span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Everything you need to get your inventory organized.
                </p>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col p-7 pt-0">
                <div className="my-2 h-px bg-slate-100" />

                <ul className="mt-6 space-y-4">
                  {[
                    "Up to 100 products",
                    "1 warehouse",
                    "Basic dashboard",
                    "Inventory tracking",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-600"
                    >
                      <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link to="/auth" className="mt-auto pt-8">
                  <Button variant="outline" className="h-12 w-full rounded-xl">
                    Start Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Professional */}
            <Card className="relative flex scale-100 flex-col overflow-hidden border-2 border-indigo-500 bg-white shadow-2xl shadow-indigo-500/15 lg:scale-105">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

              <div className="absolute right-5 top-5 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/20">
                Most Popular
              </div>

              <CardHeader className="p-7">
                <p className="text-sm font-semibold text-indigo-600">
                  Professional
                </p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tight">
                    $29
                  </span>
                  <span className="text-sm text-slate-400">/ month</span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Advanced tools for growing operations teams.
                </p>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col p-7 pt-0">
                <div className="my-2 h-px bg-slate-100" />

                <ul className="mt-6 space-y-4">
                  {[
                    "Unlimited products",
                    "Up to 5 warehouses",
                    "Advanced analytics",
                    "Transfer management",
                    "Smart stock alerts",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-600"
                    >
                      <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link to="/auth" className="mt-auto pt-8">
                  <Button className="h-12 w-full rounded-xl bg-indigo-600 font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700">
                    Start Pro Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="flex flex-col border-slate-200 bg-white/80 shadow-sm backdrop-blur">
              <CardHeader className="p-7">
                <p className="text-sm font-semibold text-slate-500">
                  Enterprise
                </p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tight">
                    $99
                  </span>
                  <span className="text-sm text-slate-400">/ month</span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Complete control for complex supply chain operations.
                </p>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col p-7 pt-0">
                <div className="my-2 h-px bg-slate-100" />

                <ul className="mt-6 space-y-4">
                  {[
                    "Unlimited everything",
                    "Priority support",
                    "Role-based access",
                    "Custom API access",
                    "Advanced security",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-600"
                    >
                      <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button variant="outline" className="mt-auto h-12 rounded-xl">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================== */}
      <section className="px-5 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-slate-950 px-6 py-16 text-center shadow-2xl sm:px-12 sm:py-20">
          <div className="absolute left-1/2 top-0 h-80 w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/30 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-cyan-500/10 blur-[100px]" />
          <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-violet-500/10 blur-[100px]" />

          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
              <Box className="h-6 w-6 text-indigo-300" />
            </div>

            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Ready to bring your inventory
              <span className="text-indigo-400"> under control?</span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Join modern operations teams using FlowBox to simplify inventory
              management and build a more efficient supply chain.
            </p>

            <div className="mt-8">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="h-13 rounded-full bg-white px-8 font-semibold text-slate-950 shadow-xl hover:bg-slate-100"
                >
                  Get started for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================== */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600">
                  <Box className="h-5 w-5 text-white" />
                </div>

                <span className="text-xl font-bold tracking-tight">
                  Flow<span className="text-indigo-600">Box</span>
                </span>
              </Link>

              <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
                The modern operating system for inventory and supply chain
                teams.
              </p>

              <div className="mt-6 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600">
                  <span className="text-xs font-bold">X</span>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600">
                  <span className="text-xs font-bold">GH</span>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600">
                  <span className="text-xs font-bold">in</span>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Product</h4>

              <ul className="mt-5 space-y-3 text-sm text-slate-500">
                <li>
                  <a href="#features" className="hover:text-slate-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-slate-900">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Company</h4>

              <ul className="mt-5 space-y-3 text-sm text-slate-500">
                <li>
                  <a href="#" className="hover:text-slate-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Legal</h4>

              <ul className="mt-5 space-y-3 text-sm text-slate-500">
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 text-xs text-slate-400 sm:flex-row">
            <p>
              © {new Date().getFullYear()} FlowBox Inc. All rights reserved.
            </p>

            <p>Built for modern operations teams.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
