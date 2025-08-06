"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, use } from "react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { useCollaboration } from "@/lib/use-collaboration";
import { Edit } from "lucide-react";

interface Document {
  id: string;
  title: string;
  content: string;
  slug: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  slug: string;
  isPublic: boolean;
}

export default function DocumentPage({ 
  params 
}: { 
  params: Promise<{ slug: string; documentSlug: string }> 
}) {
  const resolvedParams = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [collaborationEnabled, setCollaborationEnabled] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user && resolvedParams.slug && resolvedParams.documentSlug) {
      fetchDocumentData();
    }
  }, [session, resolvedParams.slug, resolvedParams.documentSlug]);

  // Initialize collaboration when document is loaded
  const {
    isConnected,
    users,
    typingUsers,
    sendDocumentChange,
    sendCursorUpdate,
    handleTyping,
  } = useCollaboration({
    documentId: document?.id || "",
    onDocumentChange: (change) => {
      if (change.userId !== session?.user?.id) {
        setContent(change.content);
      }
    },
    onUserJoined: (user) => {
      console.log(`${user.userName} joined the document`);
    },
    onUserLeft: (user) => {
      console.log(`${user.userName} left the document`);
    },
  });

  const fetchDocumentData = async () => {
    try {
      // Fetch project details
      const projectResponse = await fetch(`/api/projects/${resolvedParams.slug}`);
      if (projectResponse.ok) {
        const projectData = await projectResponse.json();
        setProject(projectData);
      }

      // Fetch document details
      const documentResponse = await fetch(`/api/projects/${resolvedParams.slug}/documents/${resolvedParams.documentSlug}`);
      if (documentResponse.ok) {
        const documentData = await documentResponse.json();
        setDocument(documentData);
        setTitle(documentData.title);
        setContent(documentData.content);
        setIsPublished(documentData.isPublished);
      }
    } catch (error) {
      console.error("Failed to fetch document data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = useCallback(async () => {
    if (!document || !hasChanges) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${resolvedParams.slug}/documents/${resolvedParams.documentSlug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          isPublished,
        }),
      });

      if (response.ok) {
        const updatedDocument = await response.json();
        setDocument(updatedDocument);
        setHasChanges(false);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save document");
      }
    } catch (error) {
      console.error("Failed to save document:", error);
      alert("Failed to save document");
    } finally {
      setSaving(false);
    }
  }, [document, hasChanges, title, content, isPublished, resolvedParams.slug, resolvedParams.documentSlug]);

  // Auto-save functionality
  useEffect(() => {
    if (!hasChanges) return;

    const timeoutId = setTimeout(() => {
      handleSave();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [hasChanges, handleSave]);

  // Track changes
  useEffect(() => {
    if (!document) return;
    
    const hasTitleChanged = title !== document.title;
    const hasContentChanged = content !== document.content;
    const hasPublishedChanged = isPublished !== document.isPublished;
    
    setHasChanges(hasTitleChanged || hasContentChanged || hasPublishedChanged);
  }, [title, content, isPublished, document]);

  // Enable collaboration when document is loaded
  useEffect(() => {
    if (document?.id) {
      setCollaborationEnabled(true);
    }
  }, [document?.id]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !document || !project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push(`/dashboard/projects/${resolvedParams.slug}`)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Project
            </button>
            <div>
              <h1 className="text-lg font-mono text-foreground">{project.name}</h1>
              <p className="text-sm text-muted-foreground">Document Editor</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {hasChanges && (
              <span className="text-sm text-yellow-600 dark:text-yellow-400">
                {saving ? "Saving..." : "Unsaved changes"}
              </span>
            )}
            {collaborationEnabled && (
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-muted-foreground">
                  {isConnected ? `${users.length} online` : 'Disconnected'}
                </span>
                {typingUsers.length > 0 && (
                  <span className="text-sm text-blue-500">
                    {typingUsers.length} typing...
                  </span>
                )}
              </div>
            )}
            <span className="text-sm text-muted-foreground">
              {session.user.name || session.user.email}
            </span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-sm font-serif border border-border rounded-md hover:bg-muted transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Document Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-serif text-foreground bg-transparent border-none outline-none focus:ring-0"
                placeholder="Document title..."
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push(`/dashboard/projects/${resolvedParams.slug}/documents/${resolvedParams.documentSlug}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit with Notion Editor
              </button>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-border"
                />
                <label htmlFor="isPublished" className="text-sm font-serif text-foreground">
                  Published
                </label>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-serif hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save"}
              </motion.button>
            </div>
          </div>

          {/* Document Content */}
          <div className="bg-card border border-border rounded-lg p-6">
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                handleTyping();
                if (collaborationEnabled) {
                  sendDocumentChange(e.target.value);
                }
              }}
              onKeyUp={(e) => {
                if (collaborationEnabled) {
                  // Send cursor position (simplified)
                  const textarea = e.target as HTMLTextAreaElement;
                  const cursorPosition = textarea.selectionStart;
                  const lines = textarea.value.substring(0, cursorPosition).split('\n');
                  const line = lines.length - 1;
                  const ch = lines[lines.length - 1].length;
                  sendCursorUpdate({ line, ch });
                }
              }}
              className="w-full h-96 p-4 bg-transparent text-foreground border-none outline-none resize-none focus:ring-0 font-mono text-sm"
              placeholder="Start writing your document... (supports Markdown)"
            />
          </div>

          {/* Document Info */}
          <div className="mt-6 text-sm text-muted-foreground">
            <p>Last updated: {new Date(document.updatedAt).toLocaleString()}</p>
            <p>Created: {new Date(document.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </main>
    </div>
  );
} 