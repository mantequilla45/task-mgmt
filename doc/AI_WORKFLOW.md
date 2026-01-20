# AI Workflow Documentation

## Tool Used

I used **Claude Code** as my AI-integrated development environment for this task board system implementation.

## Example Prompts

### 1. Initial Planning and Research
**Prompt**: "dont create the whole system yet. just make a plan, we're using next.js so scan these websites for resource, also scan the PRD pdf in /doc.
https://nextjs.org/learn/dashboard-app/mutating-data
https://nextjs.org/learn/dashboard-app/streaming
https://nextjs.org/learn/dashboard-app/adding-search-and-pagination"

- **Why this prompt**: Wanted to understand the requirements first and learn from Next.js best practices before jumping into code
- **Result**: Claude analyzed the PRD and Next.js documentation, created a structured implementation plan following Next.js patterns for server actions and data fetching

### 2. Project Structure Setup
**Prompt**: "i've created the folder structure and placeholder files, let's populate them one by one. i've added /ui for components, /dashboard/(overview), /dashboard/board, /lib (actions.ts and data.ts), i've added loading.tsx and skeleton.tsx files too"

- **Why this prompt**: Wanted to set up the project structure following Next.js App Router conventions before writing any logic
- **Result**: Claude helped populate each file systematically, starting with the foundational pieces like actions and data fetching functions

### 3. Database Schema Design
**Prompt**: "create me a prisma schema that follows this:
Data Models
You need two database tables with a relationship.
Board Table
A board is a container for tasks.
Required Fields:
* id (primary key, auto-generated)
* name (text, required)
* created_at (timestamp, auto-generated)
Optional Fields (your choice):
* description (text)
* color (text)
* updated_at (timestamp)
Task Table
A task belongs to one board.
Required Fields:
* id (primary key, auto-generated)
* board_id (foreign key to Board, required)
* title (text, required)
* status (must be one of: "todo", "in_progress", "done")
* created_at (timestamp, auto-generated)
Optional Fields (your choice):
* description (text)
* assigned_to (text)
* priority (text: "low", "medium", "high")
* due_date (date)
* updated_at (timestamp)
Database Rules:
* One Board can have many Tasks
* One Task belongs to only one Board
* When you delete a Board, decide what happens to its Tasks (delete them too, or prevent deletion)"

- **Why this prompt**: Copied the exact requirements from the PRD to ensure the schema matched specifications perfectly
- **Result**: Generated correct Prisma schema with proper relationships, I chose cascade delete for tasks when board is deleted to keep data clean

## My Process

### What I Used AI For:
- **Initial planning**: Understanding PRD requirements and creating implementation roadmap
- **Next.js patterns**: Learning server actions and streaming patterns from official docs
- **Database schema**: Generating Prisma models with proper relationships
- **Server actions boilerplate**: Basic CRUD operations structure in `/lib/actions.ts`
- **Component templates**: React component structure with TypeScript
- **Loading states**: Skeleton components for streaming UI
- **TypeScript types**: Interface definitions for props and data models
- **Zod schemas**: Initial validation schema setup
- **DnD library guidance**: Helped me understand @dnd-kit implementation patterns

### What I Coded Manually:
- **Business logic**: Decisions like cascade delete behavior, validation rules, data flow
- **UI implementation**: Component styling, layouts, responsive design with Tailwind
- **Form handling**: Validation logic, error states, success feedback
- **State management**: React state, optimistic updates, re-rendering logic
- **Component composition**: How components fit together, prop drilling, event handlers
- **Data operations**: Filtering tasks by status, sorting logic, data transformations
- **Error handling**: User-facing error messages, edge case handling
- **User interactions**: Click handlers, form submissions, navigation logic
- **Drag-and-drop behavior**: Task status updates via drag-and-drop
- **Search functionality**: Query parameter handling and filtering logic
- **Error boundaries**: Custom error boundary components and fallback UI
- **Form validation**: Zod schema refinements and custom validation rules

### Where AI-Generated Code Needed Fixes:
- **Prisma client imports**: Had to add proper singleton pattern for production
- **Server action error handling**: Improved error messages to be more user-friendly
- **TypeScript types**: Fixed some type inference issues with Prisma queries
- **Form revalidation**: Added `revalidatePath` calls to refresh data after mutations
- **Status type safety**: Made sure status enum matched exactly ("todo", "in_progress", "done")
- **Drag-and-drop state**: Had to refine the onDragEnd handler for proper status updates
- **Search debouncing**: Added proper URL param handling for search queries
- **Zod error messages**: Customized validation error messages to be more user-friendly

### How I Fixed Problems:
- Read TypeScript errors carefully and fixed type mismatches
- Tested each server action independently before connecting to UI
- Used Prisma Studio to verify database operations
- Added console logs to debug server action flows
- Checked Next.js docs when patterns didn't work as expected
- Tested drag-and-drop with various edge cases (same column drops, invalid states)
- Debugged search functionality with different query combinations
- Verified error boundaries caught all types of errors properly

## Time Management

### First 30 minutes:
- Read through PRD completely
- Created implementation plan with Claude
- Set up Next.js project with TypeScript and Tailwind
- Created folder structure and placeholder files
- Set up Prisma schema and ran initial migration

### Next 45 minutes:
- Built server actions in `/lib/actions.ts` for boards and tasks
- Created data fetching functions in `/lib/data.ts`
- Added Zod validation schemas in `/lib/definitions.ts`
- Tested actions with temporary console logs
- Set up database queries with Prisma

### Next 45 minutes:
- Built Dashboard page (`/dashboard/(overview)/page.tsx`)
- Created Board detail page (`/dashboard/board/[id]/page.tsx`)
- Added UI components (board cards, task cards, forms)
- Implemented create/edit/delete functionality
- Added loading.tsx with skeleton components
- Built search functionality with URL params
- Implemented drag-and-drop for task status changes
- Added error boundary components

### Last 20 minutes:
- Fixed remaining TypeScript errors
- Tested all CRUD operations end-to-end
- Verified drag-and-drop works correctly
- Tested search and filtering
- Verified error boundaries catch errors
- Wrote this documentation
- Quick final polish on styling

### What I Skipped:
- Advanced animations and transitions
- Complex data analytics dashboard
- Real-time collaborative updates
- Comprehensive unit testing
- Data export functionality (CSV/JSON)
- Toast notifications for all actions
- Advanced mobile gestures

### If I Had More Time:
- **Build the analytics dashboard bonus feature** - Show task statistics and completion percentages
- **Write comprehensive unit tests** - Test coverage for server actions and components
- **Add real-time updates** - WebSocket integration for multi-user collaboration
- **Implement data export** - CSV/JSON export functionality for boards and tasks
- **Add toast notifications** - Better user feedback for all actions
- **Improve accessibility** - ARIA labels, keyboard navigation, screen reader support
- **Performance optimization** - Code splitting, lazy loading, caching strategies
- **Advanced task management** - Task dependencies, subtasks, time tracking
- **Enhanced UI polish** - Smooth animations, transitions, micro-interactions
- **Deploy to production** - Set up hosting, environment variables, CI/CD pipeline

## Key Learnings

### Effective AI Usage:
- Starting with planning instead of jumping straight to code saved time
- Copying exact requirements into prompts ensures accuracy
- Breaking work into small, focused tasks works better than big prompts
- AI is great for boilerplate but needs human oversight for logic
- Using AI to understand library patterns (like @dnd-kit) accelerated implementation

### Challenges:
- Balancing speed with code quality in 2 hours
- Deciding what to build manually vs with AI assistance
- Managing time between coding and documentation
- Implementing drag-and-drop required more manual refinement than expected
- Ensuring form validation worked both client and server-side

### Best Practices Applied:
- Database-first approach (schema before code)
- Server actions for data mutations (Next.js best practice)
- Streaming UI with loading states and Suspense boundaries
- Progressive enhancement with forms that work without JavaScript
- Error boundaries to catch and handle errors gracefully
- Search with URL params for shareable, bookmarkable URLs
- Zod validation for type-safe form handling
- Drag-and-drop with @dnd-kit for intuitive task management
- Keeping components simple and focused on single responsibilities
- Testing incrementally as I built each feature