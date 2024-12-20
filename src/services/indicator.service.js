import { SMA, RSI, MACD } from 'technicalindicators';
import { CONFIG } from '../config.js';

class IndicatorService {
    calculateMA(prices) {
        const ma = new SMA({
            period: CONFIG.TECHNICAL_INDICATORS.MA.period,
            values: prices
        });
        return ma.getResult();
    }

    calculateRSI(prices) {
        const rsi = new RSI({
            period: CONFIG.TECHNICAL_INDICATORS.RSI.period,
            values: prices
        });
        return rsi.getResult();
    }

    calculateMACD(prices) {
        const macd = new MACD({
            fastPeriod: CONFIG.TECHNICAL_INDICATORS.MACD.fastPeriod,
            slowPeriod: CONFIG.TECHNICAL_INDICATORS.MACD.slowPeriod,
            signalPeriod: CONFIG.TECHNICAL_INDICATORS.MACD.signalPeriod,
            values: prices
        });
        return macd.getResult();
    }

    calculateVolume(volumes) {
        return volumes.map(vol => parseFloat(vol));
    }
}

export const indicatorService = new IndicatorService();