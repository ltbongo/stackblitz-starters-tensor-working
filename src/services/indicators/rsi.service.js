import { RSI } from 'technicalindicators';
import { CONFIG } from '../../config.js';

class RSIService {
    calculate(prices) {
        const rsi = new RSI({
            period: CONFIG.TECHNICAL_INDICATORS.RSI.period,
            values: prices
        });
        return rsi.getResult();
    }
}

export const rsiService = new RSIService();