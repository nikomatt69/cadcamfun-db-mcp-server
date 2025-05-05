// src/db.ts

import { PrismaClient } from '@prisma/client';

// Create a singleton Prisma client
const prisma = new PrismaClient();

export default prisma;
