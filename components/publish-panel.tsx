"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Instagram,
  Download,
  Share2,
  ExternalLink,
  CheckCircle,
  Copy,
  Settings,
  Calendar,
  Users,
  BarChart3,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublishPanelProps {
  documentTitle: string;
  documentContent: string;
  documentSlug: string;
  projectSlug: string;
  isPublished: boolean;
  onPublish: () => void;
}

export default function PublishPanel({
  documentTitle,
  documentContent,
  documentSlug,
  projectSlug,
  isPublished,
  onPublish
}: PublishPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const platforms = [
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'text-blue-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-700' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  ];

  const exportFormats = [
    { id: 'pdf', name: 'PDF Document', icon: Download },
    { id: 'md', name: 'Markdown File', icon: Download },
    { id: 'html', name: 'HTML File', icon: Download },
    { id: 'docx', name: 'Word Document', icon: Download },
  ];

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish();
      // Show success message
    } catch (error) {
      console.error('Failed to publish:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleExport = async (format: string) => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format,
          title: documentTitle,
          content: documentContent,
          slug: documentSlug
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${documentSlug}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleSocialShare = async (platform: string) => {
    setIsSharing(true);
    try {
      // Check if document is published first
      if (!isPublished) {
        alert('Please publish the document first before sharing on social media.');
        setIsSharing(false);
        return;
      }

      // First, create the social post in our database
      const requestBody = {
        documentSlug,
        platforms: [platform],
        autoGenerate: true, // Auto-generate content from document
        message: `Check out our latest: ${documentTitle}`,
      };
      
              const response = await fetch('/api/social/automate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

      if (response.ok) {
        const result = await response.json();

        // Then open the social media sharing dialog
        const shareData = {
          title: documentTitle,
          text: `Check out our latest: ${documentTitle}`,
          url: `${window.location.origin}/docs/${projectSlug}/${documentSlug}`,
        };

        switch (platform) {
          case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`);
            break;
          case 'linkedin':
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`);
            break;
          case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`);
            break;
          case 'instagram':
            // Instagram doesn't support direct sharing, show instructions
            alert('For Instagram, copy the link and share it in your story or post!');
            break;
        }

        // Show success message
        alert(`Successfully created ${platform} post! Check your ${platform} account.`);
      } else {
        const errorData = await response.json();
        console.error('Failed to create social post:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        if (errorData.error && errorData.error.includes('must be published')) {
          alert('Please publish the document first before sharing on social media.');
        } else {
          alert(`Failed to create ${platform} post: ${errorData.error || `HTTP ${response.status}: ${response.statusText}`}`);
        }
      }
    } catch (error) {
      console.error('Social share failed:', error);
      alert(`Failed to share on ${platform}. Please try again.`);
    } finally {
      setIsSharing(false);
    }
  };

  const copyPublicLink = async () => {
    const publicUrl = `${window.location.origin}/docs/${projectSlug}/${documentSlug}`;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleScheduleSocialPosts = () => {
    // Open scheduling modal or redirect to scheduling page
    alert('Social media scheduling feature coming soon! This will allow you to schedule posts for specific times.');
  };

  const handleViewSocialHistory = async () => {
    try {
      const response = await fetch(`/api/social/automate?documentSlug=${documentSlug}`);
      if (response.ok) {
        const data = await response.json();
        if (data.posts && data.posts.length > 0) {
          const postList = data.posts.map((post: any) => 
            `${post.platform}: ${post.status} (${new Date(post.createdAt).toLocaleDateString()})`
          ).join('\n');
          alert(`Social Media History:\n\n${postList}`);
        } else {
          alert('No social media posts found for this document.');
        }
      } else {
        alert('Failed to load social media history.');
      }
    } catch (error) {
      console.error('Failed to fetch social history:', error);
      alert('Failed to load social media history.');
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-white-600 to-Primary text-white"
      >
        <Globe className="w-4 h-4 mr-2" />
        {isPublished ? 'Manage Publishing' : 'Publish & Share'}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Publish & Share</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              {/* Publishing Status */}
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isPublished ? 'bg-green-100 dark:bg-green-900/20' : 'bg-amber-100 dark:bg-amber-900/20'}`}>
                    {isPublished ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Globe className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {isPublished ? 'Published Online' : 'Ready to Publish'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isPublished 
                        ? 'Your document is live and accessible to the public'
                        : 'Make your document public and shareable'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Publish to Website */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Publish to Website
                </h3>
                <div className="space-y-3">
                  <Button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isPublishing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    ) : (
                      <Globe className="w-4 h-4 mr-2" />
                    )}
                    {isPublished ? 'Update Publication' : 'Publish to Website'}
                  </Button>
                  
                  {isPublished && (
                    <div className="flex gap-2">
                      <Button
                        onClick={copyPublicLink}
                        variant="outline"
                        className="flex-1"
                      >
                        {copied ? (
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        {copied ? 'Copied!' : 'Copy Public Link'}
                      </Button>
                      <Button
                        onClick={() => window.open(`/docs/${projectSlug}/${documentSlug}`, '_blank')}
                        variant="outline"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Export Options */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Document
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {exportFormats.map((format) => (
                    <Button
                      key={format.id}
                      onClick={() => handleExport(format.id)}
                      variant="outline"
                      className="justify-start"
                    >
                      <format.icon className="w-4 h-4 mr-2" />
                      {format.name}
                    </Button>
                  ))}
                </div>
              </div>

                             {/* Social Media Sharing */}
               <div className="mb-6">
                 <h3 className="font-semibold mb-3 flex items-center gap-2">
                   <Share2 className="w-4 h-4" />
                   Share on Social Media
                 </h3>
                 
                 {!isPublished && (
                   <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                     <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                       <AlertTriangle className="w-4 h-4" />
                       <span className="text-sm font-medium">Document must be published first</span>
                     </div>
                     <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                       Publish your document above to enable social media sharing
                     </p>
                   </div>
                 )}
                 
                 <div className="space-y-3">
                   {/* Quick Share Buttons */}
                   <div className="grid grid-cols-2 gap-2">
                     {platforms.map((platform) => (
                       <Button
                         key={platform.id}
                         onClick={() => handleSocialShare(platform.id)}
                         disabled={isSharing || !isPublished}
                         variant="outline"
                         className="justify-start"
                       >
                         <platform.icon className={`w-4 h-4 mr-2 ${platform.color}`} />
                         {platform.name}
                       </Button>
                     ))}
                   </div>
                   
                   {/* Advanced Social Media Options */}
                   <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                     <h4 className="text-sm font-medium mb-3">Advanced Options</h4>
                     <div className="space-y-2">
                       <Button
                         onClick={() => handleScheduleSocialPosts()}
                         variant="outline"
                         size="sm"
                         className="w-full justify-start"
                       >
                         <Calendar className="w-4 h-4 mr-2" />
                         Schedule Posts
                       </Button>
                       <Button
                         onClick={() => handleViewSocialHistory()}
                         variant="outline"
                         size="sm"
                         className="w-full justify-start"
                       >
                         <BarChart3 className="w-4 h-4 mr-2" />
                         View Post History
                       </Button>
                     </div>
                   </div>
                 </div>
               </div>

              {/* Publishing Options */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Publishing Options
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Scheduled Publishing</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Schedule
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Team Collaboration</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Invite
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Analytics & Insights</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    // Open advanced publishing settings
                  }}
                  className="flex-1"
                >
                  Advanced Settings
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 