import * as tf from '@tensorflow/tfjs';
import fs from 'fs';
import path from 'path';
import { CONFIG } from '../../../config.js';

class CheckpointService {
    constructor() {
        this.baseDir = path.join(process.cwd(), 'models');
        this.currentModelDir = null;
        this.bestMetrics = {
            accuracy: 0,
            loss: Infinity,
            epoch: 0
        };
    }

    shouldSaveCheckpoint(metrics) {
        // Save if accuracy improved or loss significantly decreased
        return metrics.val_acc > this.bestMetrics.accuracy || 
               (metrics.val_loss < this.bestMetrics.loss * 0.95);
    }

    async saveCheckpoint(model, metrics) {
        try {
            // Create new model directory
            const modelDir = this.getModelDir();
            await this.ensureDirectory(modelDir);

            // Remove previous checkpoint if it exists
            if (this.currentModelDir && this.currentModelDir !== modelDir) {
                await this.removeDirectory(this.currentModelDir);
            }

            // Create metadata
            const metadata = {
                metrics: {
                    accuracy: metrics.accuracy,
                    loss: metrics.loss,
                    epoch: metrics.epoch
                },
                tradingPair: CONFIG.TRADING_PAIR,
                timeframe: CONFIG.DEFAULT_TIMEFRAME,
                timestamp: new Date().toISOString(),
                hyperparameters: {
                    learningRate: CONFIG.LEARNING_RATE,
                    batchSize: CONFIG.BATCH_SIZE,
                    epochs: CONFIG.EPOCHS,
                    lookbackPeriods: CONFIG.LOOKBACK_PERIODS
                }
            };

            // Save model
            await model.save(tf.io.withSaveHandler(async (artifacts) => {
                await Promise.all([
                    fs.promises.writeFile(
                        path.join(modelDir, 'model.json'),
                        JSON.stringify(artifacts.modelTopology)
                    ),
                    fs.promises.writeFile(
                        path.join(modelDir, 'weights.bin'),
                        Buffer.from(artifacts.weightData)
                    ),
                    fs.promises.writeFile(
                        path.join(modelDir, 'metadata.json'),
                        JSON.stringify(metadata, null, 2)
                    )
                ]);
                return {success: true};
            }));

            // Update tracking variables
            this.currentModelDir = modelDir;
            this.bestMetrics = {
                accuracy: metrics.accuracy,
                loss: metrics.loss,
                epoch: metrics.epoch
            };

            console.log(`\nCheckpoint saved at epoch ${metrics.epoch}:`);
            console.log(`- Validation accuracy: ${metrics.accuracy.toFixed(4)}`);
            console.log(`- Validation loss: ${metrics.loss.toFixed(4)}`);

            return true;
        } catch (error) {
            console.error('Error saving checkpoint:', error);
            return false;
        }
    }

    async removeDirectory(dir) {
        if (fs.existsSync(dir)) {
            await fs.promises.rm(dir, { recursive: true, force: true });
        }
    }

    getModelDir() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        return path.join(
            this.baseDir,
            `model_${CONFIG.TRADING_PAIR}_${CONFIG.DEFAULT_TIMEFRAME}_${timestamp}`
        );
    }

    async ensureDirectory(dir) {
        if (!fs.existsSync(dir)) {
            await fs.promises.mkdir(dir, { recursive: true });
        }
    }
}

export const checkpointService = new CheckpointService();