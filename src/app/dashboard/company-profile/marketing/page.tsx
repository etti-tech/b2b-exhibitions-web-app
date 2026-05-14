"use client";

import { useState } from "react";

const mockMarketing = {
  tagline: "Connecting Businesses, Powering Growth",
  brandColors: ["#4F46E5", "#0EA5E9", "#10B981"],
  targetAudiences: ["Enterprise Organisers", "SME Exhibitors", "Trade Visitors", "Sponsors"],
  channels: [
    { name: "LinkedIn", followers: "18,400", growth: "+12%", icon: "in" },
    { name: "Twitter / X", followers: "7,200", growth: "+5%", icon: "tw" },
    { name: "Instagram", followers: "4,900", growth: "+18%", icon: "ig" },
    { name: "YouTube", followers: "2,300", growth: "+31%", icon: "yt" },
  ],
  campaigns: [
    {
      id: "c1",
      name: "ExpoTech Launch 2025",
      status: "completed",
      type: "Product Launch",
      reach: "42,000",
      leads: 380,
      spend: "₹3,20,000",
      roi: "4.2x",
    },
    {
      id: "c2",
      name: "India Expo Week — Summer",
      status: "live",
      type: "Event Promotion",
      reach: "27,500",
      leads: 210,
      spend: "₹1,80,000",
      roi: "3.1x",
    },
    {
      id: "c3",
      name: "Exhibitor Onboarding Drive",
      status: "planned",
      type: "Lead Generation",
      reach: "—",
      leads: 0,
      spend: "₹2,50,000",
      roi: "—",
    },
    {
      id: "c4",
      name: "Brand Awareness Q4",
      status: "completed",
      type: "Brand Awareness",
      reach: "88,000",
      leads: 620,
      spend: "₹5,00,000",
      roi: "5.8x",
    },
  ],
  assets: [
    { name: "Logo Pack (SVG + PNG)", size: "2.4 MB", updated: "Jan 2025" },
    { name: "Brand Guidelines v3", size: "8.1 MB", updated: "Mar 2025" },
    { name: "Product Brochure 2025", size: "4.7 MB", updated: "Apr 2025" },
    { name: "Exhibition Booth Design", size: "12.3 MB", updated: "Feb 2025" },
    { name: "Video Reel (30s)", size: "45 MB", updated: "Mar 2025" },
  ],
  stats: [
    { label: "Total Campaign Reach", value: "1.58L+" },
    { label: "Total Leads Generated", value: "1,210" },
    { label: "Avg. Campaign ROI", value: "4.4x" },
    { label: "Active Campaigns", value: "1" },
  ],
};

const statusStyles: Record<string, string> = {
  live: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  completed: "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300",
  planned: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
};

export default function MarketingProfilePage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "assets">("campaigns");

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Marketing Profile</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Brand identity, campaigns, and digital presence
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          New Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {mockMarketing.stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2">
            {(["campaigns", "assets"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                  activeTab === t
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "campaigns" && (
            <section className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      {["Campaign", "Type", "Reach", "Leads", "Spend", "ROI", "Status"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-zinc-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {mockMarketing.campaigns.map((c) => (
                      <tr key={c.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-50">{c.name}</td>
                        <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{c.type}</td>
                        <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{c.reach}</td>
                        <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{c.leads || "—"}</td>
                        <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{c.spend}</td>
                        <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">{c.roi}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[c.status]}`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "assets" && (
            <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="space-y-2">
                {mockMarketing.assets.map((a) => (
                  <div key={a.name} className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3 dark:bg-zinc-800">
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{a.name}</p>
                        <p className="text-xs text-zinc-400">{a.size} · Updated {a.updated}</p>
                      </div>
                    </div>
                    <button type="button" className="rounded-lg px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Brand */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">Brand Identity</h2>
            <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">Tagline</p>
            <p className="mb-4 text-sm font-semibold italic text-zinc-800 dark:text-zinc-200">
              &ldquo;{mockMarketing.tagline}&rdquo;
            </p>
            <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">Brand Colours</p>
            <div className="flex gap-2">
              {mockMarketing.brandColors.map((c) => (
                <div key={c} className="flex flex-col items-center gap-1">
                  <div className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-700" style={{ backgroundColor: c }} />
                  <span className="text-[10px] font-mono text-zinc-400">{c}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 mb-2 text-xs text-zinc-500 dark:text-zinc-400">Target Audiences</p>
            <div className="flex flex-wrap gap-1.5">
              {mockMarketing.targetAudiences.map((a) => (
                <span key={a} className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                  {a}
                </span>
              ))}
            </div>
          </section>

          {/* Social */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">Social Media</h2>
            <div className="space-y-3">
              {mockMarketing.channels.map((ch) => (
                <div key={ch.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-100 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {ch.icon.toUpperCase()}
                    </span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{ch.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{ch.followers}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">{ch.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
