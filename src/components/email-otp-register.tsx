"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "./auth-context";
import EventAuthShell from "./event-auth-shell";

export default function EmailOtpRegister() {
  const router = useRouter();
  const { loginWithOtp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = () => {
    if (!name.trim()) {
      setError("Enter your full name.");
      setMessage(null);
      return;
    }

    const normalizedEmail = email.trim();
    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      setMessage(null);
      return;
    }

    setOtpSent(true);
    setError(null);
    setMessage("OTP sent successfully. For this demo, use 123456.");
  };

  const handleVerifyOtp = () => {
    const err = loginWithOtp(email, otp);

    if (err) {
      setError(err);
      setMessage(null);
      return;
    }

    setError(null);
    router.push("/dashboard");
  };

  return (
    <EventAuthShell>
      <div className="mx-auto w-full max-w-md p-8">
        <div className="text-center">
          <h1 className="mt-2 text-xl font-bold text-zinc-600 dark:text-zinc-300">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Get started with Fingoh for free.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label htmlFor="reg-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Full name
            </label>
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              autoComplete="name"
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email address
            </label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          {!otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Send OTP
            </button>
          ) : (
            <>
              <div>
                <label htmlFor="reg-otp" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Enter OTP
                </label>
                <input
                  id="reg-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm tracking-[0.3em] text-zinc-900 placeholder-zinc-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
                />
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Verify &amp; Create Account
              </button>
            </>
          )}

          {message && <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{message}</p>}
          {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </EventAuthShell>
  );
}
