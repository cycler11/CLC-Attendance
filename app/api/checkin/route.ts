import { NextResponse } from "next/server"
import {
  getEventById,
  getAttendeeByEmail,
  createAttendee,
  hasAttended,
  recordAttendance,
  getNotionSettings,
} from "@/lib/storage"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { eventId, email, fullName } = body

    // Validate Caltech email
    if (!email.endsWith("@caltech.edu")) {
      return NextResponse.json({ error: "Please use your Caltech email address" }, { status: 400 })
    }

    // Check if event exists
    const event = getEventById(eventId)
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Get or create attendee
    let attendee = getAttendeeByEmail(email)
    if (!attendee) {
      attendee = createAttendee(email, fullName)
    }

    // Check if already checked in
    if (hasAttended(eventId, attendee.id)) {
      return NextResponse.json({ error: "You have already checked in to this event" }, { status: 400 })
    }

    // Record attendance
    const record = recordAttendance(eventId, attendee.id, event.pointsValue)

    // Sync to Notion if configured
    const notionSettings = getNotionSettings()
    if (notionSettings?.isConnected) {
      try {
        await syncToNotion(attendee, event, record, notionSettings)
      } catch (error) {
        console.error("[v0] Failed to sync to Notion:", error)
        // Continue even if Notion sync fails
      }
    }

    return NextResponse.json({
      success: true,
      pointsAwarded: event.pointsValue,
      totalPoints: attendee.totalPoints,
      message: `Successfully checked in! You earned ${event.pointsValue} points.`,
    })
  } catch (error) {
    console.error("[v0] Check-in error:", error)
    return NextResponse.json({ error: "Failed to process check-in" }, { status: 500 })
  }
}

async function syncToNotion(attendee: any, event: any, record: any, settings: any) {
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: settings.databaseId },
      properties: {
        Name: {
          title: [{ text: { content: attendee.fullName } }],
        },
        Email: {
          email: attendee.email,
        },
        Event: {
          rich_text: [{ text: { content: event.name } }],
        },
        Points: {
          number: record.pointsAwarded,
        },
        Date: {
          date: { start: record.checkedInAt },
        },
      },
    }),
  })

  if (!response.ok) {
    throw new Error("Notion API error")
  }
}
