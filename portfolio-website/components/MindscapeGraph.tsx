'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import MindscapeNode from './MindscapeNode';

interface MindscapeNodeData {
  id: string;
  title: string;
  content: string;
  type: 'project' | 'concept' | 'idea' | 'resource' | 'note' | 'code';
  tags: string[];
  isPublic: boolean;
  position: { x: number; y: number; z: number };
  style: { color: string; size: number };
  createdAt: string;
  updatedAt: string;
}

interface MindscapeConnectionData {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  strength: number;
  type: 'strong' | 'weak' | 'hierarchy' | 'related';
  label: string;
  createdAt: string;
}

interface SelectedNodeInfo extends MindscapeNodeData {}

export default function MindscapeGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Custom node types
  const nodeTypes = useMemo(() => ({ mindscape: MindscapeNode }), []);

  // Fetch mindscape data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${backendUrl}/api/mindscape/public`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch mindscape data');
        }

        const result = await response.json();
        const { nodes: nodeData, connections: connectionData } = result.data;

        console.log('🕸️ Loaded mindscape:', { 
          nodes: nodeData.length, 
          connections: connectionData.length 
        });

        // Transform nodes to React Flow format
        const flowNodes: Node[] = nodeData.map((node: MindscapeNodeData) => ({
          id: node.id,
          type: 'mindscape',
          position: { x: node.position.x, y: node.position.y },
          data: {
            label: node.title,
            title: node.title,
            content: node.content,
            type: node.type,
            tags: node.tags,
            color: node.style.color,
            size: node.style.size,
          },
        }));

        // Transform connections to React Flow edges
        const flowEdges: Edge[] = connectionData.map((conn: MindscapeConnectionData) => ({
          id: conn.id,
          source: conn.sourceNodeId,
          target: conn.targetNodeId,
          type: conn.type === 'hierarchy' ? 'step' : 'default',
          animated: conn.type === 'weak',
          label: conn.label,
          labelStyle: { 
            fontSize: 10, 
            fill: '#ffffff80',
            fontWeight: 500,
          },
          labelBgStyle: {
            fill: '#00000060',
            fillOpacity: 0.8,
          },
          labelBgPadding: [4, 2] as [number, number],
          style: {
            stroke: conn.type === 'strong' ? '#ffffff' : '#ffffff40',
            strokeWidth: conn.strength * 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: conn.type === 'strong' ? '#ffffff' : '#ffffff40',
            width: 20,
            height: 20,
          },
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
        setError(null);
      } catch (err) {
        console.error('❌ Error loading mindscape:', err);
        setError(err instanceof Error ? err.message : 'Failed to load mindscape');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setNodes, setEdges]);

  // Handle node click
  const onNodeClick = useCallback((_: any, node: Node) => {
    // Find the full node data
    const fullNodeData = nodes.find(n => n.id === node.id);
    if (fullNodeData) {
      setSelectedNode(fullNodeData.data as any);
    }
  }, [nodes]);

  // Filter nodes based on search and type
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesSearch = searchQuery === '' || 
        node.data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.data.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = filterType === null || node.data.type === filterType;

      return matchesSearch && matchesFilter;
    });
  }, [nodes, searchQuery, filterType]);

  // Filter edges to only show connections between filtered nodes
  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
    return edges.filter(edge => 
      visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );
  }, [edges, filteredNodes]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-zinc-300">Loading Mindscape...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center max-w-md p-6 backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 mb-4">❌ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Header with Search and Filters */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 backdrop-blur-md bg-black/40 border-b border-zinc-700/50">
        <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            🕸️ Mindscape
          </h1>
          
          {/* Search */}
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 bg-zinc-900/60 border border-zinc-700/50 rounded-lg focus:outline-none focus:border-blue-500/50 transition"
          />

          {/* Type Filters */}
          <div className="flex gap-2 flex-wrap">
            {['project', 'concept', 'idea', 'resource', 'note', 'code'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(filterType === type ? null : type)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  filterType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* React Flow Graph */}
      <ReactFlow
        nodes={filteredNodes}
        edges={filteredEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.Bezier}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        className="bg-black"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="#ffffff10" 
        />
        <Controls className="bg-zinc-900/80 border border-zinc-700/50 rounded-lg" />
        <MiniMap 
          className="bg-zinc-900/80 border border-zinc-700/50 rounded-lg"
          nodeColor={(node) => (node.data as any).color}
        />
      </ReactFlow>

      {/* Node Details Panel */}
      {selectedNode && (
        <div className="absolute top-20 right-4 w-80 max-h-[calc(100vh-6rem)] overflow-y-auto backdrop-blur-xl bg-zinc-900/90 border border-zinc-700/50 rounded-lg p-6 shadow-2xl">
          <button
            onClick={() => setSelectedNode(null)}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
          >
            ✕
          </button>

          <div className="mb-4">
            <span 
              className="inline-block px-2 py-1 rounded text-xs font-medium mb-2"
              style={{ backgroundColor: `${selectedNode.style.color}40` }}
            >
              {selectedNode.type}
            </span>
            <h2 className="text-2xl font-bold mb-2">{selectedNode.title}</h2>
          </div>

          <p className="text-zinc-300 mb-4 leading-relaxed">{selectedNode.content}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {selectedNode.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="text-xs text-zinc-500">
            Created: {new Date(selectedNode.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}

      {/* Stats Footer */}
      <div className="absolute bottom-4 left-4 backdrop-blur-md bg-black/40 border border-zinc-700/50 rounded-lg px-4 py-2 text-sm text-zinc-400">
        {filteredNodes.length} nodes • {filteredEdges.length} connections
      </div>
    </div>
  );
}
