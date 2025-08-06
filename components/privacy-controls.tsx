"use client";

import { useState } from "react";
import { Shield, Eye, Download, Trash2 } from "lucide-react";

export default function PrivacyControls() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const exportData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/privacy", { method: "POST" });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "user-data.json";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setMessage("Data exported successfully!");
      }
    } catch (error) {
      setMessage("Failed to export data");
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-semibold">Privacy & Security</h1>
      </div>

      {message && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-primary">
          {message}
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Data Privacy</h2>
        <div className="space-y-4">
          <button
            onClick={exportData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export My Data
          </button>
        </div>
      </div>
    </div>
  );
} 