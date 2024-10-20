// /* eslint-disable @typescript-eslint/no-misused-promises */
// import express, { Request, Response } from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import prisma from '../prismaClient';
// import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils';
// import passport from 'passport';
// import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
// import { sendResponse } from '../utils/responseUtils';

// const router = express.Router();

// interface RegisterRequest extends Request {
//     body: {
//         email: string;
//         password: string;
//     };
// }

// interface LoginRequest extends Request {
//     body: {
//         email: string;
//         password: string;
//     };
// }

// interface TokenRequest extends Request {
//     body: {
//         refreshToken: string;
//     };
// }

// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//             callbackURL: '/auth/google/callback',
//         },
//         async (
//             accessToken: string,
//             refreshToken: string,
//             profile: Profile,
//             done: (error: Error | null, user?: Express.User) => void,
//         ) => {
//             let user = await prisma.user.findUnique({
//                 where: { email: profile?.emails?.[0]?.value },
//             });
//             if (!user) {
//                 user = await prisma.user.create({
//                     data: {
//                         email: profile?.emails?.[0]?.value || '',
//                         password: '',
//                     },
//                 });
//             }
//             done(null, user);
//         },
//     ),
// );

// /**
//  * @swagger
//  * tags:
//  *   name: Auth
//  *   description: Authentication related endpoints
//  */

// /**
//  * @swagger
//  * /auth/register:
//  *   post:
//  *     summary: Register a new user
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: User registered successfully
//  *       400:
//  *         description: Bad request
//  */
// router.post('/register', async (req: RegisterRequest, res: Response) => {
//     const { email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     let user;
//     try {
//         user = await prisma.user.create({
//             data: {
//                 email,
//                 password: hashedPassword,
//             },
//         });
//     } catch (error) {
//         console.error('Error registering user:', error);
//         sendResponse(res, { status: 500, message: 'Internal server error' });
//     }
//     sendResponse(res, { status: 201, message: 'User registered', data: user });
// });

// /**
//  * @swagger
//  * /auth/login:
//  *   post:
//  *     summary: Login a user
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: User logged in successfully
//  *       401:
//  *         description: Invalid credentials
//  */
// router.post('/login', async (req: LoginRequest, res: Response) => {
//     const { email, password } = req.body;
//     try {
//         const user = await prisma.user.findUnique({ where: { email } });
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return sendResponse(res, {
//                 status: 401,
//                 message: 'Invalid credentials',
//             });
//         }
//         const accessToken = generateAccessToken(user.id);
//         const refreshToken = generateRefreshToken(user.id);
//         await prisma.user.update({
//             where: { id: user.id },
//             data: { refreshToken },
//         });
//         sendResponse(res, {
//             status: 200,
//             message: 'User logged in successfully',
//             data: { accessToken, refreshToken },
//         });
//     } catch (error) {
//         sendResponse(res, { status: 500, message: 'Internal Server Error' });
//     }
// });
// /**
//  * @swagger
//  * /auth/token:
//  *   post:
//  *     summary: Refresh access token
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               refreshToken:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Access token refreshed successfully
//  *       401:
//  *         description: Unauthorized
//  *       403:
//  *         description: Forbidden
//  */
// router.post('/token', async (req: TokenRequest, res: Response) => {
//     const { refreshToken } = req.body;
//     try {
//         const user = await prisma.user.findFirst({ where: { refreshToken } });
//         if (!user) {
//             return sendResponse(res, {
//                 status: 403,
//                 message: 'Invalid refresh token',
//             });
//         }
//         const accessToken = generateAccessToken(user.id);
//         sendResponse(res, {
//             status: 200,
//             message: 'Access token refreshed successfully',
//             data: { accessToken },
//         });
//     } catch (error) {
//         sendResponse(res, { status: 500, message: 'Internal Server Error' });
//     }
// });

// router.get(
//     '/google',
//     passport.authenticate('google', {
//         scope: ['profile', 'email'],
//     }) as express.RequestHandler,
// );

// router.get(
//     '/google/callback',
//     passport.authenticate('google', {
//         failureRedirect: '/',
//     }) as express.RequestHandler,
//     async (req: Request, res: Response) => {
//         const user = req.user as { id: number };
//         const accessToken = generateAccessToken(user.id);
//         const refreshToken = generateRefreshToken(user.id);
//         await prisma.user.update({
//             where: { id: user.id },
//             data: { refreshToken },
//         });
//         res.json({ accessToken, refreshToken });
//     },
// );

// export default router;
import express from 'express';
import { register, login, refresh } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/token', refresh);

export default router;
