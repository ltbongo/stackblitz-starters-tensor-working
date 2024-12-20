class PatternService {
    identifyPatterns(klineData) {
        const patterns = [];
        
        for (let i = 2; i < klineData.length; i++) {
            const current = this.parseCandle(klineData[i]);
            const prev = this.parseCandle(klineData[i - 1]);
            const prev2 = this.parseCandle(klineData[i - 2]);
            
            const patternFeatures = {
                doji: this.isDoji(current),
                hammer: this.isHammer(current),
                engulfing: this.isEngulfing(current, prev),
                threeBarPattern: this.isThreeBarPattern(current, prev, prev2),
                momentum: this.calculateMomentum(current, prev)
            };
            
            patterns.push(patternFeatures);
        }
        
        return patterns;
    }

    parseCandle(candle) {
        return {
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4])
        };
    }

    isDoji(candle) {
        const bodySize = Math.abs(candle.close - candle.open);
        const totalSize = candle.high - candle.low;
        return bodySize / totalSize < 0.1;
    }

    isHammer(candle) {
        const bodySize = Math.abs(candle.close - candle.open);
        const upperWick = candle.high - Math.max(candle.open, candle.close);
        const lowerWick = Math.min(candle.open, candle.close) - candle.low;
        
        return (lowerWick > bodySize * 2) && (upperWick < bodySize * 0.5);
    }

    isEngulfing(current, prev) {
        const currentBody = Math.abs(current.close - current.open);
        const prevBody = Math.abs(prev.close - prev.open);
        
        const bullishEngulfing = current.close > current.open && 
                                prev.close < prev.open && 
                                currentBody > prevBody;
                                
        const bearishEngulfing = current.close < current.open && 
                                prev.close > prev.open && 
                                currentBody > prevBody;
                                
        return bullishEngulfing ? 1 : (bearishEngulfing ? -1 : 0);
    }

    isThreeBarPattern(current, prev, prev2) {
        const isUptrend = current.close > prev.close && 
                         prev.close > prev2.close;
                         
        const isDowntrend = current.close < prev.close && 
                           prev.close < prev2.close;
                           
        return isUptrend ? 1 : (isDowntrend ? -1 : 0);
    }

    calculateMomentum(current, prev) {
        return (current.close - prev.close) / prev.close;
    }
}

export const patternService = new PatternService();