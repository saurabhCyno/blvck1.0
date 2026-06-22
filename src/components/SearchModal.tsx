"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (!open) {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/shop?search=${encodeURIComponent(q)}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl mx-4 bg-zinc-950 border border-white/10 shadow-2xl animate-fadeIn">
        <form onSubmit={handleSubmit} className="flex items-stretch">
          <div className="flex-1 flex items-center">
            <Search className="h-5 w-5 text-white/30 ml-5 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH APPAREL, CATEGORIES, FABRICS..."
              className="w-full bg-transparent text-white font-display text-sm tracking-widest px-4 py-5 outline-none placeholder:text-white/20"
            />
          </div>
          <button
            type="submit"
            className="px-6 bg-white text-black font-display text-xs font-black tracking-widest hover:bg-white/80 transition-colors uppercase"
          >
            Search
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 text-white/40 hover:text-white transition-colors flex items-center"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
