import { NextResponse } from "next/server"
import { getAttendees, getLeaderboard } from "@/lib/storage"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const leaderboard = searchParams.get("leaderboard")

  if (leaderboard === "true") {
    const limit = Number(searchParams.get("limit")) || 10
    const topAttendees = getLeaderboard(limit)
    return NextResponse.json(topAttendees)
  }

  const attendees = getAttendees()
  return NextResponse.json(attendees)
}
