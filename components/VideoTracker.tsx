// components/VideoTracker.tsx

'use client';

import { useEffect, useRef } from 'react';
import { connectCloudinaryAnalytics } from 'cloudinary-video-analytics';

interface Props {
  publicId: string;
  title: string;
}

type AnalyticsInstance = ReturnType<typeof connectCloudinaryAnalytics>;

export default function VideoTracker({ publicId, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const analyticsRef = useRef<AnalyticsInstance | null>(null);
  const activeSession = useRef<boolean>(false);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize the library
    const analytics = connectCloudinaryAnalytics(videoRef.current);
    analyticsRef.current = analytics;

    const startTracking = async () => {
      try {
        analytics.startManualTracking({
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
          publicId: publicId,
          customData: {
            customData1: 'Stop-Guessing-Demo',
            customData2: title,
          },
        });
        activeSession.current = true;
      } catch (err) {
        console.error('Cloudinary Analytics failed to start:', err);
      }
    };

    startTracking();

    return () => {
      // Only call stop if the session was successfully started
      if (analyticsRef.current && activeSession.current) {
        try {
          analyticsRef.current.stopManualTracking();
          activeSession.current = false;
        } catch {
          // Ignore errors during unmount to prevent runtime crashes
        }
      }
    };
  }, [publicId, title]);

  return (
    <div className='relative group max-w-4xl mx-auto overflow-hidden rounded-3xl bg-black shadow-2xl border-12 border-white ring-1 ring-slate-200'>
      <video
        ref={videoRef}
        controls
        playsInline
        className='w-full aspect-video z-0'
        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${publicId}.mp4`}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
