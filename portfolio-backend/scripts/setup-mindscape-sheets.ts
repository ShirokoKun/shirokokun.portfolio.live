/**
 * 🕸️ Mindscape Google Sheets Setup Script
 * 
 * This script creates the required sheets and populates them with sample data
 * for the Mindscape visualization system.
 * 
 * Run: npx ts-node scripts/setup-mindscape-sheets.ts
 */

import { google } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config();

interface MindscapeNode {
  id: string;
  title: string;
  content: string;
  type: 'project' | 'concept' | 'idea' | 'resource' | 'note' | 'code';
  tags: string;
  isPublic: string;
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

interface MindscapeConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  strength: number;
  type: 'strong' | 'weak' | 'hierarchy' | 'related';
  label: string;
  createdAt: string;
}

async function setupMindscapeSheets() {
  console.log('🕸️  Setting up Mindscape Google Sheets...\n');

  // Initialize Google Auth
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '';
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
  }

  // Format private key
  privateKey = privateKey.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // 1. Create mindscape_nodes sheet
    console.log('📊 Creating mindscape_nodes sheet...');
    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: 'mindscape_nodes',
                  gridProperties: {
                    frozenRowCount: 1,
                  },
                },
              },
            },
          ],
        },
      });
      console.log('✅ mindscape_nodes sheet created');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️  mindscape_nodes sheet already exists, will update data');
      } else {
        throw error;
      }
    }

    // Add headers and sample data for mindscape_nodes
    const nodesHeaders = [
      'id',
      'title',
      'content',
      'type',
      'tags',
      'isPublic',
      'x',
      'y',
      'z',
      'color',
      'size',
      'createdAt',
      'updatedAt',
    ];

    const now = new Date().toISOString();

    // Sample nodes showcasing your skills and projects
    const sampleNodes: MindscapeNode[] = [
      {
        id: 'node-1',
        title: 'VisionFlow',
        content: 'WebGL-powered generative art and computer vision experiments. Real-time particle systems with GPU acceleration.',
        type: 'project',
        tags: 'webgl,three.js,computer-vision,generative-art',
        isPublic: 'true',
        x: 0,
        y: 0,
        z: 0,
        color: '#3b82f6',
        size: 80,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'node-2',
        title: 'Next.js',
        content: 'React framework for production-grade applications with server-side rendering and static generation.',
        type: 'concept',
        tags: 'react,framework,ssr,frontend',
        isPublic: 'true',
        x: 200,
        y: 100,
        z: 0,
        color: '#22c55e',
        size: 60,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'node-3',
        title: 'Computer Vision',
        content: 'Object detection, face recognition, pose estimation using TensorFlow.js and MediaPipe.',
        type: 'concept',
        tags: 'cv,tensorflow,ml,ai',
        isPublic: 'true',
        x: -150,
        y: -100,
        z: 0,
        color: '#eab308',
        size: 70,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'node-4',
        title: 'Three.js',
        content: 'JavaScript 3D library for creating WebGL experiences. Core of VisionFlow visualization.',
        type: 'concept',
        tags: 'webgl,3d,graphics,javascript',
        isPublic: 'true',
        x: -100,
        y: 150,
        z: 0,
        color: '#a855f7',
        size: 65,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'node-5',
        title: 'Portfolio Site',
        content: 'This site! Built with Next.js, TypeScript, and Tailwind CSS. Features Mindscape visualization.',
        type: 'project',
        tags: 'nextjs,typescript,portfolio,web',
        isPublic: 'true',
        x: 150,
        y: -50,
        z: 0,
        color: '#3b82f6',
        size: 75,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'node-6',
        title: 'TypeScript',
        content: 'Typed superset of JavaScript. Essential for large-scale applications and better developer experience.',
        type: 'concept',
        tags: 'typescript,javascript,types,programming',
        isPublic: 'true',
        x: 250,
        y: -150,
        z: 0,
        color: '#22c55e',
        size: 55,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'node-7',
        title: 'Generative Art',
        content: 'Algorithmic art creation using code. Exploring noise functions, particle systems, and procedural generation.',
        type: 'idea',
        tags: 'art,creative-coding,algorithms,visual',
        isPublic: 'true',
        x: 50,
        y: 200,
        z: 0,
        color: '#f97316',
        size: 60,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'node-8',
        title: 'Python',
        content: 'Used for machine learning experiments, data processing, and backend scripting.',
        type: 'concept',
        tags: 'python,programming,ml,backend',
        isPublic: 'true',
        x: -200,
        y: 50,
        z: 0,
        color: '#22c55e',
        size: 50,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'node-9',
        title: 'Neural Style Transfer',
        content: 'Exploring artistic style transfer with neural networks. Potential VisionFlow feature.',
        type: 'idea',
        tags: 'ml,art,neural-networks,computer-vision',
        isPublic: 'true',
        x: -250,
        y: -200,
        z: 0,
        color: '#f97316',
        size: 55,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'node-10',
        title: 'React Flow',
        content: 'Library for building node-based editors. Used to create this Mindscape visualization!',
        type: 'resource',
        tags: 'react,visualization,graph,ui',
        isPublic: 'true',
        x: 100,
        y: -200,
        z: 0,
        color: '#06b6d4',
        size: 50,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const nodesData = [
      nodesHeaders,
      ...sampleNodes.map((node) => [
        node.id,
        node.title,
        node.content,
        node.type,
        node.tags,
        node.isPublic,
        node.x,
        node.y,
        node.z,
        node.color,
        node.size,
        node.createdAt,
        node.updatedAt,
      ]),
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'mindscape_nodes!A1:M',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: nodesData,
      },
    });

    console.log(`✅ Added ${sampleNodes.length} sample nodes\n`);

    // 2. Create mindscape_connections sheet
    console.log('📊 Creating mindscape_connections sheet...');
    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: 'mindscape_connections',
                  gridProperties: {
                    frozenRowCount: 1,
                  },
                },
              },
            },
          ],
        },
      });
      console.log('✅ mindscape_connections sheet created');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️  mindscape_connections sheet already exists, will update data');
      } else {
        throw error;
      }
    }

    // Add headers and connections
    const connectionsHeaders = ['id', 'sourceNodeId', 'targetNodeId', 'strength', 'type', 'label', 'createdAt'];

    const sampleConnections: MindscapeConnection[] = [
      // VisionFlow connections
      { id: 'conn-1', sourceNodeId: 'node-1', targetNodeId: 'node-4', strength: 1, type: 'strong', label: 'built with', createdAt: now },
      { id: 'conn-2', sourceNodeId: 'node-1', targetNodeId: 'node-3', strength: 1, type: 'strong', label: 'uses', createdAt: now },
      { id: 'conn-3', sourceNodeId: 'node-1', targetNodeId: 'node-7', strength: 0.8, type: 'related', label: 'creates', createdAt: now },
      
      // Portfolio connections
      { id: 'conn-4', sourceNodeId: 'node-5', targetNodeId: 'node-2', strength: 1, type: 'strong', label: 'built with', createdAt: now },
      { id: 'conn-5', sourceNodeId: 'node-5', targetNodeId: 'node-6', strength: 1, type: 'strong', label: 'uses', createdAt: now },
      { id: 'conn-6', sourceNodeId: 'node-5', targetNodeId: 'node-10', strength: 0.9, type: 'strong', label: 'uses', createdAt: now },
      
      // Technology relationships
      { id: 'conn-7', sourceNodeId: 'node-2', targetNodeId: 'node-6', strength: 0.7, type: 'related', label: 'works with', createdAt: now },
      { id: 'conn-8', sourceNodeId: 'node-4', targetNodeId: 'node-7', strength: 0.6, type: 'weak', label: 'enables', createdAt: now },
      { id: 'conn-9', sourceNodeId: 'node-3', targetNodeId: 'node-8', strength: 0.7, type: 'related', label: 'implemented in', createdAt: now },
      
      // Ideas and concepts
      { id: 'conn-10', sourceNodeId: 'node-9', targetNodeId: 'node-3', strength: 0.9, type: 'related', label: 'part of', createdAt: now },
      { id: 'conn-11', sourceNodeId: 'node-9', targetNodeId: 'node-1', strength: 0.5, type: 'weak', label: 'could integrate', createdAt: now },
      { id: 'conn-12', sourceNodeId: 'node-7', targetNodeId: 'node-4', strength: 0.8, type: 'related', label: 'uses', createdAt: now },
      
      // React Flow meta-connection
      { id: 'conn-13', sourceNodeId: 'node-10', targetNodeId: 'node-2', strength: 0.6, type: 'related', label: 'library for', createdAt: now },
    ];

    const connectionsData = [
      connectionsHeaders,
      ...sampleConnections.map((conn) => [
        conn.id,
        conn.sourceNodeId,
        conn.targetNodeId,
        conn.strength,
        conn.type,
        conn.label,
        conn.createdAt,
      ]),
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'mindscape_connections!A1:G',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: connectionsData,
      },
    });

    console.log(`✅ Added ${sampleConnections.length} sample connections\n`);

    // 3. Create projects sheet
    console.log('📊 Creating projects sheet...');
    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: 'projects',
                  gridProperties: {
                    frozenRowCount: 1,
                  },
                },
              },
            },
          ],
        },
      });
      console.log('✅ projects sheet created');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️  projects sheet already exists, will update data');
      } else {
        throw error;
      }
    }

    const projectsHeaders = ['id', 'name', 'description', 'tech', 'status', 'featured', 'thumbnail', 'liveUrl', 'nodeId'];
    const projectsData = [
      projectsHeaders,
      [
        'proj-1',
        'VisionFlow',
        'WebGL-powered generative art and computer vision experiments',
        'Three.js, WebGL, TensorFlow.js',
        'active',
        'true',
        '/images/visionflow.jpg',
        'https://visionflow.shirokokun.com',
        'node-1',
      ],
      [
        'proj-2',
        'Portfolio Site',
        'Personal portfolio with Mindscape visualization',
        'Next.js, TypeScript, React Flow',
        'active',
        'true',
        '/images/portfolio.jpg',
        'https://shirokokun-portfolio-live.vercel.app',
        'node-5',
      ],
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'projects!A1:I',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: projectsData,
      },
    });

    console.log('✅ Added sample projects\n');

    // 4. Create current_status sheet
    console.log('📊 Creating current_status sheet...');
    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: 'current_status',
                  gridProperties: {
                    frozenRowCount: 1,
                  },
                },
              },
            },
          ],
        },
      });
      console.log('✅ current_status sheet created');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️  current_status sheet already exists, will update data');
      } else {
        throw error;
      }
    }

    const statusHeaders = ['id', 'status', 'learningNow', 'workingOn', 'lastUpdated'];
    const statusData = [
      statusHeaders,
      [
        '1',
        'Building Mindscape visualization system',
        'React Flow, Graph algorithms, Force-directed layouts',
        'Portfolio Mindscape + Admin Panel',
        now,
      ],
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'current_status!A1:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: statusData,
      },
    });

    console.log('✅ Added current status\n');

    console.log('🎉 Mindscape Google Sheets setup complete!');
    console.log('\n📋 Summary:');
    console.log(`   - mindscape_nodes: ${sampleNodes.length} nodes`);
    console.log(`   - mindscape_connections: ${sampleConnections.length} connections`);
    console.log('   - projects: 2 projects');
    console.log('   - current_status: 1 status entry');
    console.log('\n🔗 View your spreadsheet:');
    console.log(`   https://docs.google.com/spreadsheets/d/${spreadsheetId}\n`);

  } catch (error) {
    console.error('❌ Error setting up sheets:', error);
    process.exit(1);
  }
}

setupMindscapeSheets();
