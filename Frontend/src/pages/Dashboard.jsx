import React from "react";
import {
  Package,
  ShoppingCart,
  AlertCircle,
  TrendingUp,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Total Products", value: "1,204", icon: Package },
    { title: "Low Stock Alerts", value: "12", icon: AlertCircle },
    { title: "Orders Today", value: "48", icon: ShoppingCart },
    { title: "Revenue (MTD)", value: "$24,500", icon: TrendingUp },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Order #ord_1a2b shipped",
      time: "10 mins ago",
      highlight: true,
    },
    {
      id: 2,
      action: 'Stock added to "Mechanical Keyboard"',
      time: "1 hour ago",
      highlight: false,
    },
    {
      id: 3,
      action: 'New warehouse "Downtown Hub" registered',
      time: "3 hours ago",
      highlight: false,
    },
    {
      id: 4,
      action: 'Warning: "Wireless Mouse" inventory low (5 left)',
      time: "5 hours ago",
      highlight: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Overview of your inventory and daily metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-slate-600">
                {stat.title}
              </h3>
              <stat.icon className="h-4 w-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-950">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-slate-950" />
            <h3 className="text-lg font-semibold leading-none tracking-tight text-slate-950">
              Activity Log
            </h3>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {recentActivity.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 transition-colors"
            >
              <span
                className={`text-sm font-medium ${log.highlight ? "text-indigo-600" : "text-slate-700"}`}
              >
                {log.action}
              </span>
              <span className="text-xs text-slate-400">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
