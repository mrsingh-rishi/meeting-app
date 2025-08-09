import axios from 'axios'

export interface MCPRequest {
  jsonrpc: string
  id: number | string
  method: string
  params?: Record<string, unknown>
}

export interface MCPResponse {
  jsonrpc: string
  id: number | string
  result?: unknown
  error?: {
    code: number
    message: string
    data?: unknown
  }
}

export interface MCPTool {
  name: string
  description: string
  inputSchema: {
    type: string
    properties: Record<string, unknown>
    required?: string[]
  }
}

export class MCPClient {
  private serverUrl: string
  private requestId: number = 1

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl
  }

  private async sendRequest(method: string, params?: Record<string, unknown>): Promise<MCPResponse> {
    const request: MCPRequest = {
      jsonrpc: '2.0',
      id: this.requestId++,
      method,
      params
    }

    try {
      const response = await axios.post(this.serverUrl, request, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      })
      
      return response.data as MCPResponse
    } catch (error) {
      throw new Error(`MCP request failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async initialize(): Promise<void> {
    const response = await this.sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {
        roots: {
          listChanged: true
        },
        sampling: {}
      },
      clientInfo: {
        name: 'meeting-app',
        version: '1.0.0'
      }
    })

    if (response.error) {
      throw new Error(`MCP initialization failed: ${response.error.message}`)
    }
  }

  async listTools(): Promise<MCPTool[]> {
    const response = await this.sendRequest('tools/list')
    
    if (response.error) {
      throw new Error(`Failed to list tools: ${response.error.message}`)
    }

    return (response.result as { tools?: MCPTool[] })?.tools || []
  }

  async callTool(name: string, arguments_: Record<string, unknown>): Promise<unknown> {
    const response = await this.sendRequest('tools/call', {
      name,
      arguments: arguments_
    })

    if (response.error) {
      throw new Error(`Tool call failed: ${response.error.message}`)
    }

    return response.result
  }
}
