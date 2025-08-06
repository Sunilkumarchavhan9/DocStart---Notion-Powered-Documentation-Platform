import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

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
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, projects, documents
    const projectId = searchParams.get('projectId');

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    let results = [];

    // Search in projects
    if (type === 'all' || type === 'projects') {
      const projects = await prisma.project.findMany({
        where: {
          AND: [
            {
              OR: [
                { userId: session.user.id },
                { members: { some: { userId: session.user.id } } }
              ]
            },
            {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } }
              ]
            }
          ]
        },
        include: {
          user: { select: { name: true } },
          _count: { select: { documents: true, members: true } }
        },
        take: 10
      });

      results.push(...projects.map(project => ({
        ...project,
        type: 'project',
        searchScore: calculateSearchScore(project.name, query)
      })));
    }

    // Search in documents
    if (type === 'all' || type === 'documents') {
      const documents = await prisma.document.findMany({
        where: {
          AND: [
            {
              project: {
                OR: [
                  { userId: session.user.id },
                  { members: { some: { userId: session.user.id } } }
                ]
              }
            },
            projectId ? { projectId } : {},
            {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } }
              ]
            }
          ]
        },
        include: {
          project: { select: { name: true, slug: true } }
        },
        take: 20
      });

      results.push(...documents.map(doc => ({
        ...doc,
        type: 'document',
        searchScore: calculateSearchScore(doc.title, query)
      })));
    }

    // Sort by search relevance
    results.sort((a, b) => b.searchScore - a.searchScore);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateSearchScore(text: string, query: string): number {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  if (lowerText.startsWith(lowerQuery)) return 100;
  if (lowerText.includes(lowerQuery)) return 50;
  
  // Partial word matching
  const words = lowerQuery.split(' ');
  const matches = words.filter(word => lowerText.includes(word)).length;
  return matches * 10;
} 