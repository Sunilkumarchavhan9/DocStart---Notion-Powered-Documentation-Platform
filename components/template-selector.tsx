"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, X } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

interface TemplateSelectorProps {
  projectSlug: string;
  onDocumentCreated: (document: any) => void;
  onClose: () => void;
}

export default function TemplateSelector({ projectSlug, onDocumentCreated, onClose }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates");
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    if (!selectedTemplate || !documentTitle.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          projectSlug,
          title: documentTitle.trim(),
        }),
      });

      if (response.ok) {
        const document = await response.json();
        onDocumentCreated(document);
        onClose();
      } else {
        throw new Error("Failed to create document");
      }
    } catch (error) {
      console.error("Failed to create document:", error);
      alert("Failed to create document. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-center text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Choose a Template</h2>
            <p className="text-sm text-muted-foreground">Select a template to get started quickly</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {!selectedTemplate ? (
            // Template selection
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <motion.button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className="p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-accent transition-all duration-200 text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl mb-2">{template.icon}</div>
                  <h3 className="font-medium text-foreground mb-1">{template.name}</h3>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {template.category}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            // Document creation form
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                <div className="text-2xl">{selectedTemplate.icon}</div>
                <div>
                  <h3 className="font-medium text-foreground">{selectedTemplate.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                  Document Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="Enter document title..."
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateDocument}
                  disabled={!documentTitle.trim() || isCreating}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Document
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 