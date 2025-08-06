"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Maximize2, Minimize2 } from "lucide-react";

interface LiveEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function LiveEditor({ content, onChange, placeholder = "Start writing..." }: LiveEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");

  // Update preview content when content changes
  useEffect(() => {
    setPreviewContent(content);
  }, [content]);

  // Handle fullscreen
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isFullscreen]);

  // Convert markdown to HTML for preview
  const renderMarkdown = (text: string) => {
    // Simple markdown to HTML conversion
    let html = text
      // Headers
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Code blocks
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      // Inline code
      .replace(/`(.*?)`/g, "<code>$1</code>")
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Lists
      .replace(/^\* (.*$)/gim, "<li>$1</li>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      // Line breaks
      .replace(/\n/g, "<br>");

    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>");

    return html;
  };

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-background"
    : "relative bg-card border border-border rounded-lg";

  return (
    <div className={containerClasses}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-background border border-border rounded-md hover:bg-accent transition-colors"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>
        
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Editor and Preview */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Editor */}
        <div className={`${showPreview ? "w-1/2" : "w-full"} border-r border-border`}>
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 bg-background text-foreground resize-none focus:outline-none font-mono text-sm leading-relaxed"
            style={{ minHeight: "400px" }}
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-1/2 p-4 overflow-y-auto"
          >
            <div
              className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(previewContent) || "<p class='text-muted-foreground'>Preview will appear here...</p>"
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground bg-muted/30 border-t border-border">
        <span>
          {content.length} characters • {content.split(/\s+/).filter(word => word.length > 0).length} words
        </span>
        <span>
          {showPreview ? "Live Preview" : "Editor Mode"}
        </span>
      </div>
    </div>
  );
} 