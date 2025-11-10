import { google, sheets_v4 } from 'googleapis';
import { ApiError } from '../middlewares/error.middleware';

export interface MindscapeNode {
  id: string;
  title: string;
  content: string;
  type: 'project' | 'concept' | 'idea' | 'resource' | 'note' | 'code';
  tags: string[];
  isPublic: boolean;
  position: {
    x: number;
    y: number;
    z: number;
  };
  style: {
    color: string;
    size: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MindscapeConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  strength: number;
  type: 'strong' | 'weak' | 'hierarchy' | 'related';
  label: string;
  createdAt: string;
}

export interface MindscapeData {
  nodes: MindscapeNode[];
  connections: MindscapeConnection[];
}

export class MindscapeService {
  private sheets: sheets_v4.Sheets | null = null;
  private spreadsheetId: string = '';
  private isConfigured: boolean = false;
  private isInitialized: boolean = false;

  /**
   * Initialize the service with Google Sheets credentials
   * Called lazily on first use
   */
  private initialize(): void {
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;

    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID || '';

    console.log('🔍 Mindscape Init Check:');
    console.log('  - Email:', clientEmail ? clientEmail.substring(0, 30) + '...' : 'NOT SET');
    console.log('  - Private Key:', privateKey ? 'SET (' + privateKey.substring(0, 30) + '...)' : 'NOT SET');
    console.log('  - Sheet ID:', this.spreadsheetId ? this.spreadsheetId : 'NOT SET');

    if (!clientEmail || !privateKey || !this.spreadsheetId) {
      console.warn('⚠️  Mindscape service not configured');
      this.isConfigured = false;
      return;
    }

    try {
      let formattedKey = privateKey.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');

      const auth = new google.auth.JWT({
        email: clientEmail,
        key: formattedKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      this.isConfigured = true;
      console.log('✅ Mindscape service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Mindscape service:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Get public mindscape nodes and connections for visualization
   */
  async getPublicMindscape(): Promise<MindscapeData> {
    this.initialize();

    if (!this.isConfigured || !this.sheets) {
      throw new ApiError(503, 'Mindscape service not configured');
    }

    try {
      console.log('📊 Fetching public mindscape data...');

      // Fetch nodes
      const nodesResponse = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'mindscape_nodes!A2:M',
      });

      // Fetch connections
      const connectionsResponse = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'mindscape_connections!A2:G',
      });

      const nodeRows = nodesResponse.data.values || [];
      const connectionRows = connectionsResponse.data.values || [];

      // Parse nodes (filter public only)
      const nodes: MindscapeNode[] = nodeRows
        .filter((row) => row[5] === 'true' || row[5] === 'TRUE') // isPublic column
        .map((row) => ({
          id: row[0] || '',
          title: row[1] || '',
          content: row[2] || '',
          type: (row[3] || 'note') as MindscapeNode['type'],
          tags: row[4] ? row[4].split(',').map((tag: string) => tag.trim()) : [],
          isPublic: true,
          position: {
            x: parseFloat(row[6]) || 0,
            y: parseFloat(row[7]) || 0,
            z: parseFloat(row[8]) || 0,
          },
          style: {
            color: row[9] || '#666666',
            size: parseFloat(row[10]) || 50,
          },
          createdAt: row[11] || new Date().toISOString(),
          updatedAt: row[12] || new Date().toISOString(),
        }));

      // Parse connections (filter only connections where both nodes are public)
      const publicNodeIds = new Set(nodes.map((n) => n.id));
      const connections: MindscapeConnection[] = connectionRows
        .filter((row) => {
          const sourceId = row[1];
          const targetId = row[2];
          return publicNodeIds.has(sourceId) && publicNodeIds.has(targetId);
        })
        .map((row) => ({
          id: row[0] || '',
          sourceNodeId: row[1] || '',
          targetNodeId: row[2] || '',
          strength: parseFloat(row[3]) || 1,
          type: (row[4] || 'related') as MindscapeConnection['type'],
          label: row[5] || '',
          createdAt: row[6] || new Date().toISOString(),
        }));

      console.log(`✅ Fetched ${nodes.length} public nodes and ${connections.length} connections`);

      return { nodes, connections };
    } catch (error) {
      console.error('❌ Error fetching mindscape data:', error);
      throw new ApiError(500, 'Failed to fetch mindscape data');
    }
  }

  /**
   * Get all mindscape nodes (admin only)
   */
  async getAllNodes(): Promise<MindscapeNode[]> {
    this.initialize();

    if (!this.isConfigured || !this.sheets) {
      throw new ApiError(503, 'Mindscape service not configured');
    }

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'mindscape_nodes!A2:M',
      });

      const rows = response.data.values || [];

      return rows.map((row) => ({
        id: row[0] || '',
        title: row[1] || '',
        content: row[2] || '',
        type: (row[3] || 'note') as MindscapeNode['type'],
        tags: row[4] ? row[4].split(',').map((tag: string) => tag.trim()) : [],
        isPublic: row[5] === 'true' || row[5] === 'TRUE',
        position: {
          x: parseFloat(row[6]) || 0,
          y: parseFloat(row[7]) || 0,
          z: parseFloat(row[8]) || 0,
        },
        style: {
          color: row[9] || '#666666',
          size: parseFloat(row[10]) || 50,
        },
        createdAt: row[11] || new Date().toISOString(),
        updatedAt: row[12] || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('❌ Error fetching all nodes:', error);
      throw new ApiError(500, 'Failed to fetch nodes');
    }
  }

  /**
   * Check if service is configured
   */
  isReady(): boolean {
    this.initialize();
    return this.isConfigured;
  }
}
