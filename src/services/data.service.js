import { CONFIG } from '../config.js';

class DataService {
    prepareTrainingData(features, labels) {
        // Convert features from object format to flat array
        const flatFeatures = features.map(feature => {
            const featureArray = [];
            // Ensure consistent order of features
            featureArray.push(...feature.ma);
            featureArray.push(...feature.rsi);
            featureArray.push(...feature.macd);
            featureArray.push(...feature.volume);
            return featureArray;
        });

        // Remove any samples with NaN values
        const validIndices = flatFeatures
            .map((feat, idx) => ({ feat, idx }))
            .filter(({ feat }) => !feat.some(val => isNaN(val) || val === undefined))
            .map(({ idx }) => idx);

        const cleanFeatures = validIndices.map(idx => flatFeatures[idx]);
        const cleanLabels = validIndices.map(idx => labels[idx]);

        // Split data into training and validation sets
        const splitIndex = Math.floor(cleanFeatures.length * (1 - CONFIG.VALIDATION_SPLIT));
        
        // Verify shapes before returning
        console.log('Feature shape:', [cleanFeatures.length, cleanFeatures[0].length]);
        console.log('Label shape:', [cleanLabels.length, cleanLabels[0].length]);
        
        return {
            training: {
                features: cleanFeatures.slice(0, splitIndex),
                labels: cleanLabels.slice(0, splitIndex)
            },
            validation: {
                features: cleanFeatures.slice(splitIndex),
                labels: cleanLabels.slice(splitIndex)
            }
        };
    }

    normalizeFeatures(features) {
        // Calculate min and max for each feature type
        const stats = {
            ma: this.getMinMax(features.map(f => f.ma).flat()),
            rsi: this.getMinMax(features.map(f => f.rsi).flat()),
            macd: this.getMinMax(features.map(f => f.macd).flat()),
            volume: this.getMinMax(features.map(f => f.volume).flat())
        };

        // Normalize each feature
        return features.map(feature => ({
            ma: this.normalizeArray(feature.ma, stats.ma),
            rsi: this.normalizeArray(feature.rsi, stats.rsi),
            macd: this.normalizeArray(feature.macd, stats.macd),
            volume: this.normalizeArray(feature.volume, stats.volume)
        }));
    }

    getMinMax(array) {
        const validValues = array.filter(val => !isNaN(val) && val !== undefined);
        if (validValues.length === 0) {
            return { min: 0, max: 1 }; // Default range if no valid values
        }
        return {
            min: Math.min(...validValues),
            max: Math.max(...validValues)
        };
    }

    normalizeArray(array, { min, max }) {
        if (min === max) return array.map(() => 0.5);
        return array.map(value => {
            if (isNaN(value) || value === undefined) return 0.5;
            return (value - min) / (max - min);
        });
    }
}

export const dataService = new DataService();