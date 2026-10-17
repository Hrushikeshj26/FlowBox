import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  ArrowRight,
  BarChart3,
  Building2,
  ArrowRightLeft,
  CheckCircle2,
  Menu,
  X,
  Sun,
  Moon,
  Warehouse,
  Package,
  FileSpreadsheet,
  ShieldCheck,
  ChevronRight,
  Terminal,
  Heart,
  Globe,
  Sparkles,
  Layers,
  ExternalLink,
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

const HERO_TABS = [
  {
    id: "inventory",
    label: "Multi-Warehouse Stock",
    icon: Package,
    metrics: [
      {
        label: "Total Asset Valuation",
        value: "$148,920.00",
        delta: "+12.4% vs last mo",
      },
      {
        label: "Active Warehouse Nodes",
        value: "4 Facilities",
        delta: "82% Avg Load",
      },
      {
        label: "Low-Stock Threshold",
        value: "2 SKUs",
        delta: "Reorder Triggered",
      },
    ],
    rows: [
      {
        sku: "FB-9012",
        name: "Industrial Servo Motor v2",
        wh: "Mumbai Central Hub",
        cap: "240 / 500 units",
        status: "Optimal",
        tone: "teal",
      },
      {
        sku: "FB-4410",
        name: "Hydraulic Valve Assembly",
        wh: "Bengaluru South",
        cap: "410 / 450 units",
        status: "Near Cap",
        tone: "amber",
      },
      {
        sku: "FB-3029",
        name: "Optical Sensor Array",
        wh: "Pune Logistics Park",
        cap: "14 / 600 units",
        status: "Low Stock",
        tone: "red",
      },
      {
        sku: "FB-7781",
        name: "Anodised Chassis Frame",
        wh: "Delhi NCR Depot",
        cap: "512 / 800 units",
        status: "Optimal",
        tone: "teal",
      },
    ],
  },
  {
    id: "transfers",
    label: "Capacity-Aware Transfers",
    icon: ArrowRightLeft,
    metrics: [
      {
        label: "Completed Rebalances",
        value: "18 Transfers",
        delta: "Zero Collisions",
      },
      {
        label: "SKU Split Accuracy",
        value: "100% Atomic",
        delta: "Verified State",
      },
      { label: "Avg API Execution", value: "42ms", delta: "Express + Mongo" },
    ],
    rows: [
      {
        sku: "TR-8821",
        name: "Partial Split: 60 units → Bengaluru",
        wh: "Origin: Mumbai Hub",
        cap: "Cap Check: Passed",
        status: "Completed",
        tone: "teal",
      },
      {
        sku: "TR-8820",
        name: "Full Move: 150 units → Pune Park",
        wh: "Origin: Delhi Depot",
        cap: "Cap Check: Passed",
        status: "Completed",
        tone: "teal",
      },
      {
        sku: "TR-8819",
        name: "Partial Split: 25 units → Mumbai Hub",
        wh: "Origin: Bengaluru",
        cap: "Cap Check: Passed",
        status: "Rebalanced",
        tone: "amber",
      },
    ],
  },
  {
    id: "csv",
    label: "Bulk CSV Onboarding",
    icon: FileSpreadsheet,
    metrics: [
      { label: "Batch Throughput", value: "500+ Rows", delta: "< 1.8 Seconds" },
      {
        label: "Ingestion Pipeline",
        value: "PapaParse + insertMany",
        delta: "Single Trip",
      },
      { label: "Tenant Security", value: "JWT Scoped", delta: "req.user._id" },
    ],
    rows: [
      {
        sku: "BATCH-01",
        name: "q4_warehouse_manifest.csv",
        wh: "540 SKUs Validated",
        cap: "1.42s execution",
        status: "Imported",
        tone: "teal",
      },
      {
        sku: "BATCH-02",
        name: "supplier_directory_2026.csv",
        wh: "84 Vendors Linked",
        cap: "0.38s execution",
        status: "Imported",
        tone: "teal",
      },
      {
        sku: "BATCH-03",
        name: "bengaluru_opening_stock.csv",
        wh: "310 SKUs Validated",
        cap: "0.91s execution",
        status: "Imported",
        tone: "teal",
      },
    ],
  },
];

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");
  const [annualBilling, setAnnualBilling] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentTabObj =
    HERO_TABS.find((t) => t.id === activeTab) || HERO_TABS[0];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans antialiased">
      {/* =========================================
          TOP NAVIGATION BAR
      ========================================= */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border shadow-xs"
            : "bg-background/70 backdrop-blur-sm border-b border-border/50"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105">
                <Box className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">FlowBox</span>
              <Badge
                variant="secondary"
                className="hidden sm:inline-flex text-xs font-mono px-2 py-0.5 border border-border"
              >
                v2.4
              </Badge>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: "Architecture", href: "#features" },
                { label: "Workflow", href: "#workflow" },
                { label: "Pricing", href: "#pricing" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-10 text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Button
              variant="ghost"
              asChild
              className="h-10 px-4 text-sm font-medium"
            >
              <Link to="/login" className="inline-flex items-center">
                Sign In
              </Link>
            </Button>

            <Button
              asChild
              className="h-10 px-5 text-sm font-medium shadow-sm group"
            >
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-10 text-muted-foreground"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-background px-6 py-5 space-y-4">
            <div className="flex flex-col space-y-2.5">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-base font-medium text-muted-foreground hover:text-foreground"
              >
                Architecture
              </a>
              <a
                href="#workflow"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-base font-medium text-muted-foreground hover:text-foreground"
              >
                Workflow
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-base font-medium text-muted-foreground hover:text-foreground"
              >
                Pricing
              </a>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button variant="outline" asChild className="w-full h-11">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center"
                >
                  Sign In
                </Link>
              </Button>
              <Button asChild className="w-full h-11">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* =========================================
            HERO SECTION + ELEVATED WORKSPACE PREVIEW
        ========================================= */}
        <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-32 border-b border-border overflow-hidden">
          {/* Crisp Grid Matrix */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,#000_65%,transparent_100%)] opacity-50" />

          <div className="mx-auto max-w-7xl px-6">
            {/* Hero Header */}
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs sm:text-sm font-medium text-foreground mb-8 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>Multi-Tenant B2B Supply Chain & Inventory SaaS</span>
                <Separator orientation="vertical" className="h-3.5" />
                <a
                  href="#features"
                  className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  <span>Explore architecture</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.06] mb-6">
                Total inventory clarity.{" "}
                <span className="block sm:inline text-primary">
                  Zero operational chaos.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                Manage multi-warehouse stock, execute capacity-aware SKU
                transfers, and onboard 500+ CSV records in under two seconds.
              </p>

              {/* Fixed Horizontal Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Button
                  size="lg"
                  asChild
                  className="h-13 px-8 text-base font-semibold shadow-md shadow-primary/15 group w-full sm:w-auto"
                >
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap"
                  >
                    <span>Launch Free Workspace</span>
                    <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-13 px-8 text-base font-medium bg-card hover:bg-muted/60 w-full sm:w-auto"
                >
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Terminal className="w-4 h-4 text-primary shrink-0" />
                    <span>Explore Live Demo</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Interactive Application Frame */}
            <div className="mx-auto max-w-6xl">
              {/* Interactive Tab Pills */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                {HERO_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all border cursor-pointer ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Elevated Browser Mockup */}
              <div className="rounded-2xl border-2 border-border bg-card shadow-2xl overflow-hidden ring-4 ring-primary/5">
                {/* Browser Top Bar */}
                <div className="flex items-center justify-between border-b border-border bg-muted/50 px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                    <span className="ml-3 text-xs sm:text-sm font-mono text-muted-foreground hidden sm:inline">
                      https://flowbox.app/dashboard/{activeTab}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs font-mono bg-background px-2.5 py-1 border-primary/30 text-foreground"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-primary inline" />
                    JWT Tenant Isolated
                  </Badge>
                </div>

                {/* Browser Body */}
                <div className="p-6 sm:p-8 space-y-6 bg-background/60">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {currentTabObj.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-border bg-card p-5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-2">
                          <span className="font-medium">{m.label}</span>
                          <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md font-semibold">
                            {m.delta}
                          </span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-foreground">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Live Data Table */}
                  <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
                    <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3.5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Layers className="w-4 h-4 text-primary" />
                        <span>Active Workspace Ledger</span>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        Synced in real-time
                      </span>
                    </div>

                    <div className="divide-y divide-border text-sm">
                      {currentTabObj.rows.map((row) => (
                        <div
                          key={row.sku}
                          className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3 px-5 py-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="sm:col-span-2 font-mono text-xs font-semibold text-primary">
                            {row.sku}
                          </div>
                          <div className="sm:col-span-4 font-semibold text-foreground">
                            {row.name}
                          </div>
                          <div className="sm:col-span-3 text-sm text-muted-foreground flex items-center gap-2">
                            <Warehouse className="w-4 h-4 text-primary shrink-0" />
                            <span className="truncate">{row.wh}</span>
                          </div>
                          <div className="sm:col-span-2 font-mono text-xs sm:text-sm tabular-nums text-muted-foreground">
                            {row.cap}
                          </div>
                          <div className="sm:col-span-1 flex sm:justify-end">
                            <Badge
                              variant={
                                row.tone === "red" ? "destructive" : "secondary"
                              }
                              className="text-xs font-medium"
                            >
                              {row.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            HIGH-CONTRAST METRICS BANNER
        ========================================= */}
        <section className="py-14 border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  metric: "500+ SKUs",
                  desc: "Bulk CSV ingested in under 2 seconds",
                },
                {
                  metric: "100% Isolated",
                  desc: "Multi-tenant JWT controller scoping",
                },
                {
                  metric: "Zero Overflow",
                  desc: "Pre-transfer warehouse capacity guards",
                },
                {
                  metric: "5 Core Modules",
                  desc: "Analytics, Inventory, Transfers, Stores, Vendors",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1.5 border-l-4 border-primary pl-5"
                >
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-foreground">
                    {item.metric}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            DIFFERENTIATED BENTO ARCHITECTURE GRID
        ========================================= */}
        <section id="features" className="py-28 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 max-w-2xl">
              <Badge
                variant="outline"
                className="mb-3 font-mono text-xs px-3 py-1 border-primary/40 text-primary"
              >
                SYSTEM CAPABILITIES
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                Built for operational precision.
              </h2>
              <p className="text-lg text-muted-foreground">
                Each module is purpose-built to prevent warehouse
                over-allocation, eliminate spreadsheet drift, and keep stock
                counts accurate.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Card 1: 7 Columns - Highlighted Primary Accent Card */}
              <Card className="lg:col-span-7 border-2 border-primary/25 bg-gradient-to-br from-card via-card to-primary/5 shadow-md flex flex-col justify-between">
                <CardHeader className="p-7 sm:p-8 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                      <ArrowRightLeft className="w-6 h-6" />
                    </div>
                    <Badge className="bg-primary/15 text-primary hover:bg-primary/20 border-none font-mono text-xs px-3 py-1">
                      Atomic Stock Splitting
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    Capacity-Aware Inter-Warehouse Transfers
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground mt-2 leading-relaxed">
                    Transfer full or partial inventory between facilities.
                    FlowBox checks remaining destination capacity before
                    execution and automatically splits or merges SKU quantities.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-7 sm:p-8 pt-2">
                  <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3 text-sm">
                      <div className="rounded-lg border border-border bg-muted/40 p-3">
                        <div className="text-xs text-muted-foreground">
                          Origin Node
                        </div>
                        <div className="font-bold text-foreground">
                          Mumbai Hub
                        </div>
                        <div className="text-xs font-mono text-primary mt-0.5">
                          -45 units deducted
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center text-xs font-mono text-primary py-1">
                        <span>SPLIT SKU</span>
                        <ArrowRight className="w-5 h-5 my-0.5" />
                        <span>VALIDATED</span>
                      </div>
                      <div className="rounded-lg border border-primary/40 bg-primary/5 p-3">
                        <div className="text-xs text-muted-foreground">
                          Target Node
                        </div>
                        <div className="font-bold text-foreground">
                          Pune Facility
                        </div>
                        <div className="text-xs font-mono text-primary mt-0.5">
                          +45 units merged
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground">
                          Pune Facility Capacity Load
                        </span>
                        <span className="font-mono text-foreground font-semibold">
                          445 / 500 units (89%)
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                        <div className="h-full w-[89%] bg-primary rounded-full" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: 5 Columns - Dark Code Terminal Style */}
              <Card className="lg:col-span-5 border-border bg-zinc-950 text-zinc-50 shadow-md flex flex-col justify-between">
                <CardHeader className="p-7 sm:p-8 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-teal-400 uppercase tracking-wider">
                      Zero Data Leakage
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-bold text-white">
                    Strict Multi-Tenant Isolation
                  </CardTitle>
                  <CardDescription className="text-base text-zinc-400 mt-2 leading-relaxed">
                    Every API request is verified via JWT middleware and scoped
                    directly to{" "}
                    <code className="text-teal-300 font-mono">
                      req.user._id
                    </code>{" "}
                    so tenants only ever access their own facilities.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-7 sm:p-8 pt-2">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 font-mono text-xs sm:text-sm space-y-2 text-zinc-300">
                    <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-800 pb-2">
                      <span>productController.js</span>
                      <span className="text-teal-400">● Protected</span>
                    </div>
                    <div className="text-zinc-400">
                      const products = await Product.find(&#123;
                    </div>
                    <div className="pl-4 text-teal-300 font-semibold">
                      user: req.user._id,
                    </div>
                    <div className="pl-4 text-zinc-300">
                      storeId: targetWarehouseId
                    </div>
                    <div className="text-zinc-400">&#125;);</div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: 5 Columns - CSV Manifest Style */}
              <Card className="lg:col-span-5 border-border bg-card shadow-sm flex flex-col justify-between">
                <CardHeader className="p-7 sm:p-8 pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    Sub-2s Bulk CSV Onboarding
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground mt-2 leading-relaxed">
                    Download pre-formatted CSV templates, validate rows in the
                    browser with PapaParse, and batch-insert 500+ records in a
                    single MongoDB{" "}
                    <code className="font-mono text-foreground">
                      insertMany
                    </code>{" "}
                    call.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-7 sm:p-8 pt-2">
                  <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-mono font-semibold text-foreground">
                        flowbox_inventory.csv
                      </span>
                      <Badge variant="secondary" className="font-mono text-xs">
                        540 Rows
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Warehouse CurrentLoad Synced</span>
                      <span className="font-mono font-bold text-primary">
                        1.38s total
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: 7 Columns - Visual Telemetry Bar Chart */}
              <Card className="lg:col-span-7 border-border bg-card shadow-sm flex flex-col justify-between">
                <CardHeader className="p-7 sm:p-8 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <Badge
                      variant="outline"
                      className="font-mono text-xs px-3 py-1"
                    >
                      Recharts Analytics
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    Executive KPI & Low-Stock Telemetry
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground mt-2 leading-relaxed">
                    Visualize stock valuation across warehouses, monitor
                    capacity ceilings, and filter products or suppliers with
                    zero-latency client pagination.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-7 sm:p-8 pt-2">
                  <div className="rounded-xl border border-border bg-muted/20 p-5">
                    <div className="flex items-end justify-between gap-3 h-28 pt-4 px-2">
                      {[
                        { label: "Mumbai", h: "h-20", val: "82%" },
                        { label: "Bengaluru", h: "h-24", val: "91%" },
                        { label: "Pune", h: "h-14", val: "58%" },
                        { label: "Delhi", h: "h-16", val: "64%" },
                        { label: "Chennai", h: "h-12", val: "49%" },
                      ].map((bar) => (
                        <div
                          key={bar.label}
                          className="flex-1 flex flex-col items-center gap-2"
                        >
                          <span className="text-[11px] font-mono font-semibold text-primary">
                            {bar.val}
                          </span>
                          <div className="w-full bg-secondary rounded-t-md flex items-end overflow-hidden h-24">
                            <div
                              className={`w-full ${bar.h} bg-primary rounded-t-md`}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {bar.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* =========================================
            WORKFLOW PIPELINE SECTION
        ========================================= */}
        <section
          id="workflow"
          className="py-24 border-t border-border bg-muted/20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge
                variant="outline"
                className="mb-3 font-mono text-xs px-3 py-1"
              >
                3-STEP DEPLOYMENT
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                From raw spreadsheet to live control.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Create Warehouse Nodes",
                  desc: "Register your physical storage locations and set strict unit capacity ceilings for each facility.",
                },
                {
                  step: "02",
                  title: "Import Catalog & Suppliers",
                  desc: "Use one-click CSV templates to batch-upload ratusan SKUs and vendor directories in seconds.",
                },
                {
                  step: "03",
                  title: "Rebalance & Monitor Stock",
                  desc: "Execute partial or full stock transfers between warehouses while live charts track utilization.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-border border-t-4 border-t-primary bg-card p-8 shadow-xs space-y-4"
                >
                  <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 px-3 py-1 font-mono text-sm font-bold text-primary">
                    STEP {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            PRICING SECTION
        ========================================= */}
        <section
          id="pricing"
          className="py-28 bg-background border-t border-border"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <Badge
                  variant="outline"
                  className="mb-3 font-mono text-xs px-3 py-1"
                >
                  TRANSPARENT PRICING
                </Badge>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
                  Simple plans that scale with you.
                </h2>
              </div>

              {/* Billing Switch */}
              <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/50 p-1.5 self-start">
                <button
                  onClick={() => setAnnualBilling(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    !annualBilling
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setAnnualBilling(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2 cursor-pointer ${
                    annualBilling
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    -20%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {/* Starter */}
              <Card className="border-border bg-card flex flex-col justify-between rounded-2xl p-2">
                <CardHeader className="p-6">
                  <CardTitle className="text-2xl font-bold">Starter</CardTitle>
                  <CardDescription className="mt-2 text-base">
                    For small operations digitizing their first warehouse.
                  </CardDescription>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold tabular-nums">
                      $0
                    </span>
                    <span className="text-base text-muted-foreground">
                      / forever
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0 flex flex-col flex-1">
                  <Button
                    variant="outline"
                    asChild
                    className="w-full h-12 text-base mb-8"
                  >
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <span>Start Free</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </Link>
                  </Button>
                  <ul className="space-y-4 text-sm sm:text-base text-muted-foreground flex-1">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span>Up to 250 active SKUs</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span>2 Warehouse facilities</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span>CSV Template Import</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Operations Pro (Highlighted) */}
              <Card className="relative border-2 border-primary bg-card shadow-xl flex flex-col justify-between rounded-2xl p-2 md:-translate-y-2">
                <CardHeader className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl font-bold">
                      Operations Pro
                    </CardTitle>
                    <Badge className="bg-primary text-primary-foreground text-xs px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    Full multi-warehouse transfers and live capacity analytics.
                  </CardDescription>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold tabular-nums">
                      ${annualBilling ? "24" : "29"}
                    </span>
                    <span className="text-base text-muted-foreground">
                      / month
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0 flex flex-col flex-1">
                  <Button
                    asChild
                    className="w-full h-12 text-base mb-8 shadow-md group"
                  >
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <span>Start 14-Day Free Trial</span>
                      <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                  <ul className="space-y-4 text-sm sm:text-base text-foreground flex-1">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span>
                        <strong>Unlimited</strong> SKUs & CSV Batches
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span>Up to 15 Warehouse Locations</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span>Partial & Full SKU Transfer Splitting</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span>Vendor Directory & Low-Stock Alerts</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Enterprise */}
              <Card className="border-border bg-card flex flex-col justify-between rounded-2xl p-2">
                <CardHeader className="p-6">
                  <CardTitle className="text-2xl font-bold">
                    Enterprise
                  </CardTitle>
                  <CardDescription className="mt-2 text-base">
                    Dedicated database clusters and custom ERP webhooks.
                  </CardDescription>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold tabular-nums">
                      ${annualBilling ? "79" : "99"}
                    </span>
                    <span className="text-base text-muted-foreground">
                      / month
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0 flex flex-col flex-1">
                  <Button
                    variant="outline"
                    asChild
                    className="w-full h-12 text-base mb-8"
                  >
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <span>Contact Engineering</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </Link>
                  </Button>
                  <ul className="space-y-4 text-sm sm:text-base text-muted-foreground flex-1">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span>
                        <strong>Unlimited</strong> Global Warehouses
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span>Dedicated MongoDB Atlas Cluster</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span>Custom REST API & ERP Webhooks</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* =========================================
            BOTTOM CALL TO ACTION
        ========================================= */}
        <section className="py-24 bg-muted/30 border-t border-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="rounded-3xl border-2 border-primary/20 bg-card p-8 sm:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-lg">
              <div className="space-y-3 text-center lg:text-left max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                  Ready to modernize your supply chain?
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Deploy your isolated workspace in seconds, import a CSV
                  manifest, and test live inter-warehouse transfers right now.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
                <Button
                  size="lg"
                  asChild
                  className="h-13 px-8 text-base font-semibold group"
                >
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap"
                  >
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-13 px-8 text-base"
                >
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center whitespace-nowrap"
                  >
                    Sign In to Workspace
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================
          EXPANDED MULTI-COLUMN FOOTER + SIGNATURE
      ========================================= */}
      <footer className="border-t border-border bg-card pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-border">
            {/* Brand Column (2 Cols wide) */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-xs">
                  <Box className="w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-foreground">
                  FlowBox
                </span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Multi-tenant B2B Supply Chain & Inventory Management SaaS built
                for real-time warehouse capacity tracking, atomic stock
                transfers, and high-speed CSV onboarding.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  "MongoDB",
                  "Express.js",
                  "React.js",
                  "Node.js",
                  "Shadcn UI",
                ].map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="text-xs font-mono"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Platform Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Platform
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#features"
                    className="hover:text-primary transition-colors"
                  >
                    System Architecture
                  </a>
                </li>
                <li>
                  <a
                    href="#workflow"
                    className="hover:text-primary transition-colors"
                  >
                    Operational Workflow
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-primary transition-colors"
                  >
                    Pricing Plans
                  </a>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-primary transition-colors"
                  >
                    Live Workspace Demo
                  </Link>
                </li>
              </ul>
            </div>

            {/* Core Modules */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Core Modules
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/login"
                    className="hover:text-primary transition-colors"
                  >
                    Executive Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-primary transition-colors"
                  >
                    Multi-Warehouse Ledger
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-primary transition-colors"
                  >
                    Stock Transfer Engine
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-primary transition-colors"
                  >
                    Bulk CSV Importer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Developer / Connect */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Developer
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://github.com/Hrushikeshj26"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>GitHub Profile</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/hrushikeshj26/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://hrushij-dev.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Portfolio Website</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar with Creator Signature */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} FlowBox Inc. All rights reserved.
            </p>

            <p className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>by</span>
              <a
                href="https://github.com/Hrushikeshj26"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-primary hover:underline"
              >
                Hrushikeshj26
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
