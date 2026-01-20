import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();


const { Pool } = pg;

// Create Prisma client for seeding
let connectionString = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('No database connection string found in environment variables');
}

const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required for Supabase hosted databases
  }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean up existing data
  await prisma.task.deleteMany();
  await prisma.board.deleteMany();

  // Create sample boards
  const marketingBoard = await prisma.board.create({
    data: {
      name: 'Marketing Campaign',
      description: 'Q1 2024 marketing initiatives and campaigns',
      color: '#3B82F6',
    },
  });

  const productBoard = await prisma.board.create({
    data: {
      name: 'Product Development',
      description: 'New feature development and improvements',
      color: '#10B981',
    },
  });

  const designBoard = await prisma.board.create({
    data: {
      name: 'Design System',
      description: 'UI/UX design and component library',
      color: '#8B5CF6',
    },
  });

  const qaBoard = await prisma.board.create({
    data: {
      name: 'QA & Testing',
      description: 'Quality assurance and test automation',
      color: '#F59E0B',
    },
  });

  const devOpsBoard = await prisma.board.create({
    data: {
      name: 'DevOps & Infrastructure',
      description: 'CI/CD, deployment, and infrastructure management',
      color: '#EF4444',
    },
  });

  const hrBoard = await prisma.board.create({
    data: {
      name: 'Human Resources',
      description: 'Recruitment, onboarding, and team management',
      color: '#06B6D4',
    },
  });

  const salesBoard = await prisma.board.create({
    data: {
      name: 'Sales Pipeline',
      description: 'Lead tracking and customer acquisition',
      color: '#84CC16',
    },
  });

  const supportBoard = await prisma.board.create({
    data: {
      name: 'Customer Support',
      description: 'Customer tickets and support requests',
      color: '#EC4899',
    },
  });

  // Create sample tasks for Marketing Board
  await prisma.task.createMany({
    data: [
      {
        boardId: marketingBoard.id,
        title: 'Design landing page mockups',
        description: 'Create wireframes and high-fidelity mockups for the new landing page',
        status: 'TODO',
        priority: 'HIGH',
        assignedTo: 'Alice Smith',
        dueDate: new Date('2024-02-15'),
      },
      {
        boardId: marketingBoard.id,
        title: 'Write blog post content',
        description: 'Draft content for the Q1 product announcement blog post',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        assignedTo: 'Bob Johnson',
      },
      {
        boardId: marketingBoard.id,
        title: 'Social media strategy',
        description: 'Develop social media content calendar for March',
        status: 'DONE',
        priority: 'LOW',
        assignedTo: 'Carol Davis',
      },
    ],
  });

  // Create sample tasks for Product Board
  await prisma.task.createMany({
    data: [
      {
        boardId: productBoard.id,
        title: 'Implement user authentication',
        description: 'Add login/logout functionality with JWT tokens',
        status: 'TODO',
        priority: 'HIGH',
        assignedTo: 'David Wilson',
        dueDate: new Date('2024-02-20'),
      },
      {
        boardId: productBoard.id,
        title: 'API documentation',
        description: 'Document all REST API endpoints with examples',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        assignedTo: 'Eva Brown',
      },
      {
        boardId: productBoard.id,
        title: 'Database optimization',
        description: 'Optimize slow queries and add proper indexes',
        status: 'TODO',
        priority: 'MEDIUM',
      },
    ],
  });

  // Create sample tasks for Design Board
  await prisma.task.createMany({
    data: [
      {
        boardId: designBoard.id,
        title: 'Create button components',
        description: 'Design and implement reusable button components',
        status: 'DONE',
        priority: 'HIGH',
        assignedTo: 'Frank Miller',
      },
      {
        boardId: designBoard.id,
        title: 'Color palette refinement',
        description: 'Update brand colors and ensure accessibility compliance',
        status: 'IN_PROGRESS',
        priority: 'LOW',
        assignedTo: 'Grace Lee',
      },
    ],
  });

  // Create sample tasks for QA Board
  await prisma.task.createMany({
    data: [
      {
        boardId: qaBoard.id,
        title: 'Write unit tests for auth module',
        description: 'Cover all authentication endpoints with tests',
        status: 'TODO',
        priority: 'HIGH',
        assignedTo: 'Tom Wilson',
        dueDate: new Date('2024-02-18'),
      },
      {
        boardId: qaBoard.id,
        title: 'Automated E2E test suite',
        description: 'Set up Cypress for end-to-end testing',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedTo: 'Sarah Connor',
      },
      {
        boardId: qaBoard.id,
        title: 'Performance testing',
        description: 'Load test the API endpoints',
        status: 'TODO',
        priority: 'MEDIUM',
        assignedTo: 'Mike Ross',
        dueDate: new Date('2024-02-25'),
      },
      {
        boardId: qaBoard.id,
        title: 'Security audit',
        description: 'Run OWASP security checks',
        status: 'DONE',
        priority: 'HIGH',
        assignedTo: 'Rachel Green',
      },
    ],
  });

  // Create sample tasks for DevOps Board
  await prisma.task.createMany({
    data: [
      {
        boardId: devOpsBoard.id,
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated deployments',
        status: 'DONE',
        priority: 'HIGH',
        assignedTo: 'John DevOps',
      },
      {
        boardId: devOpsBoard.id,
        title: 'Kubernetes migration',
        description: 'Migrate services to K8s cluster',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedTo: 'Lisa Kumar',
        dueDate: new Date('2024-03-01'),
      },
      {
        boardId: devOpsBoard.id,
        title: 'Database backup automation',
        description: 'Set up automated daily backups',
        status: 'TODO',
        priority: 'MEDIUM',
        assignedTo: 'Chris Evans',
      },
      {
        boardId: devOpsBoard.id,
        title: 'Monitor setup with Grafana',
        description: 'Configure monitoring dashboards',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        assignedTo: 'Anna Smith',
      },
    ],
  });

  // Create sample tasks for HR Board
  await prisma.task.createMany({
    data: [
      {
        boardId: hrBoard.id,
        title: 'Senior Developer interviews',
        description: 'Schedule and conduct technical interviews',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedTo: 'HR Manager',
        dueDate: new Date('2024-02-20'),
      },
      {
        boardId: hrBoard.id,
        title: 'Onboarding documentation',
        description: 'Update new employee onboarding guide',
        status: 'TODO',
        priority: 'MEDIUM',
        assignedTo: 'Jane HR',
      },
      {
        boardId: hrBoard.id,
        title: 'Team building event',
        description: 'Organize Q1 team building activity',
        status: 'TODO',
        priority: 'LOW',
        assignedTo: 'Mark Events',
        dueDate: new Date('2024-03-15'),
      },
    ],
  });

  // Create sample tasks for Sales Board
  await prisma.task.createMany({
    data: [
      {
        boardId: salesBoard.id,
        title: 'Follow up with Acme Corp',
        description: 'Send proposal and schedule demo',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedTo: 'Sales Rep 1',
        dueDate: new Date('2024-02-16'),
      },
      {
        boardId: salesBoard.id,
        title: 'Q1 sales targets review',
        description: 'Review and adjust quarterly targets',
        status: 'TODO',
        priority: 'HIGH',
        assignedTo: 'Sales Manager',
      },
      {
        boardId: salesBoard.id,
        title: 'CRM data cleanup',
        description: 'Update and verify customer information',
        status: 'TODO',
        priority: 'LOW',
        assignedTo: 'Sales Admin',
      },
      {
        boardId: salesBoard.id,
        title: 'Enterprise client onboarding',
        description: 'Complete onboarding for TechCorp',
        status: 'DONE',
        priority: 'HIGH',
        assignedTo: 'Account Manager',
      },
    ],
  });

  // Create sample tasks for Support Board
  await prisma.task.createMany({
    data: [
      {
        boardId: supportBoard.id,
        title: 'Critical bug - Login issue',
        description: 'Users unable to login with SSO',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedTo: 'Support Lead',
      },
      {
        boardId: supportBoard.id,
        title: 'Update knowledge base',
        description: 'Add new FAQ entries for recent features',
        status: 'TODO',
        priority: 'MEDIUM',
        assignedTo: 'Tech Writer',
        dueDate: new Date('2024-02-22'),
      },
      {
        boardId: supportBoard.id,
        title: 'Customer feedback analysis',
        description: 'Analyze Q4 customer satisfaction surveys',
        status: 'DONE',
        priority: 'MEDIUM',
        assignedTo: 'Support Analyst',
      },
      {
        boardId: supportBoard.id,
        title: 'Ticket response time improvement',
        description: 'Implement auto-response system',
        status: 'TODO',
        priority: 'LOW',
        assignedTo: 'Support Engineer',
      },
    ],
  });

  console.log('✅ Database seeded successfully with 8 boards and 35+ tasks!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });