// app/api/analytics/route.ts

import { NextResponse } from 'next/server';
import { getCloudinaryAuthHeader } from '@/lib/cloudinary';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
        return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/video/analytics/views?expression=video_public_id=${publicId}`;

    // Next.js 16: Use AbortController to manage connection hangs
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s limit

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': getCloudinaryAuthHeader(),
                'Accept': 'application/json',
            },
            signal: controller.signal,
            next: { revalidate: 60 } // Cache for 1 minute
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return NextResponse.json({ error: 'Cloudinary API unreachable' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch {
        clearTimeout(timeoutId);
        return NextResponse.json(
            { error: 'Connection Timeout. Check your network or VPN.' },
            { status: 504 }
        );
    }
}