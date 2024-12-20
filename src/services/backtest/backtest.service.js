import { CONFIG } from '../../config.js';
import { bybitService } from '../bybit.service.js';
import { featureFactory } from '../features/feature.factory.js';
import { modelService } from '../model/model.service.js';
import { positionManager } from './position.manager.js';
import { signalGenerator } from './signal.generator.js';
import { metricsCalculator } from './metrics.calculator.js';
import { backtestLogger } from './backtest.logger.js';

class BacktestService {
    constructor() {
        this.reset();
    }

    reset() {
        positionManager.reset();
    }

    async run() {
        try {
            // Load historical data
            const klineData = await bybitService.getKlineData(CONFIG.DEFAULT_TIMEFRAME);
            backtestLogger.log('Fetched historical data:', klineData.length, 'candles');

            // Create features
            const features = featureFactory.createFeatures(klineData);
            backtestLogger.log('Created features:', features.length, 'samples');

            // Get predictions
            const predictions = await modelService.predict(features);
            const predArray = await predictions.array();
            predictions.dispose();

            // Run simulation
            for (let i = 0; i < predArray.length; i++) {
                const currentPrice = parseFloat(klineData[i + CONFIG.LOOKBACK_PERIODS][4]);
                const signal = signalGenerator.generateSignal(predArray[i]);
                
                // Update existing positions
                positionManager.updatePositions(currentPrice);

                // Open new position if signal exists
                if (signal && positionManager.canOpenPosition()) {
                    positionManager.openPosition(signal, currentPrice, klineData[i][0]);
                }

                // Log progress periodically
                if (i % 100 === 0) {
                    backtestLogger.logProgress(i, predArray.length);
                }
            }

            // Calculate and display results
            const results = metricsCalculator.calculateResults();
            backtestLogger.displayResults(results);

            return results;

        } catch (error) {
            console.error('Backtest error:', error);
            throw error;
        }
    }
}

export const backtestService = new BacktestService();