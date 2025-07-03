import { NextResponse } from "next/server"
import getConnectionStatus, { getDatabase } from "@/lib/mongodb"

export async function GET() {
  console.log("🔍 Database status check requested at:", new Date().toISOString())

  const startTime = Date.now()
  let connectionDetails = {
    uri: process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') || "Not configured",
    environment: process.env.NODE_ENV || "unknown",
    nodeVersion: process.version,
    platform: process.platform,
  }

  try {
    console.log("📡 Testing database connection...")
    
    // Test basic connection
    let connectionStatus;
    let responseTime;
    try {
      connectionStatus = await getConnectionStatus;
      responseTime = Date.now() - startTime;
    } catch (err: any) {
      responseTime = Date.now() - startTime;
      console.error("❌ Connection test failed:", err);

      return NextResponse.json({
        status: "disconnected",
        connected: false,
        error: err?.message || "Database connection failed",
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
        connectionDetails,
        troubleshooting: {
          commonIssues: [
            "MongoDB URI not configured properly",
            "MongoDB service not running (for local installations)",
            "Network connectivity issues",
            "Authentication credentials incorrect",
            "IP address not whitelisted (MongoDB Atlas)",
          ],
          sslError: err?.message?.includes("SSL") || err?.message?.includes("TLS"),
          connectionRefused: err?.message?.includes("ECONNREFUSED"),
          authenticationError: err?.message?.includes("Authentication failed"),
          networkError: err?.message?.includes("getaddrinfo ENOTFOUND"),
          suggestions: getSuggestions(err?.message || ""),
        },
        diagnostics: {
          mongoUriConfigured: !!process.env.MONGODB_URI,
          mongoUriFormat: validateMongoURI(process.env.MONGODB_URI || ""),
          environmentVariables: {
            NODE_ENV: process.env.NODE_ENV,
            MONGODB_URI_EXISTS: !!process.env.MONGODB_URI,
          }
        }
      }, { status: 503 });
    }

    // If connected, get detailed database information
    console.log("✅ Connection successful, fetching database details...")
    
    const db = await getDatabase()
    let databaseInfo = {
      name: db.databaseName,
      collections: [] as string[],
      stats: {} as Record<string, number>,
      indexes: {} as Record<string, number>,
      serverInfo: {} as any,
    }

    try {
      // Get collections
      console.log("📊 Fetching collections...")
      const collections = await db.listCollections().toArray()
      databaseInfo.collections = collections.map((c) => c.name)

      // Get document counts for each collection
      console.log("🔢 Counting documents...")
      const collectionStats: Record<string, number> = {}
      const collectionIndexes: Record<string, number> = {}

      for (const collection of databaseInfo.collections) {
        try {
          collectionStats[collection] = await db.collection(collection).countDocuments()
          const indexes = await db.collection(collection).listIndexes().toArray()
          collectionIndexes[collection] = indexes.length
        } catch (error) {
          console.warn(`⚠️ Could not get stats for collection ${collection}:`, error)
          collectionStats[collection] = -1
          collectionIndexes[collection] = -1
        }
      }

      databaseInfo.stats = collectionStats
      databaseInfo.indexes = collectionIndexes

      // Get server information
      console.log("🖥️ Fetching server info...")
      try {
        const serverStatus = await db.admin().serverStatus()
        databaseInfo.serverInfo = {
          version: serverStatus.version,
          uptime: serverStatus.uptime,
          connections: serverStatus.connections,
          host: serverStatus.host,
          ok: serverStatus.ok,
        }
      } catch (error) {
        console.warn("⚠️ Could not fetch server info:", error)
        databaseInfo.serverInfo = { error: "Unable to fetch server info" }
      }

    } catch (statsError) {
      console.warn("⚠️ Could not fetch complete database stats:", statsError)
      databaseInfo.stats = { error: -1 }
    }

    const finalResponseTime = Date.now() - startTime
    console.log(`✅ Database status check completed successfully in ${finalResponseTime}ms`)

    return NextResponse.json({
      status: "connected",
      connected: true,
      message: "Database connection successful",
      responseTime: `${finalResponseTime}ms`,
      timestamp: new Date().toISOString(),
      connectionDetails,
      database: databaseInfo,
      health: {
        ping: "ok",
        latency: `${finalResponseTime}ms`,
        status: "healthy",
      },
      summary: {
        totalCollections: databaseInfo.collections.length,
        totalDocuments: Object.values(databaseInfo.stats).reduce((sum, count) => 
          typeof count === 'number' && count >= 0 ? sum + count : sum, 0),
        totalIndexes: Object.values(databaseInfo.indexes).reduce((sum, count) => 
          typeof count === 'number' && count >= 0 ? sum + count : sum, 0),
      }
    })

  } catch (error) {
    const finalResponseTime = Date.now() - startTime
    console.error("💥 Database status check error:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorType = categorizeError(errorMessage)

    return NextResponse.json({
      status: "error",
      connected: false,
      error: errorMessage,
      errorType,
      responseTime: `${finalResponseTime}ms`,
      timestamp: new Date().toISOString(),
      connectionDetails,
      troubleshooting: {
        errorCategory: errorType,
        suggestions: getSuggestions(errorMessage),
        commonSolutions: getCommonSolutions(errorType),
      },
      diagnostics: {
        mongoUriConfigured: !!process.env.MONGODB_URI,
        mongoUriFormat: validateMongoURI(process.env.MONGODB_URI || ""),
        environmentVariables: {
          NODE_ENV: process.env.NODE_ENV,
          MONGODB_URI_EXISTS: !!process.env.MONGODB_URI,
        }
      }
    }, { status: 500 })
  }
}

function categorizeError(errorMessage: string): string {
  if (errorMessage.includes("ECONNREFUSED")) return "connection_refused"
  if (errorMessage.includes("ENOTFOUND")) return "dns_resolution"
  if (errorMessage.includes("Authentication failed")) return "authentication"
  if (errorMessage.includes("SSL") || errorMessage.includes("TLS")) return "ssl_tls"
  if (errorMessage.includes("timeout")) return "timeout"
  if (errorMessage.includes("network")) return "network"
  return "unknown"
}

function getSuggestions(errorMessage: string): string[] {
  const suggestions = []
  
  if (errorMessage.includes("ECONNREFUSED")) {
    suggestions.push(
      "MongoDB service is not running - start MongoDB locally with 'mongod'",
      "Check if MongoDB is running on the correct port (default: 27017)",
      "For Atlas: verify your cluster is running and not paused"
    )
  }
  
  if (errorMessage.includes("ENOTFOUND")) {
    suggestions.push(
      "DNS resolution failed - check your MongoDB Atlas cluster URL",
      "Verify your internet connection",
      "Check if the cluster hostname is correct in your connection string"
    )
  }
  
  if (errorMessage.includes("Authentication failed")) {
    suggestions.push(
      "Check your MongoDB username and password",
      "Verify database user permissions",
      "Ensure the user has access to the specified database"
    )
  }
  
  if (errorMessage.includes("SSL") || errorMessage.includes("TLS")) {
    suggestions.push(
      "SSL/TLS connection error - update your MongoDB driver",
      "Check if your hosting environment supports required TLS version",
      "For Atlas: try adding '&ssl=true' to your connection string"
    )
  }
  
  if (errorMessage.includes("timeout")) {
    suggestions.push(
      "Connection timeout - check your network connectivity",
      "Increase timeout values in your connection options",
      "For Atlas: verify your IP is whitelisted"
    )
  }
  
  if (suggestions.length === 0) {
    suggestions.push(
      "Check your MongoDB connection string format",
      "Verify your database credentials are correct",
      "Ensure your IP is whitelisted (for Atlas)",
      "Check if MongoDB service is running",
      "Review MongoDB logs for more details"
    )
  }
  
  return suggestions
}

function getCommonSolutions(errorType: string): string[] {
  const solutions = {
    connection_refused: [
      "Start MongoDB: mongod",
      "Check MongoDB status: systemctl status mongod",
      "Verify port 27017 is available",
      "Check firewall settings"
    ],
    dns_resolution: [
      "Check internet connection",
      "Verify MongoDB Atlas cluster URL",
      "Try using IP address instead of hostname",
      "Check DNS settings"
    ],
    authentication: [
      "Verify username and password",
      "Check database user permissions",
      "Recreate database user if needed",
      "Check connection string format"
    ],
    ssl_tls: [
      "Update MongoDB driver to latest version",
      "Check TLS version compatibility",
      "Add SSL options to connection string",
      "Contact hosting provider about TLS support"
    ],
    timeout: [
      "Increase connection timeout",
      "Check network connectivity",
      "Verify IP whitelist (Atlas)",
      "Check server resource usage"
    ],
    unknown: [
      "Check MongoDB connection string",
      "Verify environment variables",
      "Check MongoDB service status",
      "Review error logs for more details"
    ]
  }
  
  return solutions[errorType as keyof typeof solutions] || solutions.unknown
}

function validateMongoURI(uri: string): { valid: boolean; type: string; issues: string[] } {
  if (!uri) {
    return { valid: false, type: "missing", issues: ["MongoDB URI is not configured"] }
  }
  
  const issues = []
  let type = "unknown"
  
  if (uri.startsWith("mongodb://")) {
    type = "local"
  } else if (uri.startsWith("mongodb+srv://")) {
    type = "atlas"
  } else {
    issues.push("URI should start with 'mongodb://' or 'mongodb+srv://'")
  }
  
  if (!uri.includes("@") && type === "atlas") {
    issues.push("Atlas URI should contain credentials (username:password@)")
  }
  
  if (type === "local" && !uri.includes("localhost") && !uri.includes("127.0.0.1")) {
    issues.push("Local URI should contain 'localhost' or '127.0.0.1'")
  }
  
  return {
    valid: issues.length === 0,
    type,
    issues
  }
}