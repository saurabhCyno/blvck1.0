"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "../../actions";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await adminLogin(password);
      if (response.success) {
        router.refresh();
        router.push("/admin/dashboard");
      } else {
        setError(response.error || "Incorrect administrator key.");
      }
    } catch {
      setError("Server communications error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 font-body">
      {/* Return to Store Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 font-display text-xs tracking-widest text-white/50 hover:text-white transition-colors"
      >
        &larr; BACK TO APP
      </Link>

      <div className="w-full max-w-sm border border-white/10 bg-card-dark p-8 md:p-10 space-y-8 shadow-2xl">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <span className="font-display text-xs text-white/45 tracking-widest uppercase block">
            ADMIN SECURITY ACCESS
          </span>
          <h1 className="font-display text-3xl font-black tracking-widest text-white uppercase">
            BLVCK CORE SECURE
          </h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs p-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="admin-password"
              className="block text-xs font-display tracking-widest text-white/50 uppercase"
            >
              ADMINISTRATIVE KEY
            </label>
            <input
              id="admin-password"
              type="password"
              required
              placeholder="••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 px-4 py-3 text-xs text-white focus:outline-hidden focus:border-white transition-colors tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-display font-black text-xs py-4 tracking-widest hover:bg-white/80 transition-all uppercase cursor-pointer"
          >
            {loading ? "AUTHENTICATING..." : "VERIFY AND ENTER"}
          </button>
        </form>
      </div>
    </div>
  );
}
