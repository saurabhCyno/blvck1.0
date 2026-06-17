"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen({ label = "LOADING" }: { label?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 border border-white/20 border-t-white animate-spin rounded-full" />
        <p className="font-display text-xs tracking-widest text-white/40 uppercase">{label}</p>
      </div>
    </div>
  );
}
