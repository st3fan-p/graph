import Fastify from 'fastify';
import cors from '@fastify/cors';
import { treeService } from './treeService';
import { CreateNodeRequest } from './types';

const fastify = Fastify({ logger: true });

// Register CORS
fastify.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:3000'] // Allow frontend origins
});

// Get entire tree structure
fastify.get('/api/tree', async (request, reply) => {
  try {
    const tree = treeService.getTree();
    return tree;
  } catch (error) {
    reply.code(500).send({ error: 'Failed to get tree' });
  }
});

// Get specific node
fastify.get('/api/nodes/:nodeId', async (request, reply) => {
  try {
    const { nodeId } = request.params as { nodeId: string };
    const node = treeService.getNode(nodeId);
    
    if (!node) {
      reply.code(404).send({ error: 'Node not found' });
      return;
    }
    
    return node;
  } catch (error) {
    reply.code(500).send({ error: 'Failed to get node' });
  }
});

// Create new node
fastify.post('/api/nodes', async (request, reply) => {
  try {
    const createRequest = request.body as CreateNodeRequest;
    
    if (!createRequest.value) {
      reply.code(400).send({ error: 'Node value is required' });
      return;
    }
    
    const newNode = treeService.createNode(createRequest);
    reply.code(201).send(newNode);
  } catch (error) {
    if (error instanceof Error) {
      reply.code(400).send({ error: error.message });
    } else {
      reply.code(500).send({ error: 'Failed to create node' });
    }
  }
});

// Delete node
fastify.delete('/api/nodes/:nodeId', async (request, reply) => {
  try {
    const { nodeId } = request.params as { nodeId: string };
    const success = treeService.deleteNode(nodeId);
    
    if (!success) {
      reply.code(404).send({ error: 'Node not found' });
      return;
    }
    
    reply.code(204).send();
  } catch (error) {
    if (error instanceof Error) {
      reply.code(400).send({ error: error.message });
    } else {
      reply.code(500).send({ error: 'Failed to delete node' });
    }
  }
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();