"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import EventModal from "@/components/event-modal";
import BoothBookingModal from "@/components/booth-booking-modal";
import type { MockEvent, ExhibitorBooking } from "@/data/mock-data";
import { mockEvents as initialEvents, mockExhibitorBookings, mockVisitorRegistrations } from "@/data/mock-data";

const statusColors: Record<MockEvent["status"], string> = {
  upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  live: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  completed: "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300",
  draft: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
};

const statusDot: Record<MockEvent["status"], string> = {
  upcoming: "bg-blue-500",
  live: "bg-emerald-500 animate-pulse",
  completed: "bg-zinc-400",
  draft: "bg-amber-500",
};

export default function EventsPage() {
  const { user } = useAuth();

  if (user?.role === "exhibitor") return <ExhibitorEvents />;
  if (user?.role === "visitor") return <VisitorEvents />;
  return <OrganiserEvents />;
}

/* ─── Exhibitor Events ─── */

function ExhibitorEvents() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingEventId, setBookingEventId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<ExhibitorBooking[]>(mockExhibitorBookings);
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");

  const userBookings = bookings.filter((b) => b.userId === user?.id);
  const confirmedEventIds = new Set(userBookings.filter((b) => b.status === "confirmed").map((b) => b.eventId));

  const upcomingEvents = initialEvents.filter((e) => e.status === "upcoming" || e.status === "live");
  const completedEvents = initialEvents.filter((e) => e.status === "completed");
  const displayEvents = tab === "upcoming" ? upcomingEvents : completedEvents;

  const handleBookingSubmit = (booking: ExhibitorBooking) => {
    setBookings((prev) => [booking, ...prev]);
    setBookingModalOpen(false);
    setBookingEventId(null);
  };

  const getBookingForEvent = (eventId: string) => userBookings.find((b) => b.eventId === eventId);

  const bookingStatusBadge: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    approved: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    rejected: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
    payment_pending: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
    cancelled: "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300",
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Events</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Browse events and book booths to manage your exhibition presence
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2">
        {(["upcoming", "completed"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
              tab === t
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Event cards */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {displayEvents.map((evt) => {
          const booking = getBookingForEvent(evt.id);
          const isConfirmed = confirmedEventIds.has(evt.id);

          return (
            <div key={evt.id} className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <div className={`relative h-32 bg-gradient-to-br ${evt.image}`}>
                <div className="absolute inset-0 bg-black/10" />
                <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[evt.status]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${statusDot[evt.status]}`} />
                  {evt.status.charAt(0).toUpperCase() + evt.status.slice(1)}
                </span>
                {booking && (
                  <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${bookingStatusBadge[booking.status]}`}>
                    {booking.status.replace("_", " ").charAt(0).toUpperCase() + booking.status.replace("_", " ").slice(1)}
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">{evt.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{evt.description}</p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  {evt.venue}, {evt.city}
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  {new Date(evt.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – {new Date(evt.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  <MetricPill label="Booths" value={evt.booths} />
                  <MetricPill label="Exhibitors" value={evt.exhibitors} />
                  <MetricPill label="Visitors" value={evt.visitors.toLocaleString()} />
                </div>

                <div className="mt-4">
                  {tab === "completed" ? (
                    <button
                      type="button"
                      onClick={() => router.push(`/dashboard/events/${evt.id}`)}
                      className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      View Summary
                    </button>
                  ) : isConfirmed ? (
                    <button
                      type="button"
                      onClick={() => router.push(`/dashboard/events/${evt.id}`)}
                      className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      Enter Event
                    </button>
                  ) : booking ? (
                    <button
                      type="button"
                      onClick={() => router.push("/dashboard/bookings")}
                      className="w-full rounded-lg border border-indigo-300 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-500/30 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
                    >
                      View Booking
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setBookingEventId(evt.id);
                        setBookingModalOpen(true);
                      }}
                      className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    >
                      Book Booth
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {displayEvents.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No events found.</p>
        </div>
      )}

      {bookingEventId && (
        <BoothBookingModal
          open={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setBookingEventId(null);
          }}
          onSubmit={handleBookingSubmit}
          eventId={bookingEventId}
          userId={user?.id ?? ""}
        />
      )}
    </div>
  );
}

/* ─── Visitor Events ─── */

function VisitorEvents() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"upcoming" | "registered" | "completed">("upcoming");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const registrations = mockVisitorRegistrations.filter((r) => r.userId === user?.id);
  const registeredEventIds = new Set(registrations.map((r) => r.eventId));

  const upcomingEvents = initialEvents.filter((e) => (e.status === "upcoming" || e.status === "live") && !registeredEventIds.has(e.id));
  const registeredEvents = initialEvents.filter((e) => registeredEventIds.has(e.id) && e.status !== "completed");
  const completedEvents = initialEvents.filter((e) => registeredEventIds.has(e.id) && e.status === "completed");

  const displayEvents = tab === "upcoming" ? upcomingEvents : tab === "registered" ? registeredEvents : completedEvents;

  const registrationStatusBadge: Record<string, string> = {
    registered: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    checked_in: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  };

  const handleShareLink = (eventId: string) => {
    const url = `${window.location.origin}/dashboard/events/${eventId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(eventId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegister = (eventId: string) => {
    mockVisitorRegistrations.push({
      id: `VR-${Date.now()}`,
      userId: user?.id ?? "",
      eventId,
      status: "registered",
      registeredDate: new Date().toISOString().split("T")[0],
      ticketType: "general",
      badgeDownloaded: false,
      qrCode: `QR-${eventId}-${user?.id}`,
    });
    router.push("/dashboard/my-badges");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Events</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Discover trade fairs, plan your visit, and connect with exhibitors
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2">
        {(["upcoming", "registered", "completed"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
              tab === t
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {t === "registered" ? "My Events" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Event cards */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {displayEvents.map((evt) => {
          const reg = registrations.find((r) => r.eventId === evt.id);
          return (
            <div key={evt.id} className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <div className={`relative h-32 bg-gradient-to-br ${evt.image}`}>
                <div className="absolute inset-0 bg-black/10" />
                <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[evt.status]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${statusDot[evt.status]}`} />
                  {evt.status.charAt(0).toUpperCase() + evt.status.slice(1)}
                </span>
                {reg && (
                  <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${registrationStatusBadge[reg.status]}`}>
                    {reg.status.replace("_", " ").charAt(0).toUpperCase() + reg.status.replace("_", " ").slice(1)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleShareLink(evt.id); }}
                  className="absolute bottom-3 right-3 rounded-lg bg-white/90 p-1.5 text-zinc-700 shadow-sm opacity-0 transition hover:bg-white group-hover:opacity-100"
                  aria-label="Copy event link"
                >
                  {copiedId === evt.id ? (
                    <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                  )}
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">{evt.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{evt.description}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                  {evt.venue}, {evt.city}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                  {new Date(evt.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – {new Date(evt.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  <MetricPill label="Exhibitors" value={evt.exhibitors} />
                  <MetricPill label="Visitors" value={evt.visitors.toLocaleString()} />
                  <MetricPill label="Booths" value={evt.booths} />
                </div>

                <div className="mt-4">
                  {reg ? (
                    <div className="flex gap-2">
                      <button type="button" onClick={() => router.push(`/dashboard/events/${evt.id}`)} className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                        Explore Event
                      </button>
                      <button type="button" onClick={() => router.push("/dashboard/my-badges")} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800" title="View e-badge">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => handleRegister(evt.id)} className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                      Register for Event
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {displayEvents.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {tab === "upcoming" ? "No new events to discover. Check back soon!" : tab === "registered" ? "You haven't registered for any upcoming events yet." : "No completed events yet."}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Organiser Events ─── */

function OrganiserEvents() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<MockEvent[]>(initialEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<MockEvent | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState<MockEvent["status"] | "all">("all");

  const filtered = filter === "all" ? events : events.filter((e) => e.status === filter);

  const handleSave = (saved: MockEvent) => {
    setEvents((prev) => {
      const idx = prev.findIndex((e) => e.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    setModalOpen(false);
    setEditingEvent(null);
  };

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Events</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Manage your trade fairs and exhibitions</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditingEvent(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Event
        </button>
      </div>

      {/* Filter tabs */}
      <div className="mt-6 flex gap-2 overflow-x-auto">
        {(["all", "live", "upcoming", "draft", "completed"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
              filter === tab
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Event cards grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((evt) => (
          <div key={evt.id} className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div className={`relative h-32 bg-gradient-to-br ${evt.image}`}>
              <div className="absolute inset-0 bg-black/10" />
              <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[evt.status]}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusDot[evt.status]}`} />
                {evt.status.charAt(0).toUpperCase() + evt.status.slice(1)}
              </span>
              <div className="absolute right-3 top-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => { setEditingEvent(evt); setModalOpen(true); }}
                  className="rounded-lg bg-white/90 p-1.5 text-zinc-700 shadow-sm transition hover:bg-white"
                  aria-label="Edit event"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(evt.id)}
                  className="rounded-lg bg-white/90 p-1.5 text-red-600 shadow-sm transition hover:bg-white"
                  aria-label="Delete event"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="cursor-pointer p-4" onClick={() => router.push(`/dashboard/events/${evt.id}`)}>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">{evt.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{evt.description}</p>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {evt.venue}, {evt.city}
              </div>

              <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                {new Date(evt.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – {new Date(evt.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <MetricPill label="Booths" value={evt.booths} />
                <MetricPill label="Exhibitors" value={evt.exhibitors} />
                <MetricPill label="Visitors" value={evt.visitors.toLocaleString()} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No events found for this filter.</p>
        </div>
      )}

      <EventModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingEvent(null); }}
        onSave={handleSave}
        event={editingEvent}
      />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-50">Delete Event</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Are you sure? This action cannot be undone.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{value}</p>
      <p className="text-xs text-zinc-400">{label}</p>
    </div>
  );
}
