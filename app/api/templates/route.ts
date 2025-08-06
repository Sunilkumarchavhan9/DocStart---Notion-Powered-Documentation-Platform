import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Get available templates
export async function GET() {
  const templates = [
    {
      id: "docs",
      name: "Documentation",
      description: "Complete documentation template with sections for API guides, tutorials, and examples",
      icon: "",
      content: `# Project Documentation

## Overview
Brief description of your project and its purpose.

## Getting Started
Instructions for setting up and running the project.

### Prerequisites
- Requirement 1
- Requirement 2

### Installation
\`\`\`bash
# Installation steps
\`\`\`

## API Reference
Documentation for your API endpoints.

### Authentication
Describe your authentication method.

### Endpoints
List and describe your API endpoints.

## Examples
Provide code examples and use cases.

## Contributing
Guidelines for contributors.

## License
Your project license information.`,
      category: "Documentation"
    },
    {
      id: "changelog",
      name: "Changelog",
      description: "Track your project changes with version history and release notes",
      icon: "📝",
      content: `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features that have been added

### Changed
- Changes in existing functionality

### Deprecated
- Features that will be removed in upcoming releases

### Removed
- Features that have been removed

### Fixed
- Bug fixes

### Security
- Security vulnerability fixes

## [1.0.0] - YYYY-MM-DD

### Added
- Initial release
- Feature A
- Feature B

### Changed
- Updated something

### Fixed
- Fixed a bug`,
      category: "Version Control"
    },
    {
      id: "faq",
      name: "FAQ",
      description: "Answer user questions with a comprehensive FAQ section",
      icon: "❓",
      content: `# Frequently Asked Questions

## General Questions

### What is this project?
Brief description of what the project does and its main purpose.

### How do I get started?
Step-by-step guide for new users to get started with the project.

### Is this project free to use?
Information about pricing, licensing, and usage terms.

## Technical Questions

### What are the system requirements?
Minimum system requirements and supported platforms.

### How do I install the project?
Detailed installation instructions for different platforms.

### How do I configure the project?
Configuration options and settings explanation.

## Troubleshooting

### Common Issues
Solutions to frequently encountered problems.

### Error Messages
Explanation of common error messages and how to resolve them.

### Performance Issues
Tips for optimizing performance and resolving slow performance.

## Support

### Where can I get help?
Information about support channels, documentation, and community resources.

### How do I report a bug?
Instructions for reporting bugs and issues.

### How do I request a feature?
Process for requesting new features or improvements.

## Contact

For additional questions not covered in this FAQ, please contact us at:
- Email: support@example.com
- GitHub Issues: [Project Repository](https://github.com/example/project)`,
      category: "Support"
    }
  ];

  return NextResponse.json(templates);
}

// Create a new document from template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { templateId, projectSlug, title } = body;

    if (!templateId || !projectSlug || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get project
    const project = await prisma.project.findFirst({
      where: {
        slug: projectSlug,
        OR: [
          { userId: session.user.id },
          { members: { some: { userId: session.user.id } } }
        ]
      }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get template content
    const templates = [
      {
        id: "docs",
        content: `# Project Documentation

## Overview
Brief description of your project and its purpose.

## Getting Started
Instructions for setting up and running the project.

### Prerequisites
- Requirement 1
- Requirement 2

### Installation
\`\`\`bash
# Installation steps
\`\`\`

## API Reference
Documentation for your API endpoints.

### Authentication
Describe your authentication method.

### Endpoints
List and describe your API endpoints.

## Examples
Provide code examples and use cases.

## Contributing
Guidelines for contributors.

## License
Your project license information.`
      },
      {
        id: "changelog",
        content: `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features that have been added

### Changed
- Changes in existing functionality

### Deprecated
- Features that will be removed in upcoming releases

### Removed
- Features that have been removed

### Fixed
- Bug fixes

### Security
- Security vulnerability fixes

## [1.0.0] - YYYY-MM-DD

### Added
- Initial release
- Feature A
- Feature B

### Changed
- Updated something

### Fixed
- Fixed a bug`
      },
      {
        id: "faq",
        content: `# Frequently Asked Questions

## General Questions

### What is this project?
Brief description of what the project does and its main purpose.

### How do I get started?
Step-by-step guide for new users to get started with the project.

### Is this project free to use?
Information about pricing, licensing, and usage terms.

## Technical Questions

### What are the system requirements?
Minimum system requirements and supported platforms.

### How do I install the project?
Detailed installation instructions for different platforms.

### How do I configure the project?
Configuration options and settings explanation.

## Troubleshooting

### Common Issues
Solutions to frequently encountered problems.

### Error Messages
Explanation of common error messages and how to resolve them.

### Performance Issues
Tips for optimizing performance and resolving slow performance.

## Support

### Where can I get help?
Information about support channels, documentation, and community resources.

### How do I report a bug?
Instructions for reporting bugs and issues.

### How do I request a feature?
Process for requesting new features or improvements.

## Contact

For additional questions not covered in this FAQ, please contact us at:
- Email: support@example.com
- GitHub Issues: [Project Repository](https://github.com/example/project)`
      }
    ];

    const template = templates.find(t => t.id === templateId);
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Create document slug
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Create document
    const document = await prisma.document.create({
      data: {
        title,
        content: template.content,
        slug,
        projectId: project.id,
        userId: session.user.id
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Template creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 