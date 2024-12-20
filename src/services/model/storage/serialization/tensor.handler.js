import * as tf from '@tensorflow/tfjs';

class TensorHandler {
    prepareTensors(weights) {
        return weights.map(w => {
            // Always ensure float32 dtype
            const tensor = tf.cast(w, 'float32');
            // Keep track of created tensors
            this.trackTensor(tensor);
            return tensor;
        });
    }

    createSpecs(tensors) {
        return tensors.map((tensor, i) => ({
            name: `weight${i}`,
            shape: tensor.shape,
            dtype: tensor.dtype
        }));
    }

    async encodeTensors(tensors, specs) {
        try {
            return await tf.io.encodeWeights(tensors, specs);
        } finally {
            this.disposeTensors();
        }
    }

    // Private tensor tracking
    #temporaryTensors = new Set();

    trackTensor(tensor) {
        this.#temporaryTensors.add(tensor);
    }

    disposeTensors() {
        this.#temporaryTensors.forEach(tensor => {
            if (tensor && !tensor.isDisposed) {
                tensor.dispose();
            }
        });
        this.#temporaryTensors.clear();
    }
}

export const tensorHandler = new TensorHandler();