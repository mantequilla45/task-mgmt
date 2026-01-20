# Architecture Decisions Document

## Technology Stack

### Core Technologies
- **Next.js 16.1.3** with App Router and Turbopack
- **TypeScript 5** for type safety throughout
- **PostgreSQL** (via Supabase) as the primary database
- **Prisma ORM 6.2.0** for database access and migrations
- **Tailwind CSS 3.4** for styling
- **React 19.0.0** with Server Components

### Key Libraries
- **Lucide React** - Icon library for consistent UI icons
- **Zod** - Runtime validation for forms and data
- **React Hooks** - useState, useCallback, useEffect for client interactivity

## Database Architecture

### Database Provider
**Decision**: PostgreSQL hosted on Supabase

**Why**:
- **Managed service** - No infrastructure management needed
- **Built-in connection pooling** - Handles concurrent connections efficiently
- **Real-time capabilities** - Available for future features
- **Generous free tier** - Perfect for MVP and development
- **PostgreSQL features** - Full SQL support, JSONB, advanced queries

### Schema Design

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
  boardId     String?   // Nullable to support orphaned tasks
  title       String
  description String?
  status      TaskStatus // Enum: TODO, IN_PROGRESS, DONE
  priority    Priority?  // Enum: LOW, MEDIUM, HIGH
  assignedTo  String?
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  board       Board?    @relation(fields: [boardId], references: [id], onDelete: SetNull)
}
```

**Key Design Decisions**:
- **Nullable boardId** - Supports orphaned tasks when boards are deleted
- **SetNull on delete** - Tasks become orphaned rather than deleted when board is removed
- **Enums for status/priority** - Type safety at database level
- **CUID for IDs** - URL-friendly, collision-resistant identifiers

## Application Architecture

### Project Structure

```
/app
├── dashboard/
│   ├── (overview)/
│   │   ├── page.tsx          # Main dashboard with board grid
│   │   └── loading.tsx       # Loading skeleton
│   ├── board/
│   │   ├── [id]/
│   │   │   ├── page.tsx      # Board detail with kanban view
│   │   │   └── loading.tsx   # Board loading state
│   │   └── orphaned-tasks/
│   │       └── page.tsx      # Orphaned tasks management
│   └── layout.tsx            # Dashboard layout wrapper
├── ui/
│   ├── boards/
│   │   ├── board-card.tsx            # Board display card
│   │   ├── create-board-button.tsx   # Board creation modal
│   │   ├── delete-board-modal.tsx    # Board deletion with options
│   │   ├── edit-board-modal.tsx      # Board editing
│   │   └── board-settings-dropdown.tsx # Board actions menu
│   ├── tasks/
│   │   ├── task-list-optimistic.tsx  # Optimistic task list column
│   │   ├── task-card-optimistic.tsx  # Draggable task card
│   │   ├── task-board.tsx           # Kanban board container
│   │   ├── board-content.tsx        # Board page content wrapper
│   │   ├── create-task-button.tsx   # Task creation modal
│   │   ├── edit-task-modal.tsx      # Task editing modal
│   │   └── orphaned-task-card.tsx   # Special card for orphaned tasks
│   └── shared/
│       ├── button.tsx               # Reusable button component
│       ├── expandable-search.tsx    # Search with expand animation
│       └── pagination.tsx          # Pagination controls
└── lib/
    ├── actions.ts     # Server Actions for mutations
    ├── data.ts        # Data fetching functions
    ├── types.ts       # TypeScript type definitions
    └── prisma.ts      # Prisma client configuration
```

### Data Flow Architecture

```
User Interaction
       ↓
Client Component (optional optimistic update)
       ↓
Server Action (validation + mutation)
       ↓
Prisma ORM
       ↓
PostgreSQL (Supabase)
       ↓
revalidatePath()
       ↓
UI Update (Server Component re-renders)
```

### State Management Strategy

**1. Server State as Primary Source**
- All data fetched in Server Components
- Automatic revalidation after mutations
- No client-side data cache needed

**2. Optimistic Updates for UX**
```typescript
// In board-content.tsx
const addTaskOptimistically = useCallback((tempTask: Partial<Task>) => {
  const newTask: Task = {
    id: `temp-${Date.now()}`,
    ...tempTask
  };
  setTasks(prevTasks => [newTask, ...prevTasks]);
  return (realTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(t => t.id === newTask.id ? realTask : t)
    );
  };
}, [board.id]);
```

**3. URL State for Filters**
- Search queries stored in URL params
- Enables bookmarking and sharing
- Example: `/dashboard?query=design&page=2`

**4. Local State for UI Only**
- Modal open/close states
- Form input values
- Drag hover states

## Server Actions Implementation

### Core Server Actions

```typescript
// Board Management
createBoard(formData: FormData)      // Create new board
updateBoard(id: string, data: any)   // Update board details  
deleteBoard(id: string, taskHandling: 'orphan' | 'transfer' | 'delete', targetBoardId?: string)

// Task Management
createTask(formData: FormData)       // Create task with validation
updateTask(id: string, data: any)    // Update task details
updateTaskStatus(taskId: string, status: TaskStatus) // Drag-drop status change
deleteTask(id: string)               // Remove task
assignTaskToBoard(taskId: string, boardId: string) // Reassign orphaned tasks
```

### Error Handling Pattern

```typescript
try {
  // Operation
  await prisma.task.create({ data });
  
  // Revalidate affected paths
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/board/${boardId}`);
  
  return { success: true, task: newTask };
} catch (error) {
  console.error('Database Error:', error);
  return {
    success: false,
    message: 'Database Error: Failed to create task.'
  };
}
```

## Key Features Implementation

### 1. Optimistic Task Creation
- Task appears instantly in UI
- Server processes in background
- Updates with real ID when complete
- No page reload required

### 2. Drag-and-Drop Task Management
- Built with native HTML5 drag/drop
- Visual feedback during drag
- Updates status on drop
- Server action persists change

### 3. Orphaned Tasks System
- Tasks persist when board deleted
- Special page at `/dashboard/board/orphaned-tasks`
- Can reassign to any board
- Shows in dashboard when orphans exist

### 4. Board Deletion Options
- **Keep tasks as orphaned** - Tasks become unassigned
- **Transfer to another board** - Bulk reassignment
- **Delete all tasks** - Complete removal

### 5. Search Implementation
- URL-based with `?query=` param
- Server-side filtering in database
- Searches board names and descriptions
- Instant results without page reload

## Performance Optimizations

### 1. Database Query Optimization
```typescript
// Fetch all tasks once and filter in memory for orphans
const allTasks = await prisma.task.findMany();
const orphanedTasks = allTasks.filter(task => task.boardId === null);
```

### 2. Optimistic Updates
- Immediate UI feedback
- Background server processing
- Rollback on failure

### 3. Component Architecture
- Server Components for initial render
- Client Components only when needed
- Proper component boundaries

### 4. Efficient Re-renders
- `useCallback` for stable function references
- Targeted `revalidatePath` calls
- Minimal client state

## Security Considerations

### Current Implementation
- **Input validation** - All forms validate on server
- **SQL injection protection** - Prisma parameterized queries
- **XSS protection** - React auto-escapes output
- **CSRF protection** - Next.js built-in for Server Actions

### Production Requirements
- **Authentication** - Add NextAuth.js or Clerk
- **Authorization** - Row-level security for multi-tenancy
- **Rate limiting** - Prevent API abuse
- **Audit logging** - Track all mutations
- **Encryption** - Sensitive data at rest

## Known Issues & Technical Debt

### 1. Prisma Null Queries
- Prisma doesn't handle `where: { boardId: null }` well
- Workaround: Fetch all and filter in memory
- Production fix: Use raw SQL or Prisma raw queries

### 2. Height Management
- Task columns use fixed heights (`h-[60vh]`)
- Should be more responsive to viewport
- Consider CSS Grid or Flexbox improvements

### 3. Modal Background Consistency
- All modals use `bg-black/50` overlay
- Consistent across delete, edit, create modals

### 4. Type Safety Gaps
- Some `any` types in mapped data
- Should use stricter typing throughout

## Deployment Considerations

### Environment Variables
```env
DATABASE_URL          # PostgreSQL connection string
POSTGRES_PRISMA_URL   # Prisma-specific connection
POSTGRES_URL_NON_POOLING  # Direct connection
```

### Database Migrations
```bash
npx prisma migrate dev    # Development
npx prisma migrate deploy # Production
npx prisma generate       # Generate client
```

### Build Process
```bash
pnpm install
npx prisma generate
pnpm build
pnpm start
```

## Future Enhancements

### Near Term
- [ ] User authentication system
- [ ] Real-time collaboration
- [ ] File attachments on tasks
- [ ] Task comments/activity log
- [ ] Bulk task operations
- [ ] Keyboard shortcuts

### Long Term
- [ ] API for third-party integrations
- [ ] Mobile app
- [ ] Advanced filtering and sorting
- [ ] Custom fields
- [ ] Automation rules
- [ ] Analytics dashboard

## Lessons Learned

### What Worked Well
- **Optimistic updates** - Greatly improved perceived performance
- **Server Actions** - Simplified data mutations without API routes
- **Supabase** - Quick setup with generous free tier
- **Component organization** - Clear separation by feature

### Challenges Faced
- **Prisma null handling** - Required workarounds for orphaned tasks
- **Height management** - CSS complexity for full-height layouts
- **Type inference** - Complex types with Prisma relations
- **State synchronization** - Balancing optimistic and server state

### Key Decisions That Paid Off
1. **SetNull instead of Cascade** - Preserved data integrity
2. **Optimistic updates from start** - Better UX throughout
3. **URL-based search** - Shareable and bookmarkable
4. **Modular component structure** - Easy to maintain and extend

## Conclusion

This architecture successfully implements a full-featured task management system with:
- **Modern React patterns** - Server Components, Server Actions
- **Type safety** - End-to-end TypeScript
- **Great UX** - Optimistic updates, drag-and-drop
- **Scalable structure** - Clear separation of concerns
- **Production ready** - With minor enhancements needed

The codebase is maintainable, performant, and ready for future feature additions while providing an excellent developer experience.