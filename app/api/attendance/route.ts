import { NextResponse } from "next/server"
import { getAttendanceRecords, getEventById, getAttendeeById } from "@/lib/storage"

export async function GET() {
  const records = getAttendanceRecords()

  // Enrich records with event and attendee details
  const enrichedRecords = records.map((record) => {
    const event = getEventById(record.eventId)
    const attendee = getAttendeeById(record.attendeeId)

    return {
      ...record,
      eventName: event?.name || "Unknown Event",
      attendeeName: attendee?.fullName || "Unknown Attendee",
      attendeeEmail: attendee?.email || "",
    }
  })

  return NextResponse.json(enrichedRecords)
}
