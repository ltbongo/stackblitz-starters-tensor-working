import * as tf from '@tensorflow/tfjs';
import { CONFIG } from '../../config.js';

export class LayersService {
    static createInputBranches(inputShape) {
        // Separate branches for different feature types
        const technicalBranch = this.createTechnicalBranch(inputShape);
        const patternBranch = this.createPatternBranch(inputShape);
        const trendBranch = this.createTrendBranch(inputShape);
        
        return {
            technical: technicalBranch,
            pattern: patternBranch,
            trend: trendBranch
        };
    }

    static createTechnicalBranch(inputShape) {
        return tf.sequential({
            layers: [
                tf.layers.dense({
                    units: 128,
                    inputShape: [inputShape],
                    kernelInitializer: 'heNormal',
                    kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
                }),
                tf.layers.batchNormalization(),
                tf.layers.activation({ activation: 'relu' }),
                tf.layers.dropout({ rate: 0.3 })
            ]
        });
    }

    static createPatternBranch(inputShape) {
        return tf.sequential({
            layers: [
                tf.layers.dense({
                    units: 64,
                    inputShape: [inputShape],
                    kernelInitializer: 'heNormal',
                    kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
                }),
                tf.layers.batchNormalization(),
                tf.layers.activation({ activation: 'relu' }),
                tf.layers.dropout({ rate: 0.2 })
            ]
        });
    }

    static createTrendBranch(inputShape) {
        return tf.sequential({
            layers: [
                tf.layers.dense({
                    units: 64,
                    inputShape: [inputShape],
                    kernelInitializer: 'heNormal',
                    kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
                }),
                tf.layers.batchNormalization(),
                tf.layers.activation({ activation: 'relu' }),
                tf.layers.dropout({ rate: 0.2 })
            ]
        });
    }

    static createCombinedLayers() {
        return [
            tf.layers.dense({
                units: 128,
                kernelInitializer: 'heNormal',
                kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
            }),
            tf.layers.batchNormalization(),
            tf.layers.activation({ activation: 'relu' }),
            tf.layers.dropout({ rate: 0.3 }),

            tf.layers.dense({
                units: 64,
                kernelInitializer: 'heNormal',
                kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
            }),
            tf.layers.batchNormalization(),
            tf.layers.activation({ activation: 'relu' }),
            tf.layers.dropout({ rate: 0.2 })
        ];
    }

    static createOutputLayer() {
        return tf.layers.dense({
            units: 2,
            activation: 'softmax',
            kernelInitializer: 'glorotNormal'
        });
    }
}