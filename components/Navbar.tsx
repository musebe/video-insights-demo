'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, PlayCircle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Watch & Track',
      href: '/',
      icon: <PlayCircle className='w-4 h-4' />,
    },
    {
      name: 'Creator Dashboard',
      href: '/dashboard',
      icon: <BarChart3 className='w-4 h-4' />,
    },
  ];

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <div className='flex items-center gap-2'>
          <div className='bg-indigo-600 p-1.5 rounded-lg'>
            <Zap className='w-5 h-5 text-white fill-current' />
          </div>
          <span className='text-xl font-bold tracking-tight text-slate-900'>
            Growthly
          </span>
        </div>

        <nav className='flex items-center gap-6'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors hover:text-indigo-600',
                pathname === item.href ? 'text-indigo-600' : 'text-slate-500'
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
