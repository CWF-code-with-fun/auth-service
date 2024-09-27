declare module 'express-serve-static-core' {
    interface Request {
        user?: unknown; // Add your custom properties here
        headers: {
            authorization?: string; // Add custom headers here
            [key: string]: unknown; // Allow other headers as well
        };
    }
}
