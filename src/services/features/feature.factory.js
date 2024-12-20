import { CONFIG } from '../../config.js';
import { indicatorFactory } from '../indicators/indicator.factory.js';

class FeatureFactory {
    createFeatures(klineData) {
        console.log('Creating features...');
        
        // Calculate only needed indicators
        const indicators = indicatorFactory.calculateIndicators(klineData);
        
        // Find valid start index where all indicators have values
        const validStartIndex = this.findValidStartIndex(indicators);
        
        // Create feature arrays
        const features = [];
        const endIndex = klineData.length - 1;

        for (let i = validStartIndex; i < endIndex; i++) {
            if (i >= CONFIG.LOOKBACK_PERIODS - 1) {
                const featureWindow = this.createFeatureWindow(indicators, i);
                
                if (this.isValidFeatureWindow(featureWindow)) {
                    features.push(featureWindow);
                }
            }
        }

        console.log(`Created ${features.length} feature samples`);
        console.log(`Each sample has ${features[0]?.length || 0} features`);

        return features;
    }

    findValidStartIndex(indicators) {
        const startIndices = [
            indicators.ma.findIndex(val => !isNaN(val)),
            ...indicators.ema.map(ema => ema.findIndex(val => !isNaN(val))),
            indicators.patterns.findIndex(val => val !== undefined)
        ];

        return Math.max(...startIndices.filter(idx => idx !== -1));
    }

    createFeatureWindow(indicators, currentIndex) {
        const featureWindow = [];
        
        for (let j = CONFIG.LOOKBACK_PERIODS - 1; j >= 0; j--) {
            const idx = currentIndex - j;
            
            // Add MA
            featureWindow.push(this.getIndicatorValue(indicators.ma, idx));

            // Add EMAs
            indicators.ema.forEach(ema => {
                featureWindow.push(this.getIndicatorValue(ema, idx));
            });

            // Add pattern features
            featureWindow.push(
                indicators.patterns[idx]?.momentum || 0
            );
        }

        return featureWindow;
    }

    getIndicatorValue(indicator, index) {
        const value = indicator[index];
        return value !== undefined && !isNaN(value) ? value : 0;
    }

    isValidFeatureWindow(featureWindow) {
        return featureWindow.length > 0 && !featureWindow.some(val => 
            val === undefined || 
            val === null || 
            isNaN(val)
        );
    }
}

export const featureFactory = new FeatureFactory();