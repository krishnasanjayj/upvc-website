import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/db';
import { login, verifyToken } from './controllers/authController';
import { createInquiry, getInquiries, updateInquiryStatus, deleteInquiry } from './controllers/inquiriesController';
import { createQuote, getQuotes, updateQuoteStatus, deleteQuote, exportLeadsToExcel } from './controllers/quotesController';
import { getConfigs, updateConfig } from './controllers/configController';
import { authenticateToken } from './middleware/auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- ROUTES ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Auth Routes
app.post('/api/auth/login', login);
app.get('/api/auth/verify', authenticateToken, verifyToken);

// Inquiries Routes
app.post('/api/inquiries', createInquiry); // Public submission
app.get('/api/inquiries', authenticateToken, getInquiries); // Admin view
app.patch('/api/inquiries/:id/status', authenticateToken, updateInquiryStatus); // Admin update
app.delete('/api/inquiries/:id', authenticateToken, deleteInquiry); // Admin delete

// Quotes Routes
app.post('/api/quotes', createQuote); // Public calculator submission
app.get('/api/quotes/export', authenticateToken, exportLeadsToExcel); // Admin Excel export
app.get('/api/quotes', authenticateToken, getQuotes); // Admin view
app.patch('/api/quotes/:id/status', authenticateToken, updateQuoteStatus); // Admin update
app.delete('/api/quotes/:id', authenticateToken, deleteQuote); // Admin delete

// Config / Pricing Config Routes
app.get('/api/config', getConfigs); // Public (Frontend fetches configs for calculations)
app.put('/api/config', authenticateToken, updateConfig); // Admin update

// --- STARTUP ---
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(` uPVC Doors & Windows Backend Running on Port ${PORT}`);
      console.log(` Local Environment Active - Ready for Connections `);
      console.log(`==================================================`);
    });
  } catch (err) {
    console.error('Failed to start the Express server:', err);
    process.exit(1);
  }
}

startServer();
