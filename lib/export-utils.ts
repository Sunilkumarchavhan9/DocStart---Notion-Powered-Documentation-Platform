// Export utilities for documentation generator

export interface ExportOptions {
  format: 'html' | 'markdown' | 'json';
  includeStyles?: boolean;
  includeScripts?: boolean;
  theme?: 'light' | 'dark';
  title?: string;
  description?: string;
}

// Generate complete HTML document
export function generateHTMLDocument(
  content: string, 
  options: ExportOptions = { format: 'html' }
): string {
  const { title = 'Documentation', description = '', theme = 'light' } = options;
  
  const styles = `
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: ${theme === 'dark' ? '#e5e5e5' : '#333'};
        background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }
      
      h1, h2, h3, h4, h5, h6 {
        color: ${theme === 'dark' ? '#ffffff' : '#000000'};
        margin-top: 2rem;
        margin-bottom: 1rem;
      }
      
      h1 { font-size: 2.5rem; border-bottom: 2px solid #007acc; padding-bottom: 0.5rem; }
      h2 { font-size: 2rem; border-bottom: 1px solid #007acc; padding-bottom: 0.3rem; }
      h3 { font-size: 1.5rem; }
      
      code {
        background: ${theme === 'dark' ? '#2d2d2d' : '#f5f5f5'};
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.9em;
      }
      
      pre {
        background: ${theme === 'dark' ? '#2d2d2d' : '#f5f5f5'};
        padding: 1rem;
        border-radius: 6px;
        overflow-x: auto;
        border: 1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'};
      }
      
      pre code {
        background: none;
        padding: 0;
      }
      
      blockquote {
        border-left: 4px solid #007acc;
        margin: 1rem 0;
        padding-left: 1rem;
        color: ${theme === 'dark' ? '#b0b0b0' : '#666'};
      }
      
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1rem 0;
      }
      
      th, td {
        border: 1px solid ${theme === 'dark' ? '#404040' : '#ddd'};
        padding: 0.5rem;
        text-align: left;
      }
      
      th {
        background: ${theme === 'dark' ? '#2d2d2d' : '#f5f5f5'};
        font-weight: bold;
      }
      
      ul, ol {
        padding-left: 2rem;
      }
      
      li {
        margin: 0.5rem 0;
      }
      
      a {
        color: #007acc;
        text-decoration: none;
      }
      
      a:hover {
        text-decoration: underline;
      }
      
      .toc {
        background: ${theme === 'dark' ? '#2d2d2d' : '#f9f9f9'};
        padding: 1rem;
        border-radius: 6px;
        margin: 1rem 0;
        border: 1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'};
      }
      
      .toc ul {
        list-style: none;
        padding-left: 0;
      }
      
      .toc li {
        margin: 0.25rem 0;
      }
      
      .toc a {
        color: ${theme === 'dark' ? '#e5e5e5' : '#333'};
      }
      
      @media print {
        body { max-width: none; }
        pre { white-space: pre-wrap; }
      }
    </style>
  `;

  const scripts = `
    <script>
      // Add smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
      
      // Add copy button to code blocks
      document.querySelectorAll('pre').forEach(block => {
        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.style.cssText = \`
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: #007acc;
          color: white;
          border: none;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          cursor: pointer;
          font-size: 0.8rem;
        \`;
        
        block.style.position = 'relative';
        block.appendChild(button);
        
        button.addEventListener('click', () => {
          const code = block.querySelector('code');
          if (code) {
            navigator.clipboard.writeText(code.textContent || '');
            button.textContent = 'Copied!';
            setTimeout(() => {
              button.textContent = 'Copy';
            }, 2000);
          }
        });
      });
    </script>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  ${styles}
</head>
<body>
  <div class="markdown-content">
    ${content}
  </div>
  ${scripts}
</body>
</html>`;
}

// Export to JSON format
export function exportToJSON(content: string, metadata: any = {}): string {
  const sections = content.split('\n\n').filter(section => section.trim());
  
  const jsonData = {
    metadata: {
      title: metadata.title || 'Documentation',
      description: metadata.description || '',
      version: metadata.version || '1.0.0',
      lastUpdated: new Date().toISOString(),
      ...metadata
    },
    content: sections.map(section => {
      const lines = section.split('\n');
      const title = lines[0].startsWith('#') ? lines[0].replace(/^#+\s*/, '') : '';
      const body = lines.slice(1).join('\n').trim();
      
      return {
        title,
        body,
        type: lines[0].startsWith('# ') ? 'h1' : 
              lines[0].startsWith('## ') ? 'h2' : 
              lines[0].startsWith('### ') ? 'h3' : 'text'
      };
    }),
    stats: {
      wordCount: content.split(/\s+/).length,
      sectionCount: sections.length,
      characterCount: content.length
    }
  };
  
  return JSON.stringify(jsonData, null, 2);
}

// Generate deployment-ready files
export function generateDeploymentFiles(
  content: string, 
  options: ExportOptions = { format: 'html' }
): { [filename: string]: string } {
  const files: { [filename: string]: string } = {};
  
  // Main HTML file
  files['index.html'] = generateHTMLDocument(content, options);
  
  // README for deployment
  files['README.md'] = `# Documentation Site

This is an auto-generated documentation site.

## Deployment

### Vercel
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Netlify
1. Push to GitHub
2. Connect repository to Netlify
3. Set build command: \`echo "Static site - no build needed"\`
4. Set publish directory: \`.\`

### GitHub Pages
1. Push to GitHub
2. Go to repository settings
3. Enable GitHub Pages
4. Select source branch

## Customization

Edit the \`index.html\` file to customize styles and layout.
`;

  // Package.json for Node.js deployment
  files['package.json'] = JSON.stringify({
    name: "documentation-site",
    version: "1.0.0",
    description: "Auto-generated documentation site",
    scripts: {
      "start": "npx serve .",
      "dev": "npx serve ."
    },
    dependencies: {},
    devDependencies: {
      "serve": "^14.0.0"
    }
  }, null, 2);

  // Vercel configuration
  files['vercel.json'] = JSON.stringify({
    "version": 2,
    "builds": [
      {
        "src": "index.html",
        "use": "@vercel/static"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "/index.html"
      }
    ]
  }, null, 2);

  return files;
}

// Generate sitemap
export function generateSitemap(baseUrl: string, sections: string[]): string {
  const urls = sections.map(section => {
    const anchor = section.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `  <url>
    <loc>${baseUrl}#${anchor}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${urls.join('\n')}
</urlset>`;
}

// Generate RSS feed
export function generateRSSFeed(
  title: string, 
  description: string, 
  baseUrl: string, 
  sections: string[]
): string {
  const items = sections.map(section => {
    const anchor = section.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `  <item>
    <title>${section}</title>
    <link>${baseUrl}#${anchor}</link>
    <guid>${baseUrl}#${anchor}</guid>
    <pubDate>${new Date().toUTCString()}</pubDate>
  </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${title}</title>
    <link>${baseUrl}</link>
    <description>${description}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>`;
} 