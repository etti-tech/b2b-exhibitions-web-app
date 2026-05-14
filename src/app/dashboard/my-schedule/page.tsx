"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { mockVisitorSchedule, mockEvents } from "@/data/mock-data";
import type { VisitorScheduleItem } from "@/data/mock-data";

const typeStyles: Record<string, { bg: string; icon: string }> = {
  visit_stall: { bg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300", icon: "🏪" },
  meeting: { bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300", icon: "🤝" },
  seminar: { bg: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300", icon: "🎤" },
  break: { bg: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300", icon: "☕" },
  custom: { bg: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300", icon: "📌" },
};

export default function MySchedulePage() {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState("EVT-001");
  const [schedule, setSchedule] = useState<VisitorScheduleItem[]>(
    mockVisitorSchedule.filter((s) => s.userId === user?.id)
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", type: "visit_stall" as VisitorScheduleItem["type"], location: "", time: "", duration: "30 min", notes: "" });

  const registeredEvents = mockEvents.filter((e) => e.status !== "draft");
  const eventSchedule = schedule.filter((s) => s.eventId === selectedEvent);

  const handleToggle = (id: string) => {
    setSchedule((prev) => prev.map((s) => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const handleAdd = () => {
    if (!newItem.title.trim() || !newItem.time.trim()) return;
    const item: VisitorScheduleItem = {
      id: `VS-${Date.now()}`,
      userId: user?.id ?? "",
      eventId: selectedEvent,
      title: newItem.title,
      type: newItem.type,
      location: newItem.location,
      time: newItem.time,
      duration: newItem.duration,
      notes: newItem.notes || undefined,
      completed: false,
    };
    setSchedule((prev) => [...prev, item]);
    setNewItem({ title: "", type: "visit_stall", location: "", time: "", duration: "30 min", notes: "" });
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    setSchedule((prev) => prev.filter((s) => s.id !== id));
  };

  const completed = eventSchedule.filter((s) => s.completed).length;
  const total = eventSchedule.length;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">My Schedule</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Plan your visit — schedule stall visits, meetings, and seminars
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {registeredEvents.map((evt) => (
              <option key={evt.id} value={evt.id}>{evt.title}</option>
            ))}
          </select>
          <button type="button" onClick={() => setShowAddForm(!showAddForm)} className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Visit Progress</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{completed}/{total} completed</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      {/* Add form */}
      {showAddForm && (
        <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-500/30 dark:bg-indigo-500/10">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Add Schedule Item</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="add-title" className="text-xs font-medium text-zinc-500">Title</label>
              <input id="add-title" type="text" value={newItem.title} onChange={(e) => setNewItem((p) => ({ ...p, title: e.target.value }))} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" placeholder="Visit Nexa Systems booth" />
            </div>
            <div>
              <label htmlFor="add-type" className="text-xs font-medium text-zinc-500">Type</label>
              <select id="add-type" value={newItem.type} onChange={(e) => setNewItem((p) => ({ ...p, type: e.target.value as VisitorScheduleItem["type"] }))} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                <option value="visit_stall">🏪 Visit Stall</option>
                <option value="meeting">🤝 Meeting</option>
                <option value="seminar">🎤 Seminar</option>
                <option value="break">☕ Break</option>
                <option value="custom">📌 Custom</option>
              </select>
            </div>
            <div>
              <label htmlFor="add-location" className="text-xs font-medium text-zinc-500">Location</label>
              <input id="add-location" type="text" value={newItem.location} onChange={(e) => setNewItem((p) => ({ ...p, location: e.target.value }))} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" placeholder="Hall 1, Booth A-12" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="add-time" className="text-xs font-medium text-zinc-500">Time</label>
                <input id="add-time" type="text" value={newItem.time} onChange={(e) => setNewItem((p) => ({ ...p, time: e.target.value }))} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" placeholder="10:00 AM" />
              </div>
              <div className="flex-1">
                <label htmlFor="add-duration" className="text-xs font-medium text-zinc-500">Duration</label>
                <input id="add-duration" type="text" value={newItem.duration} onChange={(e) => setNewItem((p) => ({ ...p, duration: e.target.value }))} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" placeholder="30 min" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="add-notes" className="text-xs font-medium text-zinc-500">Notes (optional)</label>
              <input id="add-notes" type="text" value={newItem.notes} onChange={(e) => setNewItem((p) => ({ ...p, notes: e.target.value }))} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" placeholder="Ask about wholesale pricing" />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={handleAdd} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">Save</button>
            <button type="button" onClick={() => setShowAddForm(false)} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">Cancel</button>
          </div>
        </div>
      )}

      {/* Schedule timeline */}
      <div className="mt-6 space-y-3">
        {eventSchedule.map((item) => {
          const style = typeStyles[item.type] ?? typeStyles.custom;
          return (
            <div key={item.id} className={`group flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 ${item.completed ? "opacity-60" : ""}`}>
              {/* Time column */}
              <div className="flex w-20 shrink-0 flex-col items-center">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{item.time}</p>
                <p className="text-[10px] text-zinc-400">{item.duration}</p>
              </div>

              {/* Checkbox */}
              <button type="button" onClick={() => handleToggle(item.id)} className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${item.completed ? "border-emerald-500 bg-emerald-500" : "border-zinc-300 dark:border-zinc-600"}`}>
                {item.completed && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                )}
              </button>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold text-zinc-900 dark:text-zinc-50 ${item.completed ? "line-through" : ""}`}>{item.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.bg}`}>
                    {style.icon} {item.type.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{item.location}</p>
                {item.notes && <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">💬 {item.notes}</p>}
              </div>

              {/* Delete */}
              <button type="button" onClick={() => handleDelete(item.id)} className="shrink-0 opacity-0 transition group-hover:opacity-100" aria-label="Remove">
                <svg className="h-4 w-4 text-zinc-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
              </button>
            </div>
          );
        })}
      </div>

      {eventSchedule.length === 0 && (
        <div className="mt-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          </div>
          <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">No schedule items yet</p>
          <p className="mt-1 text-xs text-zinc-500">Plan your visit by adding stall visits, meetings, and seminars</p>
        </div>
      )}
    </div>
  );
}
