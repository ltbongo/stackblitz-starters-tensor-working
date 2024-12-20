class VisualizationService {
    displayFeatureImportance(importanceScores) {
        console.log('\nFeature Importance Analysis:');
        console.log('===========================');
        
        // Find max absolute importance for scaling
        const maxAbsImportance = Math.max(
            ...Object.values(importanceScores)
                .map(score => Math.abs(score.meanImportance))
        );
        
        // Group features by type for better organization
        const groupedFeatures = this.groupFeaturesByType(Object.entries(importanceScores));
        
        // Display each group
        for (const [groupName, features] of Object.entries(groupedFeatures)) {
            console.log(`\n${groupName}:`);
            
            // Sort features by importance within group
            features.sort((a, b) => b[1].meanImportance - a[1].meanImportance);
            
            // Display features
            features.forEach(([feature, scores]) => {
                const normalizedScore = scores.meanImportance / maxAbsImportance;
                const barLength = Math.max(0, Math.round(Math.abs(normalizedScore) * 40));
                const bar = '█'.repeat(barLength) + '░'.repeat(40 - barLength);
                
                // Extract time period from feature name
                const timePeriod = feature.split('_').pop();
                const featureName = feature.split('_')[0].padEnd(15);
                
                console.log(
                    `${featureName} ${timePeriod.padEnd(4)} │${bar}│ ${scores.meanImportance.toFixed(4)} ` +
                    `±${scores.stdDev.toFixed(4)}`
                );
            });
        }
    }

    groupFeaturesByType(features) {
        const groups = {
            'Base Indicators': [],
            'Advanced Indicators': [],
            'Moving Averages': [],
            'Pattern Features': []
        };

        features.forEach(feature => {
            const [name] = feature[0].split('_');
            
            if (name.startsWith('EMA')) {
                groups['Moving Averages'].push(feature);
            } else if (['MA'].includes(name)) {
                groups['Moving Averages'].push(feature);
            } else if (['RSI', 'MACD', 'Volume'].includes(name)) {
                groups['Base Indicators'].push(feature);
            } else if (['ADX', 'Supertrend'].includes(name)) {
                groups['Advanced Indicators'].push(feature);
            } else if (name.startsWith('Pattern')) {
                groups['Pattern Features'].push(feature);
            }
        });

        // Remove empty groups
        return Object.fromEntries(
            Object.entries(groups).filter(([_, features]) => features.length > 0)
        );
    }

    displayGroupImportance(groupScores) {
        console.log('\nFeature Group Importance:');
        console.log('========================');
        
        // Find max absolute importance for scaling
        const maxAbsImportance = Math.max(
            ...Object.values(groupScores)
                .map(score => Math.abs(score.meanImportance))
        );
        
        // Sort groups by importance
        const sortedGroups = Object.entries(groupScores)
            .sort(([, a], [, b]) => b.meanImportance - a.meanImportance);
        
        // Display each group
        sortedGroups.forEach(([group, scores]) => {
            const normalizedScore = scores.meanImportance / maxAbsImportance;
            const barLength = Math.max(0, Math.round(Math.abs(normalizedScore) * 40));
            const bar = '█'.repeat(barLength) + '░'.repeat(40 - barLength);
            
            console.log(
                `${group.padEnd(15)} │${bar}│ ${scores.meanImportance.toFixed(4)}`
            );
        });
    }
}

export const visualizationService = new VisualizationService();