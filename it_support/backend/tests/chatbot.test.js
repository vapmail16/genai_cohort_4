import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

// Mock OpenAI module
const mockCreateChatCompletion = jest.fn();
const mockOpenAI = jest.fn().mockImplementation(() => ({
  chat: {
    completions: {
      create: mockCreateChatCompletion,
    },
  },
}));

jest.unstable_mockModule('openai', () => ({
  default: mockOpenAI,
}));

// Import router after mocking
const chatbotRouter = (await import('../routes/chatbot.js')).default;

describe('Chatbot API', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/chatbot', chatbotRouter);
    mockCreateChatCompletion.mockClear();
  });

  describe('POST /api/chatbot/message', () => {
    it('should return a response from OpenAI for IT support questions', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'To reset your password, you can use the password reset feature in your account settings.',
            },
          },
        ],
      };

      mockCreateChatCompletion.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/chatbot/message')
        .send({ message: 'How do I reset my password?' })
        .expect(200);

      expect(response.body).toHaveProperty('response');
      expect(response.body.response).toBe(mockResponse.choices[0].message.content);
      expect(mockCreateChatCompletion).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-3.5-turbo',
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'system',
              content: expect.stringContaining('IT Support'),
            }),
            expect.objectContaining({
              role: 'user',
              content: 'How do I reset my password?',
            }),
          ]),
        })
      );
    });

    it('should handle empty message', async () => {
      const response = await request(app)
        .post('/api/chatbot/message')
        .send({ message: '' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle missing message field', async () => {
      const response = await request(app)
        .post('/api/chatbot/message')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle OpenAI API errors', async () => {
      mockCreateChatCompletion.mockRejectedValue(new Error('API Error'));

      const response = await request(app)
        .post('/api/chatbot/message')
        .send({ message: 'Test question' })
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    it('should include IT support context in system message', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Test response' } }],
      };
      mockCreateChatCompletion.mockResolvedValue(mockResponse);

      await request(app)
        .post('/api/chatbot/message')
        .send({ message: 'What is a firewall?' })
        .expect(200);

      const callArgs = mockCreateChatCompletion.mock.calls[0][0];
      const systemMessage = callArgs.messages.find((msg) => msg.role === 'system');
      expect(systemMessage.content).toContain('IT Support');
      expect(systemMessage.content).toContain('technical support');
    });
  });
});

