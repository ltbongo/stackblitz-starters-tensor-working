import { Direction, SignalType } from '../types/index.js';
import { CONFIG } from '../config.js';

class LabelService {
    createLabels(klineData, lookAheadPeriods = 1) {
        const labels = [];
        const prices = klineData.map(candle => parseFloat(candle[4])); // Close prices

        // We need to leave room for lookback periods at the start and prediction periods at the end
        for (let i = CONFIG.LOOKBACK_PERIODS; i < prices.length - lookAheadPeriods; i++) {
            const currentPrice = prices[i];
            const futurePrice = prices[i + lookAheadPeriods];
            
            // Calculate price direction
            const priceDirection = this.getPriceDirection(currentPrice, futurePrice);
            
            // Calculate trading signal
            const signal = this.getTradingSignal(
                prices.slice(i - CONFIG.LOOKBACK_PERIODS, i + 1),
                priceDirection
            );

            labels.push({
                direction: priceDirection,
                signal: signal
            });
        }

        return labels;
    }

    getPriceDirection(currentPrice, futurePrice) {
        return futurePrice > currentPrice ? Direction.UP : Direction.DOWN;
    }

    getTradingSignal(priceWindow, direction) {
        // Implement trading signal logic based on price direction and recent price action
        const lastPrice = priceWindow[priceWindow.length - 1];
        const prevPrice = priceWindow[priceWindow.length - 2];
        
        // Basic signal generation logic
        if (direction === Direction.UP && lastPrice > prevPrice) {
            return SignalType.BUY;
        } else if (direction === Direction.DOWN && lastPrice < prevPrice) {
            return SignalType.SELL;
        }
        
        return SignalType.HOLD;
    }

    convertLabelsToTensor(labels) {
        // Convert labels to format expected by TensorFlow
        return labels.map(label => [
            label.direction, // 0 or 1 for direction
            Object.values(SignalType).indexOf(label.signal) / 2 // Normalized signal value (0, 0.5, 1)
        ]);
    }
}

export const labelService = new LabelService();