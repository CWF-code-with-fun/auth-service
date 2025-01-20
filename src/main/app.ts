import express from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import session from 'express-session';
import cors, { CorsOptions } from 'cors'; // Import cors with type definition
import passport from '../infrastructure/auth/passportService';
import authRoutes from '../interfaces/routes/authRoutes';
import { setupSwagger } from '../infrastructure/swagger/swagger';
import userRoutes from '../interfaces/routes/userRoutes';
import uploadRoutes from '../interfaces/routes/uploadRoutes';
import errorHandler from '../interfaces/middleware/errorHandlers';
import videoRoutes from '../interfaces/routes/videoRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(compression());
app.use(express.json());

const corsOptions: CorsOptions = {
    origin: process.env.CLIENT_URL || '*', // Allow requests from the client URL or any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); // Add CORS middleware with options
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET!,
//         resave: false,
//         saveUninitialized: false,
//     }),
// );
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/api', uploadRoutes); // Add the upload route
app.use('/api', videoRoutes); // Add the video route

// Swagger setup
setupSwagger(app); // Add this line to set up Swagger

// Error handling middleware
app.use(errorHandler);

export default app;
