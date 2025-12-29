'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Menu, PlayCircle, X, Zap } from 'lucide-react';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems: NavItem[] = useMemo(
    () => [
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
    ],
    []
  );

  // Close menu on route change
  useEffect(() => {
    startTransition(() => {
      setOpen(false);
    });
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <Link href='/' className='flex items-center gap-2'>
          <div className='bg-indigo-600 p-1.5 rounded-lg'>
            <Zap className='w-5 h-5 text-white fill-current' />
          </div>
          <span className='text-xl font-bold tracking-tight text-slate-900'>
            Growthly
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className='hidden md:flex items-center gap-6'>
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

        {/* Mobile button */}
        <button
          type='button'
          className='md:hidden inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50'
          onClick={() => setOpen((v) => !v)}
          aria-label='Toggle menu'
          aria-expanded={open}
        >
          {open ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn('md:hidden border-t bg-white', open ? 'block' : 'hidden')}
      >
        <div className='container mx-auto px-4 py-3'>
          <nav className='flex flex-col gap-2'>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-50',
                  pathname === item.href
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-700'
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
