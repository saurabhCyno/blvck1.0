import React from "react";

interface MarkdownProps {
  content: string;
  className?: string;
}

export default function Markdown({ content, className = "" }: MarkdownProps) {
  if (!content) return null;

  // Simple, regex-based, high-performance client-side markdown parser
  // Handles headers, lists, paragraphs, line breaks, bold text
  const parseMarkdown = (text: string) => {
    const lines = text.split("\n");
    let inList = false;
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      let currentLine = line.trim();

      // Heading 3
      if (currentLine.startsWith("### ")) {
        if (inList) {
          inList = false;
        }
        elements.push(
          <h4 key={`h3-${index}`} className="font-display text-sm tracking-widest text-white mt-4 mb-2">
            {replaceBold(currentLine.slice(4))}
          </h4>
        );
        return;
      }

      // Heading 2
      if (currentLine.startsWith("## ")) {
        if (inList) {
          inList = false;
        }
        elements.push(
          <h3 key={`h2-${index}`} className="font-display text-base tracking-widest text-white mt-6 mb-3">
            {replaceBold(currentLine.slice(3))}
          </h3>
        );
        return;
      }

      // Heading 1
      if (currentLine.startsWith("# ")) {
        if (inList) {
          inList = false;
        }
        elements.push(
          <h2 key={`h1-${index}`} className="font-display text-lg tracking-widest text-white mt-8 mb-4">
            {replaceBold(currentLine.slice(2))}
          </h2>
        );
        return;
      }

      // Unordered list item
      if (currentLine.startsWith("- ") || currentLine.startsWith("* ")) {
        const itemContent = currentLine.slice(2);
        if (!inList) {
          inList = true;
        }
        elements.push(
          <li key={`li-${index}`} className="ml-4 list-disc text-white/70 text-xs leading-relaxed mb-1">
            {replaceBold(itemContent)}
          </li>
        );
        return;
      }

      // Empty line
      if (currentLine === "") {
        if (inList) {
          inList = false;
        }
        elements.push(<div key={`br-${index}`} className="h-4" />);
        return;
      }

      // Normal paragraph
      if (inList) {
        inList = false;
      }
      elements.push(
        <p key={`p-${index}`} className="text-xs text-white/70 leading-relaxed mb-3 font-body">
          {replaceBold(currentLine)}
        </p>
      );
    });

    return elements;
  };

  // Replace markdown **bold** with React strong elements
  const replaceBold = (text: string): React.ReactNode => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="text-white font-black">{part}</strong>;
      }
      return part;
    });
  };

  return <div className={`markdown-content ${className}`}>{parseMarkdown(content)}</div>;
}
