import { type NextRequest, NextResponse } from "next/server"
import { ADMIN_CREDENTIALS, verifyPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (username === ADMIN_CREDENTIALS.username && verifyPassword(password)) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "Invalid username or password" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
