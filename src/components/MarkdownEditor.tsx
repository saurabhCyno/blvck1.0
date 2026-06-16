"use client";

import { useState, useRef, useCallback } from "react";
import { Bold, Italic, Heading1, Heading2, Heading3, Link, ImageIcon, Eye, Edit3 } from "lucide-react";
import Markdown from "./Markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: () => Promise<string | null>;
}

export default function MarkdownEditor({ value, onChange, onImageUpload }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertAtCursor = useCallback((before: string, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const newText = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newText);
  }, [value, onChange]);

  const wrapInline = (char: string) => {
    insertAtCursor(char, char);
    textareaRef.current?.focus();
  };

  const wrapBlock = (prefix: string) => {
    insertAtCursor(prefix, "");
    textareaRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      insertAtCursor("[", `](${url})`);
      textareaRef.current?.focus();
    }
  };

  const insertImage = async () => {
    if (onImageUpload) {
      const url = await onImageUpload();
      if (url) {
        insertAtCursor("![", `](${url})`);
        textareaRef.current?.focus();
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileForImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        insertAtCursor("![", `](${data.url})`);
        textareaRef.current?.focus();
      } else {
        alert(data.error || "Upload failed.");
      }
    } catch {
      alert("Upload error.");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toolbarButtons = [
    { icon: Bold, action: () => wrapInline("**"), label: "Bold" },
    { icon: Italic, action: () => wrapInline("*"), label: "Italic" },
    { type: "divider" as const },
    { icon: Heading1, action: () => wrapBlock("# "), label: "Heading 1" },
    { icon: Heading2, action: () => wrapBlock("## "), label: "Heading 2" },
    { icon: Heading3, action: () => wrapBlock("### "), label: "Heading 3" },
    { type: "divider" as const },
    { icon: Link, action: insertLink, label: "Link" },
    { icon: ImageIcon, action: insertImage, label: "Image" },
  ];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Content</label>
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="flex items-center space-x-1 text-[10px] text-white/40 hover:text-white transition-colors uppercase tracking-widest"
        >
          {preview ? <Edit3 className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          <span>{preview ? "Edit" : "Preview"}</span>
        </button>
      </div>

      {preview ? (
        <div className="border border-white/10 bg-black p-4 min-h-[300px] max-h-[60vh] overflow-y-auto">
          <Markdown content={value} className="max-w-none" />
        </div>
      ) : (
        <div className="border border-white/10 bg-black">
          <div className="flex items-center space-x-1 px-2 py-1.5 border-b border-white/10 bg-white/[0.02]">
            {toolbarButtons.map((btn, idx) =>
              "type" in btn && btn.type === "divider" ? (
                <div key={idx} className="w-px h-5 bg-white/10 mx-1" />
              ) : (
                <button
                  key={btn.label}
                  type="button"
                  onClick={btn.action}
                  title={btn.label}
                  className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <btn.icon className="h-3.5 w-3.5" />
                </button>
              )
            )}
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-black border-0 px-4 py-3 text-xs text-white focus:outline-hidden resize-none font-mono"
            rows={14}
            placeholder="Write your content in markdown..."
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileForImage}
        className="hidden"
      />
    </div>
  );
}
