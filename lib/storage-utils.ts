// Storage utilities for documentation generator

export interface DocumentData {
  id: string;
  title: string;
  content: string;
  type: 'docs' | 'changelog' | 'faq';
  createdAt: string;
  updatedAt: string;
  metadata?: {
    description?: string;
    version?: string;
    tags?: string[];
    [key: string]: any;
  };
}

export interface StorageOptions {
  prefix?: string;
  encryption?: boolean;
  compression?: boolean;
}

// Local storage utilities
export class DocumentStorage {
  private prefix: string;
  private encryption: boolean;
  private compression: boolean;

  constructor(options: StorageOptions = {}) {
    this.prefix = options.prefix || 'doc-gen-';
    this.encryption = options.encryption || false;
    this.compression = options.compression || false;
  }

  // Save document to local storage
  saveDocument(document: DocumentData): boolean {
    try {
      const key = `${this.prefix}${document.id}`;
      let data = JSON.stringify(document);
      
      if (this.compression) {
        data = this.compress(data);
      }
      
      if (this.encryption) {
        data = this.encrypt(data);
      }
      
      localStorage.setItem(key, data);
      return true;
    } catch (error) {
      console.error('Failed to save document:', error);
      return false;
    }
  }

  // Load document from local storage
  loadDocument(id: string): DocumentData | null {
    try {
      const key = `${this.prefix}${id}`;
      let data = localStorage.getItem(key);
      
      if (!data) return null;
      
      if (this.encryption) {
        data = this.decrypt(data);
      }
      
      if (this.compression) {
        data = this.decompress(data);
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load document:', error);
      return null;
    }
  }

  // Get all documents
  getAllDocuments(): DocumentData[] {
    const documents: DocumentData[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        const id = key.replace(this.prefix, '');
        const document = this.loadDocument(id);
        if (document) {
          documents.push(document);
        }
      }
    }
    
    return documents.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  // Delete document
  deleteDocument(id: string): boolean {
    try {
      const key = `${this.prefix}${id}`;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to delete document:', error);
      return false;
    }
  }

  // Export all documents
  exportAllDocuments(): string {
    const documents = this.getAllDocuments();
    return JSON.stringify(documents, null, 2);
  }

  // Import documents
  importDocuments(jsonData: string): { success: number; failed: number } {
    try {
      const documents = JSON.parse(jsonData);
      let success = 0;
      let failed = 0;
      
      if (Array.isArray(documents)) {
        documents.forEach(doc => {
          if (this.saveDocument(doc)) {
            success++;
          } else {
            failed++;
          }
        });
      }
      
      return { success, failed };
    } catch (error) {
      console.error('Failed to import documents:', error);
      return { success: 0, failed: 1 };
    }
  }

  // Clear all documents
  clearAllDocuments(): boolean {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Failed to clear documents:', error);
      return false;
    }
  }

  // Get storage usage
  getStorageUsage(): { used: number; total: number; percentage: number } {
    let used = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        const value = localStorage.getItem(key);
        if (value) {
          used += key.length + value.length;
        }
      }
    }
    
    // Estimate total storage (varies by browser, typically 5-10MB)
    const total = 5 * 1024 * 1024; // 5MB estimate
    const percentage = (used / total) * 100;
    
    return { used, total, percentage };
  }

  // Create new document
  createDocument(title: string, type: 'docs' | 'changelog' | 'faq' = 'docs'): DocumentData {
    const id = this.generateId();
    const now = new Date().toISOString();
    
    return {
      id,
      title,
      content: '',
      type,
      createdAt: now,
      updatedAt: now,
      metadata: {
        description: '',
        version: '1.0.0',
        tags: []
      }
    };
  }

  // Update document
  updateDocument(id: string, updates: Partial<DocumentData>): boolean {
    const document = this.loadDocument(id);
    if (!document) return false;
    
    const updatedDocument = {
      ...document,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return this.saveDocument(updatedDocument);
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Simple compression (base64 encoding for demo)
  private compress(data: string): string {
    return btoa(data);
  }

  // Simple decompression
  private decompress(data: string): string {
    return atob(data);
  }

  // Simple encryption (base64 encoding for demo)
  private encrypt(data: string): string {
    return btoa(data);
  }

  // Simple decryption
  private decrypt(data: string): string {
    return atob(data);
  }
}

// Auto-save functionality
export class AutoSave {
  private storage: DocumentStorage;
  private interval: number;
  private currentDocument: DocumentData | null = null;
  private saveInterval: NodeJS.Timeout | null = null;

  constructor(storage: DocumentStorage, interval: number = 30000) { // 30 seconds
    this.storage = storage;
    this.interval = interval;
  }

  // Start auto-saving for a document
  startAutoSave(document: DocumentData): void {
    this.currentDocument = document;
    
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
    
    this.saveInterval = setInterval(() => {
      if (this.currentDocument) {
        this.storage.saveDocument(this.currentDocument);
      }
    }, this.interval);
  }

  // Stop auto-saving
  stopAutoSave(): void {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }
    this.currentDocument = null;
  }

  // Update current document content
  updateContent(content: string): void {
    if (this.currentDocument) {
      this.currentDocument.content = content;
      this.currentDocument.updatedAt = new Date().toISOString();
    }
  }

  // Force save now
  saveNow(): boolean {
    if (this.currentDocument) {
      return this.storage.saveDocument(this.currentDocument);
    }
    return false;
  }
}

// Export/Import utilities
export function exportToFile(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importFromFile(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          resolve(content);
        };
        reader.onerror = reject;
        reader.readAsText(file);
      } else {
        reject(new Error('No file selected'));
      }
    };
    
    input.click();
  });
} 