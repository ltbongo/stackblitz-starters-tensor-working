import * as tf from '@tensorflow/tfjs';
import { CONFIG } from '../config.js';

class ModelService {
    constructor() {
        this.model = null;
    }

    createModel() {
        const model = tf.sequential();
        
        const inputFeatures = CONFIG.LOOKBACK_PERIODS * 4; // 4 features with lookback
        
        // Input layer with batch normalization
        model.add(tf.layers.dense({
            units: 128,
            inputShape: [inputFeatures],
            kernelInitializer: 'glorotNormal'
        }));
        model.add(tf.layers.batchNormalization());
        model.add(tf.layers.activation({ activation: 'relu' }));
        model.add(tf.layers.dropout({ rate: 0.2 }));
        
        // Hidden layers
        model.add(tf.layers.dense({ 
            units: 64,
            kernelInitializer: 'glorotNormal'
        }));
        model.add(tf.layers.batchNormalization());
        model.add(tf.layers.activation({ activation: 'relu' }));
        model.add(tf.layers.dropout({ rate: 0.2 }));
        
        // Output layer for direction and signals
        model.add(tf.layers.dense({
            units: 2, // [direction, signal]
            activation: 'softmax',
            kernelInitializer: 'glorotNormal'
        }));
        
        const optimizer = tf.train.adam(CONFIG.LEARNING_RATE);
        
        model.compile({
            optimizer,
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });
        
        this.model = model;
        return model;
    }

    async train(features, labels) {
        if (!this.model) {
            this.createModel();
        }

        // Ensure features and labels are 2D arrays
        if (!Array.isArray(features) || !Array.isArray(features[0])) {
            throw new Error('Features must be a 2D array');
        }
        if (!Array.isArray(labels) || !Array.isArray(labels[0])) {
            throw new Error('Labels must be a 2D array');
        }

        // Convert to tensors with explicit shapes
        const xs = tf.tensor2d(features, [features.length, features[0].length]);
        const ys = tf.tensor2d(labels, [labels.length, labels[0].length]);

        // Check for NaN values
        const hasNaNFeatures = tf.any(tf.isNaN(xs)).dataSync()[0];
        const hasNaNLabels = tf.any(tf.isNaN(ys)).dataSync()[0];

        if (hasNaNFeatures) throw new Error('NaN values detected in features');
        if (hasNaNLabels) throw new Error('NaN values detected in labels');

        console.log('Training shapes:', {
            features: xs.shape,
            labels: ys.shape
        });

        return await this.model.fit(xs, ys, {
            batchSize: CONFIG.BATCH_SIZE,
            epochs: CONFIG.EPOCHS,
            validationSplit: CONFIG.VALIDATION_SPLIT,
            shuffle: true,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    console.log(
                        `Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, ` +
                        `accuracy = ${logs.acc.toFixed(4)}, ` +
                        `val_loss = ${logs.val_loss?.toFixed(4) || 'N/A'}, ` +
                        `val_acc = ${logs.val_acc?.toFixed(4) || 'N/A'}`
                    );
                }
            }
        });
    }

    predict(features) {
        if (!this.model) {
            throw new Error('Model not trained');
        }
        
        // Ensure features are in the correct shape
        if (!Array.isArray(features) || !Array.isArray(features[0])) {
            throw new Error('Features must be a 2D array');
        }
        
        const tensor = tf.tensor2d(features, [features.length, features[0].length]);
        return this.model.predict(tensor);
    }
}

export const modelService = new ModelService();