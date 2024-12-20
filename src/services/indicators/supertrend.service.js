import { CONFIG } from '../../config.js';

class SupertrendService {
    calculate(klineData) {
        const { period, multiplier } = CONFIG.TECHNICAL_INDICATORS.SUPERTREND;
        const supertrend = [];
        
        const high = klineData.map(candle => parseFloat(candle[2]));
        const low = klineData.map(candle => parseFloat(candle[3]));
        const close = klineData.map(candle => parseFloat(candle[4]));
        
        // Calculate True Range
        const tr = this.calculateTrueRange(high, low, close);
        
        // Calculate ATR
        const atr = this.calculateATR(tr, period);
        
        // Calculate Supertrend
        let upTrend = [];
        let downTrend = [];
        let trend = [];
        
        for (let i = period; i < klineData.length; i++) {
            const basicUpperBand = (high[i] + low[i]) / 2 + multiplier * atr[i];
            const basicLowerBand = (high[i] + low[i]) / 2 - multiplier * atr[i];
            
            upTrend[i] = (i > period) ? 
                (basicUpperBand < upTrend[i-1] || close[i-1] > upTrend[i-1]) ? 
                    basicUpperBand : upTrend[i-1] : basicUpperBand;
                    
            downTrend[i] = (i > period) ? 
                (basicLowerBand > downTrend[i-1] || close[i-1] < downTrend[i-1]) ? 
                    basicLowerBand : downTrend[i-1] : basicLowerBand;
            
            trend[i] = (i > period) ? 
                (close[i] <= downTrend[i] ? -1 : 
                 close[i] >= upTrend[i] ? 1 : trend[i-1]) : 0;
                 
            supertrend.push({
                upperBand: upTrend[i],
                lowerBand: downTrend[i],
                trend: trend[i]
            });
        }
        
        return supertrend;
    }

    calculateTrueRange(high, low, close) {
        const tr = [];
        tr[0] = high[0] - low[0];
        
        for (let i = 1; i < high.length; i++) {
            tr[i] = Math.max(
                high[i] - low[i],
                Math.abs(high[i] - close[i-1]),
                Math.abs(low[i] - close[i-1])
            );
        }
        
        return tr;
    }

    calculateATR(tr, period) {
        const atr = [];
        let sum = 0;
        
        // Initial ATR
        for (let i = 0; i < period; i++) {
            sum += tr[i];
            atr[i] = sum / (i + 1);
        }
        
        // Subsequent ATR values
        for (let i = period; i < tr.length; i++) {
            atr[i] = (atr[i-1] * (period - 1) + tr[i]) / period;
        }
        
        return atr;
    }
}

export const supertrendService = new SupertrendService();