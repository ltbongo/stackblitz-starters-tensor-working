import * as tf from '@tensorflow/tfjs';
import { tensorHandler } from './serialization/tensor.handler.js';

class WeightsService {
    async serializeWeights(model) {
        // Get model weights
        const originalWeights = model.getWeights();
        
        // Prepare tensors with proper dtype
        const preparedTensors = tensorHandler.prepareTensors(originalWeights);
        
        // Create weight specs
        const weightSpecs = tensorHandler.createSpecs(preparedTensors);

        try {
            // Encode weights
            const encodedWeights = await tensorHandler.encodeTensors(preparedTensors, weightSpecs);
            
            return {
                manifest: [{
                    paths: ['weights.bin'],
                    weights: weightSpecs
                }],
                data: encodedWeights.data
            };
        } catch (error) {
            console.error('Error serializing weights:', error);
            throw error;
        }
    }
}

export const weightsService = new WeightsService();