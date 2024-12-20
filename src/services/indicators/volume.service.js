class VolumeService {
    calculate(volumes) {
        return volumes.map(vol => parseFloat(vol));
    }
}

export const volumeService = new VolumeService();