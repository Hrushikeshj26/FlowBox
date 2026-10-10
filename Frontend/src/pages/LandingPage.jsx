import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  ArrowRight,
  BarChart3,
  Building2,
  Layers,
  ArrowRightLeft,
  CheckCircle2,
  Menu,
  X,
  Sun,
  Moon,
  TrendingUp,
  Warehouse,
  Zap,
  Package,
  Activity,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useTheme } from "../components/ThemeProvider";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      {/* =========================================
          CUSTOM ANIMATIONS
      ========================================= */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes moving-gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-moving-gradient {
              background-size: 200% 200%;
              animation: moving-gradient 8s ease infinite;
            }
          `,
        }}
      />

      {/* =========================================
          PREMIUM NAVBAR
      ========================================= */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md shadow-sm transition-all">
              <Box className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">FlowBox</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {["Product", "Features", "Pricing", "Docs"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <Link
              to="/auth"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Link>
            {/* Standard Shadcn squarish button */}
            <Button asChild className="rounded-md h-10 px-6 shadow-sm">
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        {/* =========================================
            HERO SECTION (Centered + Mockup + Moving Gradient)
        ========================================= */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden flex flex-col items-center text-center">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 -z-10 bg-background overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[120%] max-w-[1200px] h-[600px] opacity-30 dark:opacity-20 animate-moving-gradient bg-gradient-to-r from-primary/40 via-teal-400/40 to-emerald-500/40 blur-[100px] rounded-full" />

            {/* Minimal Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)]" />
          </div>

          <div className="mx-auto max-w-4xl px-6 relative z-10">
            <Badge
              variant="outline"
              className="rounded-md bg-background/50 backdrop-blur-sm py-1.5 px-4 mb-8 border-primary/20 text-primary shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              FlowBox 2.0 is now generally available
            </Badge>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
              Total inventory clarity. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-500 to-emerald-500">
                Zero operational chaos.
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Manage multi-warehouse inventory, automate transfers, and monitor
              stock health in real-time. Built for modern operations teams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Squarish Shadcn Buttons */}
              <Button
                size="lg"
                className="rounded-md h-12 px-8 text-base shadow-lg shadow-primary/20"
              >
                Start your free trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-md h-12 px-8 text-base bg-background/50 backdrop-blur-sm"
              >
                Book a demo
              </Button>
            </div>
          </div>

          {/* SaaS Dashboard Mockup */}
        </section>

        {/* =========================================
            LOGOS / SOCIAL PROOF
        ========================================= */}
        <section className="py-12 border-y border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
              Trusted by fast-growing operations worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-10 md:gap-24 grayscale opacity-60">
              {["NORTHSTAR", "AERIS", "VANTAGE", "ORBIT", "NEXUS"].map(
                (company) => (
                  <span
                    key={company}
                    className="text-xl md:text-2xl font-black tracking-tighter text-foreground"
                  >
                    {company}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>

        {/* =========================================
            FEATURES (MODERN BENTO GRID)
        ========================================= */}
        <section id="features" className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 max-w-2xl text-center mx-auto">
              <Badge variant="outline" className="mb-4 rounded-md">
                <Zap className="w-3 h-3 mr-2 text-primary" /> Core Capabilities
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Everything you need to move fast.
              </h2>
              <p className="text-lg text-muted-foreground">
                Replace fragmented spreadsheets with a unified system designed
                for speed, accuracy, and scale.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[300px]">
              <Card className="md:col-span-2 bg-muted/30 border-border overflow-hidden relative group rounded-xl">
                <CardContent className="p-8 h-full flex flex-col justify-between z-10 relative">
                  <div className="bg-background w-12 h-12 rounded-lg border border-border flex items-center justify-center shadow-sm">
                    <Layers className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Real-time stock visibility
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                      Instantly query inventory balances with sub-second
                      visibility across your entire global network.
                    </p>
                  </div>
                </CardContent>
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-primary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              </Card>

              <Card className="bg-card border-border overflow-hidden group rounded-xl">
                <CardContent className="p-8 h-full flex flex-col justify-between">
                  <Building2 className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">Multi-warehouse</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage stock levels independently across unlimited
                      locations.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border overflow-hidden group rounded-xl">
                <CardContent className="p-8 h-full flex flex-col justify-between">
                  <ArrowRightLeft className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">Smart Transfers</h3>
                    <p className="text-sm text-muted-foreground">
                      Move stock seamlessly with built-in transit states and
                      approvals.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 bg-slate-950 dark:bg-muted/40 border-border overflow-hidden relative text-slate-50 dark:text-foreground group rounded-xl">
                <CardContent className="p-8 h-full flex flex-col justify-between z-10 relative">
                  <div className="bg-white/10 dark:bg-background w-12 h-12 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/5 dark:border-border shadow-sm">
                    <BarChart3 className="w-6 h-6 text-teal-400 dark:text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Operational Analytics
                    </h3>
                    <p className="text-slate-400 dark:text-muted-foreground max-w-md">
                      Identify slow-moving stock, track warehouse capacity, and
                      forecast replenishment needs automatically.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* =========================================
            PRICING (Bigger, Bolder, Distinct Styles)
        ========================================= */}
        <section
          id="pricing"
          className="py-24 bg-muted/20 border-y border-border relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4 rounded-md">
                Pricing Plans
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Simple, transparent pricing.
              </h2>
              <p className="text-lg text-muted-foreground">
                Start for free, upgrade when your operation demands it. No
                hidden fees.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
              {/* Starter */}
              <Card className="border-border bg-background shadow-sm rounded-xl flex flex-col p-2">
                <CardHeader className="p-6">
                  <CardTitle className="text-2xl font-bold">Starter</CardTitle>
                  <CardDescription className="mt-2 text-sm">
                    Perfect for small operations getting off the ground.
                  </CardDescription>
                  <div className="mt-6 flex items-end gap-1">
                    <span className="text-5xl font-extrabold">$0</span>
                    <span className="text-muted-foreground mb-1">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0 flex flex-col flex-1">
                  <Button
                    variant="outline"
                    className="w-full mb-8 rounded-md h-12"
                  >
                    Get Started Free
                  </Button>
                  <ul className="space-y-4 text-sm text-muted-foreground flex-1">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />{" "}
                      Up to 100 products
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />{" "}
                      1 warehouse location
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />{" "}
                      Basic inventory tracking
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />{" "}
                      Email support
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Professional (Bigger, Darker/Prominent Theme) */}
              <Card className="relative border-primary/50 shadow-2xl shadow-primary/10 bg-card transform md:-translate-y-4 rounded-xl flex flex-col p-2 ring-1 ring-primary/20 bg-slate-950 text-slate-50 dark:bg-zinc-950 dark:border-primary/40">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-teal-500 via-primary to-emerald-400 rounded-t-xl"></div>

                <CardHeader className="p-6 pt-8">
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground hover:bg-primary/90 border-none rounded-md px-3 py-1">
                    Most Popular
                  </Badge>
                  <CardTitle className="text-2xl font-bold text-white">
                    Professional
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm text-slate-400">
                    Advanced tools for growing businesses with multiple
                    locations.
                  </CardDescription>
                  <div className="mt-6 flex items-end gap-1">
                    <span className="text-5xl font-extrabold text-white">
                      $29
                    </span>
                    <span className="text-slate-400 mb-1">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0 flex flex-col flex-1">
                  <Button className="w-full mb-8 rounded-md h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg text-base">
                    Start 14-Day Trial
                  </Button>
                  <ul className="space-y-4 text-sm text-slate-300 flex-1">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />{" "}
                      <strong>Unlimited</strong> products
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />{" "}
                      Up to 5 warehouses
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />{" "}
                      Advanced Transfer Management
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />{" "}
                      Smart stock alerts & routing
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />{" "}
                      Priority chat support
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Enterprise */}
              <Card className="border-border bg-background shadow-sm rounded-xl flex flex-col p-2">
                <CardHeader className="p-6">
                  <CardTitle className="text-2xl font-bold">
                    Enterprise
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm">
                    For massive scale and complex global supply chains.
                  </CardDescription>
                  <div className="mt-6 flex items-end gap-1">
                    <span className="text-5xl font-extrabold">$99</span>
                    <span className="text-muted-foreground mb-1">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0 flex flex-col flex-1">
                  <Button
                    variant="outline"
                    className="w-full mb-8 rounded-md h-12"
                  >
                    Contact Sales
                  </Button>
                  <ul className="space-y-4 text-sm text-muted-foreground flex-1">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />{" "}
                      <strong>Unlimited</strong> warehouses
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />{" "}
                      Custom workflow automation
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />{" "}
                      API Access & Webhooks
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />{" "}
                      Dedicated Account Manager
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* =========================================
            BOTTOM CTA
        ========================================= */}
        <section className="py-24 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-primary/5"></div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to scale your operations?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join modern teams who have replaced chaotic spreadsheets with
              FlowBox's unified system.
            </p>
            <Button
              size="lg"
              className="rounded-md h-14 px-10 text-lg shadow-xl"
            >
              Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* =========================================
          MINIMAL FOOTER
      ========================================= */}
      <footer className="border-t border-border bg-background py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-primary" />
            <span className="font-bold tracking-tight">FlowBox</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-foreground">
              Contact Sales
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FlowBox Inc.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
