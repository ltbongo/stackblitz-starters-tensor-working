import { CONFIG } from '../../config.js';

class LoggingService {
    logPrediction(index, prediction, price, signal) {
        const [downProb, upProb] = prediction;
        const timestamp = new Date().toISOString();
        
        console.log(
            `[${timestamp}] Record #${index} | ` +
            `Price: $${price.toFixed(2)} | ` +
            `Up: ${(upProb * 100).toFixed(2)}% | ` +
            `Down: ${(downProb * 100).toFixed(2)}% | ` +
            `Signal: ${signal || 'NONE'} | ` +
            `Confidence Threshold: ${(CONFIG.TRADING.MIN_CONFIDENCE * 100).toFixed(2)}%`
        );
    }
}

export const loggingService = new LoggingService();