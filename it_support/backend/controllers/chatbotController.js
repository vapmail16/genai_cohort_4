import { chatWithOpenAI } from '../services/openaiService.js';
import { checkPredefinedResponse, getPredefinedQuestions as getQuestions } from '../services/workflowService.js';

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
    }

    // Check for predefined response first
    const predefinedCheck = checkPredefinedResponse(message);
    
    if (predefinedCheck.hasPredefinedResponse) {
      return res.json({ 
        response: predefinedCheck.response,
        workflowType: predefinedCheck.workflowType,
        isPredefined: true
      });
    }

    // If no predefined response, get response from OpenAI
    const response = await chatWithOpenAI(message);

    res.json({ 
      response,
      isPredefined: false
    });
  } catch (error) {
    console.error('Error in chatbot controller:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
};

export const getPredefinedQuestions = (req, res) => {
  try {
    const questions = getQuestions();
    res.json({ questions });
  } catch (error) {
    console.error('Error getting predefined questions:', error);
    res.status(500).json({ error: 'Failed to get predefined questions' });
  }
};

