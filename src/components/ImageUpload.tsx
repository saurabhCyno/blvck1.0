"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploadResult {
  url: string;
  fileId?: string | null;
  filePath?: string | null;
}

interface ImageUploadProps {
  value: string;
  onChange: (result: ImageUploadResult) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange({ url: data.url, fileId: data.fileId });
      } else {
        alert(data.error || "Upload failed.");
      }
    } catch {
      alert("Upload error.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">{label}</label>

      {value ? (
        <div className="relative border border-white/10 bg-black overflow-hidden group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center space-x-2">
            <button
              type="button"
              onClick={() => onChange({ url: "" })}
              className="opacity-0 group-hover:opacity-100 bg-white/10 border border-white/20 p-2 hover:bg-white/20 transition-all"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border border-white/10 bg-black px-4 py-8 text-xs text-white/40 hover:text-white/60 hover:border-white/20 transition-colors disabled:opacity-30 flex flex-col items-center justify-center space-y-2"
        >
          {uploading ? (
            <>
              <div className="h-5 w-5 border border-white/20 border-t-white animate-spin rounded-full" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon className="h-6 w-6" />
              <span className="uppercase tracking-widest font-display">Click to upload {label.toLowerCase()}</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
