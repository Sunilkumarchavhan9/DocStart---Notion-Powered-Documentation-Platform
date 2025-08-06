import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ projectSlug: string; documentSlug: string }>;
}

async function getPublishedDocument(projectSlug: string, documentSlug: string) {
  const project = await prisma.project.findFirst({
    where: {
      slug: projectSlug,
      isPublic: true, // Only public projects
    },
  });

  if (!project) {
    return null;
  }

  const document = await prisma.document.findFirst({
    where: {
      slug: documentSlug,
      projectId: project.id,
      isPublished: true, // Only published documents
    },
  });

  return document;
}

export default async function PublicDocumentPage({ params }: PageProps) {
  const { projectSlug, documentSlug } = await params;
  const document = await getPublishedDocument(projectSlug, documentSlug);

  if (!document) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {document.title}
          </h1>
          <div className="flex items-center text-sm text-gray-500">
            <span>Published on {new Date(document.updatedAt).toLocaleDateString()}</span>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            dangerouslySetInnerHTML={{ __html: document.content }}
            className="text-gray-800 leading-relaxed"
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>Powered by DocStart</p>
            <p className="mt-2">
              <a 
                href="/" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Create your own documentation
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
} 