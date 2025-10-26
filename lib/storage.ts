// In-memory storage for events, attendees, and attendance records
export interface Event {
  id: string
  name: string
  description: string
  date: string
  location: string
  pointsValue: number
  createdAt: string
}

export interface Attendee {
  id: string
  email: string
  fullName: string
  totalPoints: number
  eventsAttended: number
  createdAt: string
}

export interface AttendanceRecord {
  id: string
  eventId: string
  attendeeId: string
  checkedInAt: string
  pointsAwarded: number
}

export interface NotionSettings {
  apiKey: string
  databaseId: string
  isConnected: boolean
}

// In-memory storage
const events: Event[] = []
const attendees: Attendee[] = []
let attendanceRecords: AttendanceRecord[] = []
let notionSettings: NotionSettings | null = null

// Events CRUD
export function getEvents(): Event[] {
  return events
}

export function getEventById(id: string): Event | undefined {
  return events.find((e) => e.id === id)
}

export function createEvent(event: Omit<Event, "id" | "createdAt">): Event {
  const newEvent: Event = {
    ...event,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  events.push(newEvent)
  return newEvent
}

export function updateEvent(id: string, updates: Partial<Event>): Event | null {
  const index = events.findIndex((e) => e.id === id)
  if (index === -1) return null
  events[index] = { ...events[index], ...updates }
  return events[index]
}

export function deleteEvent(id: string): boolean {
  const index = events.findIndex((e) => e.id === id)
  if (index === -1) return false
  events.splice(index, 1)
  // Also delete related attendance records
  attendanceRecords = attendanceRecords.filter((r) => r.eventId !== id)
  return true
}

// Attendees CRUD
export function getAttendees(): Attendee[] {
  return attendees
}

export function getAttendeeById(id: string): Attendee | undefined {
  return attendees.find((a) => a.id === id)
}

export function getAttendeeByEmail(email: string): Attendee | undefined {
  return attendees.find((a) => a.email.toLowerCase() === email.toLowerCase())
}

export function createAttendee(email: string, fullName: string): Attendee {
  const newAttendee: Attendee = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    fullName,
    totalPoints: 0,
    eventsAttended: 0,
    createdAt: new Date().toISOString(),
  }
  attendees.push(newAttendee)
  return newAttendee
}

// Attendance Records
export function getAttendanceRecords(): AttendanceRecord[] {
  return attendanceRecords
}

export function getAttendanceByEvent(eventId: string): AttendanceRecord[] {
  return attendanceRecords.filter((r) => r.eventId === eventId)
}

export function getAttendanceByAttendee(attendeeId: string): AttendanceRecord[] {
  return attendanceRecords.filter((r) => r.attendeeId === attendeeId)
}

export function hasAttended(eventId: string, attendeeId: string): boolean {
  return attendanceRecords.some((r) => r.eventId === eventId && r.attendeeId === attendeeId)
}

export function recordAttendance(eventId: string, attendeeId: string, pointsAwarded: number): AttendanceRecord {
  const record: AttendanceRecord = {
    id: crypto.randomUUID(),
    eventId,
    attendeeId,
    checkedInAt: new Date().toISOString(),
    pointsAwarded,
  }
  attendanceRecords.push(record)

  // Update attendee stats
  const attendee = attendees.find((a) => a.id === attendeeId)
  if (attendee) {
    attendee.totalPoints += pointsAwarded
    attendee.eventsAttended += 1
  }

  return record
}

// Notion Settings
export function getNotionSettings(): NotionSettings | null {
  return notionSettings
}

export function setNotionSettings(settings: NotionSettings): void {
  notionSettings = settings
}

export function clearNotionSettings(): void {
  notionSettings = null
}

// Stats
export function getStats() {
  return {
    totalEvents: events.length,
    totalAttendees: attendees.length,
    totalCheckIns: attendanceRecords.length,
    totalPointsAwarded: attendees.reduce((sum, a) => sum + a.totalPoints, 0),
  }
}

// Leaderboard
export function getLeaderboard(limit = 10): Attendee[] {
  return [...attendees].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, limit)
}
