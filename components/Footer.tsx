import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className='border-t bg-slate-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <div className='flex items-center gap-2'>
            <Zap className='w-4 h-4 text-indigo-600' />
            <p className='text-sm text-slate-500 font-medium'>
              © {new Date().getFullYear()} Cloudinary Analytics Demo. Built for
              Content Creators.
            </p>
          </div>
          <div className='flex gap-6 text-sm text-slate-400'>
            <span className='hover:text-indigo-600 cursor-pointer transition-colors'>
              Documentation
            </span>
            <span className='hover:text-indigo-600 cursor-pointer transition-colors'>
              API Reference
            </span>
            <span className='hover:text-indigo-600 cursor-pointer transition-colors'>
              Privacy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
