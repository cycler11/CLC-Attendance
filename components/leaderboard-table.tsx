"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

interface Attendee {
  id: string
  email: string
  fullName: string
  totalPoints: number
  eventsAttended: number
}

export function LeaderboardTable() {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/attendees?leaderboard=true&limit=10")
      const data = await response.json()
      setAttendees(data)
    } catch (error) {
      console.error("[v0] Failed to fetch leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading leaderboard...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <CardTitle>Top Attendees</CardTitle>
        </div>
        <CardDescription>Members with the most points</CardDescription>
      </CardHeader>
      <CardContent>
        {attendees.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No attendees yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Events</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendees.map((attendee, index) => (
                <TableRow key={attendee.id}>
                  <TableCell>
                    {index === 0 && <Badge className="bg-yellow-500">1st</Badge>}
                    {index === 1 && <Badge className="bg-gray-400">2nd</Badge>}
                    {index === 2 && <Badge className="bg-orange-600">3rd</Badge>}
                    {index > 2 && <span className="text-muted-foreground">{index + 1}</span>}
                  </TableCell>
                  <TableCell className="font-medium">{attendee.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">{attendee.email}</TableCell>
                  <TableCell className="text-right">{attendee.eventsAttended}</TableCell>
                  <TableCell className="text-right font-semibold">{attendee.totalPoints}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
