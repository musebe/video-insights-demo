// components/ClientTrackerWrapper.tsx

'use client';

import dynamic from 'next/dynamic';

// We move the dynamic import here, inside a Client Component
const VideoTracker = dynamic(() => import('@/components/VideoTracker'), {
  ssr: false,
  loading: () => (
    <div className='max-w-4xl mx-auto aspect-video bg-slate-200 animate-pulse rounded-xl' />
  ),
});

interface Props {
  publicId: string;
  title: string;
}

export default function ClientTrackerWrapper({ publicId, title }: Props) {
  return <VideoTracker publicId={publicId} title={title} />;
}
