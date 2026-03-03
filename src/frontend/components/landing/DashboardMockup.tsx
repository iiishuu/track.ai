"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Eye, LayoutGrid, FileText, Share2, Cpu, TrendingUp, TrendingDown } from "lucide-react";

const VISIBILITY_DATA = [
  { month: "Oct", brand: 28, hubspot: 62, salesforce: 51 },
  { month: "Nov", brand: 33, hubspot: 65, salesforce: 55 },
  { month: "Dec", brand: 39, hubspot: 61, salesforce: 58 },
  { month: "Jan", brand: 45, hubspot: 67, salesforce: 56 },
  { month: "Feb", brand: 51, hubspot: 64, salesforce: 60 },
  { month: "Mar", brand: 58, hubspot: 65, salesforce: 62 },
];

const COMPETITORS = [
  { rank: 1, name: "HubSpot", visibility: 65, sentiment: 86, position: 2.7, trend: "up" },
  { rank: 2, name: "Salesforce", visibility: 62, sentiment: 74, position: 3.1, trend: "down" },
  { rank: 3, name: "Your brand", visibility: 58, sentiment: 79, position: 3.8, trend: "up" },
  { rank: 4, name: "Attio", visibility: 47, sentiment: 68, position: 4.2, trend: "up" },
];

const NAV_ITEMS = [
  { icon: LayoutGrid, label: "Overview", active: true },
  { icon: FileText, label: "Prompts", active: false },
  { icon: Share2, label: "Sources", active: false },
  { icon: Cpu, label: "Models", active: false },
];

const LINE_COLORS = {
  brand: "#111111",
  hubspot: "#f59e0b",
  salesforce: "#3b82f6",
};

export function DashboardMockup() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/80">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <span className="ml-4 text-xs text-gray-400">trackai.io/dashboard</span>
      </div>

      <div className="flex h-[420px]">
        {/* Sidebar */}
        <aside className="flex w-48 shrink-0 flex-col border-r border-gray-100 bg-gray-50/60">
          <div className="flex items-center gap-2 px-4 py-4">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-black">
              <span className="text-[9px] font-bold text-white">T</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">Dashboard</span>
          </div>

          {/* Search */}
          <div className="px-3 pb-3">
            <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5">
              <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-[11px] text-gray-400">Quick Actions</span>
            </div>
          </div>

          {/* Nav */}
          <div className="px-2">
            <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Pages
            </p>
            {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                  active ? "bg-gray-200/70 font-medium text-gray-900" : "text-gray-500"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[12px]">{label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <div className="flex items-center gap-3">
              {["acme.com", "Last 30 days", "All Models"].map((label, i) => (
                <span
                  key={label}
                  className={`flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-[11px] ${
                    i === 0 ? "font-semibold text-gray-900" : "text-gray-500"
                  }`}
                >
                  {i === 0 && <div className="h-2 w-2 rounded-full bg-green-500" />}
                  {label}
                  {i > 0 && (
                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              ))}
            </div>
            <button className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-[11px] text-gray-600">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>

          {/* Overview row */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-2.5">
            <p className="text-[12px] text-gray-500">
              Overview · <span className="font-medium text-gray-800">acme.com</span> — visibility trending{" "}
              <span className="font-medium text-emerald-600">+5.2% this month</span>
            </p>
            <div className="flex items-center gap-4 text-[11px] text-gray-500">
              <span>Visibility: <strong className="text-gray-800">8/14</strong></span>
              <span>Sentiment: <strong className="text-gray-800">2/14 <TrendingUp className="inline h-3 w-3 text-emerald-500" /></strong></span>
              <span>Position: <strong className="text-gray-800">5/14 <TrendingUp className="inline h-3 w-3 text-emerald-500" /></strong></span>
            </div>
          </div>

          {/* Tab row */}
          <div className="flex items-center gap-1 border-b border-gray-100 px-5 py-2">
            {["Visibility", "Sentiment", "Position"].map((tab, i) => (
              <button
                key={tab}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-[11px] font-medium ${
                  i === 0 ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {i === 0 && <Eye className="h-3 w-3" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Chart + Competitors */}
          <div className="flex flex-1 overflow-hidden">
            {/* Chart */}
            <div className="flex-1 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={VISIBILITY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 11,
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hubspot"
                    stroke={LINE_COLORS.hubspot}
                    strokeWidth={2}
                    dot={false}
                    name="HubSpot"
                  />
                  <Line
                    type="monotone"
                    dataKey="salesforce"
                    stroke={LINE_COLORS.salesforce}
                    strokeWidth={2}
                    dot={false}
                    name="Salesforce"
                  />
                  <Line
                    type="monotone"
                    dataKey="brand"
                    stroke={LINE_COLORS.brand}
                    strokeWidth={2.5}
                    dot={false}
                    name="acme.com"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Competitors panel */}
            <div className="w-52 shrink-0 border-l border-gray-100 p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[12px] font-semibold text-gray-900">Competitors</p>
                <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <p className="mb-3 text-[10px] text-gray-400">Compare with competitors</p>
              <div className="space-y-0">
                <div className="grid grid-cols-4 pb-1.5 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                  <span className="col-span-1">#</span>
                  <span className="col-span-1">Brand</span>
                  <span className="col-span-1 text-center">Vis.</span>
                  <span className="col-span-1 text-center">Pos.</span>
                </div>
                {COMPETITORS.map((c) => (
                  <div
                    key={c.name}
                    className={`grid grid-cols-4 items-center rounded-md py-1.5 px-0.5 text-[11px] ${
                      c.name === "Your brand" ? "bg-gray-50 font-medium" : ""
                    }`}
                  >
                    <span className="text-gray-400">{c.rank}</span>
                    <span className="truncate text-gray-800">{c.name}</span>
                    <span className="text-center font-medium text-gray-900">{c.visibility}%</span>
                    <span className="flex items-center justify-center gap-0.5 text-gray-600">
                      {c.position}
                      {c.trend === "up" ? (
                        <TrendingUp className="h-2.5 w-2.5 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-2.5 w-2.5 text-red-400" />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
