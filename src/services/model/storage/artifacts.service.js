class ArtifactsService {
    createModelArtifacts(model, weightsManifest) {
        return {
            modelTopology: model.toJSON(),
            format: 'layers-model',
            generatedBy: 'TensorFlow.js tfjs-layers v4.22.0',
            convertedBy: null,
            weightsManifest
        };
    }
}

export const artifactsService = new ArtifactsService();