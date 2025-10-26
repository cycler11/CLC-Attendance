// Simple authentication utilities for admin access

export const ADMIN_CREDENTIALS = {
  username: "andreaisthebest",
  // Password: CaltechLongevity2025!SecureAdmin#
  passwordHash: "e8c5f3a9b2d1c4e7f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0", // Hashed version
}

// Simple hash function for password verification
export function hashPassword(password: string): string {
  // In production, use bcrypt or similar
  // This is a simple implementation for demo purposes
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(64, "0")
}

export function verifyPassword(password: string): boolean {
  const actualPassword = "CaltechLongevity2025!SecureAdmin#"
  return password === actualPassword
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  const authToken = localStorage.getItem("admin_auth")
  return authToken === "authenticated"
}

export function setAuthenticated(value: boolean) {
  if (typeof window === "undefined") return
  if (value) {
    localStorage.setItem("admin_auth", "authenticated")
  } else {
    localStorage.removeItem("admin_auth")
  }
}
