"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import {
  mockEvents,
  mockExhibitorLeads,
  mockExhibitorBookings,
  mockExhibitorProducts,
  mockExhibitorSponsors,
  mockEventVisitors,
  mockVisitorRegistrations,
  mockNetworkingContacts,
  mockEventExhibitors,
} from "@/data/mock-data";

/* ─── Chart utilities ─── */

type TimeRange = "1m" | "6m" | "1y" | "3y" | "5y" | "10y" | "max";
type MetricKey = "visitors" | "leads" | "revenue";
type ChartPoint = { label: string; value: number };

const METRIC_COLORS: Record<MetricKey, string> = {
  visitors: "#6366f1",
  leads: "#10b981",
  revenue: "#f59e0b",
};

function seededRand(seed: number, i: number): number {
  const s = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function makeLabel(range: TimeRange, i: number, total: number): string {
  const base = new Date(2026, 3, 1);
  const d = new Date(base);
  switch (range) {
    case "1m":
      d.setDate(d.getDate() - (total - 1 - i));
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    case "6m":
      d.setDate(d.getDate() - (total - 1 - i) * 7);
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    case "1y":
      d.setMonth(d.getMonth() - (total - 1 - i));
      return d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
    case "3y":
      d.setMonth(d.getMonth() - (total - 1 - i) * 3);
      return `Q${Math.floor(d.getMonth() / 3) + 1} '${String(d.getFullYear()).slice(2)}`;
    case "5y":
      d.setMonth(d.getMonth() - (total - 1 - i) * 3);
      return `Q${Math.floor(d.getMonth() / 3) + 1} '${String(d.getFullYear()).slice(2)}`;
    case "10y":
    case "max": {
      const count = range === "10y" ? 10 : 15;
      const yr = d.getFullYear() - (count - 1 - i);
      return String(yr);
    }
  }
}

function getCount(range: TimeRange): number {
  return { "1m": 30, "6m": 26, "1y": 12, "3y": 12, "5y": 20, "10y": 10, max: 15 }[range];
}

function generateSeries(range: TimeRange, seed: number, baseVal: number): ChartPoint[] {
  const n = getCount(range);
  const pts: ChartPoint[] = [];
  let val = baseVal;
  for (let i = 0; i < n; i++) {
    const delta = (seededRand(seed + i * 7, i) - 0.38) * baseVal * 0.22;
    val = Math.max(baseVal * 0.08, val + delta);
    pts.push({ label: makeLabel(range, i, n), value: Math.round(val) });
  }
  return pts;
}

function fmtVal(v: number): string {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return Math.round(v).toString();
}

/* ─── Line Chart SVG ─── */

function LineChart({
  data,
  color,
  gradientId,
}: {
  data: ChartPoint[];
  color: string;
  gradientId: string;
}) {
  const W = 700, H = 240;
  const PAD = { l: 52, r: 12, t: 12, b: 32 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  if (data.length < 2)
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
        No data available
      </div>
    );

  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));
  const spread = maxVal - minVal || 1;
  const dispMax = maxVal + spread * 0.12;
  const dispMin = Math.max(0, minVal - spread * 0.12);
  const dispRange = dispMax - dispMin || 1;

  const toX = (i: number) => PAD.l + (i / (data.length - 1)) * cW;
  const toY = (v: number) => PAD.t + cH - ((v - dispMin) / dispRange) * cH;

  const xs = data.map((_, i) => toX(i));
  const ys = data.map((d) => toY(d.value));

  const linePts = data.map((_, i) => `${xs[i].toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const fillPts = `${PAD.l},${PAD.t + cH} ${linePts} ${(PAD.l + cW).toFixed(1)},${PAD.t + cH}`;

  const yTicks = 5;
  const xStep = Math.max(1, Math.ceil(data.length / 7));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {Array.from({ length: yTicks }, (_, k) => {
        const pct = k / (yTicks - 1);
        const y = PAD.t + pct * cH;
        const val = dispMax - pct * dispRange;
        return (
          <g key={k}>
            <line
              x1={PAD.l} x2={PAD.l + cW} y1={y} y2={y}
              stroke="currentColor" strokeOpacity="0.06"
              strokeWidth="1" strokeDasharray={k === 0 ? "0" : "3 3"}
            />
            <text
              x={PAD.l - 5} y={y} dy="0.35em"
              textAnchor="end" fontSize="9" fill="currentColor" fillOpacity="0.4"
            >
              {fmtVal(val)}
            </text>
          </g>
        );
      })}

      <line
        x1={PAD.l} x2={PAD.l + cW}
        y1={PAD.t + cH} y2={PAD.t + cH}
        stroke="currentColor" strokeOpacity="0.1" strokeWidth="1"
      />

      <polygon points={fillPts} fill={`url(#${gradientId})`} />
      <polyline
        points={linePts} fill="none"
        stroke={color} strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round"
      />

      {data.length <= 14 &&
        data.map((_, i) => (
          <circle key={i} cx={xs[i]} cy={ys[i]} r="3.5" fill={color} opacity="0.85" />
        ))}

      {data.map((d, i) => {
        if (i % xStep !== 0 && i !== data.length - 1) return null;
        return (
          <text key={i} x={xs[i]} y={H - 5} textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.4">
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── Time range selector ─── */

const TIME_RANGES: { key: TimeRange; label: string }[] = [
  { key: "1m", label: "1M" },
  { key: "6m", label: "6M" },
  { key: "1y", label: "1Y" },
  { key: "3y", label: "3Y" },
  { key: "5y", label: "5Y" },
  { key: "10y", label: "10Y" },
  { key: "max", label: "Max" },
];

/* ─── Main router ─── */

export default function DashboardPage() {
  const { user } = useAuth();
  if (user?.role === "exhibitor") return <ExhibitorOverview />;
  if (user?.role === "visitor") return <VisitorOverview />;
  return <OrganiserOverview />;
}

/* =================================================
   EXHIBITOR OVERVIEW
================================================= */

function ExhibitorOverview() {
  const { user } = useAuth();
  const router = useRouter();
  const [range, setRange] = useState<TimeRange>("1y");
  const [metric, setMetric] = useState<MetricKey>("visitors");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");

  const userId = user?.id ?? "";

  const userLeads = useMemo(
    () => mockExhibitorLeads.filter((l) => l.userId === userId),
    [userId]
  );
  const userBookings = useMemo(
    () => mockExhibitorBookings.filter((b) => b.userId === userId),
    [userId]
  );
  const confirmedBookings = userBookings.filter(
    (b) => b.status === "confirmed"
  );
  const confirmedEventIds = new Set(confirmedBookings.map((b) => b.eventId));

  const userProducts = mockExhibitorProducts.filter((p) => p.userId === userId);
  const userSponsors = mockExhibitorSponsors.filter((s) => s.userId === userId);
  const activeSponsors = userSponsors.filter((s) => s.status === "active");

  const boothVisitors = mockEventVisitors.filter((v) =>
    confirmedEventIds.has(v.eventId)
  ).length;

  const confirmedRevenue = confirmedBookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => {
      const n = parseInt(b.totalPrice.replace(/[^0-9]/g, ""), 10);
      return sum + (isNaN(n) ? 0 : n);
    }, 0);

  const company = user?.company ?? "Your Company";
  const companyInitials = company.slice(0, 2).toUpperCase();

  const vendorTier =
    confirmedBookings.length >= 3
      ? { label: "T1", desc: "Tier 1 Vendor", bg: "bg-amber-100 dark:bg-amber-500/20", text: "text-amber-700 dark:text-amber-300", ring: "ring-amber-400/40" }
      : confirmedBookings.length === 2
      ? { label: "T2", desc: "Tier 2 Vendor", bg: "bg-zinc-100 dark:bg-zinc-700", text: "text-zinc-600 dark:text-zinc-300", ring: "ring-zinc-400/40" }
      : { label: "T3", desc: "Tier 3 Vendor", bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", ring: "ring-orange-300/40" };

  const chartEvents = useMemo(() => {
    const evts = [{ id: "all", title: "All Events", color: "bg-indigo-500" }];
    const colors: Record<string, string> = {
      "EVT-001": "bg-indigo-400", "EVT-002": "bg-emerald-400",
      "EVT-003": "bg-orange-400", "EVT-004": "bg-cyan-400",
      "EVT-005": "bg-violet-400", "EVT-006": "bg-amber-400",
    };
    userBookings.forEach((b) => {
      const evt = mockEvents.find((e) => e.id === b.eventId);
      if (evt && !evts.find((e) => e.id === evt.id)) {
        evts.push({ id: evt.id, title: evt.title, color: colors[evt.id] ?? "bg-zinc-400" });
      }
    });
    return evts;
  }, [userBookings]);

  const chartData = useMemo(() => {
    const seeds: Record<MetricKey, Record<string, number>> = {
      visitors: { all: 140, "EVT-001": 85, "EVT-002": 60, "EVT-003": 40, "EVT-004": 55, "EVT-005": 70, "EVT-006": 50 },
      leads:    { all: 38,  "EVT-001": 22, "EVT-002": 12, "EVT-003": 10, "EVT-004": 14, "EVT-005": 18, "EVT-006": 11 },
      revenue:  { all: 9600, "EVT-001": 4200, "EVT-002": 5400, "EVT-003": 3800, "EVT-004": 7800, "EVT-005": 5000, "EVT-006": 3200 },
    };
    const base = seeds[metric][selectedEvent] ?? seeds[metric].all;
    const seedNum = selectedEvent === "all" ? 42 : parseInt(selectedEvent.replace(/\D/g, ""), 10) * 17;
    return generateSeries(range, seedNum + (metric === "leads" ? 11 : metric === "revenue" ? 31 : 0), base);
  }, [range, metric, selectedEvent]);

  const hotCount = userLeads.filter((l) => l.score === "Hot").length;
  const warmCount = userLeads.filter((l) => l.score === "Warm").length;
  const coldCount = userLeads.filter((l) => l.score === "Cold").length;
  const leadTotal = userLeads.length || 1;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Company profile header */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-24 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90" />
        <div className="relative px-6 pb-6">
          <div className="-mt-8 mb-4 flex items-end justify-between">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-indigo-600 to-purple-700 text-xl font-bold text-white shadow-md dark:border-zinc-900">
              {companyInitials}
            </div>
          </div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{company}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Verified Exhibitor
                </span>
                <span
                  title={vendorTier.desc}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${vendorTier.bg} ${vendorTier.text} ${vendorTier.ring}`}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                  {vendorTier.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Industrial Technology &amp; Automation · Est. 2018 · Mumbai, India
              </p>
              <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-300">
                Precision engineering solutions for process industries — sensors, automation &amp; smart factory platforms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Leads */}
        <MetricCard
          label="Total Leads"
          value={userLeads.length}
          sub={`${hotCount} hot · ${warmCount} warm`}
          color="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
          icon={<svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>}
        />
        {/* Hot Leads */}
        <MetricCard
          label="Hot Leads"
          value={hotCount}
          sub="High priority"
          color="text-red-500 dark:text-red-400"
          iconBg="bg-red-50 dark:bg-red-500/10"
          icon={<svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" /></svg>}
        />
        {/* Booth Visitors */}
        <MetricCard
          label="Booth Visitors"
          value={boothVisitors}
          sub="Confirmed events"
          color="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-500/10"
          icon={<svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>}
        />
        {/* Confirmed Bookings */}
        <MetricCard
          label="Confirmed Bookings"
          value={confirmedBookings.length}
          sub={`${userBookings.filter((b) => b.status === "pending").length} pending`}
          color="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-50 dark:bg-blue-500/10"
          icon={<svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" /></svg>}
        />
        {/* Products Listed */}
        <MetricCard
          label="Products Listed"
          value={userProducts.length}
          sub="In catalog"
          color="text-violet-600 dark:text-violet-400"
          iconBg="bg-violet-50 dark:bg-violet-500/10"
          icon={<svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>}
        />
        {/* Active Sponsors */}
        <MetricCard
          label="Active Sponsors"
          value={activeSponsors.length}
          sub={`${userSponsors.length} total`}
          color="text-amber-500 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-500/10"
          icon={<svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>}
        />
        {/* Booth Revenue */}
        <MetricCard
          label="Booth Revenue"
          value={confirmedRevenue > 0 ? `$${(confirmedRevenue / 1000).toFixed(1)}k` : "—"}
          sub="Confirmed only"
          color="text-teal-600 dark:text-teal-400"
          iconBg="bg-teal-50 dark:bg-teal-500/10"
          icon={<svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
        />
        {/* Lead Conversion */}
        <MetricCard
          label="Lead Conversion"
          value={userLeads.length > 0 ? `${Math.round((hotCount / leadTotal) * 100)}%` : "—"}
          sub="Hot lead rate"
          color="text-pink-500 dark:text-pink-400"
          iconBg="bg-pink-50 dark:bg-pink-500/10"
          icon={<svg className="h-5 w-5 text-pink-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>}
        />
      </div>

      {/* Lead score distribution bar */}
      <div className="rounded-xl border border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Lead Score Distribution</p>
          <p className="text-xs text-zinc-400">{userLeads.length} total leads</p>
        </div>
        <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div className="h-full bg-red-500 transition-all" style={{ width: `${(hotCount / leadTotal) * 100}%` }} />
          <div className="h-full bg-amber-400 transition-all" style={{ width: `${(warmCount / leadTotal) * 100}%` }} />
          <div className="h-full bg-zinc-400 transition-all" style={{ width: `${(coldCount / leadTotal) * 100}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-red-500" />Hot ({hotCount})</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-amber-400" />Warm ({warmCount})</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-zinc-400" />Cold ({coldCount})</span>
        </div>
      </div>

      {/* Performance chart */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-3 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Performance Trends</h3>
            <p className="text-xs text-zinc-400">Track your metrics over time across events</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {TIME_RANGES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setRange(key)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  range === key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-[300px]">
          <div className="w-44 shrink-0 border-r border-zinc-100 p-3 dark:border-zinc-800">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Events</p>
            <div className="space-y-0.5">
              {chartEvents.map((evt) => (
                <button
                  key={evt.id}
                  type="button"
                  onClick={() => setSelectedEvent(evt.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition ${
                    selectedEvent === evt.id
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                      : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${evt.color}`} />
                  <span className="line-clamp-2 leading-tight">{evt.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0 flex-1 p-4">
            <div className="mb-4 flex gap-2">
              {(["visitors", "leads", "revenue"] as MetricKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setMetric(k)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    metric === k
                      ? ""
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                  style={metric === k ? { backgroundColor: METRIC_COLORS[k] + "20", color: METRIC_COLORS[k] } : {}}
                >
                  {k.charAt(0).toUpperCase() + k.slice(1)}
                </button>
              ))}
            </div>
            <div className="h-[240px] w-full">
              <LineChart data={chartData} color={METRIC_COLORS[metric]} gradientId={`exh-${metric}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================================================
   VISITOR OVERVIEW
================================================= */

function VisitorOverview() {
  const { user } = useAuth();
  const router = useRouter();
  const [range, setRange] = useState<TimeRange>("1y");
  const [metric, setMetric] = useState<MetricKey>("visitors");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");

  const userId = user?.id ?? "";

  const registrations = useMemo(
    () => mockVisitorRegistrations.filter((r) => r.userId === userId),
    [userId]
  );
  const connections = useMemo(
    () => mockNetworkingContacts.filter((c) => c.userId === userId && c.status === "connected"),
    [userId]
  );

  const chartEvents = useMemo(() => {
    const evts = [{ id: "all", title: "All Events", color: "bg-sky-500" }];
    const seen = new Set<string>();
    const colors: Record<string, string> = {
      "EVT-001": "bg-indigo-400", "EVT-002": "bg-emerald-400",
      "EVT-003": "bg-orange-400", "EVT-004": "bg-cyan-400",
    };
    registrations.forEach((r) => {
      if (!seen.has(r.eventId)) {
        seen.add(r.eventId);
        const evt = mockEvents.find((e) => e.id === r.eventId);
        if (evt) evts.push({ id: evt.id, title: evt.title, color: colors[evt.id] ?? "bg-zinc-400" });
      }
    });
    return evts;
  }, [registrations]);

  const chartData = useMemo(() => {
    const seeds: Record<MetricKey, Record<string, number>> = {
      visitors: { all: 90, "EVT-001": 60, "EVT-002": 40, "EVT-003": 30, "EVT-004": 50 },
      leads:    { all: 18, "EVT-001": 10, "EVT-002": 7,  "EVT-003": 5,  "EVT-004": 8 },
      revenue:  { all: 500, "EVT-001": 300, "EVT-002": 200, "EVT-003": 150, "EVT-004": 250 },
    };
    const base = seeds[metric][selectedEvent] ?? seeds[metric].all;
    const seedNum = selectedEvent === "all" ? 17 : parseInt(selectedEvent.replace(/\D/g, ""), 10) * 13;
    return generateSeries(range, seedNum + (metric === "leads" ? 5 : metric === "revenue" ? 23 : 0), base);
  }, [range, metric, selectedEvent]);

  const stats = [
    { label: "Registered Events", value: registrations.filter((r) => r.status === "registered").length, color: "text-blue-600 dark:text-blue-400" },
    { label: "Attended", value: registrations.filter((r) => r.status === "checked_in").length, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Badges Ready", value: registrations.filter((r) => !r.badgeDownloaded && r.status !== "cancelled").length, color: "text-amber-600 dark:text-amber-400" },
    { label: "Connections", value: connections.length, color: "text-indigo-600 dark:text-indigo-400" },
  ];

  const quickActions = [
    { label: "Smart Match", href: "/dashboard/smart-match", icon: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z", colorClass: "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20" },
    { label: "Floor Map", href: "/dashboard/floor-map", icon: "M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z", colorClass: "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-300 dark:hover:bg-teal-500/20" },
    { label: "My Badges", href: "/dashboard/my-badges", icon: "M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Z", colorClass: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20" },
    { label: "My Schedule", href: "/dashboard/my-schedule", icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", colorClass: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/20" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Discover trade fairs, plan your visit, and grow your network
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/dashboard/events")}
          className="rounded-lg bg-sky-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
        >
          Browse Events
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickActions.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => router.push(a.href)}
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold transition ${a.colorClass}`}
          >
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d={a.icon} />
            </svg>
            {a.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-3 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Activity Trends</h3>
            <p className="text-xs text-zinc-400">Your engagement metrics over time</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {TIME_RANGES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setRange(key)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  range === key
                    ? "bg-sky-500 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex min-h-[300px]">
          <div className="w-44 shrink-0 border-r border-zinc-100 p-3 dark:border-zinc-800">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Events</p>
            <div className="space-y-0.5">
              {chartEvents.map((evt) => (
                <button
                  key={evt.id}
                  type="button"
                  onClick={() => setSelectedEvent(evt.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition ${
                    selectedEvent === evt.id
                      ? "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
                      : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${evt.color}`} />
                  <span className="line-clamp-2 leading-tight">{evt.title}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="min-w-0 flex-1 p-4">
            <div className="mb-4 flex gap-2">
              {(["visitors", "leads", "revenue"] as MetricKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setMetric(k)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    metric !== k ? "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700" : ""
                  }`}
                  style={metric === k ? { backgroundColor: "#0ea5e920", color: "#0ea5e9" } : {}}
                >
                  {k === "leads" ? "Contacts" : k.charAt(0).toUpperCase() + k.slice(1)}
                </button>
              ))}
            </div>
            <div className="h-[240px] w-full">
              <LineChart data={chartData} color="#0ea5e9" gradientId="vis-chart" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================================================
   ORGANISER OVERVIEW
================================================= */

function OrganiserOverview() {
  const { user } = useAuth();
  const [range, setRange] = useState<TimeRange>("1y");
  const [metric, setMetric] = useState<MetricKey>("visitors");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");

  const totalExhibitors = mockEventExhibitors.length;
  const totalVisitors = mockEvents.reduce((s, e) => s + e.visitors, 0);
  const liveEvents = mockEvents.filter((e) => e.status === "live");
  const upcomingEvts = mockEvents.filter((e) => e.status === "upcoming");
  const completedEvts = mockEvents.filter((e) => e.status === "completed");
  const pendingExhibitors = mockEventExhibitors.filter((e) => e.status === "pending").length;

  const chartEvts = useMemo(() => {
    const evts = [{ id: "all", title: "All Events", color: "bg-indigo-500" }];
    const colors: Record<string, string> = {
      "EVT-001": "bg-indigo-400", "EVT-002": "bg-emerald-400",
      "EVT-003": "bg-orange-400", "EVT-004": "bg-cyan-400",
      "EVT-005": "bg-violet-400", "EVT-006": "bg-amber-400",
    };
    mockEvents.forEach((e) => {
      evts.push({ id: e.id, title: e.title, color: colors[e.id] ?? "bg-zinc-400" });
    });
    return evts;
  }, []);

  const chartData = useMemo(() => {
    const seeds: Record<MetricKey, Record<string, number>> = {
      visitors: { all: 2400, "EVT-001": 1200, "EVT-002": 850, "EVT-003": 1800, "EVT-004": 620, "EVT-005": 0, "EVT-006": 980 },
      leads:    { all: 180,  "EVT-001": 80,   "EVT-002": 45,  "EVT-003": 120,  "EVT-004": 30, "EVT-005": 0, "EVT-006": 60 },
      revenue:  { all: 85000, "EVT-001": 32000, "EVT-002": 18000, "EVT-003": 48000, "EVT-004": 15000, "EVT-005": 0, "EVT-006": 22000 },
    };
    const base = Math.max(1, seeds[metric][selectedEvent] ?? seeds[metric].all);
    const seedNum = selectedEvent === "all" ? 99 : parseInt(selectedEvent.replace(/\D/g, ""), 10) * 23;
    return generateSeries(range, seedNum + (metric === "leads" ? 7 : metric === "revenue" ? 41 : 0), base);
  }, [range, metric, selectedEvent]);

  const statsData = [
    { label: "Total Events", value: mockEvents.length, color: "text-indigo-600 dark:text-indigo-400" },
    { label: "Live Now", value: liveEvents.length, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Upcoming", value: upcomingEvts.length, color: "text-blue-600 dark:text-blue-400" },
    { label: "Completed", value: completedEvts.length, color: "text-zinc-500 dark:text-zinc-400" },
    { label: "Total Exhibitors", value: totalExhibitors, color: "text-amber-600 dark:text-amber-400" },
    { label: "Pending Approvals", value: pendingExhibitors, color: "text-orange-600 dark:text-orange-400" },
    { label: "Total Visitors", value: totalVisitors.toLocaleString(), color: "text-teal-600 dark:text-teal-400" },
    { label: "Registrations", value: mockVisitorRegistrations.length, color: "text-pink-600 dark:text-pink-400" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Platform overview — your trade fairs at a glance
          </p>
        </div>
        <Link
          href="/dashboard/events"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Manage Events
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statsData.map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent events list */}
      <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Event Status</h3>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {mockEvents.slice(0, 5).map((evt) => (
            <Link
              key={evt.id}
              href={`/dashboard/events/${evt.id}`}
              className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className={`h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br ${evt.image}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">{evt.title}</p>
                <p className="text-xs text-zinc-400">{evt.venue}, {evt.city}</p>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">{evt.exhibitors}</p>
                  <p className="text-[10px] text-zinc-400">exhibitors</p>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">{evt.visitors.toLocaleString()}</p>
                  <p className="text-[10px] text-zinc-400">visitors</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  evt.status === "live" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" :
                  evt.status === "upcoming" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300" :
                  evt.status === "completed" ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300" :
                  "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                }`}>
                  {evt.status.charAt(0).toUpperCase() + evt.status.slice(1)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Analytics chart */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-3 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Platform Analytics</h3>
            <p className="text-xs text-zinc-400">Aggregate metrics across all events</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {TIME_RANGES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setRange(key)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  range === key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex min-h-[300px]">
          <div className="w-44 shrink-0 border-r border-zinc-100 p-3 dark:border-zinc-800">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Events</p>
            <div className="space-y-0.5">
              {chartEvts.map((evt) => (
                <button
                  key={evt.id}
                  type="button"
                  onClick={() => setSelectedEvent(evt.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition ${
                    selectedEvent === evt.id
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                      : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${evt.color}`} />
                  <span className="line-clamp-2 leading-tight">{evt.title}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="min-w-0 flex-1 p-4">
            <div className="mb-4 flex gap-2">
              {(["visitors", "leads", "revenue"] as MetricKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setMetric(k)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    metric !== k ? "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700" : ""
                  }`}
                  style={metric === k ? { backgroundColor: METRIC_COLORS[k] + "20", color: METRIC_COLORS[k] } : {}}
                >
                  {k === "leads" ? "Exhibitors" : k.charAt(0).toUpperCase() + k.slice(1)}
                </button>
              ))}
            </div>
            <div className="h-[240px] w-full">
              <LineChart data={chartData} color={METRIC_COLORS[metric]} gradientId={`org-${metric}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared MetricCard helper ─── */

function MetricCard({
  label,
  value,
  sub,
  color,
  iconBg,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  iconBg: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </div>
      <p className={`mt-3 text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-300">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">{sub}</p>}
    </div>
  );
}
