import { NextResponse } from "next/server"
import { getNotionSettings, setNotionSettings, clearNotionSettings } from "@/lib/storage"

export async function GET() {
  const settings = getNotionSettings()

  // Don't expose the API key
  if (settings) {
    return NextResponse.json({
      isConnected: settings.isConnected,
      databaseId: settings.databaseId,
      hasApiKey: !!settings.apiKey,
    })
  }

  return NextResponse.json({ isConnected: false })
}

export async function POST(request: Request) {
  try {
    const { apiKey, databaseId } = await request.json()

    setNotionSettings({
      apiKey,
      databaseId,
      isConnected: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}

export async function DELETE() {
  clearNotionSettings()
  return NextResponse.json({ success: true })
}
