import { MACD } from 'technicalindicators';
import { CONFIG } from '../../config.js';

class MACDService {
    calculate(prices) {
        const macd = new MACD({
            fastPeriod: CONFIG.TECHNICAL_INDICATORS.MACD.fastPeriod,
            slowPeriod: CONFIG.TECHNICAL_INDICATORS.MACD.slowPeriod,
            signalPeriod: CONFIG.TECHNICAL_INDICATORS.MACD.signalPeriod,
            values: prices
        });
        return macd.getResult();
    }
}

export const macdService = new MACDService();