"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Nvabar";
import { 
  FileText, 
  GitBranch, 
  HelpCircle, 
  Plus, 
  Search,
  BookOpen,
  Code,
  Lightbulb,
  Calendar,
  Tag,
  Users,
  CheckCircle
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  features: string[];
  content: string;
  color: string;
}

export default function TemplatesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const templates: Template[] = [
    {
      id: "docs",
      name: "Docs",
      description: "Complete documentation templates",
      category: "documentation",
      icon: <BookOpen className="w-6 h-6" />,
      features: ["API guides", "Tutorials", "Examples"],
      content: `# Welcome to Your Documentation

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
      color: "bg-blue-500"
    },
    {
      id: "changelog",
      name: "Changelog",
      description: "Track your project changes",
      category: "tracking",
      icon: <GitBranch className="w-6 h-6" />,
      features: ["Version tracking", "Release notes", "Updates"],
      content: `# Changelog

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

## [0.9.0] - 2024-01-01

### Added
- Beta features
- Experimental functionality

### Changed
- Improved performance
- Better error handling

### Fixed
- Critical bugs
- Minor issues

## Version History

- **1.0.0**: Stable release
- **0.9.0**: Beta release
- **0.8.0**: Alpha release

## Contributing

When contributing to this project, please update the changelog appropriately.`,
      color: "bg-green-500"
    },
    {
      id: "faq",
      name: "FAQ",
      description: "Answer user questions",
      category: "support",
      icon: <HelpCircle className="w-6 h-6" />,
      features: ["Common questions", "Support", "Help center"],
      content: `# Frequently Asked Questions

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

We offer a 30-day money-back guarantee for all paid plans.`,
      color: "bg-purple-500"
    }
  ];

  const categories = [
    { id: "all", name: "All Templates", icon: <FileText className="w-4 h-4" /> },
    { id: "documentation", name: "Documentation", icon: <BookOpen className="w-4 h-4" /> },
    { id: "tracking", name: "Tracking", icon: <GitBranch className="w-4 h-4" /> },
    { id: "support", name: "Support", icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = async (template: Template) => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    try {
      // Create a new project with the template
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${template.name} Template ${Date.now()}`,
          description: template.description,
          isPublic: false,
          template: template.id,
        }),
      });

      if (response.ok) {
        const project = await response.json();
        router.push(`/dashboard/projects/${project.slug}`);
      } else {
        const error = await response.json();
        console.error("Failed to create project:", error);
      }
    } catch (error) {
      console.error("Failed to create project from template:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />
      
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
               Templates
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Choose from our pre-built templates to get started quickly
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Template Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${template.color} text-white`}>
                  {template.icon}
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {template.category}
                  </span>
                </div>
              </div>

              {/* Template Info */}
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {template.name}
              </h3>
              <p className="text-muted-foreground mb-4">
                {template.description}
              </p>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-2">Features:</h4>
                <ul className="space-y-1">
                  {template.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Use Template Button */}
              <button
                onClick={() => handleUseTemplate(template)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Use {template.name} Template
              </button>
            </motion.div>
          ))}
        </div>

        {/* Custom Template Section */}
        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No templates found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          </motion.div>
        )}

        {/* Create Custom Template */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-card border border-border rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your own custom template from scratch and share it with the community.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Custom Template
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 