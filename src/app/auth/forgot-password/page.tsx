"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/app/actions";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await requestPasswordReset(email);
      if (res.success) {
        setMessage(res.message || "A password reset link has been sent to your email.");
        setEmail("");
      } else {
        setError(res.error || "Failed to request password reset.");
      }
    } catch {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm border border-white/10 p-8">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl font-black tracking-widest text-white">
            BLVCK
          </Link>
          <p className="text-white/45 text-xs mt-2 font-body">Reset your password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 px-3 py-2">{error}</p>
          )}
          {message && (
            <p className="text-xs text-green-400 bg-green-500/5 border border-green-500/20 px-3 py-2">{message}</p>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-white/30"
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-white/20 bg-white/5 py-3 text-xs text-white hover:bg-white/10 transition-colors uppercase tracking-widest font-display font-black disabled:opacity-30"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-[10px] text-white/40 mt-6 font-body">
          Remembered your password?{" "}
          <Link href="/auth/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
