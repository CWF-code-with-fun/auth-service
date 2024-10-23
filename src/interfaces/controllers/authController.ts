/* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { Request, Response } from 'express';
// import { AuthService } from '../services/authService';
// import { RefreshTokenUseCase } from '../useCases/refreshTokenUseCase';
// import { sendResponse } from '../utils/responseUtils';

// const authService = new AuthService();
// const refreshTokenUseCase = new RefreshTokenUseCase();

// export const register = async (req: Request, res: Response) => {
//     const { email, password } = req.body;
//     try {
//         const user = await authService.registerUser(email, password);
//         sendResponse(res, {
//             status: 201,
//             message: 'User registered successfully',
//             data: user,
//         });
//     } catch (error) {
//         const errorMessage =
//             error instanceof Error
//                 ? error.message
//                 : 'An unknown error occurred';
//         sendResponse(res, { status: 500, message: errorMessage });
//     }
// };

// export const login = async (req: Request, res: Response) => {
//     const { email, password } = req.body;
//     try {
//         const tokens = await authService.loginUser(email, password);
//         sendResponse(res, {
//             status: 200,
//             message: 'User logged in successfully',
//             data: tokens,
//         });
//     } catch (error) {
//         const errorMessage =
//             error instanceof Error
//                 ? error.message
//                 : 'An unknown error occurred';
//         sendResponse(res, { status: 401, message: errorMessage });
//     }
// };

// export const refresh = async (req: Request, res: Response) => {
//     const { refreshToken } = req.body;
//     try {
//         const accessToken = await refreshTokenUseCase.execute(refreshToken);
//         sendResponse(res, {
//             status: 200,
//             message: 'Access token refreshed successfully',
//             data: { accessToken },
//         });
//     } catch (error) {
//         const errorMessage =
//             error instanceof Error
//                 ? error.message
//                 : 'An unknown error occurred';
//         sendResponse(res, { status: 403, message: errorMessage });
//     }
// };
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/responseUtils';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { UserService } from '../../domain/services/UserService';
import { TokenService } from '../../infrastructure/auth/tokenServices';
import { LoginUserUseCase } from '../../application/useCases/LoginUserUseCase';
import { RefreshTokenUseCase } from '../../application/useCases/refreshTokenUseCase';
import { RegisterUserUseCase } from '../../application/useCases/RegisterUserUseCase';
import { NotFoundError } from '../../domain/errors';

const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository);
const tokenService = new TokenService();

const registerUserUseCase = new RegisterUserUseCase();
const loginUserUseCase = new LoginUserUseCase();
const refreshTokenUseCase = new RefreshTokenUseCase();
// const refreshTokenUseCase = new RefreshTokenUseCase(userService, tokenService);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: Internal server error
 */
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { email, password } = req.body;
    try {
        const user = await registerUserUseCase.execute(email, password);
        sendResponse(res, {
            status: 201,
            message: 'User registered successfully',
            data: user,
        });
    } catch (error) {
        // // console.log('error');
        // const errorMessage =
        //     error instanceof Error
        //         ? error.message
        //         : 'An unknown error occurred';
        // sendResponse(res, { status: 500, message: errorMessage });
        next(error);
    }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { email, password } = req.body;
    try {
        const tokens = await loginUserUseCase.execute(email, password);
        sendResponse(res, {
            status: 200,
            message: 'User logged in successfully',
            data: tokens,
        });
    } catch (error) {
        // const errorMessage =
        //     error instanceof Error
        //         ? error.message
        //         : 'An unknown error occurred';
        // sendResponse(res, { status: 401, message: errorMessage });
        next(error);
    }
};
/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       403:
 *         description: Invalid refresh token
 */
export const refresh = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { refreshToken } = req.body;
    try {
        const accessToken = await refreshTokenUseCase.execute(refreshToken);
        sendResponse(res, {
            status: 200,
            message: 'Access token refreshed successfully',
            data: { accessToken },
        });
    } catch (error) {
        // const errorMessage =
        //     error instanceof Error
        //         ? error.message
        //         : 'An unknown error occurred';
        // sendResponse(res, { status: 403, message: errorMessage });
        next(error);
    }
};

/**
 * @swagger
 * /auth/test-error:
 *   get:
 *     summary: Test endpoint to throw NotFoundError
 *     tags: [Auth]
 *     responses:
 *       404:
 *         description: NotFoundError thrown
 */
export const test = async (req: Request, res: Response, next: NextFunction) => {
    try {
        throw new NotFoundError('Test NotFoundError');
    } catch (error) {
        next(error);
    }
};
