/**
 * Script: Create Admin User
 * 
 * Usage:
 *   npx tsx scripts/create-admin.ts <email> <password> <name> [role]
 * 
 * Example:
 *   npx tsx scripts/create-admin.ts admin@acedd.org password123 "Admin User" SUPER_ADMIN
 * 
 * Role options: SUPER_ADMIN (default) or ADMIN
 */

// .env yüklensin ki db importunda DATABASE_URL hazır olsun
import "dotenv/config";
import { prisma } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function createAdmin() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email> <password> <name> [role]");
    console.error("Example: npx tsx scripts/create-admin.ts admin@acedd.org password123 \"Admin User\" SUPER_ADMIN");
    process.exit(1);
  }

  const [email, password, name, role = "SUPER_ADMIN"] = args;

  // Validate role
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
    console.error("Error: Role must be either SUPER_ADMIN or ADMIN");
    process.exit(1);
  }

  // Validate email format (basic)
  if (!email.includes("@") || !email.includes(".")) {
    console.error("Error: Invalid email format");
    process.exit(1);
  }

  // Validate password length
  if (password.length < 6) {
    console.error("Error: Password must be at least 6 characters long");
    process.exit(1);
  }

  try {
    // Check if admin user already exists
    const existingUser = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      console.error(`Error: Admin user with email ${email} already exists`);
      process.exit(1);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const adminUser = await prisma.adminUser.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        passwordHash,
        role: role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN",
        isActive: true,
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Active: ${adminUser.isActive}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
