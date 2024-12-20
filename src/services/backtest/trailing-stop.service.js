import { CONFIG } from '../../config/index.js';

class TrailingStopService {
    updateTrailingStop(position, currentPrice, pnl) {
        const { direction, entryPrice } = position;
        const activationThreshold = entryPrice * (CONFIG.TRADING.TRAILING_STOP.ACTIVATION_PERCENTAGE / 100);
        
        if (pnl > activationThreshold) {
            const newStop = this.calculateNewStop(direction, currentPrice);
            
            if (this.shouldUpdateStop(position, newStop)) {
                position.trailingStop = newStop;
            }
        }
    }

    calculateNewStop(direction, currentPrice) {
        return direction === 'LONG' ?
            currentPrice * (1 - CONFIG.TRADING.TRAILING_STOP.TRAILING_PERCENTAGE / 100) :
            currentPrice * (1 + CONFIG.TRADING.TRAILING_STOP.TRAILING_PERCENTAGE / 100);
    }

    shouldUpdateStop(position, newStop) {
        return !position.trailingStop || 
            (position.direction === 'LONG' && newStop > position.trailingStop) ||
            (position.direction === 'SHORT' && newStop < position.trailingStop);
    }
}

export const trailingStopService = new TrailingStopService();