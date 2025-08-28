import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Debug environment variables
console.log('Environment check:');
console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
console.log('RESEND_API_KEY starts with re_:', process.env.RESEND_API_KEY?.startsWith('re_'));
console.log('FROM_EMAIL:', process.env.FROM_EMAIL);
console.log('TO_EMAIL:', process.env.TO_EMAIL);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Import API routes
import contactHandler from './api/contact.js';
import subscribeHandler from './api/subscribe.js';

// API routes
app.post('/api/contact', contactHandler);
app.post('/api/subscribe', subscribeHandler);

// Serve static files
app.get('*', (req, res) => {
  const filePath = req.path === '/' ? '/index.html' : req.path;
  res.sendFile(path.join(__dirname, filePath));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});