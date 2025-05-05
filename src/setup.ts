// src/setup.ts

import prisma from "./db.js";

async function main() {
  console.log("Setting up database...");
  
  // Create a default admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@cadcamfun.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@cadcamfun.com",
      password: "hashed_password_here", // In a real app, use proper password hashing
      subscription: {
        create: {
          plan: "PREMIUM",
          status: "active"
        }
      }
    }
  });
  
  console.log(`Admin user created with ID: ${adminUser.id}`);
  
  // Create a sample organization
  const organization = await prisma.organization.create({
    data: {
      name: "Sample Organization",
      description: "A sample organization for testing"
    }
  });
  
  console.log(`Sample organization created with ID: ${organization.id}`);
  
  // Create a sample project
  const project = await prisma.project.create({
    data: {
      name: "Sample Project",
      description: "A sample project for testing",
      ownerId: adminUser.id,
      organizationId: organization.id
    }
  });
  
  console.log(`Sample project created with ID: ${project.id}`);
  
  console.log("Database setup complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
