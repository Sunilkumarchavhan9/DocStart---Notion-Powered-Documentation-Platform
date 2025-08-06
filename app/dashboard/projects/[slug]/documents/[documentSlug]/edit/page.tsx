"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Share, 
  Settings,
  Users,
  Clock,
  FileText
} from "lucide-react";
import NotionEditor from "@/components/notion-editor";
import NotionIntegration from "@/components/notion-integration";
import PublishPanel from "@/components/publish-panel";
import Navbar from "@/components/Nvabar";

interface Document {
  id: string;
  title: string;
  content: string;
  slug: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Collaborator {
  id: string;
  name: string;
  color: string;
}

export default function DocumentEditPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const documentSlug = params?.documentSlug as string;
  const router = useRouter();
  const { data: session } = useSession();
  const [document, setDocument] = useState<Document | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [isNotionConnected, setIsNotionConnected] = useState(false);
  const [showNotionIntegration, setShowNotionIntegration] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchDocument();
      checkNotionConnection();
    }
  }, [session, slug as string, documentSlug as string]);

  useEffect(() => {
    if (document?.id) {
      fetchCollaborators();
    }
  }, [document?.id]);

  useEffect(() => {
    if (content && document && content !== document.content) {
      const timeoutId = setTimeout(() => {
        saveDocument();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [content, document]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/projects/${slug}/documents/${documentSlug}`);
      if (response.ok) {
        const doc = await response.json();
        setDocument(doc);
        setContent(doc.content || "");
      }
    } catch (error) {
      console.error("Failed to fetch document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCollaborators = async () => {
    if (!document?.id) return;
    
    try {
      const response = await fetch(`/api/collaboration?documentId=${document.id}`);
      if (response.ok) {
        const data = await response.json();
        setCollaborators(data.collaborators);
      }
    } catch (error) {
      console.error("Failed to fetch collaborators:", error);
    }
  };

  const saveDocument = async () => {
    if (!document) return;

    // Clean the content to prevent corruption
    let cleanContent = content;
    
    // Remove any console output that might have been captured
    cleanContent = cleanContent.replace(/console\.log\([^)]*\)/g, '');
    cleanContent = cleanContent.replace(/console\.error\([^)]*\)/g, '');
    cleanContent = cleanContent.replace(/console\.warn\([^)]*\)/g, '');
    
    // Remove any browser warnings that might have been captured
    cleanContent = cleanContent.replace(/\[Violation\][^<]*/g, '');
    cleanContent = cleanContent.replace(/ureFlagTransactionQueue[^<]*/g, '');
    cleanContent = cleanContent.replace(/wasm-sqlite-work[^<]*/g, '');
    
    // Update the content state with cleaned content
    if (cleanContent !== content) {
      setContent(cleanContent);
    }

    console.log('Saving document with:', { slug, documentSlug, content: cleanContent.substring(0, 100) + '...' });
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/projects/${slug}/documents/${documentSlug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: cleanContent,
          title: document.title,
        }),
      });

      if (response.ok) {
        const updatedDoc = await response.json();
        setDocument(updatedDoc);
        setLastSaved(new Date());
        
        // Update collaboration status
        await fetch(`/api/collaboration`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentId: document.id,
            action: "content_updated",
            content,
          }),
        });
        
        console.log('Document auto-saved successfully');
      } else {
        console.error('Failed to save document:', response.status);
      }
    } catch (error) {
      console.error("Failed to save document:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const checkNotionConnection = async () => {
    try {
      const response = await fetch('/api/user/notion-status');
      if (response.ok) {
        const data = await response.json();
        setIsNotionConnected(data.isConnected);
      }
    } catch (error) {
      console.error('Failed to check Notion connection:', error);
    }
  };

  const handleContentChange = (newContent: string) => {
    // Clean the content to prevent corruption
    let cleanContent = newContent;
    
    // Remove any console output that might have been captured
    cleanContent = cleanContent.replace(/console\.log\([^)]*\)/g, '');
    cleanContent = cleanContent.replace(/console\.error\([^)]*\)/g, '');
    cleanContent = cleanContent.replace(/console\.warn\([^)]*\)/g, '');
    
    // Remove any browser warnings that might have been captured
    cleanContent = cleanContent.replace(/\[Violation\][^<]*/g, '');
    cleanContent = cleanContent.replace(/ureFlagTransactionQueue[^<]*/g, '');
    cleanContent = cleanContent.replace(/wasm-sqlite-work[^<]*/g, '');
    
    setContent(cleanContent);
  };

  const handlePreview = () => {
    router.push(`/dashboard/projects/${slug}/documents/${documentSlug}`);
  };

  const handleShare = () => {
    // Implement share functionality
    navigator.clipboard.writeText(`${window.location.origin}/dashboard/projects/${slug}/documents/${documentSlug}`);
  };

  const handlePublish = async () => {
    try {
      const response = await fetch(`/api/projects/${slug}/documents/${documentSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: true }),
      });

      if (response.ok) {
        const updatedDoc = await response.json();
        setDocument(updatedDoc);
        // Show success message
      }
    } catch (error) {
      console.error('Failed to publish document:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Document not found</h2>
            <p className="text-muted-foreground">The document you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="sticky top-16 z-30 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-accent rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  {document.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Editing</span>
                  {lastSaved && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Saved {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                  {isSaving && (
                    <span className="flex items-center gap-1 text-primary">
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                      Saving...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2">
              {/* Write in Notion */}
              <button
                onClick={() => setShowNotionIntegration(!showNotionIntegration)}
                className="px-3 py-2 bg-black hover:bg-gray-800 text-white text-sm rounded-md transition-colors"
                title="Write in Notion"
              >
                Notion
              </button>

              {/* Collaborators */}
              <button
                onClick={() => setShowCollaborators(!showCollaborators)}
                className="p-2 hover:bg-accent rounded-md transition-colors relative"
              >
                <Users className="w-5 h-5" />
                {collaborators.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {collaborators.length}
                  </span>
                )}
              </button>

              {/* Preview */}
              <button
                onClick={handlePreview}
                className="p-2 hover:bg-accent rounded-md transition-colors"
                title="Preview"
              >
                <Eye className="w-5 h-5" />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="p-2 hover:bg-accent rounded-md transition-colors"
                title="Share"
              >
                <Share className="w-5 h-5" />
              </button>

              {/* Save */}
              <button
                onClick={saveDocument}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Saving...' : 'Save'}
              </button>

              {/* Publish & Share */}
              <PublishPanel
                documentTitle={document?.title || ''}
                documentContent={content}
                documentSlug={documentSlug}
                projectSlug={slug}
                isPublished={document?.isPublished || false}
                onPublish={handlePublish}
              />
            </div>
          </div>
        </div>

        {/* Collaborators dropdown */}
        {showCollaborators && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full right-4 bg-card border border-border rounded-lg p-4 shadow-lg z-50 min-w-[200px]"
          >
            <h3 className="text-sm font-medium text-foreground mb-2">Active Collaborators</h3>
            {collaborators.length > 0 ? (
              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: collaborator.color }}
                    />
                    <span>{collaborator.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active collaborators</p>
            )}
          </motion.div>
        )}

        {/* Notion Integration Modal */}
        {showNotionIntegration && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-0 w-96 z-50"
          >
            <NotionIntegration
              documentSlug={documentSlug as string}
              documentTitle={document.title}
              projectId={slug as string}
              isNotionConnected={isNotionConnected}
            />
          </motion.div>
        )}
      </div>

      {/* Editor */}
      <NotionEditor
        content={content}
        onChange={handleContentChange}
        projectId={slug as string}
        documentId={document.id}
        collaborators={collaborators}
      />
    </div>
  );
} 