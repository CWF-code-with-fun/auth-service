// // import express, { NextFunction, Request, Response } from 'express';
// // import createHttpError, { HttpError } from 'http-errors';
// // import logger from './Config/logger';

// // const app = express();

// // // eslint-disable-next-line @typescript-eslint/no-unused-vars
// // app.get('/', (req: Request, res: Response) => {
// //     // const err = createHttpError('500', 'Server');
// //     // throw err;

// //     res.send('Hello World!');
// // });
// // app.post('/users/register', (req: Request, res: Response) => {
// //     const { name, email, password } = req.body;
// //     if (!name || !email || !password) {
// //         const err = createHttpError(400, 'All fields are required');
// //         throw err;
// //     }
// //     res.status(201).json(req.body);
// //     res.send('Hello World!');
// // })

// // // eslint-disable-next-line @typescript-eslint/no-unused-vars
// // app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
// //     logger.error(err.message);
// //     const statusCode = err.statusCode || err.status || 500;
// //     res.status(statusCode).json({
// //         errors: [
// //             {
// //                 type: err.name,
// //                 msg: err.message,
// //                 path: '',
// //                 location: '',
// //             },
// //         ],
// //     });
// // });
// // export default app;

// import express, { NextFunction, Request, Response } from 'express';
// import createHttpError, { HttpError } from 'http-errors';
// import logger from './Config/logger';
// import authRoutes from './routes/auth';
// import { setupSwagger } from './swagger';
// import passport from 'passport';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();

// app.use(express.json());
// app.use(passport.initialize());
// app.use('/auth', authRoutes);

// setupSwagger(app);

// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello World!');
// });

// app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
//     logger.error(err.message);
//     const statusCode = err.statusCode || 500;
//     res.status(statusCode).json({
//         errors: [
//             {
//                 type: err.name,
//                 msg: err.message,
//                 path: '',
//                 location: '',
//             },
//         ],
//     });
// });
// export default app;
import express from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import session from 'express-session';
import passport from '../infrastructure/auth/passportService';
import authRoutes from '../interfaces/routes/authRoutes';
import { setupSwagger } from '../infrastructure/swagger/swagger';
import { errorHandler } from '../interfaces/middleware/errorHandlers';
import userRoutes from '../interfaces/routes/userRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(compression());
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
    }),
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Swagger setup
setupSwagger(app); // Add this line to set up Swagger

// Error handling middleware
app.use(errorHandler);

export default app;
