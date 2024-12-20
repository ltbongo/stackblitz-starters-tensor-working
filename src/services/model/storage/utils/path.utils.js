import path from 'path';

export function getModelDirectory(modelId) {
    return path.join(process.cwd(), 'models', modelId);
}

export function getModelPaths(modelId) {
    const modelDir = getModelDirectory(modelId);
    return {
        modelDir,
        weightsPath: path.join(modelDir, 'weights.json'),
        metadataPath: path.join(modelDir, 'metadata.json'),
        configPath: path.join(modelDir, 'model-config.json')
    };
}