import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ─── Get active Groq key from localStorage ─────────────────────────────────────
function getActiveGroqKey() {
  const mode = localStorage.getItem('agentic-ai-groq-mode') || 'system';
  if (mode === 'custom') {
    return localStorage.getItem('agentic-ai-groq-key') || '';
  }
  return ''; // empty → backend uses its system key
}

export const useWorkflowStore = create((set, get) => ({
  nodes: [],
  edges: [],
  logs: [],
  isExecuting: false,
  executingNodes: new Set(),
  nodeStatuses: {},
  lastResult: null,
  stats: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addLog: (message, type = 'info', nodeId = null) => {
    const log = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      message,
      type,
      nodeId,
    };
    set((state) => ({ logs: [...state.logs, log] }));
  },

  clearLogs: () => set({ logs: [] }),

  setNodeStatus: (nodeId, status) => {
    set((state) => ({
      nodeStatuses: { ...state.nodeStatuses, [nodeId]: status },
    }));
  },

  setExecutingNode: (nodeId, isExecuting) => {
    set((state) => {
      const newSet = new Set(state.executingNodes);
      if (isExecuting) newSet.add(nodeId);
      else newSet.delete(nodeId);
      return { executingNodes: newSet };
    });
  },

  // ── Real execution: calls backend pipeline ─────────────────────────────────
  executeWorkflow: async () => {
    const { nodes, addLog, setNodeStatus, setExecutingNode } = get();

    set({ isExecuting: true, lastResult: null });
    addLog('Starting workflow execution...', 'info');

    const inputNode = nodes.find((n) => n.data.type === 'input');
    if (!inputNode) {
      addLog('No input node found! Add an Input node to the canvas.', 'error');
      set({ isExecuting: false });
      return;
    }

    const goal = inputNode.data.config?.goal || '';
    if (!goal.trim() || goal.trim().length < 5) {
      addLog('Please set a goal in the Input node before executing.', 'error');
      set({ isExecuting: false });
      return;
    }

    const animateNode = async (type, logMsg, logType = 'info') => {
      const node = nodes.find((n) => n.data.type === type);
      if (!node) return;
      setExecutingNode(node.id, true);
      setNodeStatus(node.id, 'running');
      addLog(logMsg, logType, node.id);
    };

    const completeNode = (type, logMsg, logType = 'success') => {
      const node = nodes.find((n) => n.data.type === type);
      if (!node) return;
      setExecutingNode(node.id, false);
      setNodeStatus(node.id, 'completed');
      addLog(logMsg, logType, node.id);
    };

    try {
      animateNode('input', `📥 Goal received: "${goal.substring(0, 60)}..."`, 'info');
      animateNode('planner', '🧠 Planner Agent decomposing goal into sub-tasks...', 'info');

      // Get active Groq key (empty string = use system key on backend)
      const groqApiKey = getActiveGroqKey();
      const keyMode = groqApiKey ? 'custom' : 'system';
      addLog(`🔑 Using ${keyMode} Groq API key`, 'info');

      const response = await fetch(`${API_BASE}/agent/goal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goal.trim(), groqApiKey: groqApiKey || undefined }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Backend error: ${response.status}`);
      }

      const { data: result } = await response.json();

      completeNode('input', '✅ Input node processed', 'success');
      completeNode('planner', `✅ Plan created with ${(result.plan.match(/^\d+\./gm) || []).length} steps`, 'success');

      animateNode('executor', '⚙️  Executor Agent running sub-tasks...', 'info');
      completeNode('executor', `✅ Execution complete (${result.iterationsRan} iteration${result.iterationsRan > 1 ? 's' : ''})`, 'success');

      animateNode('critic', '🔍 Critic Agent evaluating output quality...', 'info');
      const score = result.qualityScore;
      const critiqueType = score >= 90 ? 'success' : score >= 70 ? 'warning' : 'error';
      completeNode('critic', `${score >= 90 ? '✅' : '⚠️'} Quality score: ${score}/100`, critiqueType);

      if (result.iterationsRan > 1) {
        addLog('🔄 Self-refinement loop triggered — re-planning and re-executing...', 'warning');
      }

      animateNode('memory', '💾 Memory Agent storing execution context...', 'info');
      completeNode('memory', result.memoryUpdate !== 'No memory update.'
        ? '✅ Memory updated with key information'
        : '✅ No new memory entries (context unchanged)', 'success');

      animateNode('output', '📤 Generating final output...', 'info');
      completeNode('output', '✅ Final output ready', 'success');

      addLog(`🎉 Workflow complete! Quality: ${score}/100 | Status: ${result.status.toUpperCase()}`, 'success');

      set({ lastResult: result });
      get().fetchStats();

    } catch (error) {
      addLog(`❌ Execution failed: ${error.message}`, 'error');
      nodes.forEach((n) => {
        const { nodeStatuses } = get();
        if (nodeStatuses[n.id] === 'running') {
          setExecutingNode(n.id, false);
          setNodeStatus(n.id, 'failed');
        }
      });
    } finally {
      set({ isExecuting: false });
    }
  },

  fetchStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/agent/status`);
      const json = await res.json();
      if (json.success) set({ stats: json.stats });
    } catch (_) {}
  },

  saveWorkflow: () => {
    const { nodes, edges } = get();
    const workflow = { nodes, edges, timestamp: new Date().toISOString() };
    localStorage.setItem('agentic-ai-workflow', JSON.stringify(workflow));
  },

  loadWorkflow: () => {
    const saved = localStorage.getItem('agentic-ai-workflow');
    if (saved) {
      const { nodes, edges } = JSON.parse(saved);
      set({ nodes, edges });
    }
  },
}));
