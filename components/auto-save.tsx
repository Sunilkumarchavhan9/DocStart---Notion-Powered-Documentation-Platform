"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";

interface AutoSaveProps {
  content: string;
  title: string;
  projectSlug: string;
  documentSlug: string;
  onSave?: () => void;
  onError?: (error: string) => void;
  debounceMs?: number;
}

export default function AutoSave({
  content,
  title,
  projectSlug,
  documentSlug,
  onSave,
  onError,
  debounceMs = 2000
}: AutoSaveProps) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastContentRef = useRef<string>('');
  const lastTitleRef = useRef<string>('');

  useEffect(() => {
    // Only save if content or title has actually changed
    if (content === lastContentRef.current && title === lastTitleRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      await saveDocument();
    }, debounceMs);

    // Update refs
    lastContentRef.current = content;
    lastTitleRef.current = title;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, title, debounceMs]);

  const saveDocument = async () => {
    if (content === lastContentRef.current && title === lastTitleRef.current) {
      return;
    }

    setStatus('saving');

    try {
      // Save main document
      const docResponse = await fetch(`/api/projects/${projectSlug}/documents/${documentSlug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!docResponse.ok) {
        throw new Error('Failed to save document');
      }

      // Create version snapshot
      const versionResponse = await fetch(`/api/projects/${projectSlug}/documents/${documentSlug}/versions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!versionResponse.ok) {
        console.warn('Failed to create version snapshot');
      }

      setStatus('saved');
      setLastSaved(new Date());
      onSave?.();

      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);

    } catch (error) {
      console.error('Auto-save error:', error);
      setStatus('error');
      onError?.(error instanceof Error ? error.message : 'Failed to save');
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return lastSaved ? `Saved at ${lastSaved.toLocaleTimeString()}` : 'Saved';
      case 'error':
        return 'Save failed';
      default:
        return '';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'saving':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>;
      case 'saved':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-4 right-4 bg-card border border-border rounded-lg px-4 py-2 shadow-lg z-50"
        >
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm text-muted-foreground">
              {getStatusMessage()}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 