import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatbotRouter from '../routes/chatbot.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chatbot', chatbotRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle port already in use error
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use.`);
    console.error(`\nTo fix this, run one of the following:`);
    console.error(`  1. Free the port: lsof -ti:${PORT} | xargs kill -9`);
    console.error(`  2. Or use the script: chmod +x scripts/free-port.sh && ./scripts/free-port.sh ${PORT}`);
    console.error(`  3. Or change PORT in your .env file to a different port\n`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
    process.exit(1);
  }
});

export default app;

