// lib/cloudinary.ts

export const getCloudinaryAuthHeader = () => {
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiKey || !apiSecret) {
        throw new Error("Missing Cloudinary Credentials");
    }

    // Basic Auth is Base64 encoded 'key:secret'
    return `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;
};