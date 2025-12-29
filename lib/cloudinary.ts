// lib/cloudinary.ts

export const getCloudinaryAuthHeader = () => {
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiKey || !apiSecret) throw new Error("Missing Cloudinary Credentials");

    return `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;
};
