"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ExternalLink, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Users,
  FileText,
  Zap,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotionIntegrationProps {
  documentSlug: string;
  documentTitle: string;
  projectId: string;
  isNotionConnected?: boolean;
}

interface SyncStatus {
  isConnected: boolean;
  notionPageUrl?: string;
  lastSyncedAt?: string;
}

export default function NotionIntegration({
  documentSlug,
  documentTitle,
  projectId,
  isNotionConnected = false
}: NotionIntegrationProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ isConnected: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [notionPages, setNotionPages] = useState<any[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);

  useEffect(() => {
    checkSyncStatus();
  }, [documentSlug]);

  const checkSyncStatus = async () => {
    try {
      const response = await fetch(`/api/notion/sync?documentSlug=${documentSlug}`);
      if (response.ok) {
        const data = await response.json();
        setSyncStatus(data);
      }
    } catch (error) {
      console.error('Failed to check sync status:', error);
    }
  };

  const connectToNotion = async () => {
    if (!isNotionConnected) {
      // Redirect to Notion OAuth
      window.location.href = '/api/auth/notion';
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/notion/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: documentTitle, 
          documentSlug 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSyncStatus({
          isConnected: true,
          notionPageUrl: data.page.url,
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to create Notion page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncFromNotion = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/notion/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentSlug }),
      });

      if (response.ok) {
        const data = await response.json();
        setSyncStatus(prev => ({
          ...prev,
          lastSyncedAt: data.syncedAt,
        }));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Refresh the page to show updated content
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to sync from Notion:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const openInNotion = () => {
    if (syncStatus.notionPageUrl) {
      window.open(syncStatus.notionPageUrl, '_blank');
    }
  };

  const loadNotionPages = async () => {
    setIsLoadingPages(true);
    try {
      const response = await fetch('/api/notion/pages');
      if (response.ok) {
        const data = await response.json();
        setNotionPages(data.pages || []);
      }
    } catch (error) {
      console.error('Failed to load Notion pages:', error);
    } finally {
      setIsLoadingPages(false);
    }
  };

  const importFromNotion = async (pageId: string, pageTitle: string) => {
    try {
      const response = await fetch('/api/notion/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pageId, 
          pageTitle,
          documentSlug,
          projectId 
        }),
      });

      if (response.ok) {
        setShowImportModal(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        // Refresh the page to show imported content
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to import from Notion:', error);
    }
  };

  return (
    <div className="border border-border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Write in Notion</h3>
          <p className="text-sm text-muted-foreground">
            Use Notion's powerful editor, sync back to DocStart
          </p>
        </div>
      </div>

      {/* Status and Actions */}
      <div className="space-y-4">
        {!isNotionConnected ? (
          // Not connected to Notion
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium">Connect your Notion workspace</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Connect DocStart to your Notion account to start writing
            </p>
            <Button 
              onClick={connectToNotion}
              className="bg-black hover:bg-gray-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Users className="w-4 h-4 mr-2" />
              )}
              Connect Notion
            </Button>
          </div>
        ) : !syncStatus.isConnected ? (
          // Connected to Notion but no page created
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Ready to create Notion page</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Create a new page in your Notion workspace for this document
            </p>
            <Button 
              onClick={connectToNotion}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              Create in Notion
            </Button>
          </div>
        ) : (
          // Connected and page exists
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="font-medium text-green-700 dark:text-green-400">
                Connected to Notion
              </span>
            </div>

            {syncStatus.lastSyncedAt && (
              <p className="text-xs text-muted-foreground">
                Last synced: {new Date(syncStatus.lastSyncedAt).toLocaleString()}
              </p>
            )}

            <div className="flex gap-2">
              <Button
                onClick={openInNotion}
                className="flex-1 bg-black hover:bg-gray-800 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Write in Notion
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                onClick={syncFromNotion}
                variant="outline"
                disabled={isSyncing}
                className="px-3"
              >
                {isSyncing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="border-t border-border pt-3">
              <Button
                onClick={() => setShowImportModal(true)}
                variant="outline"
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Import from Notion
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Make changes in Notion, then click sync to update DocStart
            </p>
          </div>
        )}
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {syncStatus.isConnected ? 'Synced successfully!' : 'Page created successfully!'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Benefits */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-blue-600 font-semibold text-sm">Familiar</div>
            <div className="text-xs text-muted-foreground">Use Notion's editor you love</div>
          </div>
          <div>
            <div className="text-purple-600 font-semibold text-sm">Powerful</div>
            <div className="text-xs text-muted-foreground">All Notion blocks & features</div>
          </div>
          <div>
            <div className="text-green-600 font-semibold text-sm">Synced</div>
            <div className="text-xs text-muted-foreground">Auto-publish to DocStart</div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowImportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Import from Notion</h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select a Notion page to import into this document:
                </p>

                <Button
                  onClick={loadNotionPages}
                  disabled={isLoadingPages}
                  className="w-full"
                >
                  {isLoadingPages ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 mr-2" />
                  )}
                  Load Notion Pages
                </Button>

                {notionPages.length > 0 && (
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {notionPages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => importFromNotion(page.id, page.title)}
                        className="w-full text-left p-3 border border-border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="font-medium text-sm">{page.title}</div>
                        <div className="text-xs text-muted-foreground">
                          Last edited: {new Date(page.lastEditedTime).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {notionPages.length === 0 && !isLoadingPages && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No pages found. Click "Load Notion Pages" to refresh.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}