import { NextResponse } from "next/server"
import { getEvents, createEvent } from "@/lib/storage"

export async function GET() {
  const events = getEvents()
  return NextResponse.json(events)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, date, location, pointsValue } = body

    if (!name || !date || !pointsValue) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const event = createEvent({
      name,
      description: description || "",
      date,
      location: location || "",
      pointsValue: Number(pointsValue),
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
