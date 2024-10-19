/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { RefreshTokenUseCase } from '../useCases/refreshTokenUseCase';
import { sendResponse } from '../utils/responseUtils';

const authService = new AuthService();
const refreshTokenUseCase = new RefreshTokenUseCase();

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await authService.registerUser(email, password);
        sendResponse(res, {
            status: 201,
            message: 'User registered successfully',
            data: user,
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'An unknown error occurred';
        sendResponse(res, { status: 500, message: errorMessage });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const tokens = await authService.loginUser(email, password);
        sendResponse(res, {
            status: 200,
            message: 'User logged in successfully',
            data: tokens,
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'An unknown error occurred';
        sendResponse(res, { status: 401, message: errorMessage });
    }
};

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    try {
        const accessToken = await refreshTokenUseCase.execute(refreshToken);
        sendResponse(res, {
            status: 200,
            message: 'Access token refreshed successfully',
            data: { accessToken },
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'An unknown error occurred';
        sendResponse(res, { status: 403, message: errorMessage });
    }
};
