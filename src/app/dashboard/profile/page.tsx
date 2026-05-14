"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-context";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [company, setCompany] = useState(user?.company ?? "");
  const [saved, setSaved] = useState(false);

  // Password change
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSaved, setPwSaved] = useState(false);

  // 2FA
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, company || undefined);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    if (currentPw !== user.password) {
      setPwError("Current password is incorrect");
      return;
    }
    if (newPw.length < 5) {
      setPwError("New password must be at least 5 characters");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("Passwords do not match");
      return;
    }
    // Mock update – in real app this would call an API
    updateProfile(user.name, user.company);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2000);
  };

  const handleEnable2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    if (otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
      setOtpError("Enter a valid 6-digit code");
      return;
    }
    // Mock verification – accept any 6-digit code
    setTwoFAEnabled(true);
    setShowSetup(false);
    setOtpCode("");
  };

  const handleDisable2FA = () => {
    setTwoFAEnabled(false);
    setShowSetup(false);
    setOtpCode("");
    setOtpError(null);
  };

  const inputCls =
    "mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Edit Profile</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Update your personal information.</p>
      </div>

      {/* ─── Personal Info ─── */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Personal Information</h2>
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
              {user.avatar}
            </span>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{user.name}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">{user.role}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
            <input disabled value={user.email} className={inputCls + " opacity-60"} />
            <p className="mt-1 text-xs text-zinc-400">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Company</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company name" className={inputCls} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Role</label>
            <input disabled value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} className={inputCls + " opacity-60 capitalize"} />
            <p className="mt-1 text-xs text-zinc-400">Switch roles via the sidebar.</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Save Changes
            </button>
            {saved && (
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Profile updated!
              </span>
            )}
          </div>
        </form>
      </section>

      {/* ─── Change Password ─── */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Change Password</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Update your password to keep your account secure.
        </p>
        <form onSubmit={handlePasswordChange} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Current Password</label>
            <input
              type="password"
              required
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">New Password</label>
            <input
              type="password"
              required
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              className={inputCls}
            />
          </div>

          {pwError && (
            <p className="text-sm font-medium text-red-600 dark:text-red-400">{pwError}</p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Update Password
            </button>
            {pwSaved && (
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Password changed!
              </span>
            )}
          </div>
        </form>
      </section>

      {/* ─── Two-Factor Authentication ─── */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Two-Factor Authentication</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Add an extra layer of security using an authenticator app.
            </p>
          </div>
          {twoFAEnabled && (
            <span className="mt-0.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Enabled
            </span>
          )}
        </div>

        {!twoFAEnabled && !showSetup && (
          <button
            type="button"
            onClick={() => setShowSetup(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            Enable 2FA
          </button>
        )}

        {showSetup && !twoFAEnabled && (
          <div className="mt-5">
            {/* Setup steps */}
            <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Setup Instructions</p>
              <ol className="mt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">1</span>
                  Install an authenticator app (Google Authenticator, Authy, or Microsoft Authenticator)
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">2</span>
                  Scan the QR code below with your authenticator app
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">3</span>
                  Enter the 6-digit code from the app to verify
                </li>
              </ol>
            </div>

            {/* Mock QR code */}
            <div className="mt-4 flex flex-col items-center gap-3">
              <div className="flex h-40 w-40 items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                  </svg>
                  <p className="mt-1 text-xs text-zinc-400">QR Code</p>
                </div>
              </div>
              <div className="w-full max-w-xs">
                <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                  Or enter this key manually:
                </p>
                <div className="mt-1 rounded-lg bg-zinc-100 px-3 py-2 text-center font-mono text-xs font-medium tracking-widest text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  ETTI-EXPO-{user.id}-2FA-MOCK
                </div>
              </div>
            </div>

            {/* OTP verification form */}
            <form onSubmit={handleEnable2FA} className="mt-5">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Verification Code
              </label>
              <div className="mt-1 flex gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className={inputCls + " max-w-[140px] text-center font-mono tracking-[0.3em]"}
                />
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Verify &amp; Enable
                </button>
              </div>
              {otpError && (
                <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">{otpError}</p>
              )}
              <button
                type="button"
                onClick={() => { setShowSetup(false); setOtpCode(""); setOtpError(null); }}
                className="mt-3 text-sm font-medium text-zinc-500 transition hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                Cancel setup
              </button>
            </form>
          </div>
        )}

        {twoFAEnabled && (
          <div className="mt-5">
            <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
              <svg className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                  Two-factor authentication is active
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Your account is protected with an authenticator app.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDisable2FA}
              className="mt-3 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              Disable 2FA
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
