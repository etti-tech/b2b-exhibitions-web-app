"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { mockEvents, type MockEvent } from "@/data/mock-data";

type EventAuthShellProps = {
  children: React.ReactNode;
};

const EVENT_ID_PATTERN = /^EVT-\d+$/i;

function getEventIdFromPath(pathname: string): string | null {
  const segments = pathname
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);

  const matchedSegment = segments.find((segment) => EVENT_ID_PATTERN.test(segment));
  return matchedSegment ? matchedSegment.toUpperCase() : null;
}

function getEventIdFromQuery(searchParams: URLSearchParams): string | null {
  const candidateKeys = ["eventId", "event", "id"];

  for (const key of candidateKeys) {
    const value = searchParams.get(key);
    if (value && EVENT_ID_PATTERN.test(value.trim())) {
      return value.trim().toUpperCase();
    }
  }

  return null;
}

function formatDateRange(event: MockEvent): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const start = formatter.format(new Date(event.startDate));
  const end = formatter.format(new Date(event.endDate));
  return `${start} - ${end}`;
}

function getEventWebsiteUrl(event: MockEvent): string {
  return `https://sspromachexpo.com?${event.id.toLowerCase()}`;
}

export default function EventAuthShell({ children }: EventAuthShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const event = useMemo(() => {
    const eventIdFromQuery = getEventIdFromQuery(searchParams);
    const eventIdFromPath = pathname ? getEventIdFromPath(pathname) : null;
    const eventId = eventIdFromQuery ?? eventIdFromPath;

    if (!eventId) {
      return null;
    }

    return mockEvents.find((mockEvent) => mockEvent.id.toUpperCase() === eventId) ?? null;
  }, [pathname, searchParams]);

  if (!event) {
    return <div className="py-8">{children}</div>;
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/80 p-3 shadow-xl shadow-zinc-900/5 backdrop-blur-sm dark:border-zinc-700/60 dark:bg-zinc-900/70 dark:shadow-black/20 lg:p-4">
      <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-700/20" />
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-700/20" />

      <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
        <aside className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-slate-900 via-indigo-900 to-sky-900 p-7 text-white shadow-inner dark:border-zinc-700/70 sm:p-8">
          <div>
            <div className="inline-flex rounded-2xl border border-white/20 bg-white/100 px-4 py-3 backdrop-blur">
              <Image
                src="/expo-logo/sspromachexpo.png"
                alt="Expo logo"
                width={520}
                height={160}
                className="h-10 w-auto max-w-[min(58vw,14rem)] object-contain sm:h-12 sm:max-w-[15.5rem]"
                sizes="(max-width: 640px) 58vw, 248px"
                priority
              />
            </div>

            <h2 className="mt-7 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{event.title}</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-100/90 sm:text-base">{event.description}</p>

            <div className="mt-7 space-y-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-white/60">Date</p>
                <p className="mt-1 text-base font-semibold text-white">{formatDateRange(event)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-white/60">Location</p>
                <p className="mt-1 text-base font-semibold text-white">{event.venue}, {event.city}</p>
              </div>
            </div>
          </div>

          <Link
            href={getEventWebsiteUrl(event)}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-indigo-900 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            Visit Event Website
          </Link>
        </aside>

        <div className="lg:flex lg:items-center lg:justify-end">{children}</div>
      </div>
    </section>
  );
}
