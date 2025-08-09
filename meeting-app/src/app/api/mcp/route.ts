import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MCPGoogleCalendarService } from '@/lib/mcp-google-calendar'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get MCP status using the new method
    const mcpStatus = await MCPGoogleCalendarService.getMCPStatus()

    return NextResponse.json({
      mcpIntegration: {
        ...mcpStatus,
        message: 'Model Context Protocol integration for Google Calendar',
        fallbackMode: mcpStatus.enabled ? 'Direct MCP communication' : 'MCP wrapper around Google API'
      }
    })

  } catch (error) {
    console.error('Error checking MCP status:', error)
    return NextResponse.json({
      mcpIntegration: {
        enabled: false,
        error: 'MCP server unavailable',
        fallbackMode: 'Direct Google API with MCP wrapper',
        availableTools: []
      }
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { toolName, args } = await request.json()

    if (!toolName) {
      return NextResponse.json({ error: 'Tool name is required' }, { status: 400 })
    }

    // Call MCP tool directly
    const result = await MCPGoogleCalendarService.callMCPTool(toolName, args || {})

    return NextResponse.json({
      tool: toolName,
      result,
      protocol: 'MCP'
    })

  } catch (error) {
    console.error('Error calling MCP tool:', error)
    return NextResponse.json(
      { error: 'Failed to call MCP tool' }, 
      { status: 500 }
    )
  }
}
