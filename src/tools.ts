// src/tools.ts

import { FastMCP, UserError } from "fastmcp";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import prisma from "./db.js";
import * as models from "./models.js";
import { Prisma } from "@prisma/client";

export function registerTools(server: FastMCP<any>) {
  // Users tools
  server.addTool({
    name: "create_user",
    description: "Creates a new user",
    parameters: models.UserCreate,
    execute: async (args, { log }) => {
      await log.info(`Creating user ${args.name || 'unnamed'}`);
      
      try {
        const user = await prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            emailVerified: args.emailVerified,
            image: args.image,
            password: args.password,
          }
        });
        
        return JSON.stringify(user);
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error("Failed to create user", errorContext);
        throw new UserError(`Failed to create user: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "update_user",
    description: "Updates an existing user",
    parameters: z.object({
      user_id: z.string(),
      data: models.UserUpdate,
    }),
    execute: async (args, { log }) => {
      await log.info(`Updating user ${args.user_id}`);
      
      try {
        const user = await prisma.user.update({
          where: { id: args.user_id },
          data: args.data
        });
        
        return JSON.stringify(user);
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to update user ${args.user_id}`, errorContext);
        throw new UserError(`Failed to update user: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "delete_user",
    description: "Deletes a user",
    parameters: z.object({
      user_id: z.string(),
    }),
    execute: async (args, { log }) => {
      await log.info(`Deleting user ${args.user_id}`);
      
      try {
        await prisma.user.delete({
          where: { id: args.user_id }
        });
        
        return JSON.stringify({ success: true, message: "User deleted successfully" });
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to delete user ${args.user_id}`, errorContext);
        throw new UserError(`Failed to delete user: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  // Subscription tools
  server.addTool({
    name: "create_subscription",
    description: "Creates a new subscription",
    parameters: models.SubscriptionCreate,
    execute: async (args, { log }) => {
      await log.info(`Creating subscription for user ${args.userId}`);
      
      try {
        const subscription = await prisma.subscription.create({
          data: {
            userId: args.userId,
            plan: args.plan,
            status: args.status,
            stripeCustomerId: args.stripeCustomerId,
            stripeSubscriptionId: args.stripeSubscriptionId,
            stripePriceId: args.stripePriceId,
            stripeCurrentPeriodEnd: args.stripeCurrentPeriodEnd,
            lsCustomerId: args.lsCustomerId,
            lsSubscriptionId: args.lsSubscriptionId,
            lsVariantId: args.lsVariantId,
            lsCurrentPeriodEnd: args.lsCurrentPeriodEnd,
            cancelAtPeriodEnd: args.cancelAtPeriodEnd,
          }
        });
        
        return JSON.stringify(subscription);
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to create subscription for user ${args.userId}`, errorContext);
        throw new UserError(`Failed to create subscription: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "update_subscription",
    description: "Updates an existing subscription",
    parameters: z.object({
      subscription_id: z.string(),
      data: models.SubscriptionUpdate,
    }),
    execute: async (args, { log }) => {
      await log.info(`Updating subscription ${args.subscription_id}`);
      
      try {
        const subscription = await prisma.subscription.update({
          where: { id: args.subscription_id },
          data: args.data
        });
        
        return JSON.stringify(subscription);
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to update subscription ${args.subscription_id}`, errorContext);
        throw new UserError(`Failed to update subscription: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "delete_subscription",
    description: "Deletes a subscription",
    parameters: z.object({
      subscription_id: z.string(),
    }),
    execute: async (args, { log }) => {
      await log.info(`Deleting subscription ${args.subscription_id}`);
      
      try {
        await prisma.subscription.delete({
          where: { id: args.subscription_id }
        });
        
        return JSON.stringify({ success: true, message: "Subscription deleted successfully" });
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to delete subscription ${args.subscription_id}`, errorContext);
        throw new UserError(`Failed to delete subscription: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  // Organizations tools
  server.addTool({
    name: "create_organization",
    description: "Creates a new organization",
    parameters: models.OrganizationCreate,
    execute: async (args, { log }) => {
      await log.info(`Creating organization ${args.name}`);
      
      try {
        const organization = await prisma.organization.create({
          data: {
            name: args.name,
            description: args.description
          }
        });
        
        return JSON.stringify(organization);
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to create organization ${args.name}`, errorContext);
        throw new UserError(`Failed to create organization: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "update_organization",
    description: "Updates an existing organization",
    parameters: z.object({
      organization_id: z.string(),
      data: models.OrganizationUpdate,
    }),
    execute: async (args, { log }) => {
      await log.info(`Updating organization ${args.organization_id}`);
      
      try {
        const organization = await prisma.organization.update({
          where: { id: args.organization_id },
          data: args.data
        });
        
        return JSON.stringify(organization);
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to update organization ${args.organization_id}`, errorContext);
        throw new UserError(`Failed to update organization: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "delete_organization",
    description: "Deletes an organization",
    parameters: z.object({
      organization_id: z.string(),
    }),
    execute: async (args, { log }) => {
      await log.info(`Deleting organization ${args.organization_id}`);
      
      try {
        await prisma.organization.delete({
          where: { id: args.organization_id }
        });
        
        return JSON.stringify({ success: true, message: "Organization deleted successfully" });
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to delete organization ${args.organization_id}`, errorContext);
        throw new UserError(`Failed to delete organization: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  // Projects tools
  server.addTool({
    name: "create_project",
    description: "Creates a new project",
    parameters: models.ProjectCreate,
    execute: async (args, { log }) => {
      await log.info(`Creating project ${args.name}`);
      
      try {
        const project = await prisma.project.create({
          data: {
            name: args.name,
            description: args.description,
            isPublic: args.isPublic,
            ownerId: args.ownerId,
            organizationId: args.organizationId
          }
        });
        
        return JSON.stringify(project);
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to create project ${args.name}`, errorContext);
        throw new UserError(`Failed to create project: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "update_project",
    description: "Updates an existing project",
    parameters: z.object({
      project_id: z.string(),
      data: models.ProjectUpdate,
    }),
    execute: async (args, { log }) => {
      await log.info(`Updating project ${args.project_id}`);
      
      try {
        const project = await prisma.project.update({
          where: { id: args.project_id },
          data: args.data
        });
        
        return JSON.stringify(project);
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to update project ${args.project_id}`, errorContext);
        throw new UserError(`Failed to update project: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "delete_project",
    description: "Deletes a project",
    parameters: z.object({
      project_id: z.string(),
    }),
    execute: async (args, { log }) => {
      await log.info(`Deleting project ${args.project_id}`);
      
      try {
        await prisma.project.delete({
          where: { id: args.project_id }
        });
        
        return JSON.stringify({ success: true, message: "Project deleted successfully" });
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to delete project ${args.project_id}`, errorContext);
        throw new UserError(`Failed to delete project: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  // Drawings tools
  server.addTool({
    name: "create_drawing",
    description: "Creates a new drawing",
    parameters: models.DrawingCreate,
    execute: async (args, { log }) => {
      await log.info(`Creating drawing ${args.name}`);
      try {
        // Drawing.data is required String
        const drawing = await prisma.drawing.create({
          data: {
            name: args.name,
            description: args.description,
            data: JSON.stringify(args.data), // Use stringify for required
            thumbnail: args.thumbnail,
            projectId: args.projectId
          }
        });
        // Parse data back for response
        return JSON.stringify({
          ...drawing,
          data: models.fromJsonField(drawing.data as string)
        });
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to create drawing ${args.name}`, errorContext);
        throw new UserError(`Failed to create drawing: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "update_drawing",
    description: "Updates an existing drawing",
    parameters: z.object({
      drawing_id: z.string(),
      data: models.DrawingUpdate,
    }),
    execute: async (args, { log }) => {
      await log.info(`Updating drawing ${args.drawing_id}`);
      try {
        const payload: Prisma.DrawingUpdateInput = {}; 
        if (args.data.name !== undefined) payload.name = args.data.name;
        if (args.data.description !== undefined) payload.description = args.data.description;
        if (args.data.thumbnail !== undefined) payload.thumbnail = args.data.thumbnail;
        // Drawing.data is required String
        if (args.data.data !== undefined) {
          if (args.data.data === null) {
             throw new UserError("Field 'data' cannot be null for Drawing.");
          }
          payload.data = JSON.stringify(args.data.data);
        }
        
        const updatedDrawing = await prisma.drawing.update({
          where: { id: args.drawing_id },
          data: payload 
        });
        
        return JSON.stringify(updatedDrawing); // Return updated record directly

      } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
             throw new UserError(`Drawing with ID ${args.drawing_id} not found`);
        }
        const errorContext = { error: String(error) };
        log.error(`Failed to update drawing ${args.drawing_id}`, errorContext);
        throw new UserError(`Failed to update drawing: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "delete_drawing",
    description: "Deletes a drawing",
    parameters: z.object({
      drawing_id: z.string(),
    }),
    execute: async (args, { log }) => {
      await log.info(`Deleting drawing ${args.drawing_id}`);
      
      try {
        await prisma.drawing.delete({
          where: { id: args.drawing_id }
        });
        
        return JSON.stringify({ success: true, message: "Drawing deleted successfully" });
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to delete drawing ${args.drawing_id}`, errorContext);
        throw new UserError(`Failed to delete drawing: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  // Components tools
  server.addTool({
    name: "create_component",
    description: "Creates a new component",
    parameters: models.ComponentCreate,
    execute: async (args, { log }) => {
      await log.info(`Creating component ${args.name}`);
      try {
        // Component.data is required String
        const component = await prisma.component.create({
          data: {
            name: args.name,
            description: args.description,
            data: JSON.stringify(args.data), // Use stringify for required
            thumbnail: args.thumbnail,
            type: args.type,
            isPublic: args.isPublic,
            projectId: args.projectId
          }
        });
         // Parse data back for response
        return JSON.stringify({
          ...component,
          data: models.fromJsonField(component.data as string)
        });
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to create component ${args.name}`, errorContext);
        throw new UserError(`Failed to create component: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "update_component",
    description: "Updates an existing component",
    parameters: z.object({
      component_id: z.string(),
      data: models.ComponentUpdate,
    }),
    execute: async (args, { log }) => {
      await log.info(`Updating component ${args.component_id}`);
      try {
        const payload: Prisma.ComponentUpdateInput = {}; 
        if (args.data.name !== undefined) payload.name = args.data.name;
        if (args.data.description !== undefined) payload.description = args.data.description;
        if (args.data.thumbnail !== undefined) payload.thumbnail = args.data.thumbnail;
        if (args.data.type !== undefined) payload.type = args.data.type;
        if (args.data.isPublic !== undefined) payload.isPublic = args.data.isPublic;
        // Component.data is required String
        if (args.data.data !== undefined) {
           if (args.data.data === null) {
             throw new UserError("Field 'data' cannot be null for Component.");
          }
           payload.data = JSON.stringify(args.data.data);
        }

        const updatedComponent = await prisma.component.update({
          where: { id: args.component_id },
          data: payload
        });
        
        return JSON.stringify(updatedComponent); // Return updated record directly

      } catch (error: unknown) {
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
             throw new UserError(`Component with ID ${args.component_id} not found`);
        }
        const errorContext = { error: String(error) };
        log.error(`Failed to update component ${args.component_id}`, errorContext);
        throw new UserError(`Failed to update component: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "delete_component",
    description: "Deletes a component",
    parameters: z.object({
      component_id: z.string(),
    }),
    execute: async (args, { log }) => {
      await log.info(`Deleting component ${args.component_id}`);
      
      try {
        await prisma.component.delete({
          where: { id: args.component_id }
        });
        
        return JSON.stringify({ success: true, message: "Component deleted successfully" });
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to delete component ${args.component_id}`, errorContext);
        throw new UserError(`Failed to delete component: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  // Materials tools
  server.addTool({
    name: "create_material",
    description: "Creates a new material",
    parameters: models.MaterialCreate,
    execute: async (args, { log }) => {
      await log.info(`Creating material ${args.name}`);
      try {
        // Material.properties is required String
        const material = await prisma.material.create({
          data: {
            name: args.name,
            description: args.description,
            properties: JSON.stringify(args.properties), // Use stringify for required
            isPublic: args.isPublic,
            ownerId: args.ownerId,
            organizationId: args.organizationId
          }
        });
         // Parse properties back for response
        return JSON.stringify({
          ...material,
          properties: models.fromJsonField(material.properties as string)
        });
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to create material ${args.name}`, errorContext);
        throw new UserError(`Failed to create material: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "update_material",
    description: "Updates an existing material",
    parameters: z.object({
      material_id: z.string(),
      data: models.MaterialUpdate,
    }),
    execute: async (args, { log }) => {
      await log.info(`Updating material ${args.material_id}`);
      try {
        const payload: Prisma.MaterialUpdateInput = {}; 
        if (args.data.name !== undefined) payload.name = args.data.name;
        if (args.data.description !== undefined) payload.description = args.data.description;
        if (args.data.isPublic !== undefined) payload.isPublic = args.data.isPublic;
        // Material.properties is required String
        if (args.data.properties !== undefined) {
            if (args.data.properties === null) {
              throw new UserError("Field 'properties' cannot be null for Material.");
            }
            payload.properties = JSON.stringify(args.data.properties);
        }

        const updatedMaterial = await prisma.material.update({
          where: { id: args.material_id },
          data: payload
        });
        
        return JSON.stringify(updatedMaterial); // Return updated record directly

      } catch (error: unknown) {
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
             throw new UserError(`Material with ID ${args.material_id} not found`);
        }
        const errorContext = { error: String(error) };
        log.error(`Failed to update material ${args.material_id}`, errorContext);
        throw new UserError(`Failed to update material: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "delete_material",
    description: "Deletes a material",
    parameters: z.object({
      material_id: z.string(),
    }),
    execute: async (args, { log }) => {
      await log.info(`Deleting material ${args.material_id}`);
      
      try {
        await prisma.material.delete({
          where: { id: args.material_id }
        });
        
        return JSON.stringify({ success: true, message: "Material deleted successfully" });
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to delete material ${args.material_id}`, errorContext);
        throw new UserError(`Failed to delete material: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  // Tools (Prisma Model) tools
  server.addTool({
    name: "create_tool_prisma",
    description: "Creates a new tool (Prisma model)",
    parameters: models.ToolCreate,
    execute: async (args, { log }) => {
      await log.info(`Creating tool ${args.name}`);
      
      try {
        const tool = await prisma.tool.create({
          data: {
            name: args.name,
            type: args.type,
            diameter: args.diameter,
            material: args.material,
            numberOfFlutes: args.numberOfFlutes,
            maxRPM: args.maxRPM,
            coolantType: args.coolantType,
            cuttingLength: args.cuttingLength,
            totalLength: args.totalLength,
            shankDiameter: args.shankDiameter,
            notes: args.notes,
            isPublic: args.isPublic,
            ownerId: args.ownerId,
            organizationId: args.organizationId
          }
        });
        
        return JSON.stringify(tool);
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to create tool ${args.name}`, errorContext);
        throw new UserError(`Failed to create tool: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "update_tool_prisma",
    description: "Updates an existing tool (Prisma model)",
    parameters: z.object({
      tool_id: z.string(),
      data: models.ToolUpdate,
    }),
    execute: async (args, { log }) => {
      await log.info(`Updating tool ${args.tool_id}`);
      
      try {
        const tool = await prisma.tool.update({
          where: { id: args.tool_id },
          data: args.data
        });
        
        return JSON.stringify(tool);
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to update tool ${args.tool_id}`, errorContext);
        throw new UserError(`Failed to update tool: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "delete_tool_prisma",
    description: "Deletes a tool (Prisma model)",
    parameters: z.object({
      tool_id: z.string(),
    }),
    execute: async (args, { log }) => {
      await log.info(`Deleting tool ${args.tool_id}`);
      
      try {
        await prisma.tool.delete({
          where: { id: args.tool_id }
        });
        
        return JSON.stringify({ success: true, message: "Tool deleted successfully" });
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to delete tool ${args.tool_id}`, errorContext);
        throw new UserError(`Failed to delete tool: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  // Machine Config tools
  server.addTool({
    name: "create_machine_config",
    description: "Creates a new machine configuration",
    parameters: models.MachineConfigCreate,
    execute: async (args, { log }) => {
      await log.info(`Creating machine config ${args.name}`);
      try {
        // MachineConfig.config is required String
        const machineConfig = await prisma.machineConfig.create({
          data: {
            name: args.name,
            type: args.type,
            description: args.description,
            config: JSON.stringify(args.config), // Use stringify for required
            isPublic: args.isPublic,
            ownerId: args.ownerId
          }
        });
         // Parse config back for response
        return JSON.stringify({
          ...machineConfig,
          config: models.fromJsonField(machineConfig.config as string)
        });
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to create machine config ${args.name}`, errorContext);
        throw new UserError(`Failed to create machine configuration: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "update_machine_config",
    description: "Updates an existing machine configuration",
    parameters: z.object({
      machine_config_id: z.string(),
      data: models.MachineConfigUpdate,
    }),
    execute: async (args, { log }) => {
      await log.info(`Updating machine config ${args.machine_config_id}`);
      try {
        const payload: Prisma.MachineConfigUpdateInput = {};
        if (args.data.name !== undefined) payload.name = args.data.name;
        if (args.data.type !== undefined) payload.type = args.data.type;
        if (args.data.description !== undefined) payload.description = args.data.description;
        if (args.data.isPublic !== undefined) payload.isPublic = args.data.isPublic;
         // MachineConfig.config is required String
        if (args.data.config !== undefined) {
            if (args.data.config === null) {
             throw new UserError("Field 'config' cannot be null for MachineConfig.");
          }
          payload.config = JSON.stringify(args.data.config);
        }

        const updatedMachineConfig = await prisma.machineConfig.update({
          where: { id: args.machine_config_id },
          data: payload
        });
        
        return JSON.stringify(updatedMachineConfig); // Return updated record directly

      } catch (error: unknown) {
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
             throw new UserError(`Machine configuration with ID ${args.machine_config_id} not found`);
        }
        const errorContext = { error: String(error) };
        log.error(`Failed to update machine config ${args.machine_config_id}`, errorContext);
        throw new UserError(`Failed to update machine configuration: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "delete_machine_config",
    description: "Deletes a machine configuration",
    parameters: z.object({
      machine_config_id: z.string(),
    }),
    execute: async (args, { log }) => {
      await log.info(`Deleting machine config ${args.machine_config_id}`);
      
      try {
        await prisma.machineConfig.delete({
          where: { id: args.machine_config_id }
        });
        
        return JSON.stringify({ success: true, message: "Machine configuration deleted successfully" });
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to delete machine config ${args.machine_config_id}`, errorContext);
        throw new UserError(`Failed to delete machine configuration: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  // Toolpath tools
  server.addTool({
    name: "create_toolpath",
    description: "Creates a new toolpath",
    parameters: models.ToolpathCreate,
    execute: async (args, { log }) => {
      await log.info(`Creating toolpath ${args.name}`);
      try {
        // Toolpath.data is optional String?
        const toolpath = await prisma.toolpath.create({
          data: {
            name: args.name,
            description: args.description,
            data: args.data === null || args.data === undefined ? Prisma.JsonNull : JSON.stringify(args.data), // Use Prisma.JsonNull for null values
            type: args.type,
            operationType: args.operationType,
            gcode: args.gcode,
            thumbnail: args.thumbnail,
            isPublic: args.isPublic,
            projectId: args.projectId,
            createdBy: args.createdBy,
            drawingId: args.drawingId,
            materialId: args.materialId,
            toolId: args.toolId,
            machineConfigId: args.machineConfigId
          }
        });
         // Parse data back if not null
        return JSON.stringify({
          ...toolpath,
          data: toolpath.data ? models.fromJsonField(toolpath.data as string) : null
        });
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to create toolpath ${args.name}`, errorContext);
        throw new UserError(`Failed to create toolpath: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "update_toolpath",
    description: "Updates an existing toolpath",
    parameters: z.object({
      toolpath_id: z.string(),
      data: models.ToolpathUpdate,
    }),
    execute: async (args, { log }) => {
      await log.info(`Updating toolpath ${args.toolpath_id}`);
      try {
        const payload: Prisma.ToolpathUpdateInput = {};
        if (args.data.name !== undefined) payload.name = args.data.name;
        if (args.data.description !== undefined) payload.description = args.data.description;
        if (args.data.type !== undefined) payload.type = args.data.type;
        if (args.data.operationType !== undefined) payload.operationType = args.data.operationType;
        if (args.data.gcode !== undefined) payload.gcode = args.data.gcode;
        if (args.data.thumbnail !== undefined) payload.thumbnail = args.data.thumbnail;
        if (args.data.isPublic !== undefined) payload.isPublic = args.data.isPublic;
        
        // Toolpath.data is optional String?
        if (args.data.data !== undefined) {
          payload.data = (args.data.data === null || args.data.data === undefined) ? Prisma.DbNull : JSON.stringify(args.data.data); // Use Prisma.DbNull for update
        }
        
        const updatedToolpath = await prisma.toolpath.update({
          where: { id: args.toolpath_id },
          data: payload
        });
        
        return JSON.stringify(updatedToolpath); // Return updated record directly

      } catch (error: unknown) {
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
             throw new UserError(`Toolpath with ID ${args.toolpath_id} not found`);
        }
        const errorContext = { error: String(error) };
        log.error(`Failed to update toolpath ${args.toolpath_id}`, errorContext);
        throw new UserError(`Failed to update toolpath: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "delete_toolpath",
    description: "Deletes a toolpath",
    parameters: z.object({
      toolpath_id: z.string(),
    }),
    execute: async (args, { log }) => {
      await log.info(`Deleting toolpath ${args.toolpath_id}`);
      
      try {
        await prisma.toolpath.delete({
          where: { id: args.toolpath_id }
        });
        
        return JSON.stringify({ success: true, message: "Toolpath deleted successfully" });
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to delete toolpath ${args.toolpath_id}`, errorContext);
        throw new UserError(`Failed to delete toolpath: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  // Library Item tools
  server.addTool({
    name: "create_library_item",
    description: "Creates a new library item",
    parameters: models.LibraryItemCreate,
    execute: async (args, { log }) => {
      await log.info(`Creating library item ${args.name}`);
      try {
        const createData: Prisma.LibraryItemCreateInput = {
            name: args.name,
            description: args.description,
            category: args.category,
            type: args.type,
            data: args.data,
            tags: args.tags,
            thumbnail: args.thumbnail,
            isPublic: args.isPublic,
            owner: args.ownerId ? { connect: { id: args.ownerId } } : undefined,
            organization: args.organizationId ? { connect: { id: args.organizationId } } : undefined,
        };
        
        if (args.properties !== null && args.properties !== undefined) {
            createData.properties = args.properties;
        }
        
        const libraryItem = await prisma.libraryItem.create({
          data: createData
        });
        
        return JSON.stringify(libraryItem);
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to create library item ${args.name}`, errorContext);
        throw new UserError(`Failed to create library item: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "update_library_item",
    description: "Updates an existing library item",
    parameters: z.object({
      library_item_id: z.string(),
      data: models.LibraryItemUpdate,
    }),
    execute: async (args, { log }) => {
      await log.info(`Updating library item ${args.library_item_id}`);
      try {
        const payload: Prisma.LibraryItemUpdateInput = {};
        if (args.data.name !== undefined) payload.name = args.data.name;
        if (args.data.description !== undefined) payload.description = args.data.description;
        if (args.data.category !== undefined) payload.category = args.data.category;
        if (args.data.type !== undefined) payload.type = args.data.type;
        if (args.data.tags !== undefined) payload.tags = args.data.tags;
        if (args.data.thumbnail !== undefined) payload.thumbnail = args.data.thumbnail;
        if (args.data.isPublic !== undefined) payload.isPublic = args.data.isPublic;

        if (args.data.data !== undefined) {
          if (args.data.data === null) {
            throw new UserError("Field 'data' cannot be null for LibraryItem.");
          }
          payload.data = args.data.data;
        }
        if (args.data.properties !== undefined) {
          payload.properties = (args.data.properties === null) ? Prisma.DbNull : args.data.properties;
        }
        
        const updatedLibraryItem = await prisma.libraryItem.update({
          where: { id: args.library_item_id },
          data: payload
        });
        
        return JSON.stringify(updatedLibraryItem);
      } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
             throw new UserError(`Library item with ID ${args.library_item_id} not found`);
        }
        const errorContext = { error: String(error) };
        log.error(`Failed to update library item ${args.library_item_id}`, errorContext);
        throw new UserError(`Failed to update library item: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  server.addTool({
    name: "delete_library_item",
    description: "Deletes a library item",
    parameters: z.object({
      library_item_id: z.string(),
    }),
    execute: async (args, { log }) => {
      await log.info(`Deleting library item ${args.library_item_id}`);
      
      try {
        await prisma.libraryItem.delete({
          where: { id: args.library_item_id }
        });
        
        return JSON.stringify({ success: true, message: "Library item deleted successfully" });
      } catch (error: unknown) {
        const errorContext = { error: String(error) };
        log.error(`Failed to delete library item ${args.library_item_id}`, errorContext);
        throw new UserError(`Failed to delete library item: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  // Add a new tool
  server.addTool({
    name: "trigger_main_app_notification",
    description: "Sends a notification using the main application's notification service.",
    parameters: z.object({
      userId: z.string(),
      message: z.string(),
    }),
    execute: async (args, { log }) => {
      const mainAppUrl = process.env.MAIN_APP_URL || "http://localhost:3000"; // Get main app URL
      const endpoint = `${mainAppUrl}/api/app-control/notify`;

      try {
        log.info(`Sending notification request to main app for user ${args.userId}`);
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: args.userId, message: args.message }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Main app notification endpoint failed: ${response.status} ${errorText}`);
        }

        const result = await response.json();
        log.info(`Main app notification response: ${JSON.stringify(result)}`);
        return JSON.stringify(result); // Return success/failure from main app API

      } catch (error: unknown) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        log.error(`Failed to trigger main app notification: ${errorMsg}`, { error: String(error) });
        // Re-throw as UserError so Claude sees it
        throw new UserError(`Failed to trigger main app notification: ${errorMsg}`);
      }
    },
  });
}