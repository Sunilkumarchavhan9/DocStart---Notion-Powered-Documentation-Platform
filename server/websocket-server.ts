import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';

const wss = new WebSocketServer({ port: 3001 });

// Store active connections by document
const documentConnections = new Map<string, Set<WebSocket>>();

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  const url = new URL(req.url || '', 'http://localhost');
  const documentId = url.searchParams.get('documentId');
  
  if (!documentId) {
    ws.close();
    return;
  }

  // Add to document connections
  if (!documentConnections.has(documentId)) {
    documentConnections.set(documentId, new Set());
  }
  documentConnections.get(documentId)!.add(ws);

  // Generate user info
  const userId = Math.random().toString(36).substr(2, 9);
  const userName = `User ${userId.slice(-4)}`;
  const userColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;

  console.log(`User connected: ${userId}`);

  // Notify others in the same document
  broadcastToDocument(documentId, {
    type: 'user_joined',
    user: { id: userId, userName, color: userColor }
  }, ws);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      switch (data.type) {
        case 'document_change':
          // Broadcast document change to all users in the document
          broadcastToDocument(documentId, {
            type: 'document_change',
            change: {
              userId,
              content: data.content,
              timestamp: new Date().toISOString()
            }
          });
          break;
          
        case 'typing_start':
          broadcastToDocument(documentId, {
            type: 'typing_start',
            userId,
            userName,
            color: userColor
          }, ws);
          break;
          
        case 'typing_stop':
          broadcastToDocument(documentId, {
            type: 'typing_stop',
            userId
          });
          break;
          
        case 'cursor_update':
          broadcastToDocument(documentId, {
            type: 'cursor_update',
            userId,
            position: data.position
          }, ws);
          break;
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`User disconnected: ${userId}`);
    
    // Remove from document connections
    const connections = documentConnections.get(documentId);
    if (connections) {
      connections.delete(ws);
      if (connections.size === 0) {
        documentConnections.delete(documentId);
      }
    }

    // Notify others that user left
    broadcastToDocument(documentId, {
      type: 'user_left',
      userId,
      userName,
      color: userColor
    });
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

function broadcastToDocument(documentId: string, message: any, excludeWs: WebSocket | null = null) {
  const connections = documentConnections.get(documentId);
  if (!connections) return;

  connections.forEach((ws) => {
    if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
}

console.log('WebSocket server running on port 3001'); 