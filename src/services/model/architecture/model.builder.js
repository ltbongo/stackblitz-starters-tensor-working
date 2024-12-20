import * as tf from '@tensorflow/tfjs';
import { CONFIG } from '../../../config.js';

class ModelBuilder {
    createModel(inputShape) {
        const model = tf.sequential();
        
        // Input layer with correct shape
        model.add(tf.layers.dense({
            units: 128,
            inputShape: [inputShape], // Use passed inputShape parameter
            activation: 'linear',
            kernelInitializer: 'heNormal',
            kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
        }));
        model.add(tf.layers.batchNormalization());
        model.add(tf.layers.activation({ activation: 'relu' }));
        model.add(tf.layers.dropout({ rate: 0.3 }));

        // Hidden layer
        model.add(tf.layers.dense({
            units: 64,
            activation: 'linear',
            kernelInitializer: 'heNormal',
            kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
        }));
        model.add(tf.layers.batchNormalization());
        model.add(tf.layers.activation({ activation: 'relu' }));
        model.add(tf.layers.dropout({ rate: 0.2 }));

        // Output layer
        model.add(tf.layers.dense({
            units: 2,
            activation: 'softmax',
            kernelInitializer: 'glorotNormal'
        }));

        // Compile model
        model.compile({
            optimizer: tf.train.adam(CONFIG.LEARNING_RATE),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        return model;
    }
}

export const modelBuilder = new ModelBuilder();