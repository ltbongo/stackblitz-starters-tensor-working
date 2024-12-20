import { ADX } from 'technicalindicators';
import { CONFIG } from '../../config.js';

class ADXService {
    calculate(klineData) {
        const high = klineData.map(candle => parseFloat(candle[2]));
        const low = klineData.map(candle => parseFloat(candle[3]));
        const close = klineData.map(candle => parseFloat(candle[4]));

        const adx = new ADX({
            high,
            low,
            close,
            period: CONFIG.TECHNICAL_INDICATORS.ADX.period
        });

        return adx.getResult();
    }
}

export const adxService = new ADXService();