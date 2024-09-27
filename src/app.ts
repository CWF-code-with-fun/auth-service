// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import express, { NextFunction, Request, Response } from 'express';
// import logger from './Config/logger';
// import { HttpError } from 'http-errors';
// import { authenticate } from './middleware/auth';
// import { generateToken } from './utils/token';

// const app: express.Application = express();

// app.use(express.json());

// app.get('/', (req: Request, res: Response) => {
//     res.send('Welcome to Auth service');
// });

// app.post('/login', (req: Request, res: Response) => {
//     const { username, password } = req.body;

//     // Validate user credentials (this is just an example, implement your own logic)
//     if (username === 'user' && password === 'password') {
//         const token = generateToken({
//             id: '1',
//             name: 'string',
//             email: 'string',
//         });
//         return res.json({ token });
//     }

//     res.status(401).json({ message: 'Invalid credentials' });
// });

// app.get('/protected', authenticate, (req: Request, res: Response) => {
//     res.send('This is a protected route');
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
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();

// Use body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use auth routes
app.use('/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
export default app;
