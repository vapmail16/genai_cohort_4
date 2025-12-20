import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chatbot from '../src/components/Chatbot';

// Mock fetch
global.fetch = vi.fn();

describe('Chatbot Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should render chatbot button initially', () => {
    render(<Chatbot />);
    const button = screen.getByRole('button', { name: /chat/i });
    expect(button).toBeInTheDocument();
  });

  it('should open chatbot window when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Chatbot />);
    
    const button = screen.getByRole('button', { name: /chat/i });
    await user.click(button);

    expect(screen.getByText(/it support chatbot/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
  });

  it('should send message and display response', async () => {
    const user = userEvent.setup();
    const mockResponse = { response: 'To reset your password, go to account settings.' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<Chatbot />);
    
    // Open chatbot
    const openButton = screen.getByRole('button', { name: /chat/i });
    await user.click(openButton);

    // Type message
    const input = screen.getByPlaceholderText(/type your message/i);
    await user.type(input, 'How do I reset my password?');

    // Send message
    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);

    // Check API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/chatbot/message',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'How do I reset my password?' }),
        })
      );
    });

    // Check response displayed
    await waitFor(() => {
      expect(screen.getByText(mockResponse.response)).toBeInTheDocument();
    });
  });

  it('should display error message when API call fails', async () => {
    const user = userEvent.setup();
    
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<Chatbot />);
    
    // Open chatbot
    const openButton = screen.getByRole('button', { name: /chat/i });
    await user.click(openButton);

    // Type and send message
    const input = screen.getByPlaceholderText(/type your message/i);
    await user.type(input, 'Test question');
    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);

    // Check error message
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should close chatbot when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<Chatbot />);
    
    // Open chatbot
    const openButton = screen.getByRole('button', { name: /chat/i });
    await user.click(openButton);

    expect(screen.getByText(/it support chatbot/i)).toBeInTheDocument();

    // Close chatbot
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    // Chatbot window should be closed
    await waitFor(() => {
      expect(screen.queryByText(/it support chatbot/i)).not.toBeInTheDocument();
    });
  });

  it('should not send empty message', async () => {
    const user = userEvent.setup();
    render(<Chatbot />);
    
    // Open chatbot
    const openButton = screen.getByRole('button', { name: /chat/i });
    await user.click(openButton);

    // Try to send empty message
    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);

    // Should not call API
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should display predefined questions when chatbot opens', async () => {
    const mockQuestions = {
      questions: [
        { text: 'How do I reset my password?', category: 'Account' },
        { text: 'I cannot connect to the network', category: 'Network' },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockQuestions,
    });

    const user = userEvent.setup();
    render(<Chatbot />);

    // Open chatbot
    const openButton = screen.getByRole('button', { name: /chat/i });
    await user.click(openButton);

    // Wait for predefined questions to load
    await waitFor(() => {
      expect(screen.getByText('How do I reset my password?')).toBeInTheDocument();
      expect(screen.getByText('I cannot connect to the network')).toBeInTheDocument();
    });
  });

  it('should send predefined question when clicked', async () => {
    const mockQuestions = {
      questions: [
        { text: 'How do I reset my password?', category: 'Account' },
      ],
    };

    const mockResponse = {
      response: 'To reset your password...',
      isPredefined: true,
    };

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuestions,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

    const user = userEvent.setup();
    render(<Chatbot />);

    // Open chatbot
    const openButton = screen.getByRole('button', { name: /chat/i });
    await user.click(openButton);

    // Wait for questions to load and click one
    await waitFor(() => {
      expect(screen.getByText('How do I reset my password?')).toBeInTheDocument();
    });

    const questionButton = screen.getByText('How do I reset my password?');
    await user.click(questionButton);

    // Check that message was sent
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/chatbot/message',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ message: 'How do I reset my password?' }),
        })
      );
    });
  });

  it('should hide predefined questions after sending a message', async () => {
    const mockQuestions = {
      questions: [
        { text: 'How do I reset my password?', category: 'Account' },
      ],
    };

    const mockResponse = {
      response: 'To reset your password...',
      isPredefined: true,
    };

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuestions,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

    const user = userEvent.setup();
    render(<Chatbot />);

    // Open chatbot
    const openButton = screen.getByRole('button', { name: /chat/i });
    await user.click(openButton);

    // Wait for questions to load
    await waitFor(() => {
      expect(screen.getByText('How do I reset my password?')).toBeInTheDocument();
    });

    // Click a question
    const questionButton = screen.getByText('How do I reset my password?');
    await user.click(questionButton);

    // Questions should be hidden after sending
    await waitFor(() => {
      expect(screen.queryByText('How do I reset my password?')).not.toBeInTheDocument();
    });
  });
});

