//app/dashboard/page.tsx

'use client';

import { useEffect, useState, useCallback } from 'react';
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

/**
 * Interface for Cloudinary Video Analytics data
 */
interface CloudinaryView {
  video_public_id: string;
  video_duration: number;
  viewer_application_name: string;
  viewer_location_country_code: string;
  viewer_os_identifier: string;
  view_watch_time: number;
  view_ended_at: string;
}

const MOCK_DATA: CloudinaryView[] = [
  {
    video_public_id: 'demo',
    video_duration: 60,
    viewer_application_name: 'Chrome',
    viewer_location_country_code: 'US',
    viewer_os_identifier: 'Mac OS',
    view_watch_time: 48,
    view_ended_at: '2025-12-29',
  },
  {
    video_public_id: 'demo',
    video_duration: 60,
    viewer_application_name: 'Safari',
    viewer_location_country_code: 'GB',
    viewer_os_identifier: 'iOS',
    view_watch_time: 15,
    view_ended_at: '2025-12-29',
  },
  {
    video_public_id: 'demo',
    video_duration: 60,
    viewer_application_name: 'Chrome',
    viewer_location_country_code: 'KE',
    viewer_os_identifier: 'Android',
    view_watch_time: 58,
    view_ended_at: '2025-12-29',
  },
];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<CloudinaryView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<number | null>(null);

  const publicId =
    'samples/analytics-demo/024_Automated_Brand_Review_with_Cloudinary_Moderation';

  const fetchAnalytics = useCallback(
    async (useMock = false) => {
      if (useMock) {
        setData(MOCK_DATA);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `/api/analytics?publicId=${encodeURIComponent(publicId)}`
        );
        if (!res.ok) throw new Error(`${res.status}`);
        const json = await res.json();
        setData(json.data || []);
        setError(null);
      } catch {
        // Replaced unused 'err' with empty catch block for Next.js 16/ESLint standards
        setError(504);
      } finally {
        setLoading(false);
      }
    },
    [publicId]
  );

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading)
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-slate-50'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4' />
        <p className='text-slate-500 font-medium'>
          Connecting to Cloudinary API...
        </p>
      </div>
    );

  if (error === 504)
    return (
      <div className='flex items-center justify-center min-h-screen bg-slate-50 p-6'>
        <Card className='max-w-md w-full p-6 text-center shadow-lg'>
          <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
          <h2 className='text-xl font-bold mb-2'>Network Timeout</h2>
          <p className='text-sm text-slate-500 mb-6'>
            Could not reach Cloudinary analytics. This is often a network
            restriction.
          </p>
          <div className='flex gap-2'>
            <Button
              onClick={() => fetchAnalytics()}
              variant='outline'
              className='flex-1'
            >
              <RefreshCcw className='w-4 h-4 mr-2' /> Retry
            </Button>
            <Button
              onClick={() => fetchAnalytics(true)}
              className='flex-1 bg-indigo-600 hover:bg-indigo-700'
            >
              Preview Demo
            </Button>
          </div>
        </Card>
      </div>
    );

  const avgWatch = Math.round(
    data.reduce((s, v) => s + v.view_watch_time, 0) / (data.length || 1)
  );

  return (
    <main className='p-6 md:p-12 bg-slate-50 min-h-screen space-y-8'>
      <header className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-black text-slate-900 tracking-tight'>
            Stop Guessing, Start Growing
          </h1>
          <p className='text-slate-500'>Video Insights Powered by Cloudinary</p>
        </div>
        <Badge
          className={
            data === MOCK_DATA
              ? 'bg-amber-100 text-amber-700'
              : 'bg-green-100 text-green-700'
          }
        >
          {data === MOCK_DATA ? 'Demo Mode' : 'Live Feed'}
        </Badge>
      </header>

      <Card className='bg-indigo-600 text-white border-none shadow-xl'>
        <CardHeader className='flex flex-row items-center space-x-4'>
          <Zap className='w-8 h-8 fill-amber-400 text-amber-400' />
          <div>
            <CardTitle>Growth Strategy</CardTitle>
            <CardDescription className='text-indigo-100'>
              {avgWatch < 30
                ? 'Retention Alert: High drop-off. Move your branding to the first 3 seconds!'
                : 'Strong Engagement: Your audience is watching! Maintain this content format.'}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <StatCard title='Total Plays' value={data.length} icon={<Play />} />
        <StatCard title='Avg. Watch' value={`${avgWatch}s`} icon={<Clock />} />
        <StatCard
          title='Countries'
          value={
            [...new Set(data.map((v) => v.viewer_location_country_code))].length
          }
          icon={<MapPin />}
        />
      </div>

      <Card className='border-none shadow-sm'>
        <CardHeader>
          <CardTitle>Engagement Timeline</CardTitle>
        </CardHeader>
        <CardContent className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={data.map((v, i) => ({ n: i, s: v.view_watch_time }))}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='n' hide />
              <Tooltip />
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
