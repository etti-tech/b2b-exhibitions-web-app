"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { mockVisitorFavorites, mockEvents } from "@/data/mock-data";
import type { VisitorFavorite } from "@/data/mock-data";

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<VisitorFavorite[]>(
    mockVisitorFavorites.filter((f) => f.userId === user?.id)
  );
  const [selectedEvent, setSelectedEvent] = useState("all");

  const registeredEvents = mockEvents.filter((e) => e.status !== "draft");
  const filtered = selectedEvent === "all" ? favorites : favorites.filter((f) => f.eventId === selectedEvent);

  const handleRemove = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Favorites</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Your saved exhibitors and stalls — quick access for your visit
          </p>
        </div>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
        >
          <option value="all">All Events</option>
          {registeredEvents.map((evt) => (
            <option key={evt.id} value={evt.id}>{evt.title}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Favorites</p>
          <p className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">{favorites.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Events</p>
          <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">{new Set(favorites.map((f) => f.eventId)).size}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Industries</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{new Set(favorites.map((f) => f.industry)).size}</p>
        </div>
      </div>

      {/* Favorites grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {filtered.map((fav) => {
          const evt = mockEvents.find((e) => e.id === fav.eventId);
          return (
            <div key={fav.id} className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(fav.id)}
                className="absolute right-3 top-3 rounded-lg p-1 text-zinc-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-500/10"
                aria-label="Remove from favorites"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>

              {/* Heart */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-50">{fav.company}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{fav.exhibitorName}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                  Hall {fav.hall}, Booth {fav.boothNumber}
                </span>
                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                  {fav.industry}
                </span>
              </div>

              {fav.notes && (
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">💬 {fav.notes}</p>
              )}

              <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
                <span>{evt?.title}</span>
                <span>Saved {new Date(fav.savedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
          </div>
          <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">No favorites yet</p>
          <p className="mt-1 text-xs text-zinc-500">Save your must-visit exhibitors from the Floor Map or Smart Match</p>
        </div>
      )}
    </div>
  );
}
