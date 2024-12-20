import * as tf from '@tensorflow/tfjs';

class FormatService {
    async modelToJSON(model) {
        const modelJSON = model.toJSON();
        return {
            modelTopology: modelJSON,
            format: 'layers-model',
            generatedBy: 'TensorFlow.js tfjs-layers',
            convertedBy: null
        };
    }

    async weightsToArrayBuffer(model) {
        const weights = model.getWeights();
        return tf.io.encodeWeights(weights);
    }
}

export const formatService = new FormatService();