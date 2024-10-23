import { Response } from 'express';

interface ResponseData {
    status: number;
    message: string | string[];
    data?: unknown;
    success?: boolean;
    errorCode?: string;
    timestamp?: string;
}

export const sendResponse = (
    res: Response,
    { status, message, data, success, errorCode, timestamp }: ResponseData,
) => {
    res.status(status).json({
        success:
            success !== undefined ? success : status >= 200 && status < 300,
        message,
        data,
        errorCode,
        timestamp: timestamp || new Date().toISOString(),
    });
};
