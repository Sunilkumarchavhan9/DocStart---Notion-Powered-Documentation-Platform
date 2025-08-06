"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Code, FileJson } from "lucide-react";

interface ExportOptionsProps {
  projectSlug: string;
  documentSlug: string;
  documentTitle: string;
}

export default function ExportOptions({ projectSlug, documentSlug, documentTitle }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const exportFormats = [
    {
      name: "HTML",
      icon: <FileText className="w-4 h-4" />,
      format: "html",
      description: "Export as HTML file"
    },
    {
      name: "Markdown",
      icon: <Code className="w-4 h-4" />,
      format: "markdown",
      description: "Export as Markdown file"
    },
    {
      name: "JSON",
      icon: <FileJson className="w-4 h-4" />,
      format: "json",
      description: "Export as JSON data"
    }
  ];

  const handleExport = async (format: string) => {
    setIsExporting(format);
    try {
      const response = await fetch(`/api/projects/${projectSlug}/documents/${documentSlug}/export?format=${format}`);
      
      if (!response.ok) {
        throw new Error("Export failed");
      }

      // Get the filename from the response headers
      const contentDisposition = response.headers.get("content-disposition");
      let filename = `${documentTitle}.${format}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium text-foreground">Export Options</h3>
      </div>
      
      <div className="space-y-2">
        {exportFormats.map((format) => (
          <motion.button
            key={format.format}
            onClick={() => handleExport(format.format)}
            disabled={isExporting !== null}
            className="w-full flex items-center justify-between p-3 text-left bg-background border border-border rounded-md hover:bg-accent hover:border-primary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div className="text-primary">
                {format.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {format.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format.description}
                </div>
              </div>
            </div>
            
            {isExporting === format.format && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            )}
          </motion.button>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Export your document in multiple formats for sharing and backup.
        </p>
      </div>
    </div>
  );
} 