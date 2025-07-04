import { CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { NotificationType } from "@/lib/types"

interface NotificationAlertProps {
  notification: NotificationType | null
}

export function NotificationAlert({ notification }: NotificationAlertProps) {
  if (!notification) return null

  return (
    <Alert
      className={`fixed top-4 right-4 z-50 w-80 sm:w-96 ${
        notification.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
      }`}
    >
      {notification.type === "success" ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <AlertCircle className="h-4 w-4 text-red-600" />
      )}
      <AlertDescription className={notification.type === "success" ? "text-green-800" : "text-red-800"}>
        {notification.message}
      </AlertDescription>
    </Alert>
  )
}
