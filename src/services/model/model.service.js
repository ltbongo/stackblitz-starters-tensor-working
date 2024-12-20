import * as tf from '@tensorflow/tfjs';
import fs from 'fs';
import path from 'path';
import { CONFIG } from '../../config.js';
import { tensorService } from './data/tensor.service.js';
import { modelBuilder } from './architecture/model.builder.js';
import { checkpointService } from './storage/checkpoint.service.js';

class ModelService {
    constructor() {
        this.model = null;
        this.featuresPerPeriod = 5;  // MA + 3 EMAs + Pattern
        this.inputShape = this.featuresPerPeriod * CONFIG.LOOKBACK_PERIODS;
    }

    createModel() {
        this.model = modelBuilder.createModel(this.inputShape);
        return this.model;
    }

    async loadLatestModel() {
        try {
            const modelDir = path.join(process.cwd(), 'models');
            const dirs = await fs.promises.readdir(modelDir);
            
            // Find latest model directory
            const latestDir = dirs
                .filter(dir => dir.startsWith('model_'))
                .sort()
                .pop();

            if (!latestDir) {
                throw new Error('No saved model found');
            }

            const modelPath = path.join(modelDir, latestDir);
            
            // Load model configuration
            const modelConfig = JSON.parse(
                await fs.promises.readFile(
                    path.join(modelPath, 'model.json'),
                    'utf-8'
                )
            );

            // Create model from config
            this.model = await tf.loadLayersModel(tf.io.fromMemory({
                modelTopology: modelConfig,
                weightsManifest: [{
                    paths: ['weights.bin'],
                    weights: modelConfig.config.layers.map(layer => ({
                        name: layer.config.name,
                        shape: layer.config.batch_input_shape || layer.config.units,
                        dtype: 'float32'
                    }))
                }]
            }));

            // Load metadata
            const metadata = JSON.parse(
                await fs.promises.readFile(
                    path.join(modelPath, 'metadata.json'),
                    'utf-8'
                )
            );

            // Compile model
            this.model.compile({
                optimizer: tf.train.adam(CONFIG.LEARNING_RATE),
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']
            });

            console.log('Model loaded successfully from:', latestDir);
            console.log('Model metrics:', metadata.metrics);
            return true;
        } catch (error) {
            console.error('Error loading model:', error);
            return false;
        }
    }

    async predict(features) {
        if (!this.model) {
            const loaded = await this.loadLatestModel();
            if (!loaded) {
                throw new Error('Model not trained');
            }
        }

        const xs = tensorService.createTensor(features);
        try {
            return this.model.predict(xs);
        } finally {
            tensorService.disposeTensors(xs);
        }
    }

    async train(features, labels) {
        if (!this.model) {
            this.createModel();
        }

        const xs = tensorService.createTensor(features);
        const ys = tensorService.createTensor(labels);

        try {
            return await this.model.fit(xs, ys, {
                batchSize: CONFIG.BATCH_SIZE,
                epochs: CONFIG.EPOCHS,
                validationSplit: CONFIG.VALIDATION_SPLIT,
                shuffle: true,
                callbacks: {
                    onEpochEnd: async (epoch, logs) => {
                        console.log(
                            `Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, ` +
                            `accuracy = ${logs.acc.toFixed(4)}, ` +
                            `val_loss = ${logs.val_loss?.toFixed(4) || 'N/A'}, ` +
                            `val_acc = ${logs.val_acc?.toFixed(4) || 'N/A'}`
                        );

                        if (checkpointService.shouldSaveCheckpoint(logs)) {
                            await checkpointService.saveCheckpoint(this.model, {
                                accuracy: logs.val_acc,
                                loss: logs.val_loss,
                                epoch
                            });
                        }
                    }
                }
            });
        } finally {
            tensorService.disposeTensors(xs, ys);
        }
    }
}

export const modelService = new ModelService();