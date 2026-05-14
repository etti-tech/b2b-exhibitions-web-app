"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/components/auth-context";
import { mockStallKeywords, mockVisitorInterests, mockEvents } from "@/data/mock-data";
import type { VisitorInterest, StallKeyword } from "@/data/mock-data";

const categoryStyles: Record<string, string> = {
  product: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  technology: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  industry: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  job: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  service: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
};

const categoryIcons: Record<string, string> = {
  product: "🏷️",
  technology: "💻",
  industry: "🏭",
  job: "💼",
  service: "🤝",
};

function computeMatchScore(stall: StallKeyword, interests: VisitorInterest[], searchTerms: string[]): number {
  let score = 0;
  const stallText = [...stall.keywords, stall.category, stall.description, stall.company].join(" ").toLowerCase();

  for (const interest of interests) {
    const keyword = interest.keyword.toLowerCase();
    if (stallText.includes(keyword)) score += 3;
    // partial match
    const words = keyword.split(" ");
    for (const w of words) {
      if (w.length > 2 && stallText.includes(w)) score += 1;
    }
  }

  for (const term of searchTerms) {
    const lower = term.toLowerCase();
    if (lower.length < 2) continue;
    if (stallText.includes(lower)) score += 2;
    // Check individual stall keywords
    for (const kw of stall.keywords) {
      if (kw.toLowerCase().includes(lower)) score += 1;
    }
  }

  return score;
}

export default function SmartMatchPage() {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState("EVT-001");
  const [interests, setInterests] = useState<VisitorInterest[]>(
    mockVisitorInterests.filter((i) => i.userId === user?.id)
  );
  const [newKeyword, setNewKeyword] = useState("");
  const [newCategory, setNewCategory] = useState<VisitorInterest["category"]>("technology");
  const [searchQuery, setSearchQuery] = useState("");

  const registeredEvents = mockEvents.filter((e) => e.status !== "draft");
  const stallsForEvent = mockStallKeywords.filter((s) => s.eventId === selectedEvent);

  const searchTerms = searchQuery.split(",").map((t) => t.trim()).filter(Boolean);

  const matchedStalls = useMemo(() => {
    if (interests.length === 0 && searchTerms.length === 0) return [];
    return stallsForEvent
      .map((stall) => ({
        ...stall,
        matchScore: computeMatchScore(stall, interests, searchTerms),
      }))
      .filter((s) => s.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [stallsForEvent, interests, searchTerms]);

  const handleAddInterest = () => {
    if (!newKeyword.trim()) return;
    const interest: VisitorInterest = {
      id: `VI-${Date.now()}`,
      userId: user?.id ?? "",
      keyword: newKeyword.trim(),
      category: newCategory,
    };
    setInterests((prev) => [...prev, interest]);
    setNewKeyword("");
  };

  const handleRemoveInterest = (id: string) => {
    setInterests((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            <span className="mr-2">✨</span>Smart Match
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Tell us what you&apos;re looking for — we&apos;ll suggest the best stalls to save your time
          </p>
        </div>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
        >
          {registeredEvents.map((evt) => (
            <option key={evt.id} value={evt.id}>{evt.title}</option>
          ))}
        </select>
      </div>

      {/* What are you looking for? */}
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">What are you looking for?</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Add your interests — product names, technologies, job roles, industries, or services you need
        </p>

        {/* Add interest form */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="keyword" className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Keyword</label>
            <input
              id="keyword"
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddInterest()}
              placeholder='e.g. "IoT sensors", "warehouse robots", "robotics engineer"'
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <div>
            <label htmlFor="category" className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Category</label>
            <select
              id="category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as VisitorInterest["category"])}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="product">🏷️ Product</option>
              <option value="technology">💻 Technology</option>
              <option value="industry">🏭 Industry</option>
              <option value="job">💼 Job / Role</option>
              <option value="service">🤝 Service</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleAddInterest}
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add
          </button>
        </div>

        {/* Quick search */}
        <div className="mt-4">
          <label htmlFor="search" className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Quick Search (comma-separated)</label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='e.g. "AI, robotics, energy"'
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Current interests */}
        {interests.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Your Interests</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {interests.map((i) => (
                <span key={i.id} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${categoryStyles[i.category]}`}>
                  {categoryIcons[i.category]} {i.keyword}
                  <button type="button" onClick={() => handleRemoveInterest(i.id)} className="ml-1 opacity-60 hover:opacity-100" aria-label="Remove">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {matchedStalls.length > 0 ? `${matchedStalls.length} Stalls Matched` : "Suggested Stalls"}
          </h2>
          {matchedStalls.length > 0 && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Sorted by relevance</span>
          )}
        </div>

        {matchedStalls.length > 0 ? (
          <div className="mt-4 space-y-3">
            {matchedStalls.map((stall, index) => (
              <div
                key={`${stall.eventId}-${stall.boothNumber}`}
                className="group overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white shadow ${
                      index === 0 ? "bg-gradient-to-br from-amber-500 to-orange-600" :
                      index === 1 ? "bg-gradient-to-br from-indigo-500 to-purple-600" :
                      index === 2 ? "bg-gradient-to-br from-emerald-500 to-teal-600" :
                      "bg-gradient-to-br from-zinc-500 to-zinc-600"
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-50">{stall.company}</h3>
                      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                        {stall.exhibitorName} · Hall {stall.hall}, Booth {stall.boothNumber}
                      </p>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{stall.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                      {stall.matchScore} pts
                    </span>
                    <span className="text-xs text-zinc-400">{stall.category}</span>
                  </div>
                </div>

                {/* Keywords */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {stall.keywords.map((kw) => {
                    const isMatched = interests.some((i) => kw.toLowerCase().includes(i.keyword.toLowerCase()) || i.keyword.toLowerCase().includes(kw.toLowerCase()))
                      || searchTerms.some((t) => kw.toLowerCase().includes(t.toLowerCase()));
                    return (
                      <span
                        key={kw}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          isMatched
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {isMatched && "✓ "}{kw}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10">
              <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">Add your interests or search keywords</p>
            <p className="mt-1 text-xs text-zinc-500">We&apos;ll match you with the most relevant stalls and exhibitors</p>
          </div>
        )}
      </div>
    </div>
  );
}
