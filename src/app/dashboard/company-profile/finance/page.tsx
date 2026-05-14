"use client";

import { useState } from "react";

const mockFinance = {
  fiscalYear: "FY 2024–25",
  currency: "INR",
  stats: [
    { label: "Total Revenue", value: "₹4.82 Cr", change: "+23%", positive: true },
    { label: "Net Profit", value: "₹96.4 L", change: "+18%", positive: true },
    { label: "Operating Expenses", value: "₹3.86 Cr", change: "+25%", positive: false },
    { label: "Profit Margin", value: "20%", change: "+2pp", positive: true },
  ],
  revenueByQuarter: [
    { quarter: "Q1 FY25", revenue: 92, target: 90 },
    { quarter: "Q2 FY25", revenue: 108, target: 100 },
    { quarter: "Q3 FY25", revenue: 135, target: 120 },
    { quarter: "Q4 FY25", revenue: 147, target: 130 },
  ],
  revenueStreams: [
    { name: "SaaS Subscriptions", amount: "₹2.14 Cr", percentage: 44 },
    { name: "Event Registrations", amount: "₹1.06 Cr", percentage: 22 },
    { name: "Booth & Sponsorship", amount: "₹96.4 L", percentage: 20 },
    { name: "Professional Services", amount: "₹67.5 L", percentage: 14 },
  ],
  expenseBreakdown: [
    { name: "Salaries & Benefits", amount: "₹1.93 Cr", percentage: 50 },
    { name: "Marketing & Sales", amount: "₹77.2 L", percentage: 20 },
    { name: "Technology & Infra", amount: "₹57.9 L", percentage: 15 },
    { name: "Operations", amount: "₹38.6 L", percentage: 10 },
    { name: "Admin & Legal", amount: "₹19.3 L", percentage: 5 },
  ],
  invoices: [
    { id: "INV-2025-0412", client: "TechExpo India Pvt. Ltd.", amount: "₹4,80,000", status: "paid", date: "12 Apr 2025" },
    { id: "INV-2025-0387", client: "BuildCon Exhibitions", amount: "₹2,20,000", status: "paid", date: "05 Apr 2025" },
    { id: "INV-2025-0401", client: "MedTech Show Organizers", amount: "₹3,60,000", status: "pending", date: "18 Apr 2025" },
    { id: "INV-2025-0415", client: "Auto Expo Partners", amount: "₹5,10,000", status: "overdue", date: "01 Apr 2025" },
    { id: "INV-2025-0418", client: "FoodFair Collective", amount: "₹1,80,000", status: "pending", date: "22 Apr 2025" },
  ],
};

const invoiceStatusStyles: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  overdue: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

const barColors = [
  "bg-indigo-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
];

export default function FinanceProfilePage() {
  const [invoiceFilter, setInvoiceFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");

  const filteredInvoices =
    invoiceFilter === "all"
      ? mockFinance.invoices
      : mockFinance.invoices.filter((i) => i.status === invoiceFilter);

  const maxRevenue = Math.max(...mockFinance.revenueByQuarter.map((q) => Math.max(q.revenue, q.target)));

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Finance Overview</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Revenue, expenses, and invoicing — {mockFinance.fiscalYear}
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Export Report
        </button>
      </div>

      {/* KPI Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {mockFinance.stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{s.label}</p>
            <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">{s.value}</p>
            <p className={`mt-0.5 text-xs font-semibold ${s.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
              {s.change} vs last year
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Revenue vs Target chart */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">
            Quarterly Revenue vs Target <span className="text-zinc-300">(₹ Lakhs)</span>
          </h2>
          <div className="space-y-4">
            {mockFinance.revenueByQuarter.map((q) => (
              <div key={q.quarter}>
                <div className="mb-1 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium">{q.quarter}</span>
                  <span>₹{q.revenue}L / Target ₹{q.target}L</span>
                </div>
                <div className="relative h-5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  {/* Target line */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-zinc-400/60 dark:bg-zinc-500"
                    style={{ left: `${(q.target / maxRevenue) * 100}%` }}
                  />
                  {/* Actual */}
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${q.revenue >= q.target ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${(q.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Achieved</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Below Target</span>
            <span className="flex items-center gap-1"><span className="h-0.5 w-4 bg-zinc-400" /> Target</span>
          </div>
        </section>

        {/* Revenue streams */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">Revenue Streams</h2>
          <div className="space-y-3">
            {mockFinance.revenueStreams.map((s, i) => (
              <div key={s.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{s.name}</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">{s.amount}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className={`h-full rounded-full ${barColors[i % barColors.length]}`}
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
                <p className="mt-0.5 text-right text-xs text-zinc-400">{s.percentage}%</p>
              </div>
            ))}
          </div>
        </section>

        {/* Expense breakdown */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">Expense Breakdown</h2>
          <div className="space-y-3">
            {mockFinance.expenseBreakdown.map((e, i) => (
              <div key={e.name} className="flex items-center gap-3">
                <span className={`h-3 w-3 shrink-0 rounded-sm ${barColors[i % barColors.length]}`} />
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{e.name}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{e.amount}</span>
                    <span className="ml-2 text-xs text-zinc-400">({e.percentage}%)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Invoices */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Recent Invoices</h2>
            <div className="flex gap-1">
              {(["all", "paid", "pending", "overdue"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setInvoiceFilter(f)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    invoiceFilter === f
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {filteredInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800">
                <div>
                  <p className="text-xs font-mono text-zinc-400">{inv.id}</p>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{inv.client}</p>
                  <p className="text-xs text-zinc-400">{inv.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{inv.amount}</p>
                  <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${invoiceStatusStyles[inv.status]}`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
            {filteredInvoices.length === 0 && (
              <p className="py-4 text-center text-sm text-zinc-400">No invoices found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
