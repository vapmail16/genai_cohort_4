import express from 'express';
import { sendMessage, getPredefinedQuestions } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/message', sendMessage);
router.get('/questions', getPredefinedQuestions);

export default router;

