// Validation utilities for documentation generator

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
}

export interface ValidationError {
  type: 'syntax' | 'structure' | 'content' | 'format';
  message: string;
  line?: number;
  column?: number;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationWarning {
  type: 'style' | 'best_practice' | 'accessibility';
  message: string;
  line?: number;
  suggestion?: string;
}

export interface ValidationSuggestion {
  type: 'improvement' | 'optimization' | 'accessibility';
  message: string;
  line?: number;
  suggestion: string;
}

// Main validation function
export function validateMarkdownContent(content: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: []
  };

  // Check for basic syntax errors
  const syntaxErrors = validateSyntax(content);
  result.errors.push(...syntaxErrors);

  // Check for structural issues
  const structureErrors = validateStructure(content);
  result.errors.push(...structureErrors);

  // Check for content quality
  const contentWarnings = validateContentQuality(content);
  result.warnings.push(...contentWarnings);

  // Check for accessibility issues
  const accessibilitySuggestions = validateAccessibility(content);
  result.suggestions.push(...accessibilitySuggestions);

  // Check for best practices
  const bestPracticeSuggestions = validateBestPractices(content);
  result.suggestions.push(...bestPracticeSuggestions);

  // Update overall validity
  result.isValid = result.errors.filter(e => e.severity === 'error').length === 0;

  return result;
}

// Validate basic markdown syntax
function validateSyntax(content: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Check for unclosed code blocks
    if (line.includes('```') && !line.trim().startsWith('```')) {
      errors.push({
        type: 'syntax',
        message: 'Code block markers should be on their own line',
        line: lineNumber,
        severity: 'error'
      });
    }

    // Check for unclosed bold/italic
    const boldMatches = line.match(/\*\*/g);
    if (boldMatches && boldMatches.length % 2 !== 0) {
      errors.push({
        type: 'syntax',
        message: 'Unclosed bold formatting',
        line: lineNumber,
        severity: 'error'
      });
    }

    const italicMatches = line.match(/\*/g);
    if (italicMatches && italicMatches.length % 2 !== 0) {
      errors.push({
        type: 'syntax',
        message: 'Unclosed italic formatting',
        line: lineNumber,
        severity: 'error'
      });
    }

    // Check for unclosed inline code
    const codeMatches = line.match(/`/g);
    if (codeMatches && codeMatches.length % 2 !== 0) {
      errors.push({
        type: 'syntax',
        message: 'Unclosed inline code',
        line: lineNumber,
        severity: 'error'
      });
    }

    // Check for malformed links
    const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
    let match;
    while ((match = linkRegex.exec(line)) !== null) {
      if (!match[2] || match[2].trim() === '') {
        errors.push({
          type: 'syntax',
          message: 'Link URL is empty',
          line: lineNumber,
          severity: 'error'
        });
      }
    }
  });

  return errors;
}

// Validate document structure
function validateStructure(content: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const lines = content.split('\n');

  // Check for at least one heading
  const hasHeading = lines.some(line => line.trim().startsWith('#'));
  if (!hasHeading) {
    errors.push({
      type: 'structure',
      message: 'Document should have at least one heading',
      severity: 'warning'
    });
  }

  // Check for proper heading hierarchy
  let currentLevel = 0;
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    
    if (trimmed.startsWith('#')) {
      const level = trimmed.match(/^#+/)?.[0].length || 0;
      
      if (level > currentLevel + 1) {
        errors.push({
          type: 'structure',
          message: `Heading level ${level} should not skip level ${currentLevel + 1}`,
          line: lineNumber,
          severity: 'warning'
        });
      }
      
      currentLevel = level;
    }
  });

  // Check for orphaned list items
  let inList = false;
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\./.test(trimmed)) {
      inList = true;
    } else if (trimmed !== '' && inList) {
      inList = false;
    }
  });

  return errors;
}

// Validate content quality
function validateContentQuality(content: string): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];
  const lines = content.split('\n');

  // Check for very long lines
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    if (line.length > 120) {
      warnings.push({
        type: 'style',
        message: 'Line is very long (consider breaking it up)',
        line: lineNumber,
        suggestion: 'Break long lines at around 80-100 characters'
      });
    }
  });

  // Check for consecutive blank lines
  let consecutiveBlanks = 0;
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    if (line.trim() === '') {
      consecutiveBlanks++;
      if (consecutiveBlanks > 2) {
        warnings.push({
          type: 'style',
          message: 'Too many consecutive blank lines',
          line: lineNumber,
          suggestion: 'Use at most 2 blank lines between sections'
        });
      }
    } else {
      consecutiveBlanks = 0;
    }
  });

  // Check for trailing whitespace
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    if (line !== line.trimEnd()) {
      warnings.push({
        type: 'style',
        message: 'Trailing whitespace detected',
        line: lineNumber,
        suggestion: 'Remove trailing spaces'
      });
    }
  });

  return warnings;
}

// Validate accessibility
function validateAccessibility(content: string): ValidationSuggestion[] {
  const suggestions: ValidationSuggestion[] = [];
  const lines = content.split('\n');

  // Check for descriptive link text
  const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    let match;
    
    while ((match = linkRegex.exec(line)) !== null) {
      const linkText = match[1];
      const url = match[2];
      
      if (linkText.toLowerCase() === 'click here' || linkText.toLowerCase() === 'here') {
        suggestions.push({
          type: 'accessibility',
          message: 'Use descriptive link text instead of "click here"',
          line: lineNumber,
          suggestion: `Replace "click here" with descriptive text like "read our documentation"`
        });
      }
      
      if (linkText === url) {
        suggestions.push({
          type: 'accessibility',
          message: 'Link text should be descriptive, not the URL',
          line: lineNumber,
          suggestion: 'Use descriptive text for the link'
        });
      }
    }
  });

  // Check for image alt text
  const imageRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    let match;
    
    while ((match = imageRegex.exec(line)) !== null) {
      const altText = match[1];
      
      if (!altText || altText.trim() === '') {
        suggestions.push({
          type: 'accessibility',
          message: 'Image missing alt text',
          line: lineNumber,
          suggestion: 'Add descriptive alt text for the image'
        });
      }
    }
  });

  return suggestions;
}

// Validate best practices
function validateBestPractices(content: string): ValidationSuggestion[] {
  const suggestions: ValidationSuggestion[] = [];

  // Check for code block language specification
  const codeBlockRegex = /```(\w+)?\n/g;
  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (!match[1]) {
      suggestions.push({
        type: 'improvement',
        message: 'Code block missing language specification',
        suggestion: 'Specify the language for syntax highlighting (e.g., ```javascript)'
      });
    }
  }

  // Check for table formatting
  const tableLines = content.split('\n').filter(line => line.includes('|'));
  if (tableLines.length > 0) {
    const hasHeaderSeparator = tableLines.some(line => 
      line.match(/^\|[\s\-:|]+\|$/)
    );
    
    if (!hasHeaderSeparator) {
      suggestions.push({
        type: 'improvement',
        message: 'Table missing header separator',
        suggestion: 'Add a separator row (e.g., | --- | --- |) after the header'
      });
    }
  }

  // Check for consistent list formatting
  const listItems = content.match(/^[\s]*[-*+]\s/gm);
  if (listItems) {
    const hasInconsistentSpacing = listItems.some(item => 
      item.match(/^[\s]*[-*+]\s{2,}/)
    );
    
    if (hasInconsistentSpacing) {
      suggestions.push({
        type: 'improvement',
        message: 'Inconsistent list item spacing',
        suggestion: 'Use exactly one space after list markers'
      });
    }
  }

  return suggestions;
}

// Quick validation for real-time feedback
export function quickValidate(content: string): { isValid: boolean; errorCount: number } {
  const result = validateMarkdownContent(content);
  const errorCount = result.errors.filter(e => e.severity === 'error').length;
  
  return {
    isValid: errorCount === 0,
    errorCount
  };
}

// Validate specific content types
export function validateDocumentType(content: string, type: 'docs' | 'changelog' | 'faq'): ValidationResult {
  const baseResult = validateMarkdownContent(content);
  const typeSpecificErrors: ValidationError[] = [];

  switch (type) {
    case 'docs':
      // Check for required sections in documentation
      if (!content.includes('## Installation') && !content.includes('## Getting Started')) {
        typeSpecificErrors.push({
          type: 'content',
          message: 'Documentation should include Installation or Getting Started section',
          severity: 'warning'
        });
      }
      break;

    case 'changelog':
      // Check for version headers
      const versionHeaders = content.match(/## \[[\d.]+\]/g);
      if (!versionHeaders || versionHeaders.length === 0) {
        typeSpecificErrors.push({
          type: 'content',
          message: 'Changelog should include version headers (e.g., ## [1.0.0])',
          severity: 'warning'
        });
      }
      break;

    case 'faq':
      // Check for question-answer structure
      const questions = content.match(/### .*\?/g);
      if (!questions || questions.length < 2) {
        typeSpecificErrors.push({
          type: 'content',
          message: 'FAQ should include multiple questions',
          severity: 'warning'
        });
      }
      break;
  }

  return {
    ...baseResult,
    errors: [...baseResult.errors, ...typeSpecificErrors],
    isValid: baseResult.isValid && typeSpecificErrors.length === 0
  };
} 