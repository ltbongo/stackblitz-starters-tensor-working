import { CONFIG } from '../../config.js';
import { normalizationService } from './normalization.service.js';

class PreprocessingService {
    normalizeFeatures(features) {
        return normalizationService.normalizeFeatures(features);
    }

    prepareTrainingData(features, labels) {
        if (!features?.length || !labels?.length) {
            throw new Error('Invalid features or labels');
        }

        // Log input shapes
        console.log('Preparing training data...');
        console.log(`Input features shape: [${features.length}, ${features[0]?.length}]`);
        console.log(`Input labels shape: [${labels.length}, ${labels[0]?.length}]`);

        // Ensure features and labels have matching lengths
        if (features.length !== labels.length) {
            console.warn(`Feature/label length mismatch. Features: ${features.length}, Labels: ${labels.length}`);
            const minLength = Math.min(features.length, labels.length);
            features = features.slice(0, minLength);
            labels = labels.slice(0, minLength);
        }

        // Remove invalid samples
        const validData = this.removeInvalidSamples(features, labels);
        
        // Split into training and validation sets
        const splitData = this.splitTrainingValidation(validData.features, validData.labels);

        // Log split information
        console.log('Training/Validation split:');
        console.log(`Training samples: ${splitData.training.features.length}`);
        console.log(`Validation samples: ${splitData.validation.features.length}`);

        return splitData;
    }

    removeInvalidSamples(features, labels) {
        const validIndices = features
            .map((feat, idx) => ({ feat, idx }))
            .filter(({ feat }) => 
                feat.every(val => val !== undefined && val !== null && !isNaN(val))
            )
            .map(({ idx }) => idx);

        return {
            features: validIndices.map(idx => features[idx]),
            labels: validIndices.map(idx => labels[idx])
        };
    }

    splitTrainingValidation(features, labels) {
        const splitIndex = Math.floor(features.length * (1 - CONFIG.VALIDATION_SPLIT));
        
        return {
            training: {
                features: features.slice(0, splitIndex),
                labels: labels.slice(0, splitIndex)
            },
            validation: {
                features: features.slice(splitIndex),
                labels: labels.slice(splitIndex)
            }
        };
    }
}

export const preprocessingService = new PreprocessingService();