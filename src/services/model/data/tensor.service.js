import * as tf from '@tensorflow/tfjs';

class TensorService {
    createTensor(data, shape) {
        // Validate data
        if (!Array.isArray(data) || !Array.isArray(data[0])) {
            throw new Error('Data must be a 2D array');
        }

        // Convert to tensor
        const tensor = tf.tensor2d(data);
        
        // Validate no NaN values
        const hasNaN = tf.any(tf.isNaN(tensor)).dataSync()[0];
        if (hasNaN) {
            tensor.dispose();
            throw new Error('NaN values detected in tensor');
        }

        return tensor;
    }

    disposeTensors(...tensors) {
        tensors.forEach(tensor => {
            if (tensor && tensor.dispose) {
                tensor.dispose();
            }
        });
    }
}

export const tensorService = new TensorService();