import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';


const { Pool } = pg;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use pooled connection for application queries
const connectionString = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('No database connection string found in environment variables');
}

// Configure pool for Supabase with SSL
// Supabase requires SSL but may use self-signed certificates
const pool = new Pool({ 
  connectionString,
  ssl: connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1') 
    ? false 
    : {
        rejectUnauthorized: false // Allow self-signed certificates
      }
});
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;