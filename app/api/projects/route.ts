import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { logProjectCreated } from "@/lib/activity-logger";

function getTemplateContent(templateId: string): string | null {
  const templates = {
    docs: `# Welcome to Your Documentation

## Getting Started

This is a comprehensive documentation template that includes everything you need to create professional documentation.

### Features

- **API Guides**: Complete API reference documentation
- **Tutorials**: Step-by-step guides for users
- **Examples**: Code examples and use cases

### Quick Start

1. Clone this template
2. Customize the content
3. Add your own sections
4. Deploy and share

## API Reference

### Authentication

\`\`\`javascript
const response = await fetch('/api/auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'user',
    password: 'pass'
  })
});
\`\`\`

## Examples

### Basic Usage

\`\`\`javascript
import { MyLibrary } from 'my-library';

const instance = new MyLibrary();
instance.initialize();
\`\`\`

## Support

Need help? Check out our [FAQ section](#faq) or [contact support](#contact).`,

    changelog: `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New feature A
- New feature B

### Changed
- Updated existing feature

### Deprecated
- Feature that will be removed

### Removed
- Removed feature

### Fixed
- Bug fix

### Security
- Security vulnerability fix

## [1.0.0] - 2024-01-15

### Added
- Initial release
- Core functionality
- Basic documentation

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

## Version History

- **1.0.0**: Stable release
- **0.9.0**: Beta release
- **0.8.0**: Alpha release

## Contributing

When contributing to this project, please update the changelog appropriately.`,

    faq: `# Frequently Asked Questions

## General Questions

### What is this project?

This is a comprehensive FAQ template designed to help users find answers to common questions quickly and efficiently.

### How do I get started?

Getting started is easy! Simply follow these steps:

1. **Sign up** for an account
2. **Choose a template** that fits your needs
3. **Customize** the content
4. **Deploy** your documentation

### Is this free to use?

Yes! Our basic plan is completely free. We also offer premium features for advanced users.

## Technical Questions

### What technologies are supported?

We support a wide range of technologies:

- **Frontend**: React, Vue, Angular
- **Backend**: Node.js, Python, Ruby
- **Databases**: PostgreSQL, MongoDB, MySQL
- **Deployment**: Vercel, Netlify, AWS

### How do I customize the styling?

You can customize the styling in several ways:

1. **Theme Editor**: Use our built-in theme editor
2. **CSS Customization**: Add custom CSS
3. **Template Modification**: Modify the template directly

### Can I export my documentation?

Yes! We support multiple export formats:

- **HTML**: Static website
- **PDF**: Printable documentation
- **Markdown**: Source files
- **JSON**: API documentation

## Troubleshooting

### My site isn't loading

If your site isn't loading, try these steps:

1. Check your internet connection
2. Clear your browser cache
3. Try a different browser
4. Contact support if the issue persists

### I can't save my changes

If you're having trouble saving:

1. Check your browser's local storage
2. Try refreshing the page
3. Make sure you're logged in
4. Check for any error messages

### How do I contact support?

You can contact support in several ways:

- **Email**: support@example.com
- **Chat**: Use our live chat feature
- **Phone**: Call us at 1-800-EXAMPLE
- **Social Media**: Follow us on Twitter

## Account Management

### How do I change my password?

To change your password:

1. Go to your account settings
2. Click on "Security"
3. Enter your current password
4. Enter your new password
5. Confirm the change

### Can I delete my account?

Yes, you can delete your account at any time:

1. Go to account settings
2. Scroll to the bottom
3. Click "Delete Account"
4. Confirm the deletion

**Note**: This action cannot be undone.

## Billing

### What payment methods do you accept?

We accept all major credit cards:

- Visa
- Mastercard
- American Express
- Discover

### Can I cancel my subscription?

Yes, you can cancel your subscription at any time:

1. Go to billing settings
2. Click "Cancel Subscription"
3. Confirm the cancellation

### Do you offer refunds?

We offer a 30-day money-back guarantee for all paid plans.`
  };

  return templates[templateId as keyof typeof templates] || null;
}

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  template: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { members: { some: { userId: session.user.id } } },
          { isPublic: true }
        ]
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        _count: {
          select: { documents: true, members: true }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Received project creation request:", body);
    
    const { name, description, isPublic, template } = projectSchema.parse(body);
    console.log("Parsed project data:", { name, description, isPublic, template });

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    console.log("Generated slug:", slug);

    // Check if slug already exists
    const existingProject = await prisma.project.findUnique({
      where: { slug }
    });

    if (existingProject) {
      console.log("Project with slug already exists:", slug);
      return NextResponse.json(
        { error: "Project with this name already exists" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        slug,
        isPublic,
        userId: session.user.id,
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        _count: {
          select: { documents: true, members: true }
        }
      }
    });

    console.log("Created project:", project.id);

    // Create template content if specified
    if (template) {
      const templateContent = getTemplateContent(template);
      if (templateContent) {
        await prisma.document.create({
          data: {
            title: "Getting Started",
            content: templateContent,
            slug: "getting-started",
            projectId: project.id,
            userId: session.user.id,
          }
        });
        console.log("Created template document for:", template);
      }
    }

    // Log activity
    // await logProjectCreated(session.user.id, project.id, project.name);

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 