"use client";

import { useState } from "react";

const mockBusiness = {
  name: "Fingoh Technologies Pvt. Ltd.",
  legalName: "Fingoh Technologies Private Limited",
  registrationNumber: "U72900MH2018PTC123456",
  gstNumber: "27AABCI1234F1Z5",
  founded: "2018",
  employees: "120–150",
  industry: "Technology & Software",
  subIndustry: "B2B SaaS / Enterprise Software",
  website: "https://fingoh.ai",
  headquarters: "Mumbai, Maharashtra, India",
  description:
    "Fingoh Technologies is a fast-growing B2B software company specialising in exhibition management, event-tech, and visitor engagement platforms. We help organisers and exhibitors maximise ROI through data-driven tools.",
  certifications: ["ISO 9001:2015", "ISO 27001:2013", "NASSCOM Member"],
  offices: [
    { city: "Mumbai", type: "Headquarters", address: "Level 4, Bandra Kurla Complex, Mumbai 400051" },
    { city: "Bengaluru", type: "R&D Centre", address: "Tower B, Manyata Tech Park, Bengaluru 560045" },
    { city: "Delhi NCR", type: "Sales Office", address: "Cyber Hub, DLF Phase 2, Gurugram 122002" },
  ],
  keyContacts: [
    { name: "Arjun Mehta", title: "Chief Executive Officer", email: "arjun.mehta@etti.tech" },
    { name: "Priya Sharma", title: "Chief Operating Officer", email: "priya.sharma@etti.tech" },
    { name: "Rahul Gupta", title: "VP — Sales & Partnerships", email: "rahul.gupta@etti.tech" },
  ],
  stats: [
    { label: "Years in Business", value: "7" },
    { label: "Active Clients", value: "340+" },
    { label: "Events Managed", value: "1,200+" },
    { label: "Team Members", value: "138" },
  ],
};

export default function BusinessProfilePage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(mockBusiness.name);
  const [description, setDescription] = useState(mockBusiness.description);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Business Profile</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Core company information, registration details, and key contacts
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {editing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {mockBusiness.stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Company overview */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">Company Overview</h2>
            <div className="space-y-4">
              <Field label="Company Name" value={name} editing={editing} onChange={setName} />
              <Field label="Legal Name" value={mockBusiness.legalName} editing={false} />
              <Field label="Registration No." value={mockBusiness.registrationNumber} editing={false} />
              <Field label="GST Number" value={mockBusiness.gstNumber} editing={false} />
              <Field label="Year Founded" value={mockBusiness.founded} editing={false} />
              <Field label="Employees" value={mockBusiness.employees} editing={false} />
              <Field label="Industry" value={mockBusiness.industry} editing={false} />
              <Field label="Sub-Industry" value={mockBusiness.subIndustry} editing={false} />
              <Field label="Headquarters" value={mockBusiness.headquarters} editing={false} />
              <Field label="Website" value={mockBusiness.website} editing={false} />
            </div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">About</h2>
            {editing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            ) : (
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
            )}
          </section>

          {/* Offices */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">Office Locations</h2>
            <div className="space-y-3">
              {mockBusiness.offices.map((o) => (
                <div key={o.city} className="flex items-start gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
                  <span className="mt-0.5 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                    {o.type}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{o.city}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{o.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Certifications */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">Certifications</h2>
            <div className="space-y-2">
              {mockBusiness.certifications.map((c) => (
                <div key={c} className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{c}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Key contacts */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">Key Contacts</h2>
            <div className="space-y-4">
              {mockBusiness.keyContacts.map((c) => (
                <div key={c.email} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{c.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{c.title}</p>
                    <p className="mt-0.5 text-xs text-indigo-600 dark:text-indigo-400">{c.email}</p>
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

function Field({
  label,
  value,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
      <span className="w-40 shrink-0 text-xs font-semibold text-zinc-500 dark:text-zinc-400">{label}</span>
      {editing && onChange ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
        />
      ) : (
        <span className="text-sm text-zinc-900 dark:text-zinc-100">{value}</span>
      )}
    </div>
  );
}
