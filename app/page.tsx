import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <main className="flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Task Board System
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          Organize your projects and tasks with our simple and intuitive task board management system.
        </p>
        <Link href="/dashboard">
          <Button size="lg" variant="primary">
            Go to Dashboard
          </Button>
        </Link>
      </main>
    </div>
  );
}
