// types/cloudinary-video-analytics.d.ts

declare module 'cloudinary-video-analytics' {
    export function connectCloudinaryAnalytics(videoElement: HTMLVideoElement | HTMLAudioElement): {
        startAutoTracking: (options?: {
            cloudName: string;
            publicId: string;
            customData?: {
                customData1?: string;
                customData2?: string;
                customData3?: string;
                customData4?: string;
                customData5?: string;
            };
        }) => void;
        startManualTracking: (options: {
            cloudName: string;
            publicId: string;
            customData?: {
                customData1?: string;
                customData2?: string;
                customData3?: string;
                customData4?: string;
                customData5?: string;
            };
        }) => void;
        stopManualTracking: () => void;
    };
}