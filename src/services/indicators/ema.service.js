import { EMA } from 'technicalindicators';
import { CONFIG } from '../../config.js';

class EMAService {
    calculate(prices) {
        return CONFIG.TECHNICAL_INDICATORS.EMA.periods.map(period => {
            const ema = new EMA({
                period,
                values: prices
            });
            return ema.getResult();
        });
    }

    calculateCrossovers(emaData) {
        const crossovers = [];
        for (let i = 1; i < emaData[0].length; i++) {
            const shortEMA = emaData[0][i];
            const longEMA = emaData[2][i];
            const prevShortEMA = emaData[0][i - 1];
            const prevLongEMA = emaData[2][i - 1];

            if (prevShortEMA <= prevLongEMA && shortEMA > longEMA) {
                crossovers.push(1); // Bullish crossover
            } else if (prevShortEMA >= prevLongEMA && shortEMA < longEMA) {
                crossovers.push(-1); // Bearish crossover
            } else {
                crossovers.push(0); // No crossover
            }
        }
        return crossovers;
    }
}

export const emaService = new EMAService();