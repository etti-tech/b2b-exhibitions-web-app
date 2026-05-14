"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import { mockExhibitorBookings, mockEvents } from "@/data/mock-data";
import type { BookingStatus } from "@/data/mock-data";

/* ─── Flow definition ─── */
// pending → payment_pending → confirmed  (or → rejected / cancelled at any step)

const FLOW_STEPS = [
  { label: "Submit Application", sub: "Fill in booth requirements",          color: "bg-indigo-600 text-white ring-indigo-600" },
  { label: "Awaiting Approval",  sub: "Organiser reviews your application",  color: "bg-amber-100 text-amber-700 ring-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:ring-amber-500/40" },
  { label: "Payment Due",        sub: "Secure your booth with payment",      color: "bg-orange-100 text-orange-700 ring-orange-300 dark:bg-orange-500/20 dark:text-orange-300 dark:ring-orange-500/40" },
  { label: "Confirmed!",         sub: "Prepare for the exhibition",          color: "bg-emerald-100 text-emerald-700 ring-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-500/40" },
];

/* ─── Status config ─── */
type StatusMeta = { label: string; badge: string; step: number; tagline: string; progressWidth: string };

const STATUS_META: Record<BookingStatus, StatusMeta> = {
  pending: {
    label: "Awaiting Approval",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    step: 1, tagline: "Your application is under review. We'll notify you once the organiser responds.",
    progressWidth: "w-1/3",
  },
  payment_pending: {
    label: "Payment Required",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300",
    step: 2, tagline: "Your booth has been approved! Complete your payment to secure your spot.",
    progressWidth: "w-2/3",
  },
  confirmed: {
    label: "Confirmed",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    step: 3, tagline: "You're all set! Start preparing for the exhibition.",
    progressWidth: "w-full",
  },
  rejected: {
    label: "Not Approved",
    badge: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
    step: -1, tagline: "Your booth application was not approved by the organiser.",
    progressWidth: "w-0",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
    step: -1, tagline: "This booking has been cancelled.",
    progressWidth: "w-0",
  },
};

const boothStyleLabels = { bare_space: "Bare Space", shell_scheme: "Shell Scheme" };
const positionLabels   = { corner: "Corner", middle: "Middle", island: "Island", end_cap: "End Cap" };

const SORT_PRIORITY: Record<BookingStatus, number> = {
  payment_pending: 0, pending: 1, confirmed: 2, rejected: 3, cancelled: 4,
};

type FilterKey = BookingStatus | "all";
const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: "all",             label: "All" },
  { key: "pending",         label: "Awaiting Approval" },
  { key: "payment_pending", label: "Payment Due" },
  { key: "confirmed",       label: "Confirmed" },
  { key: "rejected",        label: "Rejected" },
  { key: "cancelled",       label: "Cancelled" },
];

/* ─── Page ─── */
export default function BookingsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterKey>("all");

  const userBookings = useMemo(
    () =>
      mockExhibitorBookings
        .filter((b) => b.userId === user?.id)
        .sort((a, b) => SORT_PRIORITY[a.status] - SORT_PRIORITY[b.status]),
    [user?.id]
  );

  const filtered = filter === "all" ? userBookings : userBookings.filter((b) => b.status === filter);

  const counts = {
    all:             userBookings.length,
    pending:         userBookings.filter((b) => b.status === "pending").length,
    payment_pending: userBookings.filter((b) => b.status === "payment_pending").length,
    confirmed:       userBookings.filter((b) => b.status === "confirmed").length,
    rejected:        userBookings.filter((b) => b.status === "rejected").length,
    cancelled:       userBookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">My Bookings</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Track your booth applications and complete your exhibition setup
          </p>
        </div>
        <Link
          href="/dashboard/events"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Book a Booth
        </Link>
      </div>

      {/* Action-required banner */}
      {counts.payment_pending > 0 && (
        <div className="flex items-center gap-4 rounded-xl border border-orange-200 bg-orange-50 px-5 py-4 dark:border-orange-500/30 dark:bg-orange-500/10">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-500/20">
            <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">
              {counts.payment_pending} booking{counts.payment_pending > 1 ? "s" : ""} awaiting payment
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Complete your payment to confirm your exhibition booth.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFilter("payment_pending")}
            className="rounded-lg bg-orange-600 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            View Now
          </button>
        </div>
      )}

      {/* Booking flow stepper */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-5 text-xs font-bold uppercase tracking-widest text-zinc-400">How it works</p>
        <div className="flex items-start">
          {FLOW_STEPS.map((step, i, arr) => (
            <div key={step.label} className="flex flex-1 items-start">
              <div className="flex flex-col items-center text-center">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ring-2 ${step.color}`}>
                  {i + 1}
                </div>
                <p className="mt-2 max-w-[90px] text-xs font-semibold leading-snug text-zinc-700 dark:text-zinc-200">{step.label}</p>
                <p className="mt-1 hidden max-w-[90px] text-[10px] leading-snug text-zinc-400 sm:block">{step.sub}</p>
              </div>
              {i < arr.length - 1 && (
                <div className="mx-2 mt-4 h-px flex-1 border-t-2 border-dashed border-zinc-200 dark:border-zinc-700" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="Total"              value={counts.all}                          color="text-zinc-700 dark:text-zinc-200" />
        <StatCard label="Awaiting Approval"  value={counts.pending}                      color="text-amber-600 dark:text-amber-400" />
        <StatCard label="Payment Due"        value={counts.payment_pending}              color="text-orange-600 dark:text-orange-400" urgent={counts.payment_pending > 0} />
        <StatCard label="Confirmed"          value={counts.confirmed}                    color="text-emerald-600 dark:text-emerald-400" />
        <StatCard label="Rejected/Cancelled" value={counts.rejected + counts.cancelled}  color="text-zinc-400 dark:text-zinc-500" />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => {
          const count = tab.key === "all" ? undefined : counts[tab.key as BookingStatus];
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                filter === tab.key
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {tab.label}
              {count != null && count > 0 && (
                <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  filter === tab.key
                    ? "bg-white/25 text-white"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Booking cards */}
      <div className="space-y-4">
        {filtered.map((booking) => {
          const event = mockEvents.find((e) => e.id === booking.eventId);
          const meta = STATUS_META[booking.status];
          const isPaymentDue = booking.status === "payment_pending";
          const isConfirmed  = booking.status === "confirmed";
          const isRejected   = booking.status === "rejected";
          const isActive     = meta.step >= 0;

          return (
            <div
              key={booking.id}
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-zinc-900 ${
                isPaymentDue ? "border-orange-200 dark:border-orange-500/40" : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {/* Progress strip */}
              {isActive && (
                <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800">
                  <div className={`h-full transition-all ${meta.progressWidth} ${
                    meta.step === 1 ? "bg-amber-400" :
                    meta.step === 2 ? "bg-orange-400" :
                    "bg-emerald-500"
                  }`} />
                </div>
              )}

              <div className="p-5">
                {/* Top row */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                        {event?.title ?? "Unknown Event"}
                      </h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.badge}`}>
                        {meta.label}
                      </span>
                    </div>
                    {event && (
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {event.venue}, {event.city} · {new Date(event.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}–{new Date(event.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{booking.totalPrice}</p>
                    <p className="text-xs text-zinc-400">
                      Submitted {new Date(booking.submittedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    {booking.approvedDate && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        Approved {new Date(booking.approvedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Booth chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Chip>{boothStyleLabels[booking.boothStyle]}</Chip>
                  <Chip>{positionLabels[booking.boothPosition]}</Chip>
                  <Chip>{booking.sqMeters} m²</Chip>
                  <Chip>{booking.hallPreference}</Chip>
                  {booking.specialRequirements && <Chip>Special requirements</Chip>}
                </div>

                {/* Status message */}
                <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                  isPaymentDue ? "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300" :
                  isConfirmed  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" :
                  isRejected   ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300" :
                  "bg-zinc-50 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400"
                }`}>
                  <p className="font-medium">{meta.tagline}</p>
                  {booking.rejectedReason && (
                    <p className="mt-0.5 text-xs opacity-80">Reason: {booking.rejectedReason}</p>
                  )}
                </div>

                {/* CTA: Payment due */}
                {isPaymentDue && (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 21Z" />
                      </svg>
                      Pay {booking.totalPrice} Now
                    </button>
                    <button
                      type="button"
                      className="text-sm text-zinc-400 transition hover:text-red-500 dark:hover:text-red-400"
                    >
                      Cancel booking
                    </button>
                  </div>
                )}

                {/* CTA: Confirmed — exhibition prep links */}
                {isConfirmed && (
                  <div className="mt-4">
                    <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-zinc-400">Get ready for the exhibition</p>
                    <div className="flex flex-wrap gap-2">
                      <PrepLink href="/dashboard/products"   icon="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9">Add Products</PrepLink>
                      <PrepLink href="/dashboard/employees"  icon="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z">Manage Team</PrepLink>
                      <PrepLink href="/dashboard/sponsors"   icon="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z">Sponsorships</PrepLink>
                      <PrepLink href="/dashboard/leads"      icon="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z">View Leads</PrepLink>
                      <PrepLink href="/dashboard/floor-map"  icon="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z">Floor Map</PrepLink>
                    </div>
                  </div>
                )}

                {/* CTA: Rejected */}
                {isRejected && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    <button type="button" className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400">
                      Contact organiser →
                    </button>
                    <Link href="/dashboard/events" className="text-sm font-medium text-zinc-500 transition hover:text-zinc-700 dark:text-zinc-400">
                      Browse other events →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white py-16 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">No bookings found</p>
          <p className="mt-1 text-xs text-zinc-400">
            {filter === "all" ? "Browse events and book a booth to get started." : "No bookings with this status."}
          </p>
          {filter === "all" && (
            <Link
              href="/dashboard/events"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Browse Events
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Helpers ─── */

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
      {children}
    </span>
  );
}

function PrepLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
      </svg>
      {children}
    </Link>
  );
}

function StatCard({ label, value, color, urgent }: { label: string; value: number; color: string; urgent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${
      urgent
        ? "border-orange-200 bg-orange-50 dark:border-orange-500/30 dark:bg-orange-500/10"
        : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
    }`}>
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
