"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  FileText, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle, 
  Users,
  Zap,
  Globe,
  BookOpen
} from "lucide-react";
import Navbar from "@/components/Nvabar";

export default function NotionSetupPage() {
  const { data: session } = useSession();
  const [isNotionConnected, setIsNotionConnected] = useState(false);

  useEffect(() => {
    checkNotionConnection();
  }, []);

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

  const connectToNotion = () => {
    window.location.href = '/api/auth/notion';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Write in Notion, Publish with DocStart
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Use Notion's powerful editor for writing, then automatically publish beautiful documentation sites with DocStart.
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isNotionConnected ? 'bg-green-100 dark:bg-green-900/20' : 'bg-amber-100 dark:bg-amber-900/20'}`}>
                {isNotionConnected ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Users className="w-6 h-6 text-amber-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {isNotionConnected ? 'Notion Connected' : 'Connect Your Notion Workspace'}
                </h3>
                <p className="text-muted-foreground">
                  {isNotionConnected 
                    ? 'You can now write in Notion and sync to DocStart' 
                    : 'Connect your Notion workspace to get started'
                  }
                </p>
              </div>
            </div>
            
            {!isNotionConnected && (
              <button
                onClick={connectToNotion}
                className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
              >
                Connect Notion
              </button>
            )}
          </div>
        </div>

        {/* How It Works */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">1. Write in Notion</h3>
            </div>
            <p className="text-muted-foreground">
              Use Notion's familiar editor with all its powerful features - blocks, formatting, images, and more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold">2. Sync to DocStart</h3>
            </div>
            <p className="text-muted-foreground">
              Click sync to bring your Notion content into DocStart with one click.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold">3. Publish Online</h3>
            </div>
            <p className="text-muted-foreground">
              DocStart automatically creates beautiful, SEO-optimized documentation sites.
            </p>
          </motion.div>
        </div>

        {/* Getting Started Steps */}
        <div className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-2">Connect Your Notion Workspace</h3>
                <p className="text-muted-foreground mb-3">
                  Click "Connect Notion" above to authorize DocStart to access your Notion workspace.
                </p>
                {!isNotionConnected && (
                  <button
                    onClick={connectToNotion}
                    className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    Connect Now
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">Create or Import Documents</h3>
                <p className="text-muted-foreground mb-3">
                  Go to any document in DocStart and click the "Notion" button. You can either:
                </p>
                <ul className="text-muted-foreground space-y-1 ml-4">
                  <li>• Create a new page in Notion for this document</li>
                  <li>• Import an existing Notion page</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">Write and Sync</h3>
                <p className="text-muted-foreground mb-3">
                  Write your content in Notion using all its features, then click "Sync" to bring it into DocStart.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-2">Publish Your Site</h3>
                <p className="text-muted-foreground mb-3">
                  DocStart automatically creates beautiful documentation sites with SEO optimization, custom domains, and more.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Use Notion + DocStart?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Familiar Writing Experience</h4>
                  <p className="text-sm text-muted-foreground">Use Notion's editor you already know and love</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">All Notion Features</h4>
                  <p className="text-sm text-muted-foreground">Blocks, formatting, images, databases, and more</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Real-time Collaboration</h4>
                  <p className="text-sm text-muted-foreground">Work with your team in Notion</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Professional Publishing</h4>
                  <p className="text-sm text-muted-foreground">Beautiful, SEO-optimized documentation sites</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Custom Domains</h4>
                  <p className="text-sm text-muted-foreground">Use your own domain for your docs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Analytics & Insights</h4>
                  <p className="text-sm text-muted-foreground">Track visitor engagement and performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6">
            Connect your Notion workspace and start creating beautiful documentation sites.
          </p>
          
          <div className="flex gap-4 justify-center">
            {!isNotionConnected ? (
              <button
                onClick={connectToNotion}
                className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Connect Notion Workspace
              </button>
            ) : (
              <a
                href="/dashboard"
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 