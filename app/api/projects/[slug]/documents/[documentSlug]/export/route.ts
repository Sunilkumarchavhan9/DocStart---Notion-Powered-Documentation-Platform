import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; documentSlug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "html";

    // Get document with project info
    const document = await prisma.document.findFirst({
      where: {
        slug: params.documentSlug,
        project: {
          slug: params.slug,
          OR: [
            { userId: session.user.id },
            { members: { some: { userId: session.user.id } } }
          ]
        }
      },
      include: {
        project: true,
        user: true
      }
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Export based on format
    switch (format.toLowerCase()) {
      case "html":
        return exportAsHTML(document);
      case "json":
        return exportAsJSON(document);
      case "markdown":
        return exportAsMarkdown(document);
      default:
        return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
    }
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function exportAsHTML(document: any) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; }
        h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 0.5rem; }
        .meta { color: #666; font-size: 0.9rem; margin-bottom: 2rem; }
        .content { white-space: pre-wrap; }
    </style>
</head>
<body>
    <h1>${document.title}</h1>
    <div class="meta">
        <p><strong>Project:</strong> ${document.project.name}</p>
        <p><strong>Author:</strong> ${document.user.name}</p>
        <p><strong>Last Updated:</strong> ${new Date(document.updatedAt).toLocaleDateString()}</p>
    </div>
    <div class="content">${document.content}</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": `attachment; filename="${document.title}.html"`
    }
  });
}

function exportAsJSON(document: any) {
  const jsonData = {
    title: document.title,
    content: document.content,
    slug: document.slug,
    isPublished: document.isPublished,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    project: {
      name: document.project.name,
      slug: document.project.slug
    },
    author: {
      name: document.user.name,
      id: document.user.id
    }
  };

  return NextResponse.json(jsonData, {
    headers: {
      "Content-Disposition": `attachment; filename="${document.title}.json"`
    }
  });
}

function exportAsMarkdown(document: any) {
  const markdown = `# ${document.title}

**Project:** ${document.project.name}  
**Author:** ${document.user.name}  
**Last Updated:** ${new Date(document.updatedAt).toLocaleDateString()}

---

${document.content}`;

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown",
      "Content-Disposition": `attachment; filename="${document.title}.md"`
    }
  });
} 