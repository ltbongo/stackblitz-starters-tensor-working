import { CONFIG } from '../../config.js';

class SignalGenerator {
    generateSignal(prediction) {
        const [downProb, upProb] = prediction;
        
        // Check confidence threshold
        if (Math.max(downProb, upProb) < CONFIG.TRADING.MIN_CONFIDENCE) {
            return null;
        }

        // Check direction bias
        if (Math.abs(upProb - downProb) < CONFIG.TRADING.MIN_DIRECTION_BIAS) {
            return null;
        }

        return upProb > downProb ? 'LONG' : 'SHORT';
    }
}

export const signalGenerator = new SignalGenerator();