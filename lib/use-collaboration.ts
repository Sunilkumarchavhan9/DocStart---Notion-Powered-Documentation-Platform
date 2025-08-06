import { useState, useEffect, useRef } from 'react';

interface User {
  id: string;
  userName: string;
  color: string;
}

interface DocumentChange {
  userId: string;
  content: string;
  timestamp: string;
}

interface CursorPosition {
  line: number;
  ch: number;
}

interface UseCollaborationProps {
  documentId: string;
  onDocumentChange?: (change: DocumentChange) => void;
  onUserJoined?: (user: User) => void;
  onUserLeft?: (user: User) => void;
}

export function useCollaboration({
  documentId,
  onDocumentChange,
  onUserJoined,
  onUserLeft,
}: UseCollaborationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<User[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!documentId) return;

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(`ws://localhost:3001/collaboration?documentId=${documentId}`);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          console.log('Connected to collaboration server');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
              case 'user_joined':
                setUsers(prev => [...prev, data.user]);
                onUserJoined?.(data.user);
                break;
                
              case 'user_left':
                setUsers(prev => prev.filter(u => u.id !== data.userId));
                onUserLeft?.({ id: data.userId, userName: data.userName, color: data.color });
                break;
                
              case 'document_change':
                onDocumentChange?.(data.change);
                break;
                
              case 'typing_start':
                setTypingUsers(prev => {
                  const existing = prev.find(u => u.id === data.userId);
                  if (!existing) {
                    return [...prev, { id: data.userId, userName: data.userName, color: data.color }];
                  }
                  return prev;
                });
                break;
                
              case 'typing_stop':
                setTypingUsers(prev => prev.filter(u => u.id !== data.userId));
                break;
                
              case 'cursor_update':
                // Handle cursor position updates
                break;
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          console.log('Disconnected from collaboration server');
          
          // Attempt to reconnect after 5 seconds
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect to collaboration server...');
            connectWebSocket();
          }, 5000);
        };

        ws.onerror = (error) => {
          console.warn('WebSocket connection failed - collaboration features will be disabled');
          setIsConnected(false);
        };

      } catch (error) {
        console.warn('Failed to create WebSocket connection - collaboration features will be disabled');
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [documentId, onDocumentChange, onUserJoined, onUserLeft]);

  const sendMessage = (type: string, payload: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, ...payload }));
    } else {
      // Silently fail if WebSocket is not connected
      // This prevents errors when collaboration server is not available
    }
  };

  const sendDocumentChange = (content: string) => {
    sendMessage('document_change', { content });
  };

  const sendCursorUpdate = (position: CursorPosition) => {
    sendMessage('cursor_update', { position });
  };

  const handleTyping = () => {
    sendMessage('typing_start', {});
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendMessage('typing_stop', {});
    }, 1000);
  };

  return {
    isConnected,
    users,
    typingUsers,
    sendDocumentChange,
    sendCursorUpdate,
    handleTyping,
  };
} 