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
- **Database migration**: From SQLite to PostgreSQL/Supabase when connection issues arose
- **Schema modifications**: Changing from Cascade to SetNull for orphaned tasks feature
- **Component generation**: React component templates with TypeScript interfaces
- **Server actions**: CRUD operations structure in `/lib/actions.ts`
- **Optimistic updates**: Implementation pattern for instant UI feedback
- **Error handling**: Prisma null query workarounds
- **Search implementation**: URL-based search with debouncing
- **Modal components**: Delete confirmation with task handling options
- **Documentation**: Architecture and workflow documentation

### What I Coded Manually:
- **Business logic**: Orphaned tasks management, task reassignment
- **UI implementation**: Task list height management, responsive layouts
- **State management**: Task state synchronization between server and client
- **Form handling**: Due date field, assignee field, validation
- **Drag-and-drop**: Native HTML5 drag/drop implementation
- **Modal interactions**: Delete board with three options (orphan/transfer/delete)
- **Search filtering**: Server-side task filtering by title/description/assignee
- **Pagination**: Board list pagination with URL params
- **Color coding**: Status-based colors for task columns
- **Loading states**: Skeleton components for better UX

### Where AI-Generated Code Needed Fixes:
- **Prisma null queries**: Had to fetch all and filter in memory instead of `where: { boardId: null }`
- **SSL certificate errors**: Fixed Supabase connection with proper SSL config
- **Task placement**: Changed from bottom to top when creating new tasks
- **Modal backgrounds**: Standardized to `bg-black/50` across all modals
- **Height overflow**: Fixed task columns exceeding screen height
- **Search state sync**: Added useEffect to update tasks when search results change
- **Type mismatches**: Fixed boardId nullable type in multiple components
- **Optimistic rollback**: Added proper error handling for failed updates

### How I Fixed Problems:
- **Database connection**: Switched from SQLite to Supabase PostgreSQL
- **SSL issues**: Configured proper SSL settings in Prisma client
- **Null handling**: Implemented workaround for Prisma's null query limitations
- **State updates**: Added useEffect hooks for prop synchronization
- **Layout issues**: Used flexbox and overflow properties for proper height management
- **Type safety**: Updated interfaces to handle nullable boardId
- **Search functionality**: Fixed by updating local state when initialTasks prop changes

## Time Management

### First 30 minutes:
- Set up Next.js project with TypeScript
- Created Prisma schema with Board and Task models
- Configured Supabase database connection
- Ran initial migrations
- Created project structure

### Next 45 minutes:
- Built server actions for CRUD operations
- Implemented data fetching functions
- Created board list dashboard
- Added board creation functionality
- Implemented task creation within boards

### Next 45 minutes:
- Added drag-and-drop for task status changes
- Implemented search functionality
- Created delete board modal with options
- Added optimistic updates for instant feedback
- Built orphaned tasks management

### Last 30 minutes:
- Fixed height overflow issues
- Added task reassignment feature
- Implemented search state synchronization
- Updated documentation
- Fixed TypeScript errors

### What I Skipped:
- User authentication system
- Real-time collaboration
- File attachments
- Task comments
- Activity logs
- Bulk operations
- Keyboard shortcuts
- Mobile gestures

### If I Had More Time:
- **Authentication**: Add user accounts with NextAuth.js
- **Real-time updates**: WebSocket integration for collaboration
- **Rich text editor**: For task descriptions
- **File uploads**: Attachments for tasks
- **Notifications**: Toast messages for all actions
- **Testing**: Comprehensive test coverage
- **Performance**: Implement virtual scrolling for long task lists
- **Analytics**: Task completion metrics and charts
- **API**: RESTful API for third-party integrations
- **Mobile app**: React Native companion app

## Key Learnings

### Effective AI Usage:
- AI excels at boilerplate and pattern implementation
- Human oversight crucial for business logic decisions
- Breaking complex problems into smaller prompts works better
- AI helps quickly identify and fix type errors
- Documentation generation saves significant time

### Challenges:
- Prisma's handling of null values in queries
- State synchronization between server and client components
- Height management in CSS for full-screen layouts
- Type safety with nullable foreign keys
- Optimistic updates with proper rollback

### Best Practices Applied:
- **PostgreSQL over SQLite**: Better for production scalability
- **SetNull over Cascade**: Preserves data integrity
- **Optimistic updates**: Better perceived performance
- **URL-based search**: Shareable and bookmarkable
- **Server Actions**: Simplified data mutations
- **Component composition**: Reusable, focused components
- **Error boundaries**: Graceful error handling
- **TypeScript throughout**: Type safety and IntelliSense
- **Tailwind CSS**: Consistent, responsive styling
- **Progressive enhancement**: Forms work without JavaScript