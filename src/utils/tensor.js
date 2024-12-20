import * as tf from '@tensorflow/tfjs';

export function createTensor(data, shape) {
    const tensor = tf.tensor2d(data, shape);
    
    // Check for NaN values
    const hasNaN = tf.any(tf.isNaN(tensor)).dataSync()[0];
    if (hasNaN) {
        tensor.dispose();
        throw new Error('NaN values detected in tensor');
    }
    
    return tensor;
}

export function disposeTensors(...tensors) {
    tensors.forEach(tensor => {
        if (tensor && tensor.dispose) {
            tensor.dispose();
        }
    });
}