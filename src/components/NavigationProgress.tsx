"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const MAX_VISIBLE_MS = 5000;

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navigating, setNavigating] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stuckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevKey = useRef("");

  const fullKey = pathname + searchParams.toString();

  // Detect navigation completion
  useEffect(() => {
    if (prevKey.current !== fullKey && prevKey.current !== "") {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (stuckTimer.current) clearTimeout(stuckTimer.current);
      hideTimer.current = setTimeout(() => setNavigating(false), 100);
    }
    prevKey.current = fullKey;
  }, [fullKey]);

  // Safety net: auto-hide loader if it's been visible too long
  useEffect(() => {
    if (navigating) {
      stuckTimer.current = setTimeout(() => setNavigating(false), MAX_VISIBLE_MS);
    }
    return () => {
      if (stuckTimer.current) clearTimeout(stuckTimer.current);
    };
  }, [navigating]);

  // Detect navigation start via internal link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href === ""
      )
        return;

      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (stuckTimer.current) clearTimeout(stuckTimer.current);
      setNavigating(true);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!navigating) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 border border-white/20 border-t-white animate-spin rounded-full" />
        <p className="font-display text-xs tracking-widest text-white/40 uppercase">LOADING</p>
      </div>
    </div>
  );
}
