"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("Fingoh Technologies");
  const [website, setWebsite] = useState("https://fingoh.com");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [currency, setCurrency] = useState("USD");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls =
    "mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20";

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Settings</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Organisation and platform settings
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-8">
        {/* Organisation */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Organisation</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Basic details about your organisation</p>
          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Organisation Name</label>
              <input value={orgName} onChange={(e) => setOrgName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Website</label>
              <input value={website} onChange={(e) => setWebsite(e.target.value)} className={inputCls} />
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Preferences</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Configure defaults for your events</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Timezone</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={inputCls}>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                <option value="America/New_York">America/New York (EST)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                <option value="America/Chicago">America/Chicago (CST)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputCls}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="INR">INR (₹)</option>
                <option value="SGD">SGD (S$)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications placeholder */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Notifications</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Manage email and in-app notification preferences</p>
          <div className="mt-5 space-y-3">
            <ToggleRow label="Email alerts for new enquiries" defaultOn />
            <ToggleRow label="Weekly analytics digest" defaultOn />
            <ToggleRow label="Event status change alerts" defaultOn={false} />
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Save Settings
          </button>
          {saved && (
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Settings saved!</span>
          )}
        </div>
      </form>
    </div>
  );
}

function ToggleRow({ label, defaultOn }: { label: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
      <button
        type="button"
        onClick={() => setOn(!on)}
        className={`relative inline-flex h-6 w-10 shrink-0 rounded-full transition-colors ${
          on ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-600"
        }`}
        role="switch"
        aria-checked={on}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition-transform ${
            on ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
