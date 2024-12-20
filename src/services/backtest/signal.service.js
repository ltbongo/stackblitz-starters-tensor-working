import { CONFIG } from '../../config.js';

class SignalService {
    generateSignal(prediction) {
        const [downProb, upProb] = prediction;
        const signalStrength = Math.max(downProb, upProb);
        
        // Only generate signals when we have clear directional bias
        if (Math.abs(upProb - downProb) < 0.05) {
            return null;
        }
        
        if (signalStrength > CONFIG.TRADING.MIN_CONFIDENCE) {
            return upProb > downProb ? 'LONG' : 'SHORT';
        }
        
        return null;
    }
}

export const signalService = new SignalService();