import Link from 'next/link';
import { LayoutGrid, Settings, Users } from 'lucide-react';

const links = [
  { name: 'All Boards', href: '/dashboard', icon: LayoutGrid, disabled: false },
  { name: 'Team Members', href: '#', icon: Users, disabled: true },
  { name: 'Settings', href: '#', icon: Settings, disabled: true },
];

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-6 md:px-6 bg-white border-r border-zinc-200">
      <Link
        className="mb-8 flex items-center gap-2"
        href="/"
      >
        <div className="w-8 h-8 bg-zinc-900 rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-sm">TB</span>
        </div>
        <h1 className="text-xl font-medium text-zinc-900 font-heading hidden md:block">Task Board</h1>
      </Link>
      <div className="flex grow flex-col">
        <nav className="flex flex-col space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            
            if (link.disabled) {
              return (
                <div
                  key={link.name}
                  className="flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-zinc-400 cursor-default opacity-50 md:justify-start"
                  title="Coming soon"
                >
                  <Icon className="w-4 h-4" />
                  <p className="hidden md:block">{link.name}</p>
                </div>
              );
            }
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer md:justify-start"
              >
                <Icon className="w-4 h-4" />
                <p className="hidden md:block">{link.name}</p>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}