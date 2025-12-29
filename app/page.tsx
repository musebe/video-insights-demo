// app/page.tsx

import ClientTrackerWrapper from '@/components/ClientTrackerWrapper';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const videoPublicId =
    'samples/analytics-demo/024_Automated_Brand_Review_with_Cloudinary_Moderation';

  return (
    <main className='min-h-screen bg-slate-50 p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        <div className='space-y-4 text-center'>
          <Badge
            variant='outline'
            className='px-4 py-1 border-indigo-200 text-indigo-700 bg-indigo-50'
          >
            Cloudinary Video Analytics Demo
          </Badge>
          <h1 className='text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl'>
            Stop Guessing,{' '}
            <span className='text-indigo-600'>Start Growing</span>
          </h1>
          <p className='text-xl text-slate-500 max-w-2xl mx-auto'>
            Watch the automated brand review demo below. We&apos;re tracking
            engagement to show you exactly where viewers drop off.
          </p>
        </div>

        <ClientTrackerWrapper
          publicId={videoPublicId}
          title='Automated Brand Review'
        />

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 pt-8'>
          <div className='p-6 bg-white rounded-2xl border border-slate-200 shadow-sm'>
            <div className='h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4'>
              <span className='text-indigo-600 font-bold'>1</span>
            </div>
            <h3 className='font-bold text-slate-800'>Watch</h3>
            <p className='text-sm text-slate-600'>
              The library sends real-time heartbeats as you play the video.
            </p>
          </div>
          <div className='p-6 bg-white rounded-2xl border border-slate-200 shadow-sm'>
            <div className='h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4'>
              <span className='text-indigo-600 font-bold'>2</span>
            </div>
            <h3 className='font-bold text-slate-800'>Collect</h3>
            <p className='text-sm text-slate-600'>
              Data like OS, Country, and Watch Time is securely stored.
            </p>
          </div>
          <div className='p-6 bg-white rounded-2xl border border-slate-200 shadow-sm'>
            <div className='h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4'>
              <span className='text-indigo-600 font-bold'>3</span>
            </div>
            <h3 className='font-bold text-slate-800'>Analyze</h3>
            <p className='text-sm text-indigo-800 font-medium'>
              Head to the dashboard to see your growth insights.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
