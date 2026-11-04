import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // 1. User Profile
    adminName: { type: String, default: "Admin User" },
    adminEmail: { type: String, default: "admin@flowbox.com" },
    adminRole: { type: String, default: "Operations Manager" },
    adminAvatar: { type: String, default: "" }, // Stores uploaded image data

    // 2. Company Branding
    companyName: { type: String, default: "" },
    companyLogo: { type: String, default: "" }, // Stores uploaded logo data
    taxId: { type: String, default: "" },
    hqAddress: { type: String, default: "" },

    // 3. Inventory & Fulfillment Rules
    currency: { type: String, default: "USD" },
    taxRate: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    skuPrefix: { type: String, default: "FBX-" },
    orderPrefix: { type: String, default: "ORD-" },
    preventNegativeStock: { type: Boolean, default: true },
    autoApproveTransfers: { type: Boolean, default: false },

    // 4. Alerts & Notifications
    lowStockAlerts: { type: Boolean, default: true },
    orderStatusAlerts: { type: Boolean, default: true },
    capacityWarningPercent: { type: Number, default: 85 },
  },
  { timestamps: true },
);

export default mongoose.model("Settings", settingsSchema);
