// routes/userRoutes.ts
import { Router } from 'express';
import { downloadUsers, getUsers, generateHtmlReport } from '../controllers/userController';

const router = Router();

router.get('/download-users', downloadUsers);
router.get('/generate-html-report', generateHtmlReport);
router.get("/", getUsers)

export default router;