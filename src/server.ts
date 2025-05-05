// src/server.ts

import { FastMCP } from "fastmcp";
import { registerResources } from "./resources.js";
import { registerTools } from "./tools.js";

// Create a new MCP server
const server = new FastMCP({
  name: "CADCAMFUN_DB_MCP_SERVER",
  version: "1.4.0",
  instructions: `
    This MCP server provides access to a database with various entities like users, 
    organizations, projects, drawings, components, materials, tools, etc.
    
    You can use the resources to query data and the tools to create, update, or delete data.
    All operations use standard JSON.
  `,
});

// Register all resources
registerResources(server);

// Register all tools
registerTools(server);

console.log("Starting CADCAMFUN_DB_MCP_SERVER...");

// Start the server in stdio mode by default
server.start({
  transportType: "stdio"
});

// For SSE mode (HTTP), you can set the environment variable TRANSPORT_TYPE=sse
// and configure the port with PORT (default: 8080)
if (process.env.TRANSPORT_TYPE === "sse") {
  server.start({
    transportType: "sse",
    sse: {
      endpoint: "/sse",
      port: parseInt(process.env.PORT || "8080"),
    },
  });
}
