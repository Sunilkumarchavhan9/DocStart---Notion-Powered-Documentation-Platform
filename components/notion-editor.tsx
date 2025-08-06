"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Palette,
  Type,
  Users,
  Save
} from "lucide-react";

interface NotionEditorProps {
  content: string;
  onChange: (content: string) => void;
  projectId: string;
  documentId: string;
  collaborators?: Array<{ id: string; name: string; color: string }>;
}

export default function NotionEditor({ 
  content, 
  onChange, 
  projectId, 
  documentId,
  collaborators = []
}: NotionEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontSize, setFontSize] = useState("16px");
  const [textColor, setTextColor] = useState("#000000");
  const [isCollaborating, setIsCollaborating] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [lastContent, setLastContent] = useState(content);

  // Handle content updates without cursor jumps
  useEffect(() => {
    if (editorRef.current && content !== lastContent) {
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const cursorPosition = range?.startOffset || 0;
      
      // Only update if the content is different and editor is not focused
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = content;
      }
      
      setLastContent(content);
    }
  }, [content, lastContent]);

  const fonts = [
    { name: "Inter", value: "Inter" },
    { name: "Roboto", value: "Roboto" },
    { name: "Open Sans", value: "Open Sans" },
    { name: "Lato", value: "Lato" },
    { name: "Poppins", value: "Poppins" },
    { name: "Montserrat", value: "Montserrat" },
  ];

  const colors = [
    "#000000", "#1a1a1a", "#333333", "#666666", "#999999",
    "#ff0000", "#ff6600", "#ffcc00", "#00ff00", "#00ccff",
    "#0066ff", "#6600ff", "#ff00ff", "#ff0066", "#ffffff"
  ];

  const formatText = (format: string) => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    // Use execCommand for real formatting
    document.execCommand('styleWithCSS', false, 'true');
    
    switch (format) {
      case "bold":
        document.execCommand('bold', false, '');
        break;
      case "italic":
        document.execCommand('italic', false, '');
        break;
      case "underline":
        document.execCommand('underline', false, '');
        break;
      case "h1":
        document.execCommand('formatBlock', false, 'h1');
        break;
      case "h2":
        document.execCommand('formatBlock', false, 'h2');
        break;
      case "h3":
        document.execCommand('formatBlock', false, 'h3');
        break;
      case "code":
        const codeElement = document.createElement('code');
        codeElement.style.backgroundColor = '#f3f4f6';
        codeElement.style.padding = '2px 4px';
        codeElement.style.borderRadius = '4px';
        codeElement.style.fontFamily = 'monospace';
        
        try {
          range.surroundContents(codeElement);
        } catch (e) {
          // Fallback if range spans multiple elements
          codeElement.appendChild(range.extractContents());
          range.insertNode(codeElement);
        }
        break;
      case "link":
        const url = prompt('Enter URL:');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        break;
    }
    
    // Update content
    onChange(editorRef.current.innerHTML);
    setShowFormatMenu(false);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString());
      setShowFormatMenu(true);
    } else {
      setShowFormatMenu(false);
    }
  };

  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "/") {
      // Get cursor position for slash menu
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSlashMenuPosition({ 
          x: rect.left, 
          y: rect.bottom + window.scrollY 
        });
        setShowSlashMenu(true);
      }
    } else if (e.key === "Escape") {
      setShowSlashMenu(false);
      setShowFormatMenu(false);
    } else if (e.key === "Enter" && e.ctrlKey) {
      // Ctrl+Enter for line break
      e.preventDefault();
      document.execCommand('insertHTML', false, '<br><br>');
      onChange(editorRef.current?.innerHTML || '');
    } else if (e.key === "s" && e.ctrlKey) {
      // Ctrl+S for save
      e.preventDefault();
      // Trigger save by calling onChange with current content
      onChange(editorRef.current?.innerHTML || '');
      // You can also add a visual indicator here
      console.log('Save shortcut triggered');
    }
  };

  const insertBlock = (type: string) => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    switch (type) {
      case "h1":
      case "h2":
      case "h3":
        document.execCommand('formatBlock', false, type);
        break;
      case "list":
        document.execCommand('insertUnorderedList', false, '');
        break;
      case "ordered":
        document.execCommand('insertOrderedList', false, '');
        break;
      case "quote":
        const blockquote = document.createElement('blockquote');
        blockquote.style.borderLeft = '4px solid #e5e7eb';
        blockquote.style.paddingLeft = '16px';
        blockquote.style.margin = '16px 0';
        blockquote.style.fontStyle = 'italic';
        blockquote.innerHTML = 'Quote block';
        document.execCommand('insertHTML', false, blockquote.outerHTML);
        break;
      case "code":
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.style.backgroundColor = '#f3f4f6';
        code.style.padding = '16px';
        code.style.borderRadius = '8px';
        code.style.display = 'block';
        code.style.fontFamily = 'monospace';
        code.innerHTML = 'Code block';
        pre.appendChild(code);
        document.execCommand('insertHTML', false, pre.outerHTML);
        break;
      case "image":
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          const img = document.createElement('img');
          img.src = imageUrl;
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          img.alt = 'Image';
          document.execCommand('insertHTML', false, img.outerHTML);
        }
        break;
      case "link":
        const linkText = prompt('Enter link text:');
        const linkUrl = prompt('Enter URL:');
        if (linkText && linkUrl) {
          const a = document.createElement('a');
          a.href = linkUrl;
          a.textContent = linkText;
          a.style.color = '#3b82f6';
          a.style.textDecoration = 'underline';
          document.execCommand('insertHTML', false, a.outerHTML);
        }
        break;
    }

    onChange(editorRef.current.innerHTML);
    setShowSlashMenu(false);
  };

  // Auto-save functionality
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (content && content !== lastContent) {
        handleAutoSave();
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [content, lastContent]);

  const handleAutoSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Here you would make actual API call to save
      // await fetch(`/api/projects/${projectId}/documents/${documentId}`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ content }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCollaboration = () => {
    setIsCollaborating(!isCollaborating);
    // Here you would integrate with real-time collaboration service
    // like Socket.io, WebRTC, or a service like ShareDB
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Toolbar */}
      <div className="sticky top-0 z-40 bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Left side - Formatting tools */}
          <div className="flex items-center space-x-2">
            {/* Font Family */}
            <div className="relative">
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {fonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div className="relative">
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="32px">32px</option>
              </select>
            </div>

            {/* Text Color */}
            <div className="relative">
              <button
                onClick={() => setShowFormatMenu(!showFormatMenu)}
                className="p-2 hover:bg-accent rounded-md transition-colors"
              >
                <Palette className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Text Formatting */}
            <button
              onClick={() => formatText("bold")}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText("italic")}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText("underline")}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Headings */}
            <button
              onClick={() => insertBlock("h1")}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertBlock("h2")}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertBlock("h3")}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Lists */}
            <button
              onClick={() => insertBlock("list")}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertBlock("ordered")}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Other formatting */}
            <button
              onClick={() => insertBlock("quote")}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertBlock("code")}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              title="Code Block"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertBlock("link")}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              title="Link"
            >
              <Link className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertBlock("image")}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              title="Image"
            >
              <Image className="w-4 h-4" />
            </button>
          </div>

          {/* Right side - Collaboration and save */}
          <div className="flex items-center space-x-2">
            {/* Collaboration toggle */}
            <button
              onClick={toggleCollaboration}
              className={`p-2 rounded-md transition-colors ${
                isCollaborating 
                  ? "bg-green-500 text-white" 
                  : "hover:bg-accent"
              }`}
              title="Toggle Collaboration"
            >
              <Users className="w-4 h-4" />
            </button>

            {/* Save button with status */}
            <div className="flex items-center gap-2">
              {isSaving && (
                <div className="text-xs text-muted-foreground">Saving...</div>
              )}
              {lastSaved && !isSaving && (
                <div className="text-xs text-muted-foreground">
                  Saved {lastSaved.toLocaleTimeString()}
                </div>
              )}
              <button
                onClick={handleAutoSave}
                className="p-2 hover:bg-accent rounded-md transition-colors"
                title="Save Now"
                disabled={isSaving}
              >
                <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Color picker menu */}
        {showFormatMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 left-0 bg-card border border-border rounded-lg p-4 shadow-lg z-50 min-w-[200px]"
          >
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color}        
                  onClick={() => {
                    if (editorRef.current) {
                      document.execCommand('foreColor', false, color);
                      onChange(editorRef.current.innerHTML);
                    }
                    setTextColor(color);
                    setShowFormatMenu(false);
                  }}
                  className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Slash command menu */}
        {showSlashMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bg-card border border-border rounded-lg shadow-lg z-50 min-w-[250px]"
            style={{ 
              left: slashMenuPosition.x, 
              top: slashMenuPosition.y 
            }}
          >
            <div className="p-2">
              <div className="text-xs text-muted-foreground mb-2 px-2">BASIC BLOCKS</div>
              <button
                onClick={() => insertBlock('h1')}
                className="w-full text-left px-3 py-2 hover:bg-accent rounded-md flex items-center gap-3"
              >
                <Heading1 className="w-4 h-4" />
                <div>
                  <div className="font-medium">Heading 1</div>
                  <div className="text-xs text-muted-foreground">Big section heading</div>
                </div>
              </button>
              <button
                onClick={() => insertBlock('h2')}
                className="w-full text-left px-3 py-2 hover:bg-accent rounded-md flex items-center gap-3"
              >
                <Heading2 className="w-4 h-4" />
                <div>
                  <div className="font-medium">Heading 2</div>
                  <div className="text-xs text-muted-foreground">Medium section heading</div>
                </div>
              </button>
              <button
                onClick={() => insertBlock('h3')}
                className="w-full text-left px-3 py-2 hover:bg-accent rounded-md flex items-center gap-3"
              >
                <Heading3 className="w-4 h-4" />
                <div>
                  <div className="font-medium">Heading 3</div>
                  <div className="text-xs text-muted-foreground">Small section heading</div>
                </div>
              </button>
              <button
                onClick={() => insertBlock('list')}
                className="w-full text-left px-3 py-2 hover:bg-accent rounded-md flex items-center gap-3"
              >
                <List className="w-4 h-4" />
                <div>
                  <div className="font-medium">Bulleted list</div>
                  <div className="text-xs text-muted-foreground">Create a simple bulleted list</div>
                </div>
              </button>
              <button
                onClick={() => insertBlock('ordered')}
                className="w-full text-left px-3 py-2 hover:bg-accent rounded-md flex items-center gap-3"
              >
                <ListOrdered className="w-4 h-4" />
                <div>
                  <div className="font-medium">Numbered list</div>
                  <div className="text-xs text-muted-foreground">Create a list with numbering</div>
                </div>
              </button>
              <button
                onClick={() => insertBlock('quote')}
                className="w-full text-left px-3 py-2 hover:bg-accent rounded-md flex items-center gap-3"
              >
                <Quote className="w-4 h-4" />
                <div>
                  <div className="font-medium">Quote</div>
                  <div className="text-xs text-muted-foreground">Capture a quote</div>
                </div>
              </button>
              <button
                onClick={() => insertBlock('code')}
                className="w-full text-left px-3 py-2 hover:bg-accent rounded-md flex items-center gap-3"
              >
                <Code className="w-4 h-4" />
                <div>
                  <div className="font-medium">Code</div>
                  <div className="text-xs text-muted-foreground">Capture a code snippet</div>
                </div>
              </button>
              <div className="border-t border-border my-2"></div>
              <div className="text-xs text-muted-foreground mb-2 px-2">MEDIA</div>
              <button
                onClick={() => insertBlock('image')}
                className="w-full text-left px-3 py-2 hover:bg-accent rounded-md flex items-center gap-3"
              >
                <Image className="w-4 h-4" />
                <div>
                  <div className="font-medium">Image</div>
                  <div className="text-xs text-muted-foreground">Upload or embed with link</div>
                </div>
              </button>
              <button
                onClick={() => insertBlock('link')}
                className="w-full text-left px-3 py-2 hover:bg-accent rounded-md flex items-center gap-3"
              >
                <Link className="w-4 h-4" />
                <div>
                  <div className="font-medium">Link</div>
                  <div className="text-xs text-muted-foreground">Create a web link</div>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Editor */}
      <div className="max-w-4xl mx-auto p-8">
        <div
          ref={editorRef}
          contentEditable
          onInput={(e) => {
            const newContent = e.currentTarget.innerHTML;
            onChange(newContent);
          }}
          onBlur={(e) => {
            // Only update if content actually changed to prevent cursor jumps
            if (e.currentTarget.innerHTML !== content) {
              onChange(e.currentTarget.innerHTML);
            }
          }}
          onSelect={handleTextSelection}
          onKeyDown={handleKeyDown}
          className="min-h-[600px] p-6 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary prose prose-lg max-w-none"
          style={{
            fontFamily: fontFamily,
            fontSize: fontSize,
            color: textColor,
          }}
          suppressContentEditableWarning={true}
        />

        {/* Collaboration indicators */}
        {isCollaborating && collaborators.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Collaborators Online
              </span>
            </div>
            <div className="flex items-center gap-2">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center gap-2 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: collaborator.color }}
                  />
                  <span>{collaborator.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 