import * as tf from '@tensorflow/tfjs';

export function compileModel(model, learningRate) {
    model.compile({
        optimizer: tf.train.adam(learningRate),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });
    return model;
}