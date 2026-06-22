"use client";

import { useState, Suspense } from "react";
import { userLogin } from "@/app/actions";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await userLogin({ email, password });
      if (res.success) {
        router.push(redirect);
        router.refresh();
      } else {
        setError(res.error || "Login failed.");
      }
    } catch {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm border border-white/10 p-8">
      <div className="text-center mb-8">
        <Link href="/" className="font-display text-2xl font-black tracking-widest text-white">
          BLVCK CORE
        </Link>
        <p className="text-white/45 text-xs mt-2 font-body">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 px-3 py-2">{error}</p>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-black border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-white/30"
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Password</label>
            <Link
              href={`/auth/forgot-password?redirect=${encodeURIComponent(redirect)}`}
              className="text-[9px] font-display tracking-widest text-white/40 hover:text-white uppercase transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-black border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-white/30"
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-white/20 bg-white/5 py-3 text-xs text-white hover:bg-white/10 transition-colors uppercase tracking-widest font-display font-black disabled:opacity-30"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-[10px] text-white/40 mt-6 font-body">
        Don&apos;t have an account?{" "}
        <Link href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`} className="text-white hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-xs text-white/50 font-display">Loading form...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
