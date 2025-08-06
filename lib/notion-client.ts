import { Client } from '@notionhq/client';

export interface NotionPage {
  id: string;
  title: string;
  url: string;
  lastEditedTime: string;
  content?: any;
}

export interface NotionDatabase {
  id: string;
  title: string;
  url: string;
}

export class NotionClient {
  private client: Client;

  constructor(accessToken: string) {
    this.client = new Client({
      auth: accessToken,
    });
  }

  // Get user's databases
  async getDatabases(): Promise<NotionDatabase[]> {
    try {
      const response = await this.client.search({
        filter: {
          value: 'database',
          property: 'object',
        },
      });

      return response.results.map((db: any) => ({
        id: db.id,
        title: db.title?.[0]?.plain_text || 'Untitled Database',
        url: db.url,
      }));
    } catch (error) {
      console.error('Error fetching databases:', error);
      return [];
    }
  }

  // Get pages from a database or search all pages
  async getPages(databaseId?: string): Promise<NotionPage[]> {
    try {
      let response;
      
      if (databaseId) {
        response = await this.client.databases.query({
          database_id: databaseId,
        });
      } else {
        response = await this.client.search({
          filter: {
            value: 'page',
            property: 'object',
          },
        });
      }

      return response.results.map((page: any) => ({
        id: page.id,
        title: this.getPageTitle(page),
        url: page.url,
        lastEditedTime: page.last_edited_time,
      }));
    } catch (error) {
      console.error('Error fetching pages:', error);
      return [];
    }
  }

  // Create a new page in user's workspace
  async createPage(title: string, parentId?: string): Promise<NotionPage | null> {
    try {
      const parent = parentId 
        ? { page_id: parentId }
        : { type: 'page_id' as const, page_id: 'root' }; // This might need adjustment based on Notion API

      const response = await this.client.pages.create({
        parent: parent as any,
        properties: {
          title: {
            title: [
              {
                text: {
                  content: title,
                },
              },
            ],
          },
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: 'Start writing your document here...',
                  },
                },
              ],
            },
          },
        ],
      });

      return {
        id: response.id,
        title: title,
        url: `https://notion.so/${response.id.replace(/-/g, '')}`,
        lastEditedTime: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error creating page:', error);
      return null;
    }
  }

  // Get page content
  async getPageContent(pageId: string): Promise<any> {
    try {
      const blocks = await this.client.blocks.children.list({
        block_id: pageId,
      });

      return blocks.results;
    } catch (error) {
      console.error('Error fetching page content:', error);
      return null;
    }
  }

  // Convert Notion blocks to HTML (basic implementation)
  async convertBlocksToHtml(blocks: any[]): Promise<string> {
    let html = '';

    for (const block of blocks) {
      switch (block.type) {
        case 'paragraph':
          const text = block.paragraph?.rich_text?.[0]?.plain_text || '';
          html += `<p>${text}</p>`;
          break;
        case 'heading_1':
          const h1Text = block.heading_1?.rich_text?.[0]?.plain_text || '';
          html += `<h1>${h1Text}</h1>`;
          break;
        case 'heading_2':
          const h2Text = block.heading_2?.rich_text?.[0]?.plain_text || '';
          html += `<h2>${h2Text}</h2>`;
          break;
        case 'heading_3':
          const h3Text = block.heading_3?.rich_text?.[0]?.plain_text || '';
          html += `<h3>${h3Text}</h3>`;
          break;
        case 'bulleted_list_item':
          const listText = block.bulleted_list_item?.rich_text?.[0]?.plain_text || '';
          html += `<li>${listText}</li>`;
          break;
        case 'code':
          const codeText = block.code?.rich_text?.[0]?.plain_text || '';
          html += `<pre><code>${codeText}</code></pre>`;
          break;
        default:
          // Handle other block types as needed
          break;
      }
    }

    return html;
  }

  private getPageTitle(page: any): string {
    if (page.properties?.title?.title?.[0]?.plain_text) {
      return page.properties.title.title[0].plain_text;
    }
    if (page.properties?.Name?.title?.[0]?.plain_text) {
      return page.properties.Name.title[0].plain_text;
    }
    return 'Untitled Page';
  }
}

// Helper function to create Notion client from user session
export async function createNotionClient(accessToken: string): Promise<NotionClient> {
  return new NotionClient(accessToken);
}