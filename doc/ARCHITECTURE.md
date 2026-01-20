# Architecture Decisions Document

## Technology Choices

### 1. Why App Router over Pages Router?

**Decision: Next.js 14 App Router**

Reasons:
- **Server Components by default**: Better performance with reduced client-side JavaScript
- **Improved data fetching**: Built-in support for async/await in components
- **Better layouts**: Nested layouts and error boundaries
- **Modern React features**: Full support for React 18 features like Suspense
- **Future-proof**: App Router is the recommended approach for new Next.js projects

### 2. Why SQLite for Database?

**Decision: SQLite for development**

Reasons:
- **Zero configuration**: No need to install separate database server
- **Portability**: Database is a single file, easy to share and version control
- **Perfect for development**: Fast setup for a 2-hour assessment
- **Production ready**: Can easily migrate to PostgreSQL/MySQL for production
- **Prisma support**: Excellent ORM support with type safety

### 3. Why Tailwind CSS for Styling?

**Decision: Tailwind CSS**

Reasons:
- **Rapid development**: Utility-first approach speeds up development
- **Consistency**: Built-in design system with consistent spacing and colors
- **No context switching**: Styles in the same file as components
- **Small bundle size**: Only includes used styles in production
- **Great DX**: Excellent IDE support and documentation

## Data Structure Design

### Database Schema Decisions

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
  id        String     @id @default(cuid())
  boardId   String
  board     Board      @relation(fields: [boardId], references: [id], onDelete: Cascade)
  title     String
  status    TaskStatus @default(TODO)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

**Key Decisions:**

- **CUID for IDs**: More secure than auto-increment, globally unique
- **Cascade deletion**: When a board is deleted, all its tasks are deleted (better UX)
- **Status as enum**: Type safety and validation at database level
- **Timestamps**: Both created and updated times for audit trail
- **Nullable fields**: Optional fields allow flexibility without breaking existing data

### Why This Structure?

- **One-to-many relationship**: Simple and efficient for this use case
- **No soft deletes**: Kept simple for the assessment, real deletion is fine
- **Minimal required fields**: Only essential fields are required, rest optional

## API Design

### RESTful Endpoints Structure

```
/api/boards
  GET    - List all boards
  POST   - Create new board

/api/boards/[id]
  GET    - Get board with tasks
  DELETE - Delete board

/api/tasks
  GET    - Get tasks (with boardId query param)
  POST   - Create task

/api/tasks/[id]
  PATCH  - Update task
  DELETE - Delete task
```

**Design Decisions:**

- **RESTful conventions**: Standard HTTP methods for CRUD operations
- **Nested vs flat routes**: Chose flat routes for flexibility
- **PATCH over PUT**: Only update changed fields, more efficient
- **Query parameters**: For filtering (e.g., `?boardId=123`)
- **Consistent error responses**: All errors follow same structure

### Response Structure

```typescript
// Success
{
  data: T,
  success: true
}

// Error
{
  error: string,
  success: false
}
```

## Frontend Architecture

### Component Structure

```
components/
├── boards/
│   ├── BoardCard.tsx      # Individual board display
│   ├── BoardList.tsx       # List of boards
│   └── CreateBoardForm.tsx # Board creation form
├── tasks/
│   ├── TaskCard.tsx        # Individual task display
│   ├── TaskList.tsx        # List of tasks by status
│   └── CreateTaskForm.tsx  # Task creation form
└── ui/
    ├── Button.tsx          # Reusable button
    ├── Input.tsx           # Reusable input
    └── Card.tsx            # Reusable card container
```

### State Management

**Decision: React State + Server State**

- **Local state**: For UI state (modals, forms, loading)
- **Server state**: Source of truth in database
- **No global state management**: Not needed for this scope
- **Optimistic updates**: Update UI immediately, rollback on error

### Routing Strategy

- **File-based routing**: Leveraging Next.js App Router
- **Dynamic routes**: `/board/[id]` for board details
- **API routes**: Co-located with pages for clarity

## What Would I Change?

### With More Time

1. **Add Prisma migrations**: Proper migration files instead of `prisma push`
2. **Implement caching**: Redis or in-memory cache for frequently accessed data
3. **Add authentication**: User accounts and board ownership
4. **Websockets**: Real-time updates across browsers
5. **Better error handling**: Toast notifications, retry logic
6. **Comprehensive testing**: Unit, integration, and E2E tests

### Current Problems

1. **No pagination**: Board and task lists could get very long
2. **No search**: Hard to find specific boards or tasks
3. **Basic validation**: Could be more robust on both client and server
4. **No optimistic updates**: Page refreshes for some operations
5. **Simple UI**: Functional but not polished

### Production Differences

1. **Database**: PostgreSQL or MySQL instead of SQLite
2. **Authentication**: NextAuth.js or similar
3. **Rate limiting**: Prevent API abuse
4. **Monitoring**: Error tracking (Sentry), analytics
5. **CI/CD**: Automated testing and deployment
6. **Environment variables**: Proper secret management
7. **Data validation**: Zod schemas for runtime validation
8. **API versioning**: Support for backward compatibility
9. **Internationalization**: Multi-language support
10. **Accessibility**: ARIA labels, keyboard navigation

## Performance Considerations

### Current Optimizations
- Server Components for initial page load
- Dynamic imports for code splitting
- Tailwind CSS for minimal CSS bundle

### Future Optimizations
- Image optimization with next/image
- API response caching
- Database query optimization
- Client-side data caching with SWR or React Query
- Bundle size analysis and optimization

## Security Considerations

### Current Implementation
- Input validation on API routes
- SQL injection prevention via Prisma
- XSS prevention via React

### Production Requirements
- CSRF protection
- Rate limiting
- Input sanitization
- Authentication and authorization
- HTTPS enforcement
- Security headers
- Regular dependency updates