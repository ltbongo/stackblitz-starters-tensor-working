import { tensorSerializer } from './tensor.serializer.js';

class ModelSerializer {
    async serializeModel(model) {
        const weights = model.getWeights().map(w => 
            tensorSerializer.serializeTensor(w)
        );
        
        const weightSpecs = tensorSerializer.createWeightSpecs(weights);
        const encodedWeights = await tensorSerializer.encodeTensors(weights, weightSpecs);

        return {
            modelTopology: model.toJSON(),
            weightsManifest: [{
                paths: ['weights.bin'],
                weights: weightSpecs
            }],
            weightData: encodedWeights.data,
            format: 'layers-model',
            generatedBy: 'TensorFlow.js tfjs-layers v4.22.0',
            convertedBy: null
        };
    }
}

export const modelSerializer = new ModelSerializer();