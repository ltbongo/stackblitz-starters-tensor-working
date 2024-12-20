import * as tf from '@tensorflow/tfjs';
import { CONFIG } from '../../../config.js';
import { metadataService } from './metadata.service.js';

class StorageService {
    constructor() {
        this.sessionId = new Date().toISOString().replace(/[:.]/g, '-');
        this.currentModelPath = null;
        this.bestMetrics = {
            accuracy: 0,
            loss: Infinity,
            epoch: 0
        };
    }

    async saveCheckpoint(model, metrics) {
        try {
            // Generate model name if not exists
            if (!this.currentModelPath) {
                this.currentModelPath = `model_${CONFIG.TRADING_PAIR}_${CONFIG.DEFAULT_TIMEFRAME}_${this.sessionId}`;
            }

            // Save model weights as tensors
            const weights = model.getWeights();
            const weightData = weights.map(w => ({
                name: w.name,
                data: w.arraySync(),
                shape: w.shape
            }));

            // Create metadata
            const metadata = metadataService.createMetadata(model.toJSON(), metrics);

            // Store in memory (since we can't write to disk in browser environment)
            this.savedModel = {
                weights: weightData,
                metadata: metadata
            };

            // Update best metrics
            this.bestMetrics = {
                accuracy: metrics.accuracy,
                loss: metrics.loss,
                epoch: metrics.epoch
            };

            console.log(`\nCheckpoint saved at epoch ${metrics.epoch}:`);
            console.log(`- Model ID: ${this.currentModelPath}`);
            console.log(`- Validation accuracy: ${metrics.accuracy.toFixed(4)}`);
            console.log(`- Validation loss: ${metrics.loss.toFixed(4)}`);

            return true;
        } catch (error) {
            console.error('Error saving checkpoint:', error);
            throw error;
        }
    }

    shouldSaveCheckpoint(metrics) {
        return (
            metrics.accuracy > this.bestMetrics.accuracy ||
            (metrics.loss < this.bestMetrics.loss * 0.95)
        );
    }

    async loadLatestCheckpoint() {
        if (!this.savedModel) {
            throw new Error('No saved model found');
        }

        const model = tf.sequential();
        model.fromConfig(this.savedModel.metadata.modelConfig);

        // Load weights
        const weights = this.savedModel.weights.map(w => 
            tf.tensor(w.data, w.shape, 'float32')
        );
        model.setWeights(weights);

        return model;
    }
}

export const storageService = new StorageService();