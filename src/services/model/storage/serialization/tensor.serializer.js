import * as tf from '@tensorflow/tfjs';

class TensorSerializer {
    serializeTensor(tensor) {
        if (!tensor.dtype) {
            return tf.cast(tensor, 'float32');
        }
        return tensor;
    }

    createWeightSpecs(weights) {
        return weights.map((w, i) => ({
            name: `weight${i}`,
            shape: w.shape,
            dtype: 'float32'
        }));
    }

    async encodeTensors(tensors, specs) {
        return await tf.io.encodeWeights(tensors, specs);
    }
}

export const tensorSerializer = new TensorSerializer();