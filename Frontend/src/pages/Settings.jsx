import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Building2,
  Bell,
  Database,
  Upload,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  Download,
  ShieldCheck,
  Package,
  AlertTriangle,
  RotateCcw,
  Mail,
  MapPin,
  FileText,
  CircleHelp,
  ChevronRight,
  Sparkles,
  LogOut,
  Settings2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL = "http://localhost:5000/api";

const defaultSettings = {
  adminName: "",
  adminEmail: "",
  adminRole: "",
  adminAvatar: "",
  companyName: "",
  companyLogo: "",
  taxId: "",
  hqAddress: "",
  currency: "USD",
  taxRate: 0,
  lowStockThreshold: 10,
  skuPrefix: "FBX-",
  orderPrefix: "ORD-",
  preventNegativeStock: true,
  autoApproveTransfers: false,
  lowStockAlerts: true,
  orderStatusAlerts: true,
  capacityWarningPercent: 85,
};

// --------------------------------------------------
// REUSABLE FORM FIELD (UPDATED SAAS TYPOGRAPHY)
// --------------------------------------------------
function FormField({ label, description, children }) {
  return (
    <div className="min-w-0 space-y-2">
      <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
        {label}
      </label>
      {children}
      {description && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

// --------------------------------------------------
// CUSTOM TOGGLE SWITCH
// --------------------------------------------------
function ToggleRow({ title, description, checked, onCheckedChange }) {
  return (
    <div
      onClick={() => onCheckedChange(!checked)}
      className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/40 hover:bg-muted/30 shadow-sm"
    >
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
          {title}
        </p>
        <p className="text-xs font-medium leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <div
        role="switch"
        aria-checked={checked}
        aria-label={title}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white shadow-md transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </div>
    </div>
  );
}

// --------------------------------------------------
// SECTION HEADER
// --------------------------------------------------
function SectionHeader({ icon: Icon, title, description }) {
  return (
    <CardHeader className="space-y-1.5 pb-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <CardTitle className="text-base font-bold tracking-tight">
            {title}
          </CardTitle>
          <CardDescription className="text-xs font-medium leading-relaxed mt-0.5">
            {description}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------
export default function Settings() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState(defaultSettings);
  const [initialData, setInitialData] = useState(defaultSettings);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [saveStatus, setSaveStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const avatarInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

  const cardClass = "overflow-hidden border-border/70 shadow-sm transition-all hover:shadow-md bg-card/50 backdrop-blur-sm";
  const inputClass = "h-10 bg-background/50 shadow-sm"; // Matched input height

  // --------------------------------------------------
  // TABS CONFIGURATION
  // --------------------------------------------------
  const tabs = [
    {
      id: "profile",
      label: "Profile & Branding",
      shortLabel: "Profile",
      icon: User,
      description: "Personal identity & organization setup",
    },
    {
      id: "inventory",
      label: "Inventory Rules",
      shortLabel: "Inventory",
      icon: Package,
      description: "Stock thresholds & fulfillment parameters",
    },
    {
      id: "notifications",
      label: "Alerts & System",
      shortLabel: "System",
      icon: Bell,
      description: "Notifications and workspace data backups",
    },
  ];

  // --------------------------------------------------
  // FETCH SETTINGS
  // --------------------------------------------------
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/settings`);
        if (!res.ok) throw new Error("Unable to load workspace settings.");

        const data = await res.json();
        const mergedData = { ...defaultSettings, ...data };

        setFormData(mergedData);
        setInitialData(mergedData);
      } catch (error) {
        console.error("Settings fetch error:", error);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // --------------------------------------------------
  // UNSAVED CHANGES WARNING
  // --------------------------------------------------
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // --------------------------------------------------
  // FIELD UPDATE
  // --------------------------------------------------
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveStatus("idle");
    setErrorMessage("");
  };

  // --------------------------------------------------
  // IMAGE UPLOAD
  // --------------------------------------------------
  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Please select a valid PNG, JPG, WebP or SVG image.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Image size must be smaller than 2MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateField(fieldName, reader.result);
    reader.onerror = () => setErrorMessage("Unable to read the selected image.");
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // --------------------------------------------------
  // SAVE SETTINGS
  // --------------------------------------------------
  const handleSave = async (e) => {
    e.preventDefault();
    if (!isDirty || isSaving) return;

    setIsSaving(true);
    setSaveStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          taxRate: Number(formData.taxRate),
          lowStockThreshold: Number(formData.lowStockThreshold),
          capacityWarningPercent: Number(formData.capacityWarningPercent),
        }),
      });

      if (!res.ok) throw new Error("Failed to save workspace settings.");

      const updated = await res.json();
      const savedData = { ...defaultSettings, ...updated };

      setFormData(savedData);
      setInitialData(savedData);
      setSaveStatus("success");

      window.dispatchEvent(new Event("settingsUpdated"));
    } catch (error) {
      console.error("Save error:", error);
      setSaveStatus("error");
      setErrorMessage(error.message || "Network error while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------
  // LOGOUT HANDLER
  // --------------------------------------------------
  const handleLogout = () => {
    if (isDirty && !window.confirm("You have unsaved changes. Are you sure you want to log out?")) {
      return;
    }
    localStorage.removeItem("flowbox_token");
    localStorage.removeItem("flowbox_user");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  // --------------------------------------------------
  // RESET CHANGES
  // --------------------------------------------------
  const handleReset = () => {
    if (!isDirty || isSaving) return;
    if (window.confirm("Discard all unsaved changes?")) {
      setFormData(initialData);
      setSaveStatus("idle");
      setErrorMessage("");
    }
  };

  // --------------------------------------------------
  // EXPORT BACKUP
  // --------------------------------------------------
  const handleExportData = async () => {
    setIsExporting(true);
    setErrorMessage("");

    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/orders`),
      ]);

      if (!productsRes.ok || !ordersRes.ok) throw new Error("Unable to fetch inventory or order data.");

      const products = await productsRes.json();
      const orders = await ordersRes.json();

      const exportPayload = {
        exportedAt: new Date().toISOString(),
        company: formData.companyName,
        settings: formData,
        products,
        orders,
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `flowbox-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Export error:", error);
      setErrorMessage(error.message || "Failed to export workspace data.");
    } finally {
      setIsExporting(false);
    }
  };

  // --------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------
  if (isLoading) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-3">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading workspace settings...
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 pb-36 pt-2">
      
      {/* ───────────────── PAGE HEADER ───────────────── */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/65 pb-6 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Settings2 className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Workspace Settings</h1>
            {isDirty && (
              <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider ml-2">
                Unsaved changes
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Configure system rules, organization branding, and administrative preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-border/70 bg-muted/30 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            FlowBox v2.4 Engine Active
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="h-10 px-4 text-destructive font-bold uppercase tracking-wider text-xs hover:bg-destructive/10 hover:text-destructive border-border/70 shadow-sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* ERROR / SUCCESS FEEDBACK */}
      {errorMessage && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive shadow-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="font-bold">{errorMessage}</p>
        </div>
      )}

      {saveStatus === "success" && !isDirty && (
        <div role="status" className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm font-bold text-emerald-600 dark:text-emerald-400 shadow-sm animate-in fade-in-50">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Workspace settings updated successfully.
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex items-center gap-4 rounded-2xl border p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? "border-primary/50 bg-primary/[0.04] shadow-sm ring-1 ring-primary/20"
                  : "border-border/70 bg-card hover:border-border hover:bg-muted/40"
              }`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground group-hover:text-foreground"}`}>
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className={`text-sm font-bold tracking-tight ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </p>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground line-clamp-1">
                  {tab.description}
                </p>
              </div>

              <ChevronRight className={`h-5 w-5 shrink-0 transition-transform ${isActive ? "translate-x-0 text-primary" : "-translate-x-1 text-muted-foreground opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`} />
            </button>
          );
        })}
      </div>

      {/* SETTINGS FORMS CONTAINER */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* ======================================
            TAB 1: PROFILE & BRANDING
        ====================================== */}
        {activeTab === "profile" && (
          <div role="tabpanel" className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            
            {/* ADMIN PROFILE */}
            <Card className={cardClass}>
              <SectionHeader icon={User} title="Admin Profile" description="Manage your personal account credentials." />
              <Separator className="opacity-70" />
              <CardContent className="space-y-6 pt-6">
                
                {/* AVATAR UPLOAD */}
                <div className="flex items-center gap-5 rounded-xl border border-border/50 bg-muted/20 p-4 shadow-sm">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border/80 bg-background shadow-sm">
                    {formData.adminAvatar ? (
                      <img src={formData.adminAvatar} alt="Admin avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        {formData.adminName?.charAt(0)?.toUpperCase() || "A"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 space-y-2">
                    <input ref={avatarInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => handleFileUpload(e, "adminAvatar")} />
                    <div className="flex flex-wrap items-center gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => avatarInputRef.current?.click()} className="h-9 shadow-sm text-xs font-bold uppercase tracking-wider">
                        <Upload className="mr-2 h-3.5 w-3.5" /> Upload Photo
                      </Button>
                      {formData.adminAvatar && (
                        <Button type="button" size="icon" variant="ghost" aria-label="Remove avatar" className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => updateField("adminAvatar", "")}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-muted-foreground">PNG, JPG or WebP. Max file size 2MB.</p>
                  </div>
                </div>

                {/* PERSONAL INPUTS */}
                <div className="space-y-4">
                  <FormField label="Full Name">
                    <Input className={inputClass} value={formData.adminName} onChange={(e) => updateField("adminName", e.target.value)} placeholder="e.g. Hrushikesh Jadhav" />
                  </FormField>
                  <FormField label="Work Email Address">
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className={`${inputClass} pl-10`} type="email" value={formData.adminEmail} onChange={(e) => updateField("adminEmail", e.target.value)} placeholder="admin@flowbox.com" />
                    </div>
                  </FormField>
                  <FormField label="Role / Job Title">
                    <Input className={inputClass} value={formData.adminRole} onChange={(e) => updateField("adminRole", e.target.value)} placeholder="Operations Manager" />
                  </FormField>
                </div>
              </CardContent>
            </Card>

            {/* COMPANY BRANDING */}
            <Card className={cardClass}>
              <SectionHeader icon={Building2} title="Company Branding" description="Configure your corporate identity and organization setup." />
              <Separator className="opacity-70" />
              <CardContent className="space-y-6 pt-6">
                
                {/* LOGO UPLOAD */}
                <div className="flex items-center gap-5 rounded-xl border border-border/50 bg-muted/20 p-4 shadow-sm">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border/80 bg-background shadow-sm">
                    {formData.companyLogo ? (
                      <img src={formData.companyLogo} alt="Company logo" className="h-full w-full object-contain p-2" />
                    ) : (
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 space-y-2">
                    <input ref={logoInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={(e) => handleFileUpload(e, "companyLogo")} />
                    <div className="flex flex-wrap items-center gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => logoInputRef.current?.click()} className="h-9 shadow-sm text-xs font-bold uppercase tracking-wider">
                        <Upload className="mr-2 h-3.5 w-3.5" /> Upload Logo
                      </Button>
                      {formData.companyLogo && (
                        <Button type="button" size="icon" variant="ghost" aria-label="Remove company logo" className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => updateField("companyLogo", "")}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-muted-foreground">Square PNG or SVG recommended. Max 2MB.</p>
                  </div>
                </div>

                {/* COMPANY INPUTS */}
                <div className="space-y-4">
                  <FormField label="Company / Workspace Name">
                    <Input className={inputClass} value={formData.companyName} onChange={(e) => updateField("companyName", e.target.value)} placeholder="FlowBox Logistics" />
                  </FormField>
                  <FormField label="Tax ID / GSTIN">
                    <Input className={inputClass} value={formData.taxId} onChange={(e) => updateField("taxId", e.target.value)} placeholder="e.g. 29ABCDE1234F1Z5" />
                  </FormField>
                  <FormField label="Headquarters Address">
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className={`${inputClass} pl-10`} value={formData.hqAddress} onChange={(e) => updateField("hqAddress", e.target.value)} placeholder="100 Supply Chain Way, Suite 400" />
                    </div>
                  </FormField>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ======================================
            TAB 2: INVENTORY RULES
        ====================================== */}
        {activeTab === "inventory" && (
          <div role="tabpanel" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* STOCK PARAMETERS */}
            <Card className={cardClass}>
              <SectionHeader icon={Package} title="Stock & Fulfillment Parameters" description="Set global calculation rules and automated identification prefixes." />
              <Separator className="opacity-70" />
              <CardContent className="grid grid-cols-1 gap-x-6 gap-y-5 pt-6 md:grid-cols-2">
                <FormField label="Default Currency" description="Currency used across product catalogs.">
                  <Select value={formData.currency} onValueChange={(val) => updateField("currency", val)}>
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($) — US Dollar</SelectItem>
                      <SelectItem value="INR">INR (₹) — Indian Rupee</SelectItem>
                      <SelectItem value="EUR">EUR (€) — Euro</SelectItem>
                      <SelectItem value="GBP">GBP (£) — British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Tax / GST Rate (%)" description="Standard tax percentage applied.">
                  <Input className={inputClass} type="number" min="0" max="100" step="0.1" value={formData.taxRate} onChange={(e) => updateField("taxRate", e.target.value)} />
                </FormField>
                <FormField label="Low-Stock Threshold" description="Items below this quantity trigger alerts.">
                  <Input className={inputClass} type="number" min="1" value={formData.lowStockThreshold} onChange={(e) => updateField("lowStockThreshold", e.target.value)} />
                </FormField>
                <FormField label="Capacity Warning (%)" description="Triggers storage alerts at this limit.">
                  <Input className={inputClass} type="number" min="50" max="100" value={formData.capacityWarningPercent} onChange={(e) => updateField("capacityWarningPercent", e.target.value)} />
                </FormField>
                <FormField label="Auto SKU Prefix" description="Prefix attached to generated codes.">
                  <Input className={inputClass} value={formData.skuPrefix} onChange={(e) => updateField("skuPrefix", e.target.value)} placeholder="FBX-" />
                </FormField>
                <FormField label="Order Ref Prefix" description="Prefix attached to new sales orders.">
                  <Input className={inputClass} value={formData.orderPrefix} onChange={(e) => updateField("orderPrefix", e.target.value)} placeholder="ORD-" />
                </FormField>
              </CardContent>
            </Card>

            {/* OPERATIONAL GUARDRAILS */}
            <Card className={cardClass}>
              <SectionHeader icon={ShieldCheck} title="Operational Guardrails" description="Enforce safety constraints for orders and inventory movements." />
              <Separator className="opacity-70" />
              <CardContent className="space-y-4 pt-6">
                <ToggleRow title="Prevent Negative Inventory" description="Block order fulfillment and transfers if requested quantities exceed current stock." checked={formData.preventNegativeStock} onCheckedChange={(value) => updateField("preventNegativeStock", value)} />
                <ToggleRow title="Instant Internal Transfers" description="Automatically mark inter-warehouse stock movements as completed instantly." checked={formData.autoApproveTransfers} onCheckedChange={(value) => updateField("autoApproveTransfers", value)} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* ======================================
            TAB 3: ALERTS & SYSTEM
        ====================================== */}
        {activeTab === "notifications" && (
          <div role="tabpanel" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* NOTIFICATIONS */}
            <Card className={cardClass}>
              <SectionHeader icon={Bell} title="System Notifications" description="Manage operational triggers and dashboard notification preferences." />
              <Separator className="opacity-70" />
              <CardContent className="space-y-4 pt-6">
                <ToggleRow title="Low-Stock Replenishment Alerts" description={`Highlight items when stock drops below your threshold (${formData.lowStockThreshold} units).`} checked={formData.lowStockAlerts} onCheckedChange={(value) => updateField("lowStockAlerts", value)} />
                <ToggleRow title="Order Fulfillment Updates" description="Notify team members when orders transition between Pending, Shipped, and Delivered." checked={formData.orderStatusAlerts} onCheckedChange={(value) => updateField("orderStatusAlerts", value)} />
              </CardContent>
            </Card>

            {/* DATA BACKUP & EXPORT */}
            <Card className={cardClass}>
              <SectionHeader icon={Database} title="Data Backup & Export" description="Download complete workspace database snapshots." />
              <Separator className="opacity-70" />
              <CardContent className="pt-6 space-y-5">
                <div className="flex flex-col justify-between gap-5 rounded-xl border border-border/70 bg-muted/20 p-5 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-card shadow-sm">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">Full Workspace Snapshot</p>
                        <Badge variant="secondary" className="text-[10px] font-bold">JSON</Badge>
                      </div>
                      <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                        Includes all products, customer order histories, warehouses, and system settings.
                      </p>
                    </div>
                  </div>
                  <Button type="button" variant="outline" onClick={handleExportData} disabled={isExporting} className="h-10 shrink-0 shadow-sm text-xs font-bold uppercase tracking-wider">
                    {isExporting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Exporting...</> : <><Download className="mr-2 h-4 w-4" /> Export Backup</>}
                  </Button>
                </div>
                <div className="flex items-start gap-2 text-xs font-medium leading-relaxed text-muted-foreground px-1">
                  <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                  <p>Backups are generated in real-time directly from your database. Exporting does not modify or delete any workspace records.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ======================================
            STICKY SAVE BAR
        ====================================== */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/90 px-4 py-3.5 backdrop-blur-xl md:left-64 md:px-8 shadow-[0_-4px_6px_-1px_rgb(0_0_0_/_0.05)]">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* STATUS MESSAGE */}
            <div className="flex items-center gap-2.5 text-sm font-bold">
              {isDirty ? (
                <>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-foreground">You have unsaved configuration changes</span>
                </>
              ) : saveStatus === "success" ? (
                <>
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  <span className="text-muted-foreground">All changes saved successfully</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">Workspace settings are up to date</span>
                </>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" size="sm" onClick={handleReset} disabled={!isDirty || isSaving} className="h-10 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                <RotateCcw className="mr-2 h-4 w-4" /> Discard
              </Button>
              <Button type="submit" size="sm" disabled={!isDirty || isSaving} className="h-10 min-w-[140px] shadow-sm text-xs font-bold uppercase tracking-wider">
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}