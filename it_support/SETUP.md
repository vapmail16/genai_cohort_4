# IT Support Chatbot Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

## Backend Setup

1. Navigate to the backend directory:
```bash
cd it_support/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory:
```bash
touch .env
```

4. Add the following to the `.env` file:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=5001
NODE_ENV=development
```

**Note:** Port 5000 is often used by macOS system processes. We use 5001 by default to avoid conflicts.

5. Replace `your_openai_api_key_here` with your actual OpenAI API key.

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5001` (or the port specified in your `.env` file)

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd it_support/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Running Tests

### Backend Tests
```bash
cd it_support/backend
npm test
```

### Frontend Tests
```bash
cd it_support/frontend
npm test
```

## Usage

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Click the chat button (💬) in the bottom right corner
4. Start asking IT support questions!

## API Endpoint

The chatbot API endpoint is available at:
- **POST** `http://localhost:5001/api/chatbot/message` (or your configured port)

**Request:**
```json
{
  "message": "How do I reset my password?"
}
```

**Response:**
```json
{
  "response": "To reset your password, you can use the password reset feature..."
}
```

