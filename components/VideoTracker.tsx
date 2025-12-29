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
  const startedRef = useRef(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    let cancelled = false;

    // Create a fresh instance per mount
    const analytics = connectCloudinaryAnalytics(el);
    analyticsRef.current = analytics;

    // One-tick delay helps avoid Strict Mode race issues in dev
    queueMicrotask(() => {
      if (cancelled) return;

      try {
        analytics.startManualTracking({
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDINARY_CLOUD_NAME
            ? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDINARY_CLOUD_NAME
            : (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string),
          publicId,
          customData: {
            customData1: 'Stop-Guessing-Demo',
            customData2: title,
          },
        });

        startedRef.current = true;
      } catch (err) {
        console.error('Cloudinary Analytics failed to start:', err);
        startedRef.current = false;
      }
    });

    return () => {
      cancelled = true;

      if (!startedRef.current) return;
      if (!analyticsRef.current) return;

      try {
        analyticsRef.current.stopManualTracking();
      } catch (err) {
        // Dev-only race errors can show here.
        console.warn('Cloudinary Analytics stop failed:', err);
      } finally {
        startedRef.current = false;
      }
    };
  }, [publicId, title]);

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDINARY_CLOUD_NAME;

  return (
    <div className='relative group max-w-4xl mx-auto overflow-hidden rounded-3xl bg-black shadow-2xl border-12 border-white ring-1 ring-slate-200'>
      <video
        ref={videoRef}
        controls
        playsInline
        className='w-full aspect-video z-0'
        src={`https://res.cloudinary.com/${cloudName}/video/upload/${publicId}.mp4`}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
