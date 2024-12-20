import { CONFIG } from '../../config.js';

class NormalizationService {
    normalizeFeatures(features) {
        // Calculate stats for each feature type
        const stats = this.calculateFeatureStats(features);
        
        // Normalize each feature
        return features.map(sample => {
            const normalizedSample = [];
            const featuresPerPeriod = sample.length / CONFIG.LOOKBACK_PERIODS;
            
            // Process each lookback period
            for (let i = 0; i < CONFIG.LOOKBACK_PERIODS; i++) {
                const periodStart = i * featuresPerPeriod;
                const periodEnd = periodStart + featuresPerPeriod;
                const periodFeatures = sample.slice(periodStart, periodEnd);
                
                // Normalize each feature in the period
                const normalizedPeriod = periodFeatures.map((value, featureIdx) => {
                    const stat = stats[featureIdx % featuresPerPeriod];
                    if (stat.max === stat.min) return 0.5;
                    return (value - stat.min) / (stat.max - stat.min);
                });
                
                normalizedSample.push(...normalizedPeriod);
            }
            
            return normalizedSample;
        });
    }

    calculateFeatureStats(features) {
        const featuresPerPeriod = features[0].length / CONFIG.LOOKBACK_PERIODS;
        const stats = Array(featuresPerPeriod).fill(null).map(() => ({
            min: Infinity,
            max: -Infinity
        }));

        // Calculate min/max for each feature type across all periods
        features.forEach(sample => {
            for (let i = 0; i < sample.length; i++) {
                const featureIdx = i % featuresPerPeriod;
                const value = sample[i];
                if (!isNaN(value) && value !== null) {
                    stats[featureIdx].min = Math.min(stats[featureIdx].min, value);
                    stats[featureIdx].max = Math.max(stats[featureIdx].max, value);
                }
            }
        });

        // Handle edge cases
        stats.forEach(stat => {
            if (stat.min === Infinity || stat.max === -Infinity) {
                stat.min = 0;
                stat.max = 1;
            } else if (stat.min === stat.max) {
                stat.min -= 0.5;
                stat.max += 0.5;
            }
        });

        return stats;
    }
}

export const normalizationService = new NormalizationService();