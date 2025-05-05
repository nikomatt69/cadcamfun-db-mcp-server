import { FastMCP, UserError } from "fastmcp";
import prisma from "./db.js";
import * as models from "./models.js";

export function registerResources(server: FastMCP<any>) {
  // Users resources
  server.addResourceTemplate({
    uriTemplate: "resource://users",
    name: "Users",
    mimeType: "application/json",
    arguments: [],
    async load(_args) {
      
      try {
        const users = await prisma.user.findMany({
          include: {
            subscription: true
          }
        });
        
        return { 
          text: JSON.stringify(users) 
        };
      } catch (error) {
        throw new UserError(`Failed to list users: ${error}`);
      }
    },
  });

  server.addResourceTemplate({
    uriTemplate: "resource://users/{user_id}",
    name: "User",
    mimeType: "application/json",
    arguments: [
      {
        name: "user_id",
        description: "ID of the user",
        required: true,
      },
    ],
    async load({ user_id }) {
      
      try {
        const user = await prisma.user.findUnique({ 
          where: { id: user_id },
          include: {
            subscription: true
          }
        });
        
        if (!user) {
          throw new UserError(`User with ID ${user_id} not found`);
        }
        
        return { 
          text: JSON.stringify(user) 
        };
      } catch (error) {
        throw new UserError(`Failed to get user: ${error}`);
      }
    },
  });

  // Organizations resources
  server.addResourceTemplate({
    uriTemplate: "resource://organizations",
    name: "Organizations",
    mimeType: "application/json",
    arguments: [],
    async load(_args) {
      
      try {
        const organizations = await prisma.organization.findMany();
        
        return { 
          text: JSON.stringify(organizations) 
        };
      } catch (error) {
        throw new UserError(`Failed to list organizations: ${error}`);
      }
    },
  });

  server.addResourceTemplate({
    uriTemplate: "resource://organizations/{organization_id}",
    name: "Organization",
    mimeType: "application/json",
    arguments: [
      {
        name: "organization_id",
        description: "ID of the organization",
        required: true,
      },
    ],
    async load({ organization_id }) {
      
      try {
        const organization = await prisma.organization.findUnique({
          where: { id: organization_id }
        });
        
        if (!organization) {
          throw new UserError(`Organization with ID ${organization_id} not found`);
        }
        
        return { 
          text: JSON.stringify(organization) 
        };
      } catch (error) {
        throw new UserError(`Failed to get organization: ${error}`);
      }
    },
  });

  // Projects resources
  server.addResourceTemplate({
    uriTemplate: "resource://projects",
    name: "Projects",
    mimeType: "application/json",
    arguments: [
      {
        name: "organization_id",
        description: "Optional ID of the organization to filter projects",
        required: false,
      },
    ],
    async load({ organization_id }) {
      
      try {
        const where = organization_id ? { organizationId: organization_id } : {};
        
        const projects = await prisma.project.findMany({
          where,
          include: {
            owner: true,
            organization: true
          }
        });
        
        return { 
          text: JSON.stringify(projects) 
        };
      } catch (error) {
        throw new UserError(`Failed to list projects: ${error}`);
      }
    },
  });

  server.addResourceTemplate({
    uriTemplate: "resource://projects/{project_id}",
    name: "Project",
    mimeType: "application/json",
    arguments: [
      {
        name: "project_id",
        description: "ID of the project",
        required: true,
      },
    ],
    async load({ project_id }) {
      
      try {
        const project = await prisma.project.findUnique({
          where: { id: project_id },
          include: {
            owner: true,
            organization: true
          }
        });
        
        if (!project) {
          throw new UserError(`Project with ID ${project_id} not found`);
        }
        
        return { 
          text: JSON.stringify(project) 
        };
      } catch (error) {
        throw new UserError(`Failed to get project: ${error}`);
      }
    },
  });

  // Drawings resources
  server.addResourceTemplate({
    uriTemplate: "resource://drawings",
    name: "Drawings",
    mimeType: "application/json",
    arguments: [
      {
        name: "project_id",
        description: "ID of the project to list drawings for",
        required: true,
      },
    ],
    async load({ project_id }) {
      
      try {
        const drawings = await prisma.drawing.findMany({
          where: { projectId: project_id }
        });
        
        return { 
          text: JSON.stringify(drawings.map(drawing => ({
            ...drawing,
            data: typeof drawing.data === 'string' ? models.fromJsonField(drawing.data) : null
          }))) 
        };
      } catch (error) {
        throw new UserError(`Failed to list drawings: ${error}`);
      }
    },
  });

  server.addResourceTemplate({
    uriTemplate: "resource://drawings/{drawing_id}",
    name: "Drawing",
    mimeType: "application/json",
    arguments: [
      {
        name: "drawing_id",
        description: "ID of the drawing",
        required: true,
      },
    ],
    async load({ drawing_id }) {
      
      try {
        const drawing = await prisma.drawing.findUnique({
          where: { id: drawing_id }
        });
        
        if (!drawing) {
          throw new UserError(`Drawing with ID ${drawing_id} not found`);
        }
        
        return { 
          text: JSON.stringify({
            ...drawing,
            data: typeof drawing.data === 'string' ? models.fromJsonField(drawing.data) : null
          }) 
        };
      } catch (error) {
        throw new UserError(`Failed to get drawing: ${error}`);
      }
    },
  });

  // Components resources
  server.addResourceTemplate({
    uriTemplate: "resource://components",
    name: "Components",
    mimeType: "application/json",
    arguments: [
      {
        name: "project_id",
        description: "ID of the project to list components for",
        required: true,
      },
    ],
    async load({ project_id }) {
      
      try {
        const components = await prisma.component.findMany({
          where: { projectId: project_id }
        });
        
        return { 
          text: JSON.stringify(components.map(component => ({
            ...component,
            data: typeof component.data === 'string' ? models.fromJsonField(component.data) : null
          }))) 
        };
      } catch (error) {
        throw new UserError(`Failed to list components: ${error}`);
      }
    },
  });

  server.addResourceTemplate({
    uriTemplate: "resource://components/{component_id}",
    name: "Component",
    mimeType: "application/json",
    arguments: [
      {
        name: "component_id",
        description: "ID of the component",
        required: true,
      },
    ],
    async load({ component_id }) {
      
      try {
        const component = await prisma.component.findUnique({
          where: { id: component_id }
        });
        
        if (!component) {
          throw new UserError(`Component with ID ${component_id} not found`);
        }
        
        return { 
          text: JSON.stringify({
            ...component,
            data: typeof component.data === 'string' ? models.fromJsonField(component.data) : null
          }) 
        };
      } catch (error) {
        throw new UserError(`Failed to get component: ${error}`);
      }
    },
  });

  // Materials resources
  server.addResourceTemplate({
    uriTemplate: "resource://materials",
    name: "Materials",
    mimeType: "application/json",
    arguments: [
      {
        name: "organization_id",
        description: "Optional ID of the organization to filter materials",
        required: false,
      },
    ],
    async load({ organization_id }) {
      
      try {
        const where = organization_id ? { organizationId: organization_id } : {};
        
        const materials = await prisma.material.findMany({
          where
        });
        
        return { 
          text: JSON.stringify(materials.map(material => ({
            ...material,
            properties: typeof material.properties === 'string' ? models.fromJsonField(material.properties) : null
          }))) 
        };
      } catch (error) {
        throw new UserError(`Failed to list materials: ${error}`);
      }
    },
  });

  server.addResourceTemplate({
    uriTemplate: "resource://materials/{material_id}",
    name: "Material",
    mimeType: "application/json",
    arguments: [
      {
        name: "material_id",
        description: "ID of the material",
        required: true,
      },
    ],
    async load({ material_id }) {
      
      try {
        const material = await prisma.material.findUnique({
          where: { id: material_id }
        });
        
        if (!material) {
          throw new UserError(`Material with ID ${material_id} not found`);
        }
        
        return { 
          text: JSON.stringify({
            ...material,
            properties: typeof material.properties === 'string' ? models.fromJsonField(material.properties) : null
          }) 
        };
      } catch (error) {
        throw new UserError(`Failed to get material: ${error}`);
      }
    },
  });

  // Tools resources
  server.addResourceTemplate({
    uriTemplate: "resource://tools",
    name: "Tools",
    mimeType: "application/json",
    arguments: [
      {
        name: "organization_id",
        description: "Optional ID of the organization to filter tools",
        required: false,
      },
    ],
    async load({ organization_id }) {
      
      try {
        const where = organization_id ? { organizationId: organization_id } : {};
        
        const tools = await prisma.tool.findMany({
          where
        });
        
        return { 
          text: JSON.stringify(tools) 
        };
      } catch (error) {
        throw new UserError(`Failed to list tools: ${error}`);
      }
    },
  });

  server.addResourceTemplate({
    uriTemplate: "resource://tools/{tool_id}",
    name: "Tool",
    mimeType: "application/json",
    arguments: [
      {
        name: "tool_id",
        description: "ID of the tool",
        required: true,
      },
    ],
    async load({ tool_id }) {
      
      try {
        const tool = await prisma.tool.findUnique({
          where: { id: tool_id }
        });
        
        if (!tool) {
          throw new UserError(`Tool with ID ${tool_id} not found`);
        }
        
        return { 
          text: JSON.stringify(tool) 
        };
      } catch (error) {
        throw new UserError(`Failed to get tool: ${error}`);
      }
    },
  });

  // Machine Configs resources
  server.addResourceTemplate({
    uriTemplate: "resource://machine-configs",
    name: "Machine Configurations",
    mimeType: "application/json",
    arguments: [
      {
        name: "owner_id",
        description: "Optional ID of the owner to filter machine configurations",
        required: false,
      },
    ],
    async load({ owner_id }) {
      
      try {
        const where = owner_id ? { ownerId: owner_id } : {};
        
        const machineConfigs = await prisma.machineConfig.findMany({
          where
        });
        
        return { 
          text: JSON.stringify(machineConfigs.map(config => ({
            ...config,
            config: typeof config.config === 'string' ? models.fromJsonField(config.config) : null
          }))) 
        };
      } catch (error) {
        throw new UserError(`Failed to list machine configurations: ${error}`);
      }
    },
  });

  server.addResourceTemplate({
    uriTemplate: "resource://machine-configs/{machine_config_id}",
    name: "Machine Configuration",
    mimeType: "application/json",
    arguments: [
      {
        name: "machine_config_id",
        description: "ID of the machine configuration",
        required: true,
      },
    ],
    async load({ machine_config_id }) {
      
      try {
        const machineConfig = await prisma.machineConfig.findUnique({
          where: { id: machine_config_id }
        });
        
        if (!machineConfig) {
          throw new UserError(`Machine configuration with ID ${machine_config_id} not found`);
        }
        
        return { 
          text: JSON.stringify({
            ...machineConfig,
            config: typeof machineConfig.config === 'string' ? models.fromJsonField(machineConfig.config) : null
          }) 
        };
      } catch (error) {
        throw new UserError(`Failed to get machine configuration: ${error}`);
      }
    },
  });

  // Toolpaths resources
  server.addResourceTemplate({
    uriTemplate: "resource://toolpaths",
    name: "Toolpaths",
    mimeType: "application/json",
    arguments: [
      {
        name: "project_id",
        description: "ID of the project to list toolpaths for",
        required: true,
      },
    ],
    async load({ project_id }) {
      
      try {
        const toolpaths = await prisma.toolpath.findMany({
          where: { projectId: project_id }
        });
        
        return { 
          text: JSON.stringify(toolpaths.map(toolpath => ({
            ...toolpath,
            data: toolpath.data && typeof toolpath.data === 'string' ? models.fromJsonField(toolpath.data) : null
          }))) 
        };
      } catch (error) {
        throw new UserError(`Failed to list toolpaths: ${error}`);
      }
    },
  });

  server.addResourceTemplate({
    uriTemplate: "resource://toolpaths/{toolpath_id}",
    name: "Toolpath",
    mimeType: "application/json",
    arguments: [
      {
        name: "toolpath_id",
        description: "ID of the toolpath",
        required: true,
      },
    ],
    async load({ toolpath_id }) {
      
      try {
        const toolpath = await prisma.toolpath.findUnique({
          where: { id: toolpath_id }
        });
        
        if (!toolpath) {
          throw new UserError(`Toolpath with ID ${toolpath_id} not found`);
        }
        
        return { 
          text: JSON.stringify({
            ...toolpath,
            data: toolpath.data && typeof toolpath.data === 'string' ? models.fromJsonField(toolpath.data) : null
          }) 
        };
      } catch (error) {
        throw new UserError(`Failed to get toolpath: ${error}`);
      }
    },
  });

  // Library Items resources
  server.addResourceTemplate({
    uriTemplate: "resource://library-items",
    name: "Library Items",
    mimeType: "application/json",
    arguments: [
      {
        name: "organization_id",
        description: "Optional ID of the organization to filter library items",
        required: false,
      },
    ],
    async load({ organization_id }) {
      
      try {
        const where = organization_id ? { organizationId: organization_id } : {};
        
        const libraryItems = await prisma.libraryItem.findMany({
          where
        });
        
        return { 
          text: JSON.stringify(libraryItems.map(item => ({
            ...item,
            data: typeof item.data === 'string' ? models.fromJsonField(item.data) : null,
            properties: item.properties && typeof item.properties === 'string' ? models.fromJsonField(item.properties) : null,
            tags: item.tags // Assuming tags is already string[]
          }))) 
        };
      } catch (error) {
        throw new UserError(`Failed to list library items: ${error}`);
      }
    },
  });

  server.addResourceTemplate({
    uriTemplate: "resource://library-items/{library_item_id}",
    name: "Library Item",
    mimeType: "application/json",
    arguments: [
      {
        name: "library_item_id",
        description: "ID of the library item",
        required: true,
      },
    ],
    async load({ library_item_id }) {
      
      try {
        const libraryItem = await prisma.libraryItem.findUnique({
          where: { id: library_item_id }
        });
        
        if (!libraryItem) {
          throw new UserError(`Library item with ID ${library_item_id} not found`);
        }
        
        return { 
          text: JSON.stringify({
            ...libraryItem,
            data: typeof libraryItem.data === 'string' ? models.fromJsonField(libraryItem.data) : null,
            properties: libraryItem.properties && typeof libraryItem.properties === 'string' ? models.fromJsonField(libraryItem.properties) : null,
            tags: libraryItem.tags // Assuming tags is already string[]
          }) 
        };
      } catch (error) {
        throw new UserError(`Failed to get library item: ${error}`);
      }
    },
  });
}