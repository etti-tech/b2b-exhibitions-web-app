"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { mockVisitorRegistrations, mockEvents } from "@/data/mock-data";

const ticketTypeStyles: Record<string, string> = {
  general: "bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
  business: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  vip: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
};

const statusColors: Record<string, string> = {
  registered: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  checked_in: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

export default function MyBadgesPage() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState(
    mockVisitorRegistrations.filter((r) => r.userId === user?.id)
  );

  const handleDownload = (regId: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === regId ? { ...r, badgeDownloaded: true } : r))
    );
    // Mock download – in production this would generate a PDF
    const badge = registrations.find((r) => r.id === regId);
    if (badge) {
      const evt = mockEvents.find((e) => e.id === badge.eventId);
      const content = `E-Badge\n\n${user?.name}\n${user?.company ?? ""}\n\nEvent: ${evt?.title}\nVenue: ${evt?.venue}, ${evt?.city}\nDates: ${evt?.startDate} - ${evt?.endDate}\nTicket: ${badge.ticketType.toUpperCase()}\nQR: ${badge.qrCode}\n\nShow this badge at the entrance.`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `badge-${badge.qrCode}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">My E-Badges</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Download your e-badges with QR codes to show at the event entrance
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Badges</p>
          <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">{registrations.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Downloaded</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{registrations.filter((r) => r.badgeDownloaded).length}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Pending Download</p>
          <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{registrations.filter((r) => !r.badgeDownloaded).length}</p>
        </div>
      </div>

      {/* Badge cards */}
      <div className="mt-8 space-y-4">
        {registrations.map((reg) => {
          const evt = mockEvents.find((e) => e.id === reg.eventId);
          if (!evt) return null;

          return (
            <div key={reg.id} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-col sm:flex-row">
                {/* Badge visual */}
                <div className={`flex w-full flex-col items-center justify-center bg-gradient-to-br ${evt.image} p-6 text-white sm:w-64`}>
                  {/* QR code placeholder */}
                  <div className="flex h-28 w-28 items-center justify-center rounded-xl border-4 border-white/30 bg-white/20 backdrop-blur-sm">
                    <div className="grid grid-cols-5 gap-0.5">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className={`h-4 w-4 rounded-sm ${Math.random() > 0.4 ? "bg-white" : "bg-transparent"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-medium opacity-80">{reg.qrCode}</p>
                  <p className="mt-1 text-sm font-bold">{user?.name}</p>
                  <span className={`mt-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${ticketTypeStyles[reg.ticketType]}`}>
                    {reg.ticketType.toUpperCase()}
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{evt.title}</h3>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{evt.venue}, {evt.city}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[reg.status]}`}>
                        {reg.status.replace("_", " ").charAt(0).toUpperCase() + reg.status.replace("_", " ").slice(1)}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-zinc-500 dark:text-zinc-400">Event Dates</p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">
                          {new Date(evt.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – {new Date(evt.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-500 dark:text-zinc-400">Registered On</p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">
                          {new Date(reg.registeredDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(reg.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      {reg.badgeDownloaded ? "Re-download Badge" : "Download E-Badge"}
                    </button>
                    {reg.badgeDownloaded && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        Downloaded
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {registrations.length === 0 && (
        <div className="mt-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">No badges yet</p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">Register for an event to get your e-badge</p>
        </div>
      )}
    </div>
  );
}
