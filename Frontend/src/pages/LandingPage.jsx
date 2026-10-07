import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  ArrowRightLeft,
  Building2,
  BarChart3,
  Network,
  Package,
  Menu,
  X,
  Moon,
  Sun,
  Search,
  Check,
  ArrowRight,
  Layers,
  MapPin,
  AlertCircle,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  Warehouse,
  Zap,
  Globe,
  ShieldCheck,
  Clock3,
  Crown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useTheme } from "../components/ThemeProvider";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigation = [
    { label: "Product", href: "/product" },
    { label: "Features", href: "/features" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
  ];

  const features = [
    {
      icon: Building2,
      title: "Multi-warehouse inventory",
      desc: "Manage stock levels independently across unlimited locations and retail spaces.",
    },
    {
      icon: Layers,
      title: "Real-time stock visibility",
      desc: "Instantly query inventory balances with sub-second visibility across your network.",
    },
    {
      icon: ArrowRightLeft,
      title: "Inventory transfers",
      desc: "Move stock between locations seamlessly with built-in transit states and approvals.",
    },
    {
      icon: Network,
      title: "Supplier management",
      desc: "Centralize vendor contacts, purchase orders, and lead times in one directory.",
    },
    {
      icon: Package,
      title: "Capacity monitoring",
      desc: "Ensure your warehouses never exceed physical constraints with volumetric tracking.",
    },
    {
      icon: BarChart3,
      title: "Operational analytics",
      desc: "Identify slow-moving stock and forecast replenishment needs automatically.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background font-sans text-foreground transition-colors duration-300">
      {/* =========================================================
          CUSTOM ANIMATIONS
      ========================================================= */}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes blob {
              0% {
                transform: translate(0px, 0px) scale(1);
              }
              33% {
                transform: translate(30px, -50px) scale(1.1);
              }
              66% {
                transform: translate(-20px, 20px) scale(0.9);
              }
              100% {
                transform: translate(0px, 0px) scale(1);
              }
            }

            @keyframes float {
              0% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-10px);
              }
              100% {
                transform: translateY(0px);
              }
            }

            @keyframes pulse-soft {
              0%,
              100% {
                opacity: 0.5;
              }
              50% {
                opacity: 1;
              }
            }

            .animate-blob {
              animation: blob 15s infinite alternate ease-in-out;
            }

            .animate-float {
              animation: float 6s infinite ease-in-out;
            }

            .animate-pulse-soft {
              animation: pulse-soft 3s infinite ease-in-out;
            }

            .animation-delay-2000 {
              animation-delay: 2s;
            }

            .animation-delay-4000 {
              animation-delay: 4s;
            }
          `,
        }}
      />

      {/* =========================================================
          GLOBAL AMBIENT BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="animate-blob absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />

        <div className="animate-blob animation-delay-2000 absolute right-[-10%] top-[20%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px]" />

        <div className="animate-blob animation-delay-4000 absolute bottom-[-10%] left-[20%] h-[50%] w-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* =========================================================
          NAVBAR
      ========================================================= */}

      <header
        className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
          isScrolled
            ? "border-border bg-background/80 shadow-sm backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="group flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
                <Box className="h-5 w-5" />
              </div>

              <span className="text-lg font-bold tracking-tight">FlowBox</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden items-center gap-5 md:flex">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>

              <Link
                to="/auth"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Log in
              </Link>

              <Button asChild className="shadow-sm">
                <Link to="/auth">Get started</Link>
              </Button>
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="absolute w-full border-b border-border bg-background px-5 pb-6 pt-4 shadow-lg md:hidden">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-foreground"
                >
                  {item.label}
                </Link>
              ))}

              <Separator className="my-2" />

              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-foreground"
              >
                Log in
              </Link>

              <Button asChild className="w-full">
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center"
                >
                  Get started
                </Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* =========================================================
            HERO
        ========================================================= */}

        <section className="relative overflow-hidden pb-20 pt-36 sm:pb-28 sm:pt-44 lg:pb-36">
          {/* Grid */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(rgba(99,102,241,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.045) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "linear-gradient(to bottom, black 0%, transparent 85%)",
            }}
          />

          {/* Hero glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[550px] w-[850px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-cyan-400/15 blur-[120px]" />

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl text-center">
              {/* Announcement */}
              <Badge
                variant="secondary"
                className="mb-7 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200"
              >
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500">
                  <Sparkles className="h-3 w-3 text-white" />
                </span>
                FlowBox 2.0 is now available
                <ChevronRight className="ml-1 h-4 w-4 text-indigo-400" />
              </Badge>

              {/* Heading */}
              <h1 className="text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] text-slate-950 dark:text-slate-50 sm:text-6xl lg:text-7xl xl:text-[82px]">
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
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8C100 2 170 11 250 6C330 1 400 8 497 3"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.35"
                    />

                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0"
                        y1="0"
                        x2="500"
                        y2="0"
                      >
                        <stop stopColor="#6366F1" />
                        <stop offset="0.5" stopColor="#8B5CF6" />
                        <stop offset="1" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              {/* Description */}
              <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-500 dark:text-slate-400 sm:text-lg">
                FlowBox gives modern operations teams one intelligent workspace
                to manage inventory, warehouses, transfers, suppliers, and
                demand — all in real time.
              </p>

              {/* CTA */}
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="h-14 rounded-full bg-slate-950 px-8 text-base font-semibold shadow-2xl shadow-slate-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-indigo-500/25 dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-400"
                  >
                    Start for free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <a href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 rounded-full border-slate-200 bg-white/80 px-8 text-base font-semibold shadow-sm backdrop-blur transition-all hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:hover:bg-slate-800"
                  >
                    Explore platform
                  </Button>
                </a>
              </div>

              {/* Trust line */}
              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                No credit card required
                <span className="mx-1">•</span>
                14-day Pro trial
              </div>

              {/* Hero dashboard preview */}
              <div className="relative mx-auto mt-20 max-w-5xl">
                <div className="absolute -inset-6 -z-10 rounded-[32px] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl" />

                <div className="animate-float overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                    {/* Browser header */}
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                      </div>

                      <div className="h-2 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />

                      <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-950" />
                    </div>

                    {/* Dashboard */}
                    <div className="grid gap-4 md:grid-cols-4">
                      {[
                        {
                          label: "Total inventory",
                          value: "24,892",
                          change: "+12.8%",
                          icon: Package,
                        },
                        {
                          label: "Warehouses",
                          value: "12",
                          change: "+2",
                          icon: Warehouse,
                        },
                        {
                          label: "Transfers",
                          value: "184",
                          change: "+8.4%",
                          icon: ArrowRightLeft,
                        },
                        {
                          label: "Stock health",
                          value: "94.2%",
                          change: "+4.6%",
                          icon: TrendingUp,
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-xl border border-slate-200 bg-white p-4 text-left dark:border-slate-800 dark:bg-slate-900"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                              {stat.label}
                            </span>

                            <stat.icon className="h-4 w-4 text-indigo-500" />
                          </div>

                          <div className="text-xl font-bold text-slate-900 dark:text-white">
                            {stat.value}
                          </div>

                          <div className="mt-1 text-xs font-medium text-emerald-500">
                            {stat.change}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chart placeholder */}
                    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            Inventory movement
                          </div>

                          <div className="mt-1 text-xs text-slate-400">
                            Last 30 days
                          </div>
                        </div>

                        <Badge variant="secondary">Live</Badge>
                      </div>

                      <div className="flex h-36 items-end gap-2">
                        {[40, 52, 45, 70, 62, 80, 72, 92, 68, 85, 78, 96].map(
                          (height, index) => (
                            <div
                              key={index}
                              className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-500 to-violet-400 opacity-80"
                              style={{ height: `${height}%` }}
                            />
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            TRUST
        ========================================================= */}

        <section className="border-y border-border bg-muted/30 py-10">
          <div className="mx-auto max-w-7xl px-5 text-center sm:px-6 lg:px-8">
            <p className="mb-8 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Built for teams that move products.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 opacity-50 dark:opacity-40 md:gap-16">
              <span className="text-xl font-bold tracking-tighter md:text-2xl">
                NORTHSTAR
              </span>

              <span className="text-xl font-bold tracking-widest md:text-2xl">
                NEXUS
              </span>

              <span className="text-xl font-black tracking-tight md:text-2xl">
                AERIS
              </span>

              <span className="text-xl font-bold uppercase md:text-2xl">
                Vantage
              </span>

              <span className="text-xl font-semibold tracking-[0.2em] md:text-2xl">
                ORBIT
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================
            PROBLEM / VALUE
        ========================================================= */}

        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <Badge variant="secondary" className="mb-5">
                  <Zap className="mr-2 h-3.5 w-3.5" />
                  Operations, simplified
                </Badge>

                <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  Inventory gets complicated.
                  <br className="hidden md:block" />
                  Your software shouldn't.
                </h2>

                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  Spreadsheets fragment quickly. Warehouse visibility becomes a
                  guessing game. Manual transfers lead to errors, and stock
                  uncertainty halts your growth.
                </p>

                <p className="text-lg leading-relaxed text-muted-foreground">
                  FlowBox acts as the single source of truth for your entire
                  physical operation, bringing clarity to chaos.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Badge variant="outline">
                    <ShieldCheck className="mr-2 h-3.5 w-3.5 text-emerald-500" />
                    Secure by default
                  </Badge>

                  <Badge variant="outline">
                    <Clock3 className="mr-2 h-3.5 w-3.5 text-indigo-500" />
                    Real-time data
                  </Badge>

                  <Badge variant="outline">
                    <Globe className="mr-2 h-3.5 w-3.5 text-cyan-500" />
                    Global operations
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-6 lg:pl-12">
                {[
                  {
                    icon: Search,
                    title: "Know what you have",
                    desc: "Real-time counts across all your SKUs, automatically updated.",
                  },
                  {
                    icon: MapPin,
                    title: "Know where it is",
                    desc: "Track items accurately across multiple warehouses and transit states.",
                  },
                  {
                    icon: AlertCircle,
                    title: "Know what needs attention",
                    desc: "Proactive alerts for low stock, delayed shipments, and capacity limits.",
                  },
                ].map((item, index) => (
                  <React.Fragment key={item.title}>
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <item.icon className="h-6 w-6" />
                      </div>

                      <div>
                        <h3 className="mb-1 text-xl font-bold text-foreground">
                          {item.title}
                        </h3>

                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>

                    {index < 2 && <Separator />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            FEATURES
        ========================================================= */}

        <section id="features" className="bg-muted/30 py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="mb-16 max-w-2xl">
              <Badge variant="secondary" className="mb-5">
                Platform
              </Badge>

              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Everything your operations team needs.
              </h2>

              <p className="text-lg text-muted-foreground">
                A complete toolkit designed specifically for modern B2B
                inventory management, avoiding the bloat of traditional ERPs.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="group border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                >
                  <CardHeader>
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <feature.icon className="h-5 w-5" />
                    </div>

                    <CardTitle className="text-lg font-bold">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            PRICING
        ========================================================= */}

        <section
          id="pricing"
          className="relative overflow-hidden bg-background py-24 md:py-32"
        >
          {/* Pricing background */}
          <div className="pointer-events-none absolute left-1/2 top-20 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px]" />

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            {/* Pricing heading */}
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <Badge
                variant="secondary"
                className="mb-5 rounded-full px-4 py-1.5"
              >
                Simple pricing
              </Badge>

              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                Choose the plan that fits your operation.
              </h2>

              <p className="text-lg leading-relaxed text-muted-foreground">
                Start small, grow without friction, and unlock more operational
                power when your network expands.
              </p>
            </div>

            {/* Pricing cards */}
            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3 lg:items-stretch">
              {/* STARTER */}
              <Card className="relative flex flex-col overflow-hidden rounded-3xl border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="h-1.5 bg-slate-200 dark:bg-slate-800" />

                <CardHeader className="pb-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <Package className="h-5 w-5" />
                    </div>

                    <Badge variant="outline">For getting started</Badge>
                  </div>

                  <CardTitle className="text-2xl">Starter</CardTitle>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Everything you need to organize a small inventory operation.
                  </p>

                  <div className="mt-7 flex items-end gap-1">
                    <span className="text-5xl font-bold tracking-tight text-foreground">
                      $0
                    </span>

                    <span className="mb-1.5 text-sm text-muted-foreground">
                      / month
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <Button
                    asChild
                    variant="outline"
                    className="mb-8 h-11 w-full rounded-xl"
                  >
                    <Link to="/auth">Get started free</Link>
                  </Button>

                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Includes
                  </p>

                  <ul className="flex-1 space-y-4 text-sm">
                    {[
                      "Up to 100 products",
                      "1 warehouse",
                      "Basic inventory tracking",
                      "Basic dashboard",
                      "Email support",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        </span>

                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* PROFESSIONAL */}
              <Card className="relative flex flex-col overflow-hidden rounded-3xl border-primary/40 bg-slate-950 text-white shadow-2xl shadow-indigo-500/20 ring-1 ring-primary/20 lg:-translate-y-4 dark:bg-indigo-950/40">
                {/* Popular label */}
                <div className="absolute right-5 top-5">
                  <Badge className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-white">
                    Most Popular
                  </Badge>
                </div>

                {/* Gradient top */}
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

                <CardHeader className="pb-4">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-indigo-300">
                    <Crown className="h-5 w-5" />
                  </div>

                  <CardTitle className="text-2xl text-white">
                    Professional
                  </CardTitle>

                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
                    Advanced tools for growing operations with multiple
                    warehouses.
                  </p>

                  <div className="mt-7 flex items-end gap-1">
                    <span className="text-5xl font-bold tracking-tight text-white">
                      $29
                    </span>

                    <span className="mb-1.5 text-sm text-slate-400">
                      / month
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    14-day Pro trial included
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <Button
                    asChild
                    className="mb-8 h-11 w-full rounded-xl bg-white font-semibold text-slate-950 shadow-lg shadow-black/10 hover:bg-indigo-50"
                  >
                    <Link to="/auth">Start 14-day trial</Link>
                  </Button>

                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Everything in Starter, plus
                  </p>

                  <ul className="flex-1 space-y-4 text-sm">
                    {[
                      "Unlimited products",
                      "Up to 5 warehouses",
                      "Advanced analytics",
                      "Transfer management",
                      "Smart stock alerts",
                      "Priority support",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-slate-300"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20">
                          <Check className="h-3.5 w-3.5 text-indigo-300" />
                        </span>

                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* ENTERPRISE */}
              <Card className="relative flex flex-col overflow-hidden rounded-3xl border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="h-1.5 bg-gradient-to-r from-slate-300 to-slate-500 dark:from-slate-700 dark:to-slate-500" />

                <CardHeader className="pb-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                      <Building2 className="h-5 w-5" />
                    </div>

                    <Badge variant="outline">For scale</Badge>
                  </div>

                  <CardTitle className="text-2xl">Enterprise</CardTitle>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Full control for large, distributed supply chain teams.
                  </p>

                  <div className="mt-7 flex items-end gap-1">
                    <span className="text-5xl font-bold tracking-tight text-foreground">
                      $99
                    </span>

                    <span className="mb-1.5 text-sm text-muted-foreground">
                      / month
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <Button
                    asChild
                    variant="outline"
                    className="mb-8 h-11 w-full rounded-xl"
                  >
                    <Link to="/contact">Contact sales</Link>
                  </Button>

                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Everything in Professional, plus
                  </p>

                  <ul className="flex-1 space-y-4 text-sm">
                    {[
                      "Unlimited warehouses",
                      "Advanced security & SAML",
                      "Priority 24/7 support",
                      "API access",
                      "Custom workflows",
                      "Dedicated onboarding",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10">
                          <Check className="h-3.5 w-3.5 text-violet-500" />
                        </span>

                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Pricing footnote */}
            <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground sm:flex-row">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Secure payments
              <span className="hidden sm:inline">•</span>
              Cancel anytime
              <span className="hidden sm:inline">•</span>
              No long-term contracts
            </div>
          </div>
        </section>

        {/* =========================================================
            FINAL CTA
        ========================================================= */}

        <section className="relative overflow-hidden bg-slate-950 py-24 text-slate-50 md:py-32">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 animate-blob rounded-full bg-primary/20 blur-[100px]" />

          <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-6 lg:px-8">
            <Badge className="mb-6 border border-white/10 bg-white/10 text-indigo-200 hover:bg-white/10">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Built for modern operations
            </Badge>

            <h2 className="mb-6 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Ready to get inventory under control?
            </h2>

            <p className="mb-10 text-lg text-slate-400">
              Bring your products, warehouses, and operations into one connected
              workspace.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-14 w-full rounded-xl bg-white px-8 text-lg font-semibold text-slate-950 shadow-xl hover:bg-indigo-50 sm:w-auto"
              >
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center gap-2"
                >
                  Start building with FlowBox
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-border bg-background pb-8 pt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-2">
              <Link
                to="/"
                className="group mb-4 inline-flex items-center gap-2"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                  <Box className="h-4 w-4" />
                </div>

                <span className="text-lg font-bold tracking-tight">
                  FlowBox
                </span>
              </Link>

              <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Modern B2B inventory management software built for operations
                teams that need clarity, not complexity.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-foreground">
                Product
              </h3>

              <ul className="space-y-3">
                {[
                  ["Features", "/features"],
                  ["Pricing", "/pricing"],
                  ["Integrations", "/integrations"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-foreground">
                Company
              </h3>

              <ul className="space-y-3">
                {[
                  ["About", "/about"],
                  ["Careers", "/careers"],
                  ["Contact", "/contact"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-foreground">
                Resources
              </h3>

              <ul className="space-y-3">
                {[
                  ["Documentation", "/docs"],
                  ["Help center", "/help"],
                  ["API", "/api"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="mb-8" />

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FlowBox. All rights reserved.
            </p>

            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacy
              </Link>

              <Link
                to="/terms"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
