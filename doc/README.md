# Task Board System

A full-stack task management application built with Next.js, TypeScript, and Prisma.

## Requirements

- Node.js 18 or higher
- npm or yarn package manager

## Tech Stack

- **Frontend**: Next.js 14+ with App Router, React 18+, TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite (for development)
- **ORM**: Prisma
- **Styling**: Tailwind CSS

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features

- **Dashboard**: View all boards in a card/list layout
- **Board Management**: Create, view, and delete boards
- **Task Management**: Create, update, and delete tasks within boards
- **Task Status**: Change task status between todo, in_progress, and done
- **Real-time Updates**: Changes appear immediately without page refresh
- **Data Persistence**: All data is saved to database

## Project Structure

```
task-board/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── board/[id]/        # Board detail page
│   └── page.tsx           # Dashboard/Homepage
├── components/            # React components
├── lib/                   # Utilities and database client
├── prisma/                # Database schema and migrations
└── doc/                   # Documentation
```

## API Endpoints

### Boards
- `GET /api/boards` - Get all boards
- `POST /api/boards` - Create a new board
- `GET /api/boards/[id]` - Get a board with its tasks
- `DELETE /api/boards/[id]` - Delete a board

### Tasks
- `GET /api/tasks?boardId=[id]` - Get tasks for a board
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

## Development

To run in development mode with hot-reload:
```bash
npm run dev
```

To build for production:
```bash
npm run build
npm start
```

## Database Management

View database with Prisma Studio:
```bash
npx prisma studio
```

Run migrations:
```bash
npx prisma migrate dev
```

## License

MIT