import { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponseServerIO } from "@/lib/socket-server";
import { initSocketServer } from "@/lib/socket-server";

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...");
    
    const httpServer: NetServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;
    
    // Initialize collaboration server
    initSocketServer(io);
  }

  res.status(200).json({ message: "Socket.IO server is running" });
} 