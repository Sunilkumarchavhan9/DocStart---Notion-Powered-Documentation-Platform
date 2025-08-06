"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Activity {
  id: string;
  type: string;
  metadata: any;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  project?: {
    name: string;
  };
  document?: {
    title: string;
  };
}

interface ActivityFeedProps {
  projectSlug: string;
}

export default function ActivityFeed({ projectSlug }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
    // Set up polling for real-time updates
    const interval = setInterval(fetchActivities, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [projectSlug]);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/projects/${projectSlug}/activities`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityMessage = (activity: Activity) => {
    switch (activity.type) {
      case "PROJECT_CREATED":
        return `created project "${activity.project?.name}"`;
      case "PROJECT_UPDATED":
        return `updated project "${activity.project?.name}"`;
      case "DOCUMENT_CREATED":
        return `created document "${activity.document?.title}"`;
      case "DOCUMENT_UPDATED":
        return `updated document "${activity.document?.title}"`;
      case "DOCUMENT_PUBLISHED":
        return `published document "${activity.document?.title}"`;
      case "COMMENT_ADDED":
        return `commented on "${activity.document?.title}"`;
      case "MEMBER_ADDED":
        return `added a new member to the project`;
      case "MEMBER_REMOVED":
        return `removed a member from the project`;
      default:
        return "performed an action";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "PROJECT_CREATED":
        return "";
      case "PROJECT_UPDATED":
        return "";
      case "DOCUMENT_CREATED":
        return "";
      case "DOCUMENT_UPDATED":
        return "";
      case "DOCUMENT_PUBLISHED":
        return "";
      case "COMMENT_ADDED":
        return "";
      case "MEMBER_ADDED":
        return "";
      case "MEMBER_REMOVED":
        return "";
      default:
        return "Notification";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-serif text-foreground mb-4">Recent Activity</h3>
      
      <AnimatePresence>
        {activities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-muted-foreground"
          >
            <div className="text-4xl mb-2"></div>
            <p>No activity yet</p>
            <p className="text-sm">Activity will appear here as you work</p>
          </motion.div>
        ) : (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="text-2xl">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  {getActivityMessage(activity)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
} 