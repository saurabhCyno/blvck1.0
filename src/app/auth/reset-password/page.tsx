"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword, validateResetToken } from "@/app/actions";
import Link from "next/link";

function ResetPasswordFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    if (!token) {
      setValidating(false);
      return;
    }
    const checkToken = async () => {
      try {
        const res = await validateResetToken(token);
        if (!res.success) {
          setTokenError(res.error || "Invalid or expired reset token.");
        }
      } catch {
        setTokenError("Failed to validate reset token.");
      } finally {
        setValidating(false);
      }
    };
    checkToken();
  }, [token]);

  if (validating) {
    return <div className="text-center text-xs text-white/50">Validating reset token...</div>;
  }

  if (!token || tokenError) {
    return (
      <div className="text-center">
        <p className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 px-3 py-2 mb-6">
          {tokenError || "Missing or invalid reset token. Please request a new link."}
        </p>
        <Link href="/auth/forgot-password" className="text-xs text-white hover:underline uppercase tracking-widest font-display">
          Back to Forgot Password
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(token, password);
      if (res.success) {
        setMessage("Password has been reset successfully. Redirecting to login...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        setError(res.error || "Failed to reset password.");
      }
    } catch {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 px-3 py-2">{error}</p>
      )}
      {message && (
        <p className="text-xs text-green-400 bg-green-500/5 border border-green-500/20 px-3 py-2">{message}</p>
      )}

      <div className="space-y-1.5">
        <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-black border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-white/30"
          placeholder="Min. 6 characters"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-black border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-white/30"
          placeholder="Confirm new password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full border border-white/20 bg-white/5 py-3 text-xs text-white hover:bg-white/10 transition-colors uppercase tracking-widest font-display font-black disabled:opacity-30"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm border border-white/10 p-8">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl font-black tracking-widest text-white">
            BLVCK
          </Link>
          <p className="text-white/45 text-xs mt-2 font-body">Set your new password</p>
        </div>

        <Suspense fallback={<div className="text-center text-xs text-white/50">Loading reset form...</div>}>
          <ResetPasswordFormContent />
        </Suspense>

        <p className="text-center text-[10px] text-white/40 mt-6 font-body">
          Return to{" "}
          <Link href="/auth/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
