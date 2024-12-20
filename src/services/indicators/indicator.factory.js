import { maService } from './ma.service.js';
import { emaService } from './ema.service.js';
import { patternService } from './pattern.service.js';

class IndicatorFactory {
    calculateIndicators(klineData) {
        const prices = this.extractPrices(klineData);

        // Calculate only needed indicators
        const ma = maService.calculate(prices);
        const ema = emaService.calculate(prices);
        const patterns = patternService.identifyPatterns(klineData);

        return {
            ma, ema, patterns
        };
    }

    extractPrices(klineData) {
        return klineData.map(candle => parseFloat(candle[4])); // Close price
    }
}

export const indicatorFactory = new IndicatorFactory();