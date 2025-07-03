// "use client"

// import { SidebarTrigger } from "@/components/ui/sidebar"
// import { Button } from "@/components/ui/button"
// import { Database, LogOut } from "lucide-react"
// import { usePathname } from "next/navigation"

// interface AdminHeaderProps {
//   setSidebarOpen: (open: boolean) => void
//   loading: boolean
//   dbStatus: {
//     connected: boolean
//     stats?: { products: number; orders: number; customers: number }
//     error?: string
//   } | null
//   onRefreshStatus: () => void
// }

// export function AdminHeader({ setSidebarOpen, loading, dbStatus, onRefreshStatus }: AdminHeaderProps) {
//   const pathname = usePathname()

//   const getPageTitle = () => {
//     switch (pathname) {
//       case "/admin/dashboard":
//         return "Orders"
//       case "/admin/dashboard/customers":
//         return "Customers"
//       case "/admin/dashboard/products":
//         return "Products"
//       case "/admin/dashboard/settings":
//         return "Settings"
//       default:
//         return "Dashboard"
//     }
//   }

//   return (
//     <header className="h-16 flex items-center gap-4 border-b px-4">
//       <SidebarTrigger onClick={() => setSidebarOpen(true)} />
//       <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
//       <div className="ml-auto flex items-center space-x-2">
//         {/* Database Status in Header */}
//         <div className="flex items-center space-x-1">
//           {dbStatus?.connected ? (
//             <div className="flex items-center space-x-1">
//               <Database className="h-4 w-4 text-green-600" />
//               <span className="text-xs text-green-600 hidden sm:inline">Connected</span>
//             </div>
//           ) : (
//             <div className="flex items-center space-x-1">
//               <Database className="h-4 w-4 text-red-600" />
//               <span className="text-xs text-red-600 hidden sm:inline">Disconnected</span>
//             </div>
//           )}
//         </div>
//         {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
//         <Button variant="outline" size="sm" onClick={onRefreshStatus} disabled={loading}>
//           <Database className="h-4 w-4 mr-1" />
//           <span className="hidden sm:inline">Refresh</span>
//         </Button>
//         <Button variant="ghost" size="icon" aria-label="Sign out">
//           <LogOut className="h-4 w-4" />
//         </Button>
//       </div>
//     </header>
//   )
// }
