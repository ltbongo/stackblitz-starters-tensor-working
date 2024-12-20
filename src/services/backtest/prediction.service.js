import * as tf from '@tensorflow/tfjs';
import { modelService } from '../model/model.service.js';

class PredictionService {
    async batchPredict(features, batchSize = 32) {
        const predictions = [];
        
        for (let i = 0; i < features.length; i += batchSize) {
            const batchFeatures = features.slice(i, Math.min(i + batchSize, features.length));
            const batchPredictions = await this.predictBatch(batchFeatures);
            predictions.push(...batchPredictions);
        }
        
        return predictions;
    }

    async predictBatch(features) {
        const tensor = tf.tensor2d(features);
        try {
            const predictions = await modelService.model.predict(tensor).array();
            return predictions;
        } finally {
            tensor.dispose();
        }
    }
}

export const predictionService = new PredictionService();