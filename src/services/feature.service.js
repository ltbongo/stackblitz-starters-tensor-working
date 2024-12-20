import { indicatorService } from './indicator.service.js';
import { CONFIG } from '../config.js';

class FeatureService {
    createFeatures(klineData) {
        const prices = klineData.map(candle => parseFloat(candle[4])); // Close prices
        const volumes = klineData.map(candle => parseFloat(candle[5]));

        // Calculate indicators
        const ma = indicatorService.calculateMA(prices);
        const rsi = indicatorService.calculateRSI(prices);
        const macd = indicatorService.calculateMACD(prices);
        const volume = indicatorService.calculateVolume(volumes);

        // Find the maximum valid index where all indicators have values
        const validStartIndex = Math.max(
            ma.findIndex(val => !isNaN(val)),
            rsi.findIndex(val => !isNaN(val)),
            macd.findIndex(val => !isNaN(val))
        );

        const features = {
            ma: ma.slice(validStartIndex),
            rsi: rsi.slice(validStartIndex),
            macd: macd.slice(validStartIndex),
            volume: volume.slice(validStartIndex)
        };

        return this.createLookbackFeatures(features);
    }

    createLookbackFeatures(features) {
        const lookbackFeatures = [];
        const numSamples = Math.min(
            features.ma.length,
            features.rsi.length,
            features.macd.length,
            features.volume.length
        );

        for (let i = CONFIG.LOOKBACK_PERIODS; i < numSamples; i++) {
            const sample = {
                ma: [],
                rsi: [],
                macd: [],
                volume: []
            };

            // Create lookback window for each feature
            for (let j = 0; j < CONFIG.LOOKBACK_PERIODS; j++) {
                const idx = i - CONFIG.LOOKBACK_PERIODS + j;
                sample.ma.push(features.ma[idx] || 0);
                sample.rsi.push(features.rsi[idx] || 0);
                sample.macd.push(features.macd[idx] || 0);
                sample.volume.push(features.volume[idx] || 0);
            }

            lookbackFeatures.push(sample);
        }

        return lookbackFeatures;
    }
}

export const featureService = new FeatureService();