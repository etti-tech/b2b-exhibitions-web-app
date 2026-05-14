"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { mockExhibitorSponsors, mockEvents } from "@/data/mock-data";
import type { ExhibitorSponsor } from "@/data/mock-data";

const tierColors: Record<string, string> = {
  platinum: "bg-zinc-200 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-100",
  gold: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  silver: "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300",
  bronze: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
};

const statusStyles = {
  active:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  pending:  "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

export default function SponsorsPage() {
  const { user } = useAuth();
  const [sponsors, setSponsors] = useState<ExhibitorSponsor[]>(
    mockExhibitorSponsors.filter((s) => s.userId === user?.id),
  );
  const [showAdd, setShowAdd] = useState(false);
  const [newSponsor, setNewSponsor] = useState({ companyName: "", tier: "silver" as ExhibitorSponsor["tier"], amount: "", eventId: "" });

  const allEvents = mockEvents.filter((e) => e.status === "upcoming" || e.status === "live");

  const totalActive  = sponsors.filter((s) => s.status === "active").length;
  const totalPending  = sponsors.filter((s) => s.status === "pending").length;
  const totalRejected = sponsors.filter((s) => s.status === "rejected").length;
  const totalAmount   = sponsors
    .filter((s) => s.status !== "rejected")
    .reduce((sum, s) => sum + parseInt(s.amount.replace(/[^0-9]/g, ""), 10), 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const sponsor: ExhibitorSponsor = {
      id: `SP-${Date.now()}`,
      userId: user?.id ?? "",
      eventId: newSponsor.eventId,
      tier: newSponsor.tier,
      companyName: newSponsor.companyName,
      amount: `$${parseInt(newSponsor.amount, 10).toLocaleString()}`,
      status: "pending",
    };
    setSponsors((prev) => [sponsor, ...prev]);
    setNewSponsor({ companyName: "", tier: "silver", amount: "", eventId: "" });
    setShowAdd(false);
  };

  // Group by event
  const groupedByEvent = sponsors.reduce<Record<string, ExhibitorSponsor[]>>((acc, s) => {
    if (!acc[s.eventId]) acc[s.eventId] = [];
    acc[s.eventId].push(s);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Sponsors</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage sponsors supporting your exhibition booths
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Sponsor
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Sponsors</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalActive}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Awaiting Approval</p>
          <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{totalPending}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Rejected</p>
          <p className="mt-1 text-2xl font-bold text-red-500 dark:text-red-400">{totalRejected}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Sponsorship</p>
          <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">${totalAmount.toLocaleString()}</p>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-500/30 dark:bg-indigo-500/5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">New Sponsor</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Company name"
              value={newSponsor.companyName}
              onChange={(e) => setNewSponsor((prev) => ({ ...prev, companyName: e.target.value }))}
              required
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <select
              value={newSponsor.tier}
              onChange={(e) => setNewSponsor((prev) => ({ ...prev, tier: e.target.value as ExhibitorSponsor["tier"] }))}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </select>
            <input
              type="number"
              placeholder="Amount ($)"
              value={newSponsor.amount}
              onChange={(e) => setNewSponsor((prev) => ({ ...prev, amount: e.target.value }))}
              required
              min={100}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <select
              value={newSponsor.eventId}
              onChange={(e) => setNewSponsor((prev) => ({ ...prev, eventId: e.target.value }))}
              required
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="">Select event</option>
              {allEvents.map((evt) => (
                <option key={evt.id} value={evt.id}>{evt.title}</option>
              ))}
            </select>
          </div>
          <div className="mt-3 flex gap-2">
            <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700">Save</button>
            <button type="button" onClick={() => setShowAdd(false)} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">Cancel</button>
          </div>
        </form>
      )}

      {/* Sponsors grouped by event */}
      <div className="mt-6 space-y-8">
        {Object.entries(groupedByEvent).map(([eventId, eventSponsors]) => {
          const event = mockEvents.find((e) => e.id === eventId);
          return (
            <div key={eventId}>
              <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {event?.title ?? "Unknown Event"}
                <span className="ml-2 text-sm font-normal text-zinc-400">({eventSponsors.length})</span>
              </h2>
              <div className="space-y-3">
                {eventSponsors.map((s) => (
                  <div key={s.id} className={`flex items-start justify-between rounded-2xl border bg-white p-4 dark:bg-zinc-900 ${
                      s.status === "rejected"
                        ? "border-red-200 dark:border-red-500/30"
                        : "border-zinc-200 dark:border-zinc-800"
                    }`}>
                    <div className="flex items-start gap-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${tierColors[s.tier]}`}>{s.tier}</span>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{s.companyName}</p>
                        <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[s.status]}`}>
                          {s.status === "active" ? "Approved" : s.status === "pending" ? "Awaiting Approval" : "Rejected"}
                        </span>
                        {s.status === "rejected" && s.rejectedReason && (
                          <p className="mt-1 text-xs text-red-500 dark:text-red-400">{s.rejectedReason}</p>
                        )}
                      </div>
                    </div>
                    <p className={`text-sm font-bold ${
                      s.status === "rejected"
                        ? "text-zinc-400 line-through dark:text-zinc-600"
                        : "text-indigo-600 dark:text-indigo-400"
                    }`}>{s.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {sponsors.length === 0 && !showAdd && (
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No sponsors yet. Add your first sponsor.</p>
        </div>
      )}
    </div>
  );
}
