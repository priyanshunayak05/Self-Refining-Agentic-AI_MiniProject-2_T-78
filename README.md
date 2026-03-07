# Backend Node - Agentic AI Workflow Builder

This is the backend for **Project T-78**, an **N8N-style visual Agentic AI Workflow Builder**.  
It handles task execution, workflow orchestration, memory storage, API management, and real-time communication.

## Features

- Agent-based architecture
- Planner, Executor, Critic, and Memory agents
- Workflow engine for node execution
- Groq API integration
- MongoDB for workflow, execution, and memory storage
- Express REST API
- Socket.io support for real-time updates
- JWT authentication support
- Rate limiting and centralized error handling
- Scalable TypeScript backend structure

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- Socket.io
- Groq SDK
- Winston
- Zod

## Folder Structure

```text
backend-node/
├── src/
│   ├── agents/
│   │   ├── planner.agent.ts
│   │   ├── executor.agent.ts
│   │   ├── critic.agent.ts
│   │   ├── memory.agent.ts
│   │   └── base.agent.ts
│   ├── workflows/
│   │   ├── workflow.engine.ts
│   │   ├── node.executor.ts
│   │   └── node.types.ts
│   ├── models/
│   │   ├── workflow.model.ts
│   │   ├── execution.model.ts
│   │   └── memory.model.ts
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   │   └── groq.client.ts
│   └── app.ts
├── package.json
├── tsconfig.json
└── .env
