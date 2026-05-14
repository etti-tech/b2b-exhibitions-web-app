"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { mockNetworkingContacts, mockEvents } from "@/data/mock-data";
import type { NetworkingContact } from "@/data/mock-data";

const typeStyles: Record<string, string> = {
  exhibitor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
  visitor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  speaker: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
};

const statusStyles: Record<string, string> = {
  connected: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  declined: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

export default function NetworkingPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<NetworkingContact[]>(
    mockNetworkingContacts.filter((c) => c.userId === user?.id)
  );
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const registeredEvents = mockEvents.filter((e) => e.status !== "draft");
  const filtered = contacts
    .filter((c) => selectedEvent === "all" || c.eventId === selectedEvent)
    .filter((c) => filterType === "all" || c.type === filterType)
    .filter((c) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return c.contactName.toLowerCase().includes(q) || c.contactCompany.toLowerCase().includes(q) || c.contactRole.toLowerCase().includes(q);
    });

  const connected = contacts.filter((c) => c.status === "connected").length;
  const pending = contacts.filter((c) => c.status === "pending").length;

  const handleExportContacts = () => {
    const csv = [
      "Name,Company,Role,Email,Phone,Type,Status,Event",
      ...filtered.map((c) => {
        const evt = mockEvents.find((e) => e.id === c.eventId);
        return `"${c.contactName}","${c.contactCompany}","${c.contactRole}","${c.contactEmail}","${c.contactPhone}","${c.type}","${c.status}","${evt?.title ?? ""}"`;
      }),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "networking-contacts.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConnect = (id: string) => {
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, status: "connected" as const } : c));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Networking</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Your connections — exhibitors, visitors, and speakers you&apos;ve met at events
          </p>
        </div>
        <button type="button" onClick={handleExportContacts} className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Contacts</p>
          <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">{contacts.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Connected</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{connected}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{pending}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          <option value="all">All Events</option>
          {registeredEvents.map((evt) => (<option key={evt.id} value={evt.id}>{evt.title}</option>))}
        </select>
        <div className="flex gap-1">
          {(["all", "exhibitor", "visitor", "speaker"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setFilterType(t)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${filterType === t ? "bg-indigo-600 text-white" : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}{t === "all" ? "" : "s"}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search contacts..."
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm placeholder-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      {/* Contact cards */}
      <div className="mt-6 space-y-3">
        {filtered.map((contact) => {
          const evt = mockEvents.find((e) => e.id === contact.eventId);
          return (
            <div key={contact.id} className="group flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              {/* Avatar */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {contact.avatar}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-50">{contact.contactName}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeStyles[contact.type]}`}>
                    {contact.type}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[contact.status]}`}>
                    {contact.status}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-300">{contact.contactRole} at {contact.contactCompany}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                    {contact.contactEmail}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                    {contact.contactPhone}
                  </span>
                  <span>{evt?.title}</span>
                </div>
                {contact.notes && <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">💬 {contact.notes}</p>}
              </div>

              {/* Action */}
              {contact.status === "pending" && (
                <button type="button" onClick={() => handleConnect(contact.id)} className="shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
          </div>
          <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">No contacts found</p>
          <p className="mt-1 text-xs text-zinc-500">Connect with exhibitors and visitors during trade fairs</p>
        </div>
      )}
    </div>
  );
}
