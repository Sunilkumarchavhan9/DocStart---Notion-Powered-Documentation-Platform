// Markdown processing utilities for documentation generator

export interface MarkdownSection {
  title: string;
  content: string;
  type: 'docs' | 'changelog' | 'faq';
}

// Default templates for different content types
export const defaultTemplates = {
  docs: `# Getting Started

Welcome to our documentation! This guide will help you get up and running quickly.

## Installation

\`\`\`bash
npm install your-package
\`\`\`

## Quick Start

1. Import the package
2. Initialize with your config
3. Start building!

## Features

- **Feature 1**: Description of feature 1
- **Feature 2**: Description of feature 2
- **Feature 3**: Description of feature 3

## API Reference

### \`functionName()\`

Description of the function.

**Parameters:**
- \`param1\` (string): Description
- \`param2\` (number): Description

**Returns:** Description of return value

**Example:**
\`\`\`javascript
const result = functionName('example', 42);
\`\`\`

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option1 | string | 'default' | Description |
| option2 | boolean | true | Description |

## Examples

### Basic Example

\`\`\`javascript
// Your code example here
const example = new Example();
example.doSomething();
\`\`\`

### Advanced Example

\`\`\`javascript
// More complex example
const config = {
  option1: 'value',
  option2: true
};
\`\`\`

## Troubleshooting

### Common Issues

**Issue 1:** Description of issue
**Solution:** How to fix it

**Issue 2:** Description of issue  
**Solution:** How to fix it

## Support

Need help? Contact us at support@example.com`,

  changelog: `# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- New feature 1
- New feature 2

### Changed
- Updated existing feature

### Fixed
- Bug fix 1
- Bug fix 2

## [1.0.0] - 2024-01-01

### Added
- Initial release
- Core functionality
- Basic features

### Changed
- N/A

### Fixed
- N/A

## [0.9.0] - 2023-12-01

### Added
- Beta features
- Experimental functionality

### Changed
- API improvements
- Performance optimizations

### Fixed
- Various bug fixes

## [0.8.0] - 2023-11-01

### Added
- Early access features

### Changed
- Breaking changes documented

### Fixed
- Critical bug fixes

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your-repo/tags).

## Release Types

- **Major**: Breaking changes
- **Minor**: New features, backwards compatible
- **Patch**: Bug fixes, backwards compatible`,

  faq: `# Frequently Asked Questions

## General Questions

### What is this product?

This is a brief description of what your product does and who it's for.

### How do I get started?

1. Sign up for an account
2. Follow the getting started guide
3. Start using the product

### Is there a free trial?

Yes, we offer a 14-day free trial with full access to all features.

## Technical Questions

### What browsers are supported?

We support all modern browsers:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Do you have an API?

Yes, we provide a RESTful API with comprehensive documentation.

### Can I self-host this?

Currently, we only offer cloud-hosted solutions. Self-hosting may be available in the future.

## Pricing & Billing

### What payment methods do you accept?

We accept all major credit cards, PayPal, and bank transfers for annual plans.

### Can I cancel anytime?

Yes, you can cancel your subscription at any time. No long-term contracts required.

### Do you offer refunds?

We offer a 30-day money-back guarantee for all paid plans.

## Security & Privacy

### Is my data secure?

Yes, we use industry-standard encryption and security practices to protect your data.

### Where is my data stored?

Your data is stored in secure, SOC 2 compliant data centers.

### Do you comply with GDPR?

Yes, we are fully GDPR compliant and provide tools to help you meet your compliance requirements.

## Support

### How can I get help?

- Email: support@example.com
- Documentation: docs.example.com
- Community: community.example.com

### What are your support hours?

We provide 24/7 support for enterprise customers and business hours support for all other plans.

### Do you offer custom integrations?

Yes, we offer custom integration services for enterprise customers.` 
};

// Function to process markdown content
export function processMarkdown(content: string): string {
  // Basic markdown processing - you can extend this with more features
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
    .replace(/^### (.*$)/gim, '<h3>$1</h3>') // H3 headers
    .replace(/^## (.*$)/gim, '<h2>$1</h2>') // H2 headers
    .replace(/^# (.*$)/gim, '<h1>$1</h1>') // H1 headers
    .replace(/^- (.*$)/gim, '<li>$1</li>') // List items
    .replace(/\n\n/g, '</p><p>') // Paragraphs
    .replace(/^<p>/, '') // Remove first <p>
    .replace(/<\/p>$/, ''); // Remove last </p>
}

// Function to extract sections from markdown
export function extractSections(content: string): MarkdownSection[] {
  const sections: MarkdownSection[] = [];
  const lines = content.split('\n');
  let currentSection: MarkdownSection | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    if (line.startsWith('# ')) {
      // Save previous section
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        sections.push(currentSection);
      }
      
      // Start new section
      const title = line.substring(2).trim();
      currentSection = {
        title,
        content: '',
        type: 'docs' // Default type
      };
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    currentSection.content = currentContent.join('\n').trim();
    sections.push(currentSection);
  }

  return sections;
}

// Function to generate table of contents
export function generateTOC(content: string): string {
  const lines = content.split('\n');
  const toc: string[] = [];
  
  lines.forEach((line, index) => {
    if (line.startsWith('## ')) {
      const title = line.substring(3).trim();
      const anchor = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      toc.push(`- [${title}](#${anchor})`);
    }
  });

  return toc.length > 0 ? `## Table of Contents\n\n${toc.join('\n')}\n\n` : '';
}

// Function to validate markdown syntax
export function validateMarkdown(content: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for unclosed code blocks
  const codeBlockCount = (content.match(/```/g) || []).length;
  if (codeBlockCount % 2 !== 0) {
    errors.push('Unclosed code block detected');
  }
  
  // Check for unclosed bold/italic
  const boldCount = (content.match(/\*\*/g) || []).length;
  if (boldCount % 2 !== 0) {
    errors.push('Unclosed bold formatting detected');
  }
  
  const italicCount = (content.match(/\*/g) || []).length;
  if (italicCount % 2 !== 0) {
    errors.push('Unclosed italic formatting detected');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Function to export markdown to HTML
export function markdownToHTML(markdown: string): string {
  // This is a basic implementation - you might want to use a proper markdown parser
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>');
  
  // Wrap in paragraphs
  html = `<p>${html}</p>`;
  
  return html;
}

// Function to get word count
export function getWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}

// Function to get reading time estimate
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = getWordCount(content);
  return Math.ceil(wordCount / wordsPerMinute);
} 