import React, { useState, useRef, useEffect } from 'react';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [predefinedQuestions, setPredefinedQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(true);
  const messagesEndRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/chatbot/message';
  const QUESTIONS_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/chatbot/questions';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load predefined questions when chatbot opens
  useEffect(() => {
    if (isOpen && predefinedQuestions.length === 0) {
      fetch(QUESTIONS_URL)
        .then((res) => res.json())
        .then((data) => {
          setPredefinedQuestions(data.questions || []);
        })
        .catch((error) => {
          console.error('Error loading predefined questions:', error);
        });
    }
  }, [isOpen, QUESTIONS_URL, predefinedQuestions.length]);

  const handlePredefinedQuestion = (questionText) => {
    setInput(questionText);
    // Don't hide questions immediately - let user see the question being sent
    // Questions will be hidden when message is sent
    // Automatically send the question
    handleSendMessage(null, questionText);
  };

  const handleSendMessage = async (e, questionText = null) => {
    if (e) {
      e.preventDefault();
    }
    
    const messageToSend = questionText || input.trim();
    if (!messageToSend || isLoading) return;

    const userMessage = messageToSend.trim();
    setInput('');
    setShowQuestions(false);
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        className="chatbot-toggle"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            // Reset when opening
            setShowQuestions(true);
          }
        }}
        aria-label="Toggle chatbot"
      >
        💬
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>IT Support Chatbot</h3>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.length === 0 && showQuestions && predefinedQuestions.length > 0 && (
              <div className="chatbot-welcome">
                <p>Hello! I'm your IT Support assistant. How can I help you today?</p>
                <div className="predefined-questions">
                  <p className="questions-label">Common questions:</p>
                  <div className="questions-grid">
                    {predefinedQuestions.map((question, index) => (
                      <button
                        key={index}
                        className="question-button"
                        onClick={() => handlePredefinedQuestion(question.text)}
                        disabled={isLoading}
                      >
                        {question.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {messages.length === 0 && !showQuestions && (
              <div className="chatbot-welcome">
                <p>Hello! I'm your IT Support assistant. How can I help you today?</p>
              </div>
            )}
            {messages.length > 0 && showQuestions && predefinedQuestions.length > 0 && (
              <div className="predefined-questions-inline">
                <div className="questions-header">
                  <p className="questions-label">Common questions:</p>
                  <button
                    className="hide-questions-button"
                    onClick={() => setShowQuestions(false)}
                    aria-label="Hide questions"
                    title="Hide questions"
                  >
                    ×
                  </button>
                </div>
                <div className="questions-grid">
                  {predefinedQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="question-button"
                      onClick={() => handlePredefinedQuestion(question.text)}
                      disabled={isLoading}
                    >
                      {question.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}
              >
                <div className="message-content">{message.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="message message-assistant">
                <div className="message-content">
                  <span className="typing-indicator">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            {messages.length > 0 && !showQuestions && predefinedQuestions.length > 0 && (
              <button
                type="button"
                className="show-questions-button"
                onClick={() => setShowQuestions(true)}
                disabled={isLoading}
                aria-label="Show common questions"
                title="Show common questions"
              >
                📋
              </button>
            )}
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="chatbot-send"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;

