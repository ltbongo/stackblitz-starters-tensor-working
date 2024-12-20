import { SMA } from 'technicalindicators';
import { CONFIG } from '../../config.js';

class MAService {
    calculate(prices) {
        const ma = new SMA({
            period: CONFIG.TECHNICAL_INDICATORS.MA.period,
            values: prices
        });
        return ma.getResult();
    }
}

export const maService = new MAService();