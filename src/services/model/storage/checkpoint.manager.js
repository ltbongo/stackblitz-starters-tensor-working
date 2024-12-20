import fs from 'fs';
import path from 'path';
import { CONFIG } from '../../../config.js';
import { modelSerializer } from './serialization/model.serializer.js';

class CheckpointManager {
    constructor() {
        this.baseDir = path.join(process.cwd(), 'models');
        this.currentModelDir = null;
        this.bestMetrics = null;
    }

    async saveCheckpoint(model, metrics) {
        try {
            // Initialize or clear model directory
            this.currentModelDir = this.currentModelDir || this.createModelDir();
            await this.ensureCleanDirectory(this.currentModelDir);

            // Serialize model and weights
            const serializedModel = await modelSerializer.serializeModel(model);

            // Save files
            await Promise.all([
                this.writeJSON('model.json', serializedModel),
                this.writeBinary('weights.bin', serializedModel.weightData),
                this.writeJSON('metadata.json', this.createMetadata(metrics))
            ]);

            this.bestMetrics = metrics;
            return true;
        } catch (error) {
            console.error('Error saving checkpoint:', error);
            return false;
        }
    }

    createModelDir() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        return path.join(
            this.baseDir,
            `model_${CONFIG.TRADING_PAIR}_${CONFIG.DEFAULT_TIMEFRAME}_${timestamp}`
        );
    }

    async ensureCleanDirectory(dir) {
        if (fs.existsSync(dir)) {
            await fs.promises.rm(dir, { recursive: true });
        }
        await fs.promises.mkdir(dir, { recursive: true });
    }

    async writeJSON(filename, data) {
        await fs.promises.writeFile(
            path.join(this.currentModelDir, filename),
            JSON.stringify(data, null, 2)
        );
    }

    async writeBinary(filename, data) {
        await fs.promises.writeFile(
            path.join(this.currentModelDir, filename),
            Buffer.from(data)
        );
    }

    createMetadata(metrics) {
        return {
            metrics,
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
    }
}

export const checkpointManager = new CheckpointManager();