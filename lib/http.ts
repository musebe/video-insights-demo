// lib/http.ts
import { Agent } from "undici";

export const cloudinaryAgent = new Agent({
    keepAliveTimeout: 10_000,
    keepAliveMaxTimeout: 10_000,
});
