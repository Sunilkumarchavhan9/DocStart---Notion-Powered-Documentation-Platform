"use client";

import { useState } from "react";
import { Globe, Zap, CheckCircle } from "lucide-react";

export default function VercelDeploy({ projectSlug, projectName }: { projectSlug: string; projectName: string }) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const handleDeploy = async () => {
    setIsDeploying(true);
    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 2000));
    setDeployed(true);
    setIsDeploying(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Globe className="w-6 h-6 text-primary" />
        <h2 className="text-lg font-medium">Deploy to Vercel</h2>
      </div>

      {!deployed ? (
        <button
          onClick={handleDeploy}
          disabled={isDeploying}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isDeploying ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Deploying...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Deploy to Vercel
            </>
          )}
        </button>
      ) : (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span>Deployed successfully!</span>
        </div>
      )}
    </div>
  );
} 