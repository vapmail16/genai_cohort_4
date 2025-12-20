import { describe, it, expect } from '@jest/globals';
import { checkPredefinedResponse, getPredefinedQuestions } from '../services/workflowService.js';

describe('Workflow Service', () => {
  describe('checkPredefinedResponse', () => {
    it('should return response for password reset question', () => {
      const result = checkPredefinedResponse('How do I reset my password?');
      expect(result).toBeDefined();
      expect(result.hasPredefinedResponse).toBe(true);
      expect(result.response).toContain('password');
    });

    it('should return response for network connection question', () => {
      const result = checkPredefinedResponse('I cannot connect to the network');
      expect(result).toBeDefined();
      expect(result.hasPredefinedResponse).toBe(true);
      expect(result.response).toContain('network');
    });

    it('should return response for email setup question', () => {
      const result = checkPredefinedResponse('How do I set up my email?');
      expect(result).toBeDefined();
      expect(result.hasPredefinedResponse).toBe(true);
    });

    it('should return false for questions not in predefined list', () => {
      const result = checkPredefinedResponse('What is the meaning of life?');
      expect(result).toBeDefined();
      expect(result.hasPredefinedResponse).toBe(false);
    });

    it('should handle case-insensitive matching', () => {
      const result1 = checkPredefinedResponse('HOW DO I RESET MY PASSWORD?');
      const result2 = checkPredefinedResponse('how do i reset my password?');
      expect(result1.hasPredefinedResponse).toBe(true);
      expect(result2.hasPredefinedResponse).toBe(true);
    });

    it('should handle partial matches for common IT issues', () => {
      const result = checkPredefinedResponse('My computer is slow');
      expect(result.hasPredefinedResponse).toBe(true);
    });

    it('should return workflow type when predefined response exists', () => {
      const result = checkPredefinedResponse('How do I reset my password?');
      expect(result.workflowType).toBeDefined();
    });
  });

  describe('getPredefinedQuestions', () => {
    it('should return an array of predefined questions', () => {
      const questions = getPredefinedQuestions();
      expect(Array.isArray(questions)).toBe(true);
      expect(questions.length).toBeGreaterThan(0);
    });

    it('should return questions with text and category', () => {
      const questions = getPredefinedQuestions();
      questions.forEach((q) => {
        expect(q).toHaveProperty('text');
        expect(q).toHaveProperty('category');
        expect(typeof q.text).toBe('string');
        expect(typeof q.category).toBe('string');
      });
    });

    it('should include common IT support categories', () => {
      const questions = getPredefinedQuestions();
      const categories = questions.map((q) => q.category);
      expect(categories).toContain('Account');
      expect(categories).toContain('Network');
    });
  });
});

