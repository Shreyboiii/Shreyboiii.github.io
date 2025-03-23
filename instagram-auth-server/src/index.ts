#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI || "https://shreyboiii.github.io/igdata";

if (!INSTAGRAM_CLIENT_ID) {
  throw new Error('INSTAGRAM_CLIENT_ID environment variable is required');
}

if (!INSTAGRAM_CLIENT_SECRET) {
  throw new Error('INSTAGRAM_CLIENT_SECRET environment variable is required');
}

class InstagramAuthServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'instagram-auth-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_long_lived_token',
          description: 'Exchanges a code for a long-lived Instagram access token',
          inputSchema: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: 'The code received from Instagram',
              },
            },
            required: ['code'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'get_long_lived_token') {
        const code = request.params.arguments?.code;

        if (!code) {
          throw new McpError(ErrorCode.InvalidParams, 'Code is required');
        }

        try {
          const shortLivedTokenResponse = await axios.post(
            'https://api.instagram.com/oauth/access_token',
            new URLSearchParams({
              client_id: INSTAGRAM_CLIENT_ID,
              client_secret: INSTAGRAM_CLIENT_SECRET,
              code: code,
              grant_type: 'authorization_code',
              redirect_uri: INSTAGRAM_REDIRECT_URI,
            })
          );

          const shortLivedToken = shortLivedTokenResponse.data.access_token;

          const longLivedTokenResponse = await axios.get(
            `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${INSTAGRAM_CLIENT_SECRET}&access_token=${shortLivedToken}`
          );

          const longLivedToken = longLivedTokenResponse.data.access_token;
          const expiresIn = longLivedTokenResponse.data.expires_in;

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  longLivedToken,
                  expiresIn,
                }),
              },
            ],
          };
        } catch (error: any) {
          console.error(error);
          throw new McpError(
            ErrorCode.InternalError,
            error.message || 'Failed to exchange code for token'
          );
        }
      } else {
        throw new McpError(ErrorCode.MethodNotFound, 'Tool not found');
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Instagram Auth MCP server running on stdio');
  }
}

const server = new InstagramAuthServer();
server.run().catch(console.error);