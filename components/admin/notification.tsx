"use client"

import { useToast } from "@/hooks/use-toast"

/* Simple wrapper that exposes the toast hook for dashboard pages */
export const useNotification = () => {
  const { toast } = useToast()
  return {
    success: (message: string) => toast({ title: "Success", description: message }),
    error: (message: string) => toast({ variant: "destructive", title: "Error", description: message }),
  }
}
