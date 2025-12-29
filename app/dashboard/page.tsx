// app/dashboard/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  Play,
  Clock,
  MapPin,
  AlertCircle,
  RefreshCcw,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CloudinaryView {
  video_public_id: string;
  video_duration: number | null;
  viewer_application_name: string;
  viewer_location_country_code: string;
  viewer_os_identifier: string;
  view_watch_time: number;
  view_ended_at: string;
}

const POLL_MS = 15000; // 15s feels sane

function dedupeAndSort(rows: CloudinaryView[]) {
  const map = new Map<string, CloudinaryView>();

  for (const v of rows) {
    const key = [
      v.video_public_id,
      v.view_ended_at,
      v.viewer_application_name,
      v.viewer_location_country_code,
      v.viewer_os_identifier,
    ].join('|');

    const prev = map.get(key);
    if (!prev || (v.view_watch_time ?? 0) > (prev.view_watch_time ?? 0)) {
      map.set(key, v);
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => +new Date(b.view_ended_at) - +new Date(a.view_ended_at)
  );
}

function toStatus(err: unknown): number {
  if (err instanceof Error) {
    const n = Number(err.message);
    if (Number.isFinite(n)) return n;
  }
  return 502;
}

export default function AnalyticsDashboard() {
  const [rows, setRows] = useState<CloudinaryView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<number | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const inFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const publicId =
    'samples/analytics-demo/024_Automated_Brand_Review_with_Cloudinary_Moderation';

  const fetchAnalytics = useCallback(async () => {
    if (isDemo) return;

    // Prevent overlap
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    // Abort any previous request just in case
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    try {
      const res = await fetch(
        `/api/analytics?publicId=${encodeURIComponent(publicId)}`,
        {
          cache: 'no-store',
          signal: controller.signal,
        }
      );

      if (!res.ok) {
        setRows([]);
        setError(res.status);
        return;
      }

      const json: unknown = await res.json();
      const data = (json as { data?: CloudinaryView[] }).data;

      setRows(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: unknown) {
      // If we aborted, ignore.
      if (err instanceof DOMException && err.name === 'AbortError') return;

      setRows([]);
      setError(toStatus(err));
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }, [publicId, isDemo]);

  // Initial fetch (dev Strict Mode safe)
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Polling with no overlap
  useEffect(() => {
    if (isDemo) return;

    const id = window.setInterval(() => {
      fetchAnalytics();
    }, POLL_MS);

    return () => window.clearInterval(id);
  }, [fetchAnalytics, isDemo]);

  const data = useMemo(() => dedupeAndSort(rows), [rows]);

  const avgWatch = useMemo(() => {
    if (!data.length) return 0;
    const total = data.reduce((s, v) => s + (v.view_watch_time || 0), 0);
    return Math.round(total / data.length);
  }, [data]);

  const countries = useMemo(() => {
    return new Set(
      data.map((v) => v.viewer_location_country_code).filter(Boolean)
    ).size;
  }, [data]);

  if (loading && !rows.length && !error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-slate-50'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4' />
        <p className='text-slate-500 font-medium'>Loading analytics...</p>
      </div>
    );
  }

  if (error && !rows.length) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-slate-50 p-6'>
        <Card className='max-w-md w-full p-6 text-center shadow-lg'>
          <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
          <h2 className='text-xl font-bold mb-2'>Analytics Error</h2>
          <p className='text-sm text-slate-500 mb-6'>
            Could not load analytics. Status: {error}.
          </p>

          <div className='flex gap-2'>
            <Button
              onClick={() => fetchAnalytics()}
              variant='outline'
              className='flex-1'
            >
              <RefreshCcw className='w-4 h-4 mr-2' />
              Retry
            </Button>

            <Button
              onClick={() => {
                // Demo off for now. Keep your MOCK_DATA if you want.
                setIsDemo(true);
                setError(null);
              }}
              className='flex-1 bg-indigo-600 hover:bg-indigo-700'
            >
              Demo
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <main className='p-6 md:p-12 bg-slate-50 min-h-screen space-y-8'>
      <header className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-black text-slate-900 tracking-tight'>
            Video Analytics
          </h1>
          <p className='text-slate-500'>Updates every {POLL_MS / 1000}s.</p>
          {error ? (
            <p className='text-sm text-red-600'>
              Last refresh failed: {error}.
            </p>
          ) : null}
        </div>

        <div className='flex items-center gap-2'>
          <Badge
            className={
              isDemo
                ? 'bg-amber-100 text-amber-700'
                : 'bg-green-100 text-green-700'
            }
          >
            {isDemo ? 'Demo Mode' : 'Live Feed'}
          </Badge>

          <Button
            onClick={() => fetchAnalytics()}
            variant='outline'
            size='sm'
            disabled={inFlightRef.current}
          >
            <RefreshCcw className='w-4 h-4 mr-2' />
            Refresh
          </Button>
        </div>
      </header>

      <Card className='bg-indigo-600 text-white border-none shadow-xl'>
        <CardHeader className='flex flex-row items-center space-x-4'>
          <Zap className='w-8 h-8 fill-amber-400 text-amber-400' />
          <div>
            <CardTitle>Watch Quality</CardTitle>
            <CardDescription className='text-indigo-100'>
              {avgWatch < 30
                ? 'High drop-off. Put your key message in the first 3 seconds.'
                : 'Good engagement. Keep this style and pacing.'}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <StatCard title='Total Views' value={data.length} icon={<Play />} />
        <StatCard title='Avg Watch' value={`${avgWatch}s`} icon={<Clock />} />
        <StatCard title='Countries' value={countries} icon={<MapPin />} />
      </div>

      <Card className='border-none shadow-sm'>
        <CardHeader>
          <CardTitle>Engagement Timeline</CardTitle>
        </CardHeader>

        <CardContent className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={data
                .slice()
                .reverse()
                .map((v, i) => ({
                  n: i,
                  s: v.view_watch_time || 0,
                  t: new Date(v.view_ended_at).toLocaleString(),
                }))}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='n' hide />
              <Tooltip
                formatter={(value: unknown, _name: unknown, item: unknown) => {
                  const payload =
                    typeof item === 'object' &&
                    item !== null &&
                    'payload' in item
                      ? (item as { payload?: { t?: string } }).payload
                      : undefined;

                  const label = payload?.t ?? '';
                  const num = typeof value === 'number' ? value : Number(value);

                  return [Number.isFinite(num) ? num : 0, label];
                }}
              />
              <Area
                type='monotone'
                dataKey='s'
                stroke='#4f46e5'
                fill='#818cf8'
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card className='p-6 flex flex-col items-center border-none shadow-sm'>
      <div className='text-indigo-500 mb-2'>{icon}</div>
      <span className='text-sm font-bold text-slate-400 uppercase'>
        {title}
      </span>
      <span className='text-3xl font-black'>{value}</span>
    </Card>
  );
}
