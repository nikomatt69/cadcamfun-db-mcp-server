# Prisma MCP Server

This package provides a Model Context Protocol (MCP) server that acts as an interface to a database managed by Prisma ORM. It allows MCP-compatible clients (like AI assistants or other applications) to interact with your database by querying resources and executing tools.

This server uses `fastmcp` to expose Prisma models and operations.

## Features

*   **Resource Loading:** Exposes Prisma models as readable MCP resources (e.g., `resource://users/{user_id}`, `resource://projects`).
*   **Tool Execution:** Provides MCP tools for common CRUD (Create, Read, Update, Delete) operations on your Prisma models (e.g., `create_user`, `update_project`).
*   **Database Interaction:** Handles the translation between MCP requests and Prisma Client database queries.
*   **Configurable Transport:** Supports both `stdio` and `sse` (Server-Sent Events over HTTP) transport modes.
*   **Extensible:** Easily add custom resources or tools for more complex operations or interactions with other application services.

## Prerequisites

*   **Node.js:** A recent version (check `package.json` engines if specified).
*   **Yarn or npm:** Package manager.
*   **Prisma Client:** Your consuming project must have `@prisma/client` installed and a `prisma/schema.prisma` file configured for your target database.
*   **Database:** A running database instance supported by Prisma (e.g., PostgreSQL, MySQL, SQLite).

## Installation

```bash
# Using yarn
yarn add cadcamfun-db-mcp-server @prisma/client

# Using npm
npm install cadcamfun-db-mcp-server @prisma/client
```

**Note:** You *must* install `@prisma/client` as a peer dependency in the project *using* this server package.

## Setup in Consuming Project

1.  **Prisma Schema:** Ensure you have a valid `prisma/schema.prisma` file in your project root defining your database connection and models.
2.  **Environment Variables:** Configure the necessary environment variables (e.g., in a `.env` file). **Do not commit sensitive variables like `DATABASE_URL` directly to version control.**
    *   `DATABASE_URL`: **(Required)** The connection string for your database (e.g., `postgresql://user:password@host:port/database`).
    *   `TRANSPORT_TYPE`: (Optional) Set to `sse` to use Server-Sent Events over HTTP. **Defaults to `stdio`.**
    *   `PORT`: (Optional, requires `TRANSPORT_TYPE=sse`) Port for the SSE server. **Defaults to `8080`.**
    *   `MAIN_APP_URL`: (Optional) Base URL for your main application if using tools that need to call back to it (e.g., `trigger_main_app_notification`). **Defaults to `http://localhost:3000`.**
    *   `LOG_LEVEL`: (Optional) Controls logging verbosity. Set to `DEBUG`, `INFO`, `WARN`, or `ERROR`. Behavior depends on the logger implementation within the package (if used).
3.  **Generate Prisma Client:** Before running the server, you *must* generate the Prisma Client based on your schema:
    ```bash
    npx prisma generate
    ```
    This step is crucial as the server relies on the generated client in `node_modules/@prisma/client`.

## Usage

```typescript
// Example: index.ts in your consuming project

// Import the server creation function
import { createPrismaMcpServer } from 'prisma-mcp-server';
import { PrismaClient } from '@prisma/client'; // Make sure Prisma Client is installed

// Ensure required environment variables are set
if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set.");
  process.exit(1);
}

// Optional: Configure transport type and port via environment variables
// process.env.TRANSPORT_TYPE = 'sse';
// process.env.PORT = '8081';

async function main() {
  // Ensure Prisma Client is generated (Best done in a build step)
  try {
    // Check if client exists, generate if not (simple check)
    require.resolve('@prisma/client'); 
  } catch (e) {
      console.log('Prisma Client not found, attempting to generate...');
      try {
          const { execSync } = require('child_process');
          execSync('npx prisma generate', { stdio: 'inherit' });
          console.log('Prisma Client generated.');
      } catch (error) {
          console.error('Error generating Prisma Client:', error);
          process.exit(1);
      }
  }

  // Create the server instance
  const server = createPrismaMcpServer({
    // Optional: Override default server info if needed
    // name: "MyCustomServerName",
    // version: "2.0.0",
    // instructions: "Custom instructions..."
  });

  console.log(`Starting Prisma MCP Server...`);

  // Determine transport options based on environment variables
  const transportType = process.env.TRANSPORT_TYPE === 'sse' ? 'sse' : 'stdio';
  const port = parseInt(process.env.PORT || "8080");
  const sseEndpoint = "/sse"; // Assuming hardcoded endpoint

  const startOptions: any = { transportType }; // Use 'any' temporarily if exact type is complex
  if (transportType === 'sse') {
    startOptions.sse = { endpoint: sseEndpoint, port: port };
  }

  // Start the server using the options derived from environment variables
  server.start(startOptions);

  console.log(`Server started with transport: ${transportType}`);
  if (transportType === 'sse') {
      console.log(`SSE endpoint available at http://localhost:${port}${sseEndpoint}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

```

Now you can connect your MCP client to the running server using the configured transport method (`stdio` or the `/sse` endpoint).

## Connecting with Claude Desktop

Claude Desktop (or similar MCP clients) can connect to this server using either the `stdio` or `sse` transport method.

1.  **Configure Transport:**
    *   Before starting the server, set the `TRANSPORT_TYPE` environment variable in your consuming project's environment (e.g., in your `.env` file or system environment):
        *   `TRANSPORT_TYPE=stdio` (Default): The server will communicate over standard input and output.
        *   `TRANSPORT_TYPE=sse`: The server will start an HTTP server for Server-Sent Events.
    *   If using `sse`, you can also set the `PORT` environment variable (defaults to `8080`).

2.  **Start the Server:**
    *   Run your consuming application's entry point (e.g., `node your-app-entrypoint.js`) which includes the code to create and start the `prisma-mcp-server` (as shown in the [Usage](#usage) section).

3.  **Connect Claude Desktop:**
    *   **If using `stdio`:** Configure Claude Desktop to launch the server process directly. This usually involves providing the command to start your application (e.g., `node /path/to/your-app-entrypoint.js` or `yarn start` if you have a start script).
    *   **If using `sse`:** Configure Claude Desktop to connect to the HTTP endpoint. The default URL will be `http://localhost:8080/sse`. If you changed the `PORT`, adjust accordingly.

4.  **Identify the Server:**
    *   In Claude Desktop, you might need to identify the server. By default, it's named `PrismaAPI_Server` (version `1.1.0`), but this can be overridden when calling `createPrismaMcpServer`.

**Example `mcp.json` Snippets for Claude Desktop:**

*   **Using `stdio`:**

    ```json
    {
      "mcpServers": {
        "prisma_api_stdio": {
          "name": "Prisma API Server (stdio)", // Optional display name
          // Option 1: Using npx with a script/package name
          "command": "npx",
          "args": [
            "cadcamfun-db-mcp-server" // Replace with your actual script/package name
          ],
          // Option 2: Using yarn/npm run script
          // "command": "yarn", 
          // "args": ["start:prisma-mcp"], // Assuming a script named 'start:prisma-mcp'
          "workingDirectory": "" // Replace with the path to your CONSUMING project root
        }
      }
    }
    ```

*   **Using `sse`:**

    ```json
    {
      "mcpServers": {
        "prisma_api_sse": {
          "name": "Prisma API Server (SSE)", // Optional display name
          // Assumes the server is running and listening on port 8080 (default)
          // The port can be changed via the PORT environment variable when starting the server.
          "url": "http://localhost:8080/sse" 
        }
      }
    }
    ```

Refer to your specific MCP client's documentation for the exact steps on how to add and configure a new MCP server connection.

## Available Resources & Tools

This server exposes MCP resources and tools corresponding to the Prisma models defined in its internal schema (`prisma/schema.prisma` within the package, although it uses the *consuming project's* generated client).

**Resources (Examples):**

*   `resource://users`
*   `resource://users/{user_id}`
*   `resource://projects`
*   `resource://projects/{project_id}`
*   `resource://drawings?project_id={project_id}`
*   `resource://drawings/{drawing_id}`
*   `resource://components?project_id={project_id}`
*   `resource://components/{component_id}`
*   `resource://materials`
*   `resource://materials/{material_id}`
*   `resource://tools`
*   `resource://tools/{tool_id}`
*   `resource://machine-configs`
*   `resource://machine-configs/{machine_config_id}`
*   `resource://toolpaths?project_id={project_id}`
*   `resource://toolpaths/{toolpath_id}`
*   `resource://library-items`
*   `resource://library-items/{library_item_id}`

*(Refer to `src/resources.ts` for the complete list and arguments)*

**Tools (Examples):**

*   `create_user`, `update_user`, `delete_user`
*   `create_subscription`, `update_subscription`, `delete_subscription`
*   `create_organization`, `update_organization`, `delete_organization`
*   `create_project`, `update_project`, `delete_project`
*   `create_drawing`, `update_drawing`, `delete_drawing`
*   `create_component`, `update_component`, `delete_component`
*   `create_material`, `update_material`, `delete_material`
*   `create_tool_prisma`, `update_tool_prisma`, `delete_tool_prisma`
*   `create_machine_config`, `update_machine_config`, `delete_machine_config`
*   `create_toolpath`, `update_toolpath`, `delete_toolpath`
*   `create_library_item`, `update_library_item`, `delete_library_item`
*   `trigger_main_app_notification` (Example custom tool)

*(Refer to `src/tools.ts` for the complete list and parameters defined using Zod)*

## Extending

You can fork this package or use it as a base to add your own custom resources and tools by modifying `src/resources.ts` and `src/tools.ts`. Remember to rebuild (`yarn build`) after making changes.

## Deployment

1.  **Configure Database:** Ensure your production `DATABASE_URL` environment variable is set correctly in your deployment environment (e.g., server environment variables, secrets manager). **Do not commit this to your repository.**
2.  **Environment Variables:** Set `TRANSPORT_TYPE` (`sse` or `stdio`) and optionally `PORT` and `MAIN_APP_URL` in your deployment environment.
3.  **Build & Run:**
    ```bash
    # Navigate to your project directory (where prisma-mcp-server is a dependency)

    # Install dependencies
    yarn install --production # Or npm install --omit=dev

    # Generate Prisma Client (Important! Needs DATABASE_URL)
    npx prisma generate

    # Apply Migrations (Needs DATABASE_URL - Replace with your strategy)
    # Example:
    # npx prisma migrate deploy 

    # Build your application (which includes the server code)
    yarn build # Or your specific build command

    # Start your application (which starts the MCP server)
    # Use a process manager like pm2 in production
    # Example:
    # pm2 start your-app-entrypoint.js 
    # OR
    # node your-app-entrypoint.js 
    ```

## License

[Specify Your License Here] 