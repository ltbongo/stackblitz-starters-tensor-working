import { CONFIG } from '../config.js';

export function validateFeatures(features, expectedFeatureCount) {
    if (!Array.isArray(features) || !Array.isArray(features[0])) {
        throw new Error('Features must be a 2D array');
    }

    if (features[0].length !== expectedFeatureCount) {
        throw new Error(`Invalid feature shape. Expected ${expectedFeatureCount} features, got ${features[0].length}`);
    }

    // Validate no NaN or undefined values
    const hasInvalidValues = features.some(row => 
        row.some(val => isNaN(val) || val === undefined || val === null)
    );

    if (hasInvalidValues) {
        throw new Error('Features contain invalid values (NaN, undefined, or null)');
    }
}

export function validateLabels(labels) {
    if (!Array.isArray(labels) || !Array.isArray(labels[0])) {
        throw new Error('Labels must be a 2D array');
    }
    
    if (labels[0].length !== 2) {
        throw new Error('Labels must have shape [n, 2] for direction and signal');
    }

    const hasInvalidValues = labels.some(row => 
        row.some(val => isNaN(val) || val === undefined || val === null)
    );

    if (hasInvalidValues) {
        throw new Error('Labels contain invalid values (NaN, undefined, or null)');
    }
}