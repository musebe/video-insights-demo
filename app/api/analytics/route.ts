// app/api/analytics/route.ts
import { NextResponse } from "next/server";
import { getCloudinaryAuthHeader } from "@/lib/cloudinary";
import { cloudinaryAgent } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIMEOUT_MS = 15_000;
const MAX_RETRIES = 2;

type UndiciRequestInit = RequestInit & {
    dispatcher?: unknown;
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
        return NextResponse.json({ error: "Public ID is required" }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
        return NextResponse.json(
            { error: "Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME" },
            { status: 500 }
        );
    }

    let authHeader: string;
    try {
        authHeader = getCloudinaryAuthHeader();
    } catch (err: unknown) {
        return NextResponse.json(
            { error: "Missing Cloudinary credentials", details: toErrorMessage(err) },
            { status: 500 }
        );
    }

    const expression = `video_public_id=${publicId}`;
    const url =
        `https://api.cloudinary.com/v1_1/${cloudName}/video/analytics/views` +
        `?expression=${encodeURIComponent(expression)}` +
        `&max_results=50&sort_by=-view_ended_at`;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        try {
            const res = await fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        Authorization: authHeader,
                        Accept: "application/json",
                    },
                    signal: controller.signal,
                    cache: "no-store",
                    dispatcher: cloudinaryAgent,
                } as UndiciRequestInit
            );

            clearTimeout(timeoutId);

            const bodyText = await res.text();

            if (!res.ok) {
                console.error("Cloudinary API error:", {
                    status: res.status,
                    body: bodyText,
                });

                return NextResponse.json(
                    {
                        error: "Cloudinary API error",
                        status: res.status,
                        body: safeJson(bodyText),
                    },
                    { status: res.status }
                );
            }

            return new NextResponse(bodyText, {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (err: unknown) {
            clearTimeout(timeoutId);

            const details = getFetchErrorDetails(err);
            const msg = toErrorMessage(err);

            const isConnectTimeout =
                details.causeCode === "UND_ERR_CONNECT_TIMEOUT";

            console.error("Fetch failed:", {
                attempt,
                message: msg,
                details,
            });

            if (isConnectTimeout && attempt < MAX_RETRIES) {
                await sleep(backoffMs(attempt));
                continue;
            }

            return NextResponse.json(
                {
                    error: "Fetch failed",
                    details: { message: msg, ...details },
                },
                { status: 502 }
            );
        }
    }

    return NextResponse.json({ error: "Unknown failure" }, { status: 502 });
}

function safeJson(text: string): unknown {
    try {
        return JSON.parse(text) as unknown;
    } catch {
        return text;
    }
}

function toErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return "Unknown error";
}

function getFetchErrorDetails(err: unknown): {
    name?: string;
    code?: string;
    causeName?: string;
    causeCode?: string;
    causeMessage?: string;
} {
    if (!(err instanceof Error)) return {};

    const out: {
        name?: string;
        code?: string;
        causeName?: string;
        causeCode?: string;
        causeMessage?: string;
    } = { name: err.name };

    const cause = (err as { cause?: unknown }).cause;
    if (cause instanceof Error) {
        out.causeName = cause.name;
        out.causeMessage = cause.message;

        const c = cause as Error & { code?: string };
        if (typeof c.code === "string") out.causeCode = c.code;
    }

    return out;
}

function sleep(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms));
}

function backoffMs(attempt: number) {
    return 300 * Math.pow(3, attempt);
}
