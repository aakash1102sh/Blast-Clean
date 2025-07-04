"use client"

import { Menu, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DatabaseStatus } from "@/lib/types"

interface AdminHeaderProps {
  activeTab: string
  dbStatus: DatabaseStatus | null
  loading: boolean
  onMenuClick: () => void
  onRefreshDatabase: () => void
}

export function AdminHeader({ activeTab, dbStatus, loading, onMenuClick, onRefreshDatabase }: AdminHeaderProps) {
  return (
    <header className="border-b bg-card px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Button variant="ghost" size="sm" className="md:hidden p-2" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>

          <h1 className="text-xl sm:text-2xl font-bold capitalize truncate">{activeTab}</h1>

          <div className="hidden sm:flex items-center space-x-2">
            {dbStatus?.connected ? (
              <div className="flex items-center space-x-1">
                <Database className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600">Connected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Database className="h-4 w-4 text-red-600" />
                <span className="text-xs text-red-600">Disconnected</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}

          <Button
            variant="outline"
            size="sm"
            onClick={onRefreshDatabase}
            disabled={loading}
            className="hidden sm:flex bg-transparent"
          >
            <Database className="h-4 w-4 mr-1" />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefreshDatabase}
            disabled={loading}
            className="sm:hidden p-2 bg-transparent"
          >
            <Database className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
