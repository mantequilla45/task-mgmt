# Architecture Decisions Document

## Technology Choices

### Next.js App Router
**Decision**: Used Next.js 14+ with App Router (not Pages Router)

**Why**:
- **Server Components by default** - Better performance with less JavaScript shipped to client
- **Server Actions** - Simplified data mutations without separate API routes
- **Streaming UI** - Built-in support for loading states and progressive rendering
- **File-based routing** - Cleaner structure with route groups and layouts
- **Modern pattern** - App Router is the recommended approach for new Next.js projects

**Trade-offs**:
- Steeper learning curve compared to Pages Router
- Some third-party libraries still catching up with App Router patterns
- More complex mental model (server vs client components)

### SQLite + Prisma ORM
**Decision**: Used SQLite as the database with Prisma as the ORM

**Why SQLite**:
- **Zero configuration** - No external database server needed
- **Fast setup** - Perfect for 2-hour time constraint
- **File-based** - Easy to share and deploy
- **Sufficient for requirements** - Handles all CRUD operations needed
- **Simple to reset** - Easy to restart with fresh data during development

**Why Prisma**:
- **Type safety** - Auto-generated TypeScript types from schema
- **Excellent DX** - Intuitive API and great error messages
- **Migration system** - Version control for database schema
- **Prisma Studio** - Visual database browser for debugging
- **Active ecosystem** - Well-maintained with good documentation

**Trade-offs**:
- SQLite has limitations (no concurrent writes, single file)
- In production, would use PostgreSQL for better concurrency and features
- Prisma adds bundle size compared to raw SQL

### Tailwind CSS
**Decision**: Used Tailwind CSS for styling

**Why**:
- **Rapid development** - Utility-first approach speeds up styling
- **Consistency** - Design system built-in with spacing, colors, typography scales
- **No context switching** - Write styles directly in JSX
- **Responsive design** - Mobile-first breakpoints make responsive design easy
- **Already familiar** - Part of my existing tech stack

**Trade-offs**:
- Can lead to verbose className strings
- Requires learning Tailwind's utility class names
- Less CSS reusability compared to traditional CSS modules

### TypeScript
**Decision**: Used TypeScript throughout the entire application

**Why**:
- **Type safety** - Catch errors at compile time instead of runtime
- **Better IDE support** - Autocomplete, refactoring, inline documentation
- **Prisma integration** - Generated types match database schema exactly
- **Required by PRD** - Specified in the technical requirements
- **Self-documenting** - Types serve as inline documentation

**Trade-offs**:
- More verbose code compared to JavaScript
- Occasional type wrestling with complex types
- Longer initial setup time

---

## Data Architecture

### Database Schema Design

**Board Model**:
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
```

**Design decisions**:
- **CUID for IDs** - More URL-friendly than UUIDs, better for horizontal scaling
- **Optional fields** - Description and color add flexibility without complexity
- **Auto timestamps** - CreatedAt and updatedAt tracked automatically
- **One-to-many relationship** - Board has many tasks via Prisma relation

**Task Model**:
```prisma
model Task {
  id          String    @id @default(cuid())
  boardId     String
  title       String
  description String?
  status      String    // "todo" | "in_progress" | "done"
  priority    String?   // "low" | "medium" | "high"
  assignedTo  String?
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  board       Board     @relation(fields: [boardId], references: [id], onDelete: Cascade)
}
```

**Design decisions**:
- **Status as String** - Kept flexible, validated in application layer with TypeScript types
- **Cascade delete** - When a board is deleted, all its tasks are automatically deleted
  - **Why cascade?** Orphaned tasks without a board have no context and would be useless
  - Alternative would be to prevent deletion if board has tasks, but that creates UX friction
- **Optional metadata** - Priority, assignedTo, dueDate add power features without mandatory complexity
- **Foreign key constraint** - Ensures referential integrity (tasks can't reference non-existent boards)

### Data Flow Pattern

**Server Actions approach** instead of API Routes:
```
User Action → Server Action → Prisma → Database
                    ↓
            revalidatePath() → UI updates
```

**Why this pattern**:
- Simpler than separate API layer
- Built-in form handling with progressive enhancement
- Automatic revalidation of server components
- Type-safe end-to-end (no HTTP serialization issues)

---

## API Design

### Server Actions Structure

**File organization**:
```
/lib
  ├── actions.ts     # All data mutations (create, update, delete)
  ├── data.ts        # All data fetching (read operations)
  └── definitions.ts # TypeScript types and Zod schemas
```

**Why this separation**:
- **Clear responsibility** - Mutations in actions.ts, queries in data.ts
- **Easy to find** - Developers know exactly where to look
- **Server/Client boundary** - Actions can be called from client components
- **Reusability** - Data fetching functions used across multiple pages

### Server Actions Implemented

**Board Actions**:
- `createBoard(formData)` - Create new board with Zod validation
- `updateBoard(id, formData)` - Update board name/description
- `deleteBoard(id)` - Delete board and cascade delete tasks

**Task Actions**:
- `createTask(boardId, formData)` - Create task in specific board with validation
- `updateTask(id, updates)` - Update any task field (status, title, etc.)
- `updateTaskStatus(id, status)` - Specialized action for drag-and-drop status changes
- `deleteTask(id)` - Remove task

**Error Handling Pattern**:
```typescript
try {
  // Validation with Zod
  const validated = FormSchema.parse(formData);
  
  // Database operation
  await prisma.task.create({ data: validated });
  
  // Revalidate affected routes
  revalidatePath('/dashboard');
  
  return { success: true };
} catch (error) {
  if (error instanceof z.ZodError) {
    return { error: 'Validation failed: ' + error.message };
  }
  return { error: 'Failed to create task' };
}
```

**Why this pattern**:
- User-friendly error messages (not raw database errors)
- Validation happens before database operations with Zod
- Automatic UI refresh with revalidatePath
- Consistent error handling across all actions
- Type-safe validation with Zod schemas

---

## Frontend Architecture

### Project Structure

```
/app
  ├── dashboard
  │   ├── (overview)
  │   │   ├── page.tsx          # Dashboard home with search
  │   │   └── loading.tsx       # Loading skeleton
  │   └── board
  │       └── [id]
  │           ├── page.tsx      # Board detail with drag-and-drop
  │           ├── loading.tsx   # Board loading state
  │           └── error.tsx     # Error boundary
  ├── ui
  │   ├── boards
  │   │   ├── board-card.tsx    # Board display card
  │   │   ├── create-board.tsx  # Board creation form with validation
  │   │   └── board-grid.tsx    # Board list layout
  │   ├── tasks
  │   │   ├── task-card.tsx     # Draggable task card
  │   │   ├── create-task.tsx   # Task creation form with Zod validation
  │   │   ├── task-column.tsx   # Droppable status column
  │   │   └── task-board.tsx    # Drag-and-drop board container
  │   ├── search.tsx            # Search component with URL params
  │   └── skeletons.tsx         # Loading skeletons
  └── lib
      ├── actions.ts            # Server actions
      ├── data.ts               # Data fetching with search support
      └── definitions.ts        # Types and Zod schemas
```

**Why this structure**:
- **Route groups** - `(overview)` keeps dashboard clean without affecting URL
- **Component organization** - Features grouped by domain (boards, tasks)
- **Colocation** - Loading states and error boundaries near their pages
- **Separation of concerns** - UI components separate from business logic

### State Management

**Approach**: Minimal client-side state, leverage server state

**What we use**:
- **Server Components** - Default for all pages, fetch data server-side
- **Server Actions** - Handle mutations with automatic revalidation
- **React useState** - Only for truly interactive UI (forms, modals, drag state)
- **URL state** - Search params for filters (e.g., `?query=design`)
- **useOptimistic** - For instant UI feedback during drag-and-drop

**Why minimal state**:
- Less complexity, fewer bugs
- Server is source of truth
- Automatic data freshness with revalidation
- Better performance (less client JS)

**Example - Task Status Update via Drag-and-Drop**:
```typescript
// Client component with drag state
const [activeId, setActiveId] = useState(null);

function handleDragEnd(event) {
  const { active, over } = event;
  if (over && active.id !== over.id) {
    // Server action handles the update
    updateTaskStatus(active.id, over.id);
  }
}
```

After the server action runs, `revalidatePath` refreshes the UI automatically.

### Component Design Principles

**Server Components by default**:
- All pages are Server Components
- Fetch data directly in components
- No loading spinners needed (use Suspense boundaries)

**Client Components only when needed**:
- Forms with interactivity (marked with `'use client'`)
- Drag-and-drop functionality (@dnd-kit requires client)
- Event handlers (onClick, onChange)
- React hooks (useState, useEffect, useOptimistic)
- Search component with URL manipulation

**Component composition**:
- Small, focused components (single responsibility)
- Props for data, server actions for mutations
- Reusable UI components in `/ui` folder
- Feature-specific components grouped together

### Form Handling & Validation

**Pattern**: Progressive enhancement with Server Actions + Zod

```typescript
// Zod schema for validation
const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

// Server Action with validation
async function createTask(formData: FormData) {
  'use server'
  
  const validated = TaskSchema.parse({
    title: formData.get('title'),
    status: formData.get('status'),
  });
  
  await prisma.task.create({ data: validated });
  revalidatePath('/dashboard');
}

// Form uses action prop
<form action={createTask}>
  <input name="title" required />
  <button type="submit">Create</button>
</form>
```

**Benefits**:
- Works without JavaScript (progressive enhancement)
- Built-in loading states with `useFormStatus`
- Type-safe validation with Zod
- Server-side validation prevents malicious inputs
- Clear, user-friendly error messages

**Enhanced with**:
- **Zod validation** - Runtime type checking and validation
- **Error boundaries** - Catch and display errors gracefully
- **Client-side validation** - HTML5 validation for immediate feedback
- **Form state management** - useFormState for handling errors and success states

### Search Implementation

**Pattern**: URL-based search with server-side filtering

```typescript
// URL: /dashboard?query=design

// Search component (Client Component)
'use client'
export function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return <input onChange={(e) => handleSearch(e.target.value)} />;
}

// Server Component reads params and filters
export default async function Page({ searchParams }) {
  const query = searchParams?.query || '';
  const boards = await fetchFilteredBoards(query);
  
  return <BoardGrid boards={boards} />;
}
```

**Why this approach**:
- **Shareable URLs** - Search state in URL can be bookmarked/shared
- **Server-side filtering** - Database does the heavy lifting
- **No state management** - URL is the source of truth
- **Back button works** - Browser history just works
- **Progressive enhancement** - Works even if JS fails

### Drag-and-Drop Implementation

**Library**: @dnd-kit/core + @dnd-kit/sortable

**Why @dnd-kit**:
- **Modern** - Built for React with hooks
- **Accessible** - Keyboard navigation and screen reader support
- **Performant** - Optimized for smooth interactions
- **Flexible** - Works with any layout (not just lists)
- **TypeScript support** - Full type safety

**Implementation pattern**:
```typescript
// Board page is a Client Component
'use client'
import { DndContext, DragEndEvent } from '@dnd-kit/core';

export function TaskBoard({ tasks }) {
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.data.current.status !== over.id) {
      // Server action updates status
      await updateTaskStatus(active.id, over.id);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <TaskColumn status="todo" tasks={todoTasks} />
      <TaskColumn status="in_progress" tasks={inProgressTasks} />
      <TaskColumn status="done" tasks={doneTasks} />
    </DndContext>
  );
}
```

**Why this works**:
- Visual feedback during drag (cards follow cursor)
- Server action updates database
- revalidatePath refreshes UI with new data
- Optimistic updates for instant feedback (optional enhancement)

### Error Handling

**Error Boundaries**: Implemented at route level

```typescript
// app/dashboard/board/[id]/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Why error boundaries**:
- **Graceful degradation** - App doesn't crash completely
- **User-friendly** - Shows helpful error messages
- **Recovery option** - Reset button to retry
- **Isolated failures** - Errors don't propagate to entire app

**Error handling layers**:
1. **Form validation** - Zod catches invalid inputs before submission
2. **Server action try-catch** - Handles database/network errors
3. **Error boundaries** - Catches unexpected React errors
4. **404 handling** - not-found.tsx for missing resources

---

## What Would Change in Production

### Database
- **Switch to PostgreSQL** - Better for concurrent users, more features
- **Add indexes** - On boardId, status, createdAt for faster queries
- **Connection pooling** - Use Prisma with connection pool (PgBouncer)
- **Migrations** - Proper migration strategy for zero-downtime deploys

### Authentication & Authorization
- **Add NextAuth.js** - User authentication and sessions
- **Row-level security** - Users can only see/edit their own boards
- **API rate limiting** - Prevent abuse of server actions
- **CSRF protection** - Additional security for mutations

### Performance
- **Edge runtime** - Deploy to edge for lower latency
- **Caching strategy** - Redis for frequently accessed data
- **Static generation** - Pre-render public boards
- **Image optimization** - If we add file uploads later
- **Code splitting** - Lazy load components, reduce initial bundle

### Monitoring & Observability
- **Error tracking** - Sentry for production error monitoring
- **Analytics** - Track user behavior, feature usage
- **Performance monitoring** - Web vitals, server action latency
- **Logging** - Structured logging for debugging production issues

### Testing
- **Unit tests** - Jest for server actions and utilities
- **Integration tests** - Test API contracts and data flows
- **E2E tests** - Playwright for critical user journeys
- **Visual regression** - Catch UI bugs automatically

### User Experience
- **Toast notifications** - Feedback for all actions (success/error)
- **Optimistic updates** - Instant UI response before server confirms
- **Undo functionality** - Let users undo deletes
- **Keyboard shortcuts** - Power user features
- **Mobile gestures** - Swipe to delete, pull to refresh

### Developer Experience
- **CI/CD pipeline** - Automated testing and deployment
- **Staging environment** - Test before production
- **Environment variables** - Proper secrets management
- **API documentation** - Document server actions for team
- **Storybook** - Component library and visual testing

---

## Lessons Learned

### What Worked Well
- **Server Actions** simplified the codebase significantly
- **Zod validation** caught errors early and provided type safety
- **Drag-and-drop** with @dnd-kit was easier than expected
- **URL-based search** eliminated need for complex state management
- **Error boundaries** prevented cascading failures

### What Was Challenging
- **Balancing time** between features and polish in 2 hours
- **TypeScript complexity** with drag-and-drop types
- **Deciding** when to use client vs server components
- **Form validation** - getting both client and server validation right

### If Starting Over
- Would start with drag-and-drop earlier (took more time than expected)
- Would use a UI component library (shadcn/ui) for faster development
- Would add optimistic updates from the beginning
- Would implement toast notifications early for better UX feedback

---

## Conclusion

This architecture prioritizes **developer experience** and **rapid development** while maintaining **type safety** and **user experience**. The use of Next.js App Router with Server Actions, Prisma ORM, Zod validation, and modern React patterns creates a robust foundation that could scale to a production application with relatively minor modifications.

The biggest wins were:
- **Server Actions** eliminating the need for a separate API layer
- **Zod** providing runtime validation and type safety
- **Drag-and-drop** creating intuitive task management
- **URL-based search** providing shareable, bookmarkable results
- **Error boundaries** creating resilient user experience

For a 2-hour assessment, this architecture demonstrates proficiency with modern web development practices, AI-assisted development workflows, and the ability to make pragmatic technical decisions under time constraints.