"use client";

import { useState, Suspense } from "react";
import { userSignup } from "@/app/actions";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await userSignup(form);
      if (res.success) {
        router.push(redirect);
        router.refresh();
      } else {
        setError(res.error || "Signup failed.");
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
        <p className="text-white/45 text-xs mt-2 font-body">Create your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 px-3 py-2">{error}</p>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full bg-black border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-white/30"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full bg-black border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-white/30"
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            className="w-full bg-black border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-white/30"
            placeholder="+91 98765 43210"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
            className="w-full bg-black border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-white/30"
            placeholder="Min. 6 characters"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-white/20 bg-white/5 py-3 text-xs text-white hover:bg-white/10 transition-colors uppercase tracking-widest font-display font-black disabled:opacity-30"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-[10px] text-white/40 mt-6 font-body">
        Already have an account?{" "}
        <Link href={`/auth/login?redirect=${encodeURIComponent(redirect)}`} className="text-white hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-xs text-white/50 font-display">Loading form...</div>}>
        <SignupFormContent />
      </Suspense>
    </div>
  );
}
