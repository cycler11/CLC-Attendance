import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { apiKey, databaseId } = await request.json()

    if (!apiKey || !databaseId) {
      return NextResponse.json({ error: "API key and database ID are required" }, { status: 400 })
    }

    // Test connection by retrieving database info
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: "Failed to connect to Notion. Please check your credentials." },
        { status: 400 },
      )
    }

    const database = await response.json()

    return NextResponse.json({
      success: true,
      databaseName: database.title?.[0]?.plain_text || "Untitled Database",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to test Notion connection" }, { status: 500 })
  }
}
