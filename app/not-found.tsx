import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Event Not Found</h1>
          <p className="text-muted-foreground text-balance">
            The event you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin">Go to Admin Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
