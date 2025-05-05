// src/models.ts

import { z } from "zod";
import { Prisma } from "@prisma/client";

// --- Helper function to convert JSON strings to/from objects ---
export function fromJsonField<T>(json: string): T {
  if (!json) return {} as T;
  return JSON.parse(json) as T;
}

export function toJsonField(data: any): string | null {
  if (data === null || data === undefined) {
    return null;
  }
  return JSON.stringify(data);
}

// --- Enums ---
export const UserRole = z.enum(["ADMIN", "MANAGER", "MEMBER"]);
export type UserRole = z.infer<typeof UserRole>;

export const NotificationType = z.enum([
  "NEW_MESSAGE",
  "PROJECT_CREATED",
  "COMPONENT_CREATED",
  "MEMBER_JOINED",
  "ORGANIZATION_INVITATION",
]);
export type NotificationType = z.infer<typeof NotificationType>;

// --- Base Schemas ---
export const UserBase = z.object({
  name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  emailVerified: z.date().nullable().optional(),
  image: z.string().nullable().optional(),
});

export const User = UserBase.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type User = z.infer<typeof User>;

export const UserCreate = UserBase.extend({
  password: z.string().nullable().optional(),
});
export type UserCreate = z.infer<typeof UserCreate>;

export const UserUpdate = z.object({
  name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  password: z.string().nullable().optional(),
});
export type UserUpdate = z.infer<typeof UserUpdate>;

export const SubscriptionBase = z.object({
  plan: z.string().default("FREE"),
  status: z.string().default("inactive"),
  stripeCustomerId: z.string().nullable().optional(),
  stripeSubscriptionId: z.string().nullable().optional(),
  stripePriceId: z.string().nullable().optional(),
  stripeCurrentPeriodEnd: z.date().nullable().optional(),
  lsCustomerId: z.string().nullable().optional(),
  lsSubscriptionId: z.string().nullable().optional(),
  lsVariantId: z.string().nullable().optional(),
  lsCurrentPeriodEnd: z.date().nullable().optional(),
  cancelAtPeriodEnd: z.boolean().default(false),
});

export const Subscription = SubscriptionBase.extend({
  id: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Subscription = z.infer<typeof Subscription>;

export const SubscriptionCreate = SubscriptionBase.extend({
  userId: z.string(),
});
export type SubscriptionCreate = z.infer<typeof SubscriptionCreate>;

export const SubscriptionUpdate = z.object({
  plan: z.string().optional(),
  status: z.string().optional(),
  stripeCustomerId: z.string().nullable().optional(),
  stripeSubscriptionId: z.string().nullable().optional(),
  stripePriceId: z.string().nullable().optional(),
  stripeCurrentPeriodEnd: z.date().nullable().optional(),
  lsCustomerId: z.string().nullable().optional(),
  lsSubscriptionId: z.string().nullable().optional(),
  lsVariantId: z.string().nullable().optional(),
  lsCurrentPeriodEnd: z.date().nullable().optional(),
  cancelAtPeriodEnd: z.boolean().optional(),
});
export type SubscriptionUpdate = z.infer<typeof SubscriptionUpdate>;

export const OrganizationBase = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
});

export const Organization = OrganizationBase.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Organization = z.infer<typeof Organization>;

export const OrganizationCreate = OrganizationBase;
export type OrganizationCreate = z.infer<typeof OrganizationCreate>;

export const OrganizationUpdate = z.object({
  name: z.string().optional(),
  description: z.string().nullable().optional(),
});
export type OrganizationUpdate = z.infer<typeof OrganizationUpdate>;

export const ProjectBase = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  isPublic: z.boolean().default(false),
});

export const Project = ProjectBase.extend({
  id: z.string(),
  ownerId: z.string(),
  organizationId: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Project = z.infer<typeof Project>;

export const ProjectCreate = ProjectBase.extend({
  ownerId: z.string(),
  organizationId: z.string().nullable().optional(),
});
export type ProjectCreate = z.infer<typeof ProjectCreate>;

export const ProjectUpdate = z.object({
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  isPublic: z.boolean().optional(),
  organizationId: z.string().nullable().optional(),
});
export type ProjectUpdate = z.infer<typeof ProjectUpdate>;

export const DrawingBase = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  data: z.record(z.any()),
  thumbnail: z.string().nullable().optional(),
});

export const Drawing = DrawingBase.extend({
  id: z.string(),
  projectId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Drawing = z.infer<typeof Drawing>;

export const DrawingCreate = DrawingBase.extend({
  projectId: z.string(),
});
export type DrawingCreate = z.infer<typeof DrawingCreate>;

export const DrawingUpdate = z.object({
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  data: z.record(z.any()).optional(),
  thumbnail: z.string().nullable().optional(),
});
export type DrawingUpdate = z.infer<typeof DrawingUpdate>;

export const ComponentBase = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  data: z.record(z.any()),
  thumbnail: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  isPublic: z.boolean().default(false),
});

export const Component = ComponentBase.extend({
  id: z.string(),
  projectId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Component = z.infer<typeof Component>;

export const ComponentCreate = ComponentBase.extend({
  projectId: z.string(),
});
export type ComponentCreate = z.infer<typeof ComponentCreate>;

export const ComponentUpdate = z.object({
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  data: z.record(z.any()).optional(),
  thumbnail: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  isPublic: z.boolean().optional(),
});
export type ComponentUpdate = z.infer<typeof ComponentUpdate>;

export const MaterialBase = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  properties: z.record(z.any()),
  isPublic: z.boolean().default(false),
});

export const Material = MaterialBase.extend({
  id: z.string(),
  ownerId: z.string().nullable().optional(),
  organizationId: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Material = z.infer<typeof Material>;

export const MaterialCreate = MaterialBase.extend({
  ownerId: z.string().nullable().optional(),
  organizationId: z.string().nullable().optional(),
});
export type MaterialCreate = z.infer<typeof MaterialCreate>;

export const MaterialUpdate = z.object({
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  properties: z.record(z.any()).optional(),
  isPublic: z.boolean().optional(),
});
export type MaterialUpdate = z.infer<typeof MaterialUpdate>;

export const ToolBase = z.object({
  name: z.string(),
  type: z.string(),
  diameter: z.number(),
  material: z.string(),
  numberOfFlutes: z.number().nullable().optional(),
  maxRPM: z.number().nullable().optional(),
  coolantType: z.string().nullable().optional(),
  cuttingLength: z.number().nullable().optional(),
  totalLength: z.number().nullable().optional(),
  shankDiameter: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  isPublic: z.boolean().default(false),
});

export const ToolPrisma = ToolBase.extend({
  id: z.string(),
  ownerId: z.string().nullable().optional(),
  organizationId: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ToolPrisma = z.infer<typeof ToolPrisma>;

export const ToolCreate = ToolBase.extend({
  ownerId: z.string().nullable().optional(),
  organizationId: z.string().nullable().optional(),
});
export type ToolCreate = z.infer<typeof ToolCreate>;

export const ToolUpdate = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  diameter: z.number().optional(),
  material: z.string().optional(),
  numberOfFlutes: z.number().nullable().optional(),
  maxRPM: z.number().nullable().optional(),
  coolantType: z.string().nullable().optional(),
  cuttingLength: z.number().nullable().optional(),
  totalLength: z.number().nullable().optional(),
  shankDiameter: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  isPublic: z.boolean().optional(),
});
export type ToolUpdate = z.infer<typeof ToolUpdate>;

export const MachineConfigBase = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string().nullable().optional(),
  config: z.record(z.any()),
  isPublic: z.boolean().default(false),
});

export const MachineConfig = MachineConfigBase.extend({
  id: z.string(),
  ownerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type MachineConfig = z.infer<typeof MachineConfig>;

export const MachineConfigCreate = MachineConfigBase.extend({
  ownerId: z.string(),
});
export type MachineConfigCreate = z.infer<typeof MachineConfigCreate>;

export const MachineConfigUpdate = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  description: z.string().nullable().optional(),
  config: z.record(z.any()).optional(),
  isPublic: z.boolean().optional(),
});
export type MachineConfigUpdate = z.infer<typeof MachineConfigUpdate>;

export const ToolpathBase = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  data: z.record(z.any()).nullable().optional(),
  type: z.string().nullable().optional(),
  operationType: z.string().nullable().optional(),
  gcode: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  isPublic: z.boolean().default(false),
});

export const Toolpath = ToolpathBase.extend({
  id: z.string(),
  projectId: z.string(),
  createdBy: z.string(),
  drawingId: z.string().nullable().optional(),
  materialId: z.string().nullable().optional(),
  toolId: z.string().nullable().optional(),
  machineConfigId: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Toolpath = z.infer<typeof Toolpath>;

export const ToolpathCreate = ToolpathBase.extend({
  projectId: z.string(),
  createdBy: z.string(),
  drawingId: z.string().nullable().optional(),
  materialId: z.string().nullable().optional(),
  toolId: z.string().nullable().optional(),
  machineConfigId: z.string().nullable().optional(),
});
export type ToolpathCreate = z.infer<typeof ToolpathCreate>;

export const ToolpathUpdate = z.object({
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  data: z.record(z.any()).nullable().optional(),
  type: z.string().nullable().optional(),
  operationType: z.string().nullable().optional(),
  gcode: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  isPublic: z.boolean().optional(),
});
export type ToolpathUpdate = z.infer<typeof ToolpathUpdate>;

export const LibraryItemBase = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  category: z.string(),
  type: z.string(),
  data: z.record(z.any()),
  properties: z.record(z.any()).nullable().optional(),
  tags: z.array(z.string()).default([]),
  thumbnail: z.string().nullable().optional(),
  isPublic: z.boolean().default(false),
});

export const LibraryItem = LibraryItemBase.extend({
  id: z.string(),
  ownerId: z.string().nullable().optional(),
  organizationId: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type LibraryItem = z.infer<typeof LibraryItem>;

export const LibraryItemCreate = LibraryItemBase.extend({
  ownerId: z.string().nullable().optional(),
  organizationId: z.string().nullable().optional(),
});
export type LibraryItemCreate = z.infer<typeof LibraryItemCreate>;

export const LibraryItemUpdate = z.object({
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  data: z.record(z.any()).optional(),
  properties: z.record(z.any()).nullable().optional(),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string().nullable().optional(),
  isPublic: z.boolean().optional(),
});
export type LibraryItemUpdate = z.infer<typeof LibraryItemUpdate>;
