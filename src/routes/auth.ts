// routes/auth.ts
import express, { Request, Response } from 'express';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth';
import { users, User } from '../models/User';

const router = express.Router();

// Define types for request bodies
interface RegisterRequestBody {
    email: string;
    password: string;
}

interface LoginRequestBody {
    email: string;
    password: string;
}

router.post(
    '/register',
    async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
        const { email, password } = req.body;
        const hashedPassword = await hashPassword(password);

        const newUser: User = {
            id: new Date().toISOString(),
            email,
            password: hashedPassword,
        };
        users.push(newUser);

        res.status(201).json({ message: 'User registered successfully' });
    },
);

router.post(
    '/login',
    async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
        const { email, password } = req.body;
        const user = users.find((u) => u.email === email);

        if (!user || !(await verifyPassword(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        let token: string;
        try {
            token = generateToken(user.id);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json({ token });
    },
);

export default router;
