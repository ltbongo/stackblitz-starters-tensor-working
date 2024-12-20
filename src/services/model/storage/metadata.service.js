import { CONFIG } from '../../../config.js';

class MetadataService {
    createMetadata(modelConfig, metrics) {
        return {
            modelConfig,
            hyperparameters: this.getHyperparameters(),
            trainingMetrics: this.formatMetrics(metrics),
            timestamp: new Date().toISOString(),
            tradingPair: CONFIG.TRADING_PAIR
        };
    }

    getHyperparameters() {
        return {
            learningRate: CONFIG.LEARNING_RATE,
            batchSize: CONFIG.BATCH_SIZE,
            epochs: CONFIG.EPOCHS,
            lookbackPeriods: CONFIG.LOOKBACK_PERIODS,
            timeframe: CONFIG.DEFAULT_TIMEFRAME
        };
    }

    formatMetrics(metrics) {
        return {
            accuracy: metrics.accuracy,
            loss: metrics.loss,
            epoch: metrics.epoch
        };
    }
}

export const metadataService = new MetadataService();