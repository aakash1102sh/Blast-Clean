interface LoadingOverlayProps {
  loading: boolean
}

export function LoadingOverlay({ loading }: LoadingOverlayProps) {
  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-3 text-sm text-muted-foreground text-center">Loading...</p>
      </div>
    </div>
  )
}
