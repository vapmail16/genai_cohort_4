import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful IT Support assistant. Your role is to provide clear, accurate, and helpful answers to technical support questions. 
You should:
- Provide step-by-step solutions when possible
- Explain technical concepts in a clear and understandable way
- Ask clarifying questions if needed
- Focus on IT support topics like troubleshooting, system configuration, network issues, software problems, and general technical assistance
- Be professional, friendly, and patient

Always aim to help users resolve their IT issues effectively.`;

export const chatWithOpenAI = async (userMessage) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};

