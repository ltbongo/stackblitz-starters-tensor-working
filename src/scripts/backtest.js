import dotenv from 'dotenv';
import { backtestService } from '../services/backtest/backtest.service.js';

// Load environment variables
dotenv.config();

// Run backtest
console.log('Starting backtest...');
backtestService.run().catch(console.error);