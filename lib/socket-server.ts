import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./prisma";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

interface DocumentChange {
  documentId: string;
  content: string;
  cursor?: {
    line: number;
    ch: number;
  };
  userId: string;
  userName: string;
}

interface UserPresence {
  userId: string;
  userName: string;
  documentId: string;
  cursor?: {
    line: number;
    ch: number;
  };
}

class CollaborationServer {
  private io: SocketIOServer;
  private documentSessions: Map<string, Set<string>> = new Map(); // documentId -> Set of socketIds
  private userSessions: Map<string, UserPresence> = new Map(); // socketId -> UserPresence

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Join document room
      socket.on("join-document", async (data: { documentId: string; userId: string; userName: string }) => {
        const { documentId, userId, userName } = data;
        
        // Verify user has access to document
        const document = await prisma.document.findFirst({
          where: { id: documentId },
          include: {
            project: {
              include: {
                members: {
                  where: { userId }
                }
              }
            }
          }
        });

        if (!document) {
          socket.emit("error", { message: "Document not found" });
          return;
        }

        // Check if user has access
        const hasAccess = 
          document.project.userId === userId || 
          document.project.members.length > 0 ||
          document.project.isPublic;

        if (!hasAccess) {
          socket.emit("error", { message: "Access denied" });
          return;
        }

        // Join the document room
        socket.join(`document-${documentId}`);
        
        // Track user session
        this.userSessions.set(socket.id, {
          userId,
          userName,
          documentId,
        });

        // Track document session
        if (!this.documentSessions.has(documentId)) {
          this.documentSessions.set(documentId, new Set());
        }
        this.documentSessions.get(documentId)!.add(socket.id);

        // Notify others in the room
        socket.to(`document-${documentId}`).emit("user-joined", {
          userId,
          userName,
          socketId: socket.id,
        });

        // Send current users in the room
        const usersInRoom = Array.from(this.documentSessions.get(documentId) || [])
          .map(socketId => this.userSessions.get(socketId))
          .filter(Boolean);

        socket.emit("room-users", usersInRoom);
      });

      // Handle document changes
      socket.on("document-change", async (data: DocumentChange) => {
        const { documentId, content, cursor, userId, userName } = data;
        
        // Broadcast change to other users in the room
        socket.to(`document-${documentId}`).emit("document-updated", {
          content,
          cursor,
          userId,
          userName,
          timestamp: new Date().toISOString(),
        });

        // Update user's cursor position
        const userSession = this.userSessions.get(socket.id);
        if (userSession && userSession.documentId === documentId) {
          userSession.cursor = cursor;
          this.userSessions.set(socket.id, userSession);
        }
      });

      // Handle cursor position updates
      socket.on("cursor-update", (data: { documentId: string; cursor: { line: number; ch: number } }) => {
        const { documentId, cursor } = data;
        
        const userSession = this.userSessions.get(socket.id);
        if (userSession && userSession.documentId === documentId) {
          userSession.cursor = cursor;
          this.userSessions.set(socket.id, userSession);
          
          // Broadcast cursor position to others
          socket.to(`document-${documentId}`).emit("cursor-updated", {
            userId: userSession.userId,
            userName: userSession.userName,
            cursor,
            socketId: socket.id,
          });
        }
      });

      // Handle typing indicators
      socket.on("typing-start", (data: { documentId: string }) => {
        const { documentId } = data;
        const userSession = this.userSessions.get(socket.id);
        
        if (userSession && userSession.documentId === documentId) {
          socket.to(`document-${documentId}`).emit("user-typing", {
            userId: userSession.userId,
            userName: userSession.userName,
            socketId: socket.id,
          });
        }
      });

      socket.on("typing-stop", (data: { documentId: string }) => {
        const { documentId } = data;
        socket.to(`document-${documentId}`).emit("user-stopped-typing", {
          socketId: socket.id,
        });
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        
        const userSession = this.userSessions.get(socket.id);
        if (userSession) {
          const { documentId, userId, userName } = userSession;
          
          // Remove from document session
          const documentSession = this.documentSessions.get(documentId);
          if (documentSession) {
            documentSession.delete(socket.id);
            if (documentSession.size === 0) {
              this.documentSessions.delete(documentId);
            }
          }

          // Notify others
          socket.to(`document-${documentId}`).emit("user-left", {
            userId,
            userName,
            socketId: socket.id,
          });

          // Clean up user session
          this.userSessions.delete(socket.id);
        }
      });
    });
  }
}

export function initSocketServer(io: SocketIOServer) {
  return new CollaborationServer(io);
} 