import { prisma } from "./prisma";

type ActivityType = 
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED"
  | "DOCUMENT_CREATED"
  | "DOCUMENT_UPDATED"
  | "DOCUMENT_PUBLISHED"
  | "COMMENT_ADDED"
  | "MEMBER_ADDED"
  | "MEMBER_REMOVED";

interface LogActivityParams {
  type: ActivityType;
  userId: string;
  projectId?: string;
  documentId?: string;
  metadata?: any;
}

export async function logActivity({
  type,
  userId,
  projectId,
  documentId,
  metadata,
}: LogActivityParams) {
  try {
    await prisma.activity.create({
      data: {
        type,
        userId,
        projectId,
        documentId,
        metadata,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

// Convenience functions for common activities
export async function logProjectCreated(userId: string, projectId: string, projectName: string) {
  await logActivity({
    type: "PROJECT_CREATED",
    userId,
    projectId,
    metadata: { projectName },
  });
}

export async function logProjectUpdated(userId: string, projectId: string, projectName: string) {
  await logActivity({
    type: "PROJECT_UPDATED",
    userId,
    projectId,
    metadata: { projectName },
  });
}

export async function logDocumentCreated(userId: string, projectId: string, documentId: string, documentTitle: string) {
  await logActivity({
    type: "DOCUMENT_CREATED",
    userId,
    projectId,
    documentId,
    metadata: { documentTitle },
  });
}

export async function logDocumentUpdated(userId: string, projectId: string, documentId: string, documentTitle: string) {
  await logActivity({
    type: "DOCUMENT_UPDATED",
    userId,
    projectId,
    documentId,
    metadata: { documentTitle },
  });
}

export async function logDocumentPublished(userId: string, projectId: string, documentId: string, documentTitle: string) {
  await logActivity({
    type: "DOCUMENT_PUBLISHED",
    userId,
    projectId,
    documentId,
    metadata: { documentTitle },
  });
}

export async function logCommentAdded(userId: string, projectId: string, documentId: string, documentTitle: string) {
  await logActivity({
    type: "COMMENT_ADDED",
    userId,
    projectId,
    documentId,
    metadata: { documentTitle },
  });
}

export async function logMemberAdded(userId: string, projectId: string, memberName: string) {
  await logActivity({
    type: "MEMBER_ADDED",
    userId,
    projectId,
    metadata: { memberName },
  });
}

export async function logMemberRemoved(userId: string, projectId: string, memberName: string) {
  await logActivity({
    type: "MEMBER_REMOVED",
    userId,
    projectId,
    metadata: { memberName },
  });
} 