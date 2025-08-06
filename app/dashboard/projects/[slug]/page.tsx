 "use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import ActivityFeed from "@/components/activity-feed";

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
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  _count: {
    documents: number;
    members: number;
  };
}

interface CreateDocumentData {
  title: string;
  content: string;
  isPublished: boolean;
}

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    params.then(resolvedParams => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  if (!slug) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <ProjectPageClient slug={slug} />;
}

function ProjectPageClient({ slug }: { slug: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDocumentData>({
    title: "",
    content: "",
    isPublished: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user && slug) {
      fetchProjectData();
    }
  }, [session, slug]);

  const fetchProjectData = async () => {
    try {
      // Fetch project details
      const projectResponse = await fetch(`/api/projects/${slug}`);
      if (projectResponse.ok) {
        const projectData = await projectResponse.json();
        setProject(projectData);
      }

      // Fetch documents
      const documentsResponse = await fetch(`/api/projects/${slug}/documents`);
      if (documentsResponse.ok) {
        const documentsData = await documentsResponse.json();
        setDocuments(documentsData);
      }
    } catch (error) {
      console.error("Failed to fetch project data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      const response = await fetch(`/api/projects/${slug}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newDocument = await response.json();
        setDocuments(prev => [newDocument, ...prev]);
        setShowCreateModal(false);
        setFormData({ title: "", content: "", isPublished: false });
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create document");
      }
    } catch (error) {
      console.error("Failed to create document:", error);
      alert("Failed to create document");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDocumentClick = (document: Document) => {
    router.push(`/dashboard/projects/${slug}/documents/${document.slug}`);
  };

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

  if (!session || !project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-mono bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {project.name}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
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
        {/* Project Info */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-serif text-foreground mb-2">{project.name}</h2>
              <p className="text-muted-foreground mb-4">
                {project.description || "No description"}
              </p>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <span>Created by {project.user.name}</span>
                <span>{project._count.documents} documents</span>
                <span>{project._count.members} members</span>
                <span>{project.isPublic ? "Public" : "Private"}</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-serif hover:bg-primary/90 transition-colors"
            >
              Create Document
            </motion.button>
          </div>
        </div>

        {/* Documents */}
        <div>
          <h3 className="text-lg font-serif text-foreground mb-4">Documents</h3>
          
          {documents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">📄</div>
              <h4 className="text-lg font-serif text-foreground mb-2">No documents yet</h4>
              <p className="text-muted-foreground mb-4">
                Create your first document to get started
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-serif hover:bg-primary/90 transition-colors"
              >
                Create Your First Document
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((document, index) => (
                <motion.div
                  key={document.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleDocumentClick(document)}
                  className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-serif text-foreground">{document.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      document.isPublished 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}>
                      {document.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {document.content.substring(0, 150)}...
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Updated {new Date(document.updatedAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="mt-12">
          <ActivityFeed projectSlug={slug} />
        </div>
      </main>

      {/* Create Document Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-serif text-foreground mb-4">Create New Document</h3>
              
              <form onSubmit={handleCreateDocument} className="space-y-4">
                <div>
                  <label className="block text-sm font-serif text-foreground mb-2">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter document title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-serif text-foreground mb-2">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter document content (supports Markdown)"
                    rows={10}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="rounded border-border"
                  />
                  <label htmlFor="isPublished" className="text-sm font-serif text-foreground">
                    Publish immediately
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-md text-sm font-serif hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading || !formData.title.trim() || !formData.content.trim()}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-serif hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createLoading ? "Creating..." : "Create Document"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}