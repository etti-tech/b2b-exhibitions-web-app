"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./auth-context";
import type { UserRole } from "@/data/mock-data";

const roleLabels: Record<UserRole, string> = {
  organiser: "Organiser",
  exhibitor: "Exhibitor",
  visitor: "Visitor",
  sponsor: "Sponsor",
  vendor: "Vendor",
};

type SidebarLink = { href: string; label: string; icon: React.ComponentType<{ active: boolean }>; children?: { href: string; label: string }[] };

const organiserLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/dashboard/events", label: "Events", icon: CalendarIcon },
  {
    href: "/dashboard/company-profile",
    label: "Company Profile",
    icon: BuildingIcon,
    children: [
      { href: "/dashboard/company-profile/business", label: "Business" },
      { href: "/dashboard/company-profile/marketing", label: "Marketing" },
      { href: "/dashboard/company-profile/finance", label: "Finance" },
    ],
  },
  { href: "/dashboard/employees", label: "Employees", icon: UsersIcon },
  { href: "/dashboard/analytics", label: "Analytics", icon: ChartIcon },
  { href: "/dashboard/enquiries", label: "Enquiries", icon: InboxIcon },
  { href: "/dashboard/team", label: "Team", icon: TeamIcon },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
  { href: "/dashboard/profile", label: "Profile", icon: UserIcon },
];

const exhibitorLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/dashboard/events", label: "Events", icon: CalendarIcon },
  {
    href: "/dashboard/company-profile",
    label: "Company Profile",
    icon: BuildingIcon,
    children: [
      { href: "/dashboard/company-profile/business", label: "Business" },
      { href: "/dashboard/company-profile/marketing", label: "Marketing" },
      { href: "/dashboard/company-profile/finance", label: "Finance" },
    ],
  },
  { href: "/dashboard/employees", label: "Employees", icon: UsersIcon },
  { href: "/dashboard/bookings", label: "My Bookings", icon: TicketIcon },
  { href: "/dashboard/products", label: "Products", icon: CubeIcon },
  { href: "/dashboard/leads", label: "Leads", icon: LeadIcon },
  { href: "/dashboard/sponsors", label: "Sponsors", icon: SponsorIcon },
];

const visitorLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/dashboard/events", label: "Events", icon: CalendarIcon },
  {
    href: "/dashboard/company-profile",
    label: "Company Profile",
    icon: BuildingIcon,
    children: [
      { href: "/dashboard/company-profile/business", label: "Business" },
      { href: "/dashboard/company-profile/marketing", label: "Marketing" },
      { href: "/dashboard/company-profile/finance", label: "Finance" },
    ],
  },
  { href: "/dashboard/floor-map", label: "Floor Map", icon: MapIcon },
  { href: "/dashboard/my-badges", label: "My Badges", icon: BadgeIcon },
  { href: "/dashboard/smart-match", label: "Smart Match", icon: SparklesIcon },
  { href: "/dashboard/my-schedule", label: "My Schedule", icon: ClockIcon },
  { href: "/dashboard/favorites", label: "Favorites", icon: HeartIcon },
  { href: "/dashboard/networking", label: "Networking", icon: NetworkIcon },
  { href: "/dashboard/profile", label: "Profile", icon: UserIcon },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

const roleSidebarLinks: Record<UserRole, SidebarLink[]> = {
  organiser: organiserLinks,
  exhibitor: exhibitorLinks,
  visitor: visitorLinks,
  sponsor: organiserLinks,   // fallback for now
  vendor: organiserLinks,    // fallback for now
};

export default function DashboardSidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [flyoutPos, setFlyoutPos] = useState<{ href: string; top: number; left: number } | null>(null);
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    if (typeof window === "undefined") return "dark";
    try {
      const saved = window.localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    return "dark";
  });
  const pathname = usePathname();
  const { user, logout, switchRole } = useAuth();

  const applyTheme = (t: "light" | "dark" | "system") => {
    setTheme(t);
    if (t === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
      try { window.localStorage.removeItem("theme"); } catch {}
    } else {
      document.documentElement.classList.toggle("dark", t === "dark");
      try { window.localStorage.setItem("theme", t); } catch {}
    }
  };

  if (!user) return null;

  // Only collapse on desktop; mobile overlay always shows full sidebar
  const isCollapsed = collapsed && !mobileOpen;

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={`mb-4 mt-4 ${isCollapsed ? "flex justify-center px-2" : "mx-4"}`}>
        {isCollapsed ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white select-none">
            F
          </div>
        ) : (
          <Link href="/" aria-label="Fingoh home">
            <Image src="/logo.png" alt="Fingoh" width={120} height={32} priority className="h-8 w-auto dark:hidden" />
            <Image src="/logo-white.png" alt="Fingoh" width={120} height={32} priority className="hidden h-8 w-auto dark:block" />
          </Link>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 min-h-0 overflow-y-auto space-y-1 px-3">
        {(roleSidebarLinks[user.role] ?? organiserLinks).map((link) => {
          if (link.children) {
            const childActive = link.children.some((child) => pathname.startsWith(child.href));
            const isExpanded = expandedGroups.has(link.href) || childActive;
            return (
              <div key={link.href}>
                <button
                  type="button"
                  onClick={(e) => {
                    if (isCollapsed) {
                      const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                      setFlyoutPos((prev) =>
                        prev?.href === link.href ? null : { href: link.href, top: rect.top, left: rect.right + 8 }
                      );
                    } else {
                      setFlyoutPos(null);
                      setExpandedGroups((prev) => {
                        const next = new Set(prev);
                        if (next.has(link.href)) next.delete(link.href);
                        else next.add(link.href);
                        return next;
                      });
                    }
                  }}
                  title={isCollapsed ? link.label : undefined}
                  className={`flex w-full items-center rounded-lg py-2.5 text-sm font-medium transition ${
                    isCollapsed ? "justify-center px-2" : "gap-3 px-3"
                  } ${
                    childActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  <link.icon active={childActive} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{link.label}</span>
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Expanded inline sub-items (non-collapsed) */}
                {isExpanded && !isCollapsed && (
                  <div className="ml-8 mt-0.5 space-y-0.5">
                    {link.children.map((child) => {
                      const active = pathname === child.href || pathname.startsWith(child.href + "/");
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => { setMobileOpen(false); setUserMenuOpen(false); }}
                          className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition ${
                            active
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                              : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                          }`}
                        >
                          <span className={`mr-2 h-1.5 w-1.5 rounded-full ${active ? "bg-indigo-500" : "bg-zinc-300 dark:bg-zinc-600"}`} />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const active = link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => { setMobileOpen(false); setUserMenuOpen(false); }}
              title={isCollapsed ? link.label : undefined}
              className={`flex items-center rounded-lg py-2.5 text-sm font-medium transition ${
                isCollapsed ? "justify-center px-2" : "gap-3 px-3"
              } ${
                active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <link.icon active={active} />
              {!isCollapsed && link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user menu */}
      <div className="relative border-t border-zinc-200 p-3 dark:border-zinc-800">
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            title={user.name}
            className="flex w-full items-center justify-center rounded-xl py-1.5 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {user.avatar}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-left transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {user.avatar}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">{user.name}</span>
              <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">{user.email}</span>
            </span>
            <ChevronIcon open={userMenuOpen} />
          </button>
        )}

        {userMenuOpen && (
          <div className={`absolute z-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800 ${
            isCollapsed
              ? "bottom-0 left-full ml-2 w-64"
              : "bottom-[calc(100%+0.5rem)] left-3 right-3"
          }`}>
            {/* User info header */}
            <div className="border-b border-zinc-100 px-3 py-3 dark:border-zinc-700/60">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {user.avatar}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">{user.name}</p>
                  <p className="truncate text-xs text-zinc-400">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Role switcher */}
            {user.roles.length > 1 && (
              <div className="border-b border-zinc-100 px-3 py-2.5 dark:border-zinc-700/60">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Switch Role</p>
                <div className="space-y-0.5">
                  {user.roles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        switchRole(role);
                        setUserMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition ${
                        role === user.role
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      }`}
                    >
                      <RoleBadge role={role} />
                      <span className="flex-1">{roleLabels[role]}</span>
                      {role === user.role && (
                        <svg className="h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Theme selector */}
            <div className="border-b border-zinc-100 px-3 py-2.5 dark:border-zinc-700/60">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Appearance</p>
              <div className="flex gap-1">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => applyTheme(t)}
                    className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-1.5 py-1.5 text-[11px] font-semibold transition ${
                      theme === t
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                    }`}
                  >
                    {t === "light" && <ThemeSunIcon active={theme === t} />}
                    {t === "dark" && <ThemeMoonIcon active={theme === t} />}
                    {t === "system" && <ThemeSystemIcon active={theme === t} />}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <Link
              href="/dashboard/profile"
              onClick={() => {
                setUserMenuOpen(false);
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <UserIcon active={false} />
              Edit Profile
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => {
                setUserMenuOpen(false);
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <SettingsIcon active={false} />
              Settings
            </Link>
            <Link
              href="/"
              onClick={() => {
                logout();
                setUserMenuOpen(false);
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <LogoutIcon />
              Logout
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => { setMobileOpen(false); setUserMenuOpen(false); }}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-zinc-200 bg-white transition-transform duration-200 lg:hidden dark:border-zinc-800 dark:bg-zinc-900 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={() => { setMobileOpen(false); setUserMenuOpen(false); }}
          className="absolute right-3 top-4 rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          aria-label="Close menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        {sidebar}
      </aside>

      {/* Desktop sidebar */}
      <aside className={`relative hidden shrink-0 border-r border-zinc-200 bg-white lg:block dark:border-zinc-800 dark:bg-zinc-900 transition-[width] duration-200 ${collapsed ? "w-16" : "w-72"}`}>
        {/* Collapse/expand toggle on the border */}
        <button
          type="button"
          onClick={() => { setCollapsed((prev) => !prev); setFlyoutPos(null); }}
          title={collapsed ? "Expand sidebar" : "Minimize sidebar"}
          className="absolute -right-[16px] top-[20px] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <svg
            className={`h-3 w-3 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 19.5-7.5-7.5 7.5-7.5" />
          </svg>
        </button>
        {sidebar}
      </aside>

      {/* Collapsed sidebar flyout — rendered outside asides to escape overflow clipping */}
      {flyoutPos && collapsed && !mobileOpen && (() => {
        const activeLink = (roleSidebarLinks[user.role] ?? organiserLinks).find(
          (l) => l.children && l.href === flyoutPos.href
        );
        if (!activeLink?.children) return null;
        return (
          <>
            <div
              className="fixed inset-0 z-[60]"
              onClick={() => setFlyoutPos(null)}
            />
            <div
              className="fixed z-[70] min-w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-800"
              style={{ top: flyoutPos.top, left: flyoutPos.left }}
            >
              <div className="border-b border-zinc-100 px-3 py-2.5 dark:border-zinc-700/60">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{activeLink.label}</p>
              </div>
              {activeLink.children.map((child) => {
                const active = pathname === child.href || pathname.startsWith(child.href + "/");
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => {
                      setFlyoutPos(null);
                      setMobileOpen(false);
                      setUserMenuOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      active ? "bg-indigo-500" : "bg-zinc-300 dark:bg-zinc-600"
                    }`} />
                    {child.label}
                  </Link>
                );
              })}
            </div>
          </>
        );
      })()}
    </>
  );
}

/* ─── Small helper components ─── */

const roleColors: Record<UserRole, string> = {
  organiser: "bg-indigo-500",
  exhibitor: "bg-emerald-500",
  visitor: "bg-sky-500",
  sponsor: "bg-amber-500",
  vendor: "bg-violet-500",
};

function RoleBadge({ role }: { role: UserRole }) {
  return <span className={`inline-block h-2 w-2 rounded-full ${roleColors[role]}`} />;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
  );
}

function ChartIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
}

function InboxIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
    </svg>
  );
}

function TeamIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function TicketIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
    </svg>
  );
}

function CubeIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  );
}

function LeadIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
}

function SponsorIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  );
}

function BuildingIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  );
}

function UsersIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  );
}

/* ─── Visitor-specific icons ─── */

function MapIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
    </svg>
  );
}

function BadgeIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
    </svg>
  );
}

function SparklesIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  );
}

function ClockIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
}

function NetworkIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    </svg>
  );
}

function ThemeSunIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-3.5 w-3.5 ${active ? "text-white" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  );
}

function ThemeMoonIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-3.5 w-3.5 ${active ? "text-white" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 8.002-4.248 9.72 9.72 0 0 1-1 0v-1.75Z" />
    </svg>
  );
}

function ThemeSystemIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-3.5 w-3.5 ${active ? "text-white" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
    </svg>
  );
}
