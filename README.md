# Task Management System

A modern, full-featured task management application built with Next.js, TypeScript, and PostgreSQL. Features a Kanban-style board interface with drag-and-drop functionality, real-time search, and optimistic updates for a seamless user experience.

![Next.js](https://img.shields.io/badge/Next.js-16.1.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.2.0-2D3748)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)

## 🚀 Features

### Core Functionality
- **📋 Board Management**: Create, edit, and delete task boards with custom colors and descriptions
- **✅ Task Management**: Full CRUD operations for tasks with rich metadata
- **🎯 Drag & Drop**: Intuitive task status updates via drag-and-drop between columns
- **🔍 Real-time Search**: Filter tasks instantly by title, description, or assignee
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Advanced Features
- **⚡ Optimistic Updates**: Instant UI feedback with background server synchronization
- **🗂️ Orphaned Tasks**: Tasks persist when boards are deleted, can be reassigned
- **🎨 Custom Board Colors**: Visual organization with color-coded boards
- **📊 Task Metadata**: Priority levels, due dates, assignees, and descriptions
- **📄 Pagination**: Efficient board list navigation with URL-based pagination
- **💾 Auto-save**: All changes persist automatically without manual saving

### Task Properties
- **Status**: Todo, In Progress, Done
- **Priority**: Low, Medium, High
- **Due Date**: Optional deadline tracking
- **Assignee**: Task assignment support
- **Description**: Rich text descriptions

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.3 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **State Management**: React Server Components + URL state

### Backend
- **Runtime**: Node.js with Next.js Server Components
- **Database**: PostgreSQL (Supabase hosted)
- **ORM**: Prisma 6.2.0
- **Validation**: Zod schemas
- **Actions**: Next.js Server Actions

### Infrastructure
- **Hosting**: Vercel-ready
- **Database Host**: Supabase
- **Package Manager**: pnpm
- **Build Tool**: Turbopack

## 📦 Installation

### Prerequisites
- Node.js 18.17 or later
- pnpm (recommended) or npm
- PostgreSQL database (or Supabase account)

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/task-mgmt.git
cd task-mgmt
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your database credentials:
```env
# Database URLs (from Supabase)
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
POSTGRES_PRISMA_URL="postgresql://user:password@host:port/database?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host:port/database"
```

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed with sample data
npx prisma db seed
```

5. **Run the development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🎮 Usage

### Creating a Board
1. Click "Create Board" on the dashboard
2. Enter board name and optional description
3. Choose a color for visual organization
4. Click "Create" to add the board

### Managing Tasks
1. Navigate to a board by clicking on it
2. Click "Add Task" to create a new task
3. Fill in task details (title, priority, due date, etc.)
4. Drag tasks between columns to update status
5. Click on a task to edit or delete it

### Task Status Workflow
- **To Do** → Starting point for new tasks
- **In Progress** → Tasks currently being worked on
- **Done** → Completed tasks

### Searching Tasks
- Click the search icon in the board view
- Type to filter tasks in real-time
- Search works across title, description, and assignee fields
- Clear search to show all tasks

### Handling Orphaned Tasks
When a board is deleted, you can:
1. **Keep tasks as orphaned** - Access them via "Tasks without Board"
2. **Transfer to another board** - Move all tasks to a different board
3. **Delete all tasks** - Remove tasks permanently

## 🏗️ Project Structure

```
task-mgmt/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Dashboard routes
│   │   ├── (overview)/     # Board list page
│   │   └── board/          # Board detail pages
│   ├── ui/                 # React components
│   │   ├── boards/         # Board-related components
│   │   └── tasks/          # Task-related components
│   └── lib/                # Core logic
│       ├── actions.ts      # Server Actions (mutations)
│       ├── data.ts         # Data fetching functions
│       └── types.ts        # TypeScript definitions
├── prisma/                  # Database
│   └── schema.prisma       # Database schema
├── public/                  # Static assets
└── doc/                    # Documentation
    ├── architecture.md     # Technical decisions
    └── AI_WORKFLOW.md      # Development process
```

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server

# Database
pnpm db:push      # Push schema changes
pnpm db:migrate   # Run migrations
pnpm db:seed      # Seed database
pnpm db:studio    # Open Prisma Studio

# Code Quality
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript validation
pnpm format       # Format with Prettier
```

### Database Management

```bash
# View database in GUI
npx prisma studio

# Reset database
npx prisma migrate reset

# Generate types from schema
npx prisma generate
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Build for production
pnpm build

# Test production build locally
pnpm start
```

### Environment Variables for Production

```env
# Required for production
DATABASE_URL=your_production_database_url
POSTGRES_PRISMA_URL=your_pooled_connection_url
POSTGRES_URL_NON_POOLING=your_direct_connection_url

# Optional
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📊 Database Schema

```prisma
model Board {
  id          String   @id @default(cuid())
  name        String
  description String?
  color       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tasks       Task[]
}

model Task {
  id          String    @id @default(cuid())
  boardId     String?
  title       String
  description String?
  status      TaskStatus
  priority    Priority?
  assignedTo  String?
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  board       Board?    @relation(onDelete: SetNull)
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

## 🐛 Known Issues

1. **Prisma null queries**: Workaround implemented for filtering orphaned tasks
2. **Height management**: Task columns use fixed viewport heights
3. **Large datasets**: No virtualization for 1000+ tasks
4. **Search state**: Requires useEffect for prop synchronization

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical discussions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Documentation

- [Architecture Decisions](./ARCHITECTURE.md) - Technical choices and trade-offs
- [AI Workflow](./doc/AI_WORKFLOW.md) - Development process and learnings
- [API Documentation](./doc/api.md) - Server Actions reference

## 🔮 Future Enhancements

### Near Term
- [ ] User authentication with NextAuth.js
- [ ] Real-time collaboration with WebSockets
- [ ] File attachments for tasks
- [ ] Task comments and activity feed
- [ ] Bulk task operations
- [ ] Keyboard shortcuts
- [ ] Export to CSV/JSON

### Long Term
- [ ] Mobile app with React Native
- [ ] REST API for integrations
- [ ] Advanced analytics dashboard
- [ ] Custom fields and workflows
- [ ] Automation rules
- [ ] Time tracking
- [ ] Gantt chart view

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) by Vercel
- Database by [Supabase](https://supabase.com/)
- ORM by [Prisma](https://www.prisma.io/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

---

Built with ❤️ using Next.js and TypeScript