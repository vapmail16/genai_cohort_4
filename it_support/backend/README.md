# IT Support Backend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following content:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=5001
NODE_ENV=development
```

**Note:** Port 5000 is often used by macOS ControlCenter. We use 5001 by default to avoid conflicts.

3. Replace `your_openai_api_key_here` with your actual OpenAI API key.

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5001` (or the port specified in your `.env` file)

## Running Tests

```bash
npm test
```

## API Endpoints

### POST /api/chatbot/message
Send a message to the IT Support chatbot.

**Base URL:** `http://localhost:5001` (or your configured port)

**Request Body:**
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

