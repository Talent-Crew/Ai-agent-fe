/**
 * Audio Analysis Utilities for Detecting Reading vs Natural Speech
 */

/**
 * Analyze audio characteristics to detect if someone is reading
 * @param {AudioBuffer} audioBuffer - The audio buffer to analyze
 * @returns {Object} Analysis results with suspicion scores
 */
export function analyzeAudioForReading(audioBuffer) {
    const analysis = {
        duration: audioBuffer.duration,
        suspicionScore: 0,
        flags: [],
        details: {}
    };

    // 1. Calculate speech rate (words per minute estimate)
    const estimatedWords = Math.floor(audioBuffer.duration * 2.5); // Average 2.5 words per second
    const wordsPerMinute = (estimatedWords / audioBuffer.duration) * 60;
    analysis.details.estimatedWPM = Math.round(wordsPerMinute);

    // Reading is typically 150-200 WPM, natural speech is 100-150 WPM
    if (wordsPerMinute > 180) {
        analysis.suspicionScore += 30;
        analysis.flags.push('FAST_SPEECH_RATE');
        analysis.details.fastSpeech = true;
    }

    // 2. Analyze volume consistency (reading tends to be more uniform)
    const volumeVariance = calculateVolumeVariance(audioBuffer);
    analysis.details.volumeVariance = volumeVariance;

    if (volumeVariance < 0.1) {
        analysis.suspicionScore += 25;
        analysis.flags.push('UNIFORM_VOLUME');
        analysis.details.uniformVolume = true;
    }

    // 3. Detect pause patterns (natural speech has more pauses)
    const pauseAnalysis = detectPauses(audioBuffer);
    analysis.details.pauseCount = pauseAnalysis.pauseCount;
    analysis.details.pausePercentage = pauseAnalysis.pausePercentage;

    if (pauseAnalysis.pauseCount < 2 && audioBuffer.duration > 10) {
        analysis.suspicionScore += 20;
        analysis.flags.push('FEW_PAUSES');
        analysis.details.fewPauses = true;
    }

    // 4. Response time (too fast might indicate prepared answer)
    if (audioBuffer.duration > 0 && audioBuffer.duration < 3) {
        analysis.suspicionScore += 15;
        analysis.flags.push('SUSPICIOUSLY_SHORT');
        analysis.details.tooShort = true;
    }

    // 5. Energy distribution (reading has more consistent energy)
    const energyConsistency = calculateEnergyConsistency(audioBuffer);
    analysis.details.energyConsistency = energyConsistency;

    if (energyConsistency > 0.8) {
        analysis.suspicionScore += 20;
        analysis.flags.push('CONSISTENT_ENERGY');
        analysis.details.highEnergyConsistency = true;
    }

    // Overall assessment
    if (analysis.suspicionScore >= 50) {
        analysis.verdict = 'HIGH_SUSPICION';
    } else if (analysis.suspicionScore >= 30) {
        analysis.verdict = 'MODERATE_SUSPICION';
    } else {
        analysis.verdict = 'NATURAL_SPEECH';
    }

    return analysis;
}

/**
 * Calculate volume variance across audio buffer
 */
function calculateVolumeVariance(audioBuffer) {
    const channelData = audioBuffer.getChannelData(0);
    const segmentSize = Math.floor(channelData.length / 10); // Divide into 10 segments
    const volumes = [];

    for (let i = 0; i < 10; i++) {
        const start = i * segmentSize;
        const end = start + segmentSize;
        let sum = 0;

        for (let j = start; j < end && j < channelData.length; j++) {
            sum += Math.abs(channelData[j]);
        }

        volumes.push(sum / segmentSize);
    }

    // Calculate variance
    const mean = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const variance = volumes.reduce((sum, vol) => sum + Math.pow(vol - mean, 2), 0) / volumes.length;

    return variance;
}

/**
 * Detect pauses in speech
 */
function detectPauses(audioBuffer) {
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const threshold = 0.02; // Volume threshold for silence
    const minPauseDuration = 0.3; // Minimum 300ms to count as pause

    let pauseCount = 0;
    let currentPauseLength = 0;
    let totalPauseDuration = 0;

    for (let i = 0; i < channelData.length; i++) {
        if (Math.abs(channelData[i]) < threshold) {
            currentPauseLength++;
        } else {
            const pauseDuration = currentPauseLength / sampleRate;
            if (pauseDuration >= minPauseDuration) {
                pauseCount++;
                totalPauseDuration += pauseDuration;
            }
            currentPauseLength = 0;
        }
    }

    return {
        pauseCount,
        totalPauseDuration,
        pausePercentage: (totalPauseDuration / audioBuffer.duration) * 100
    };
}

/**
 * Calculate energy consistency
 */
function calculateEnergyConsistency(audioBuffer) {
    const channelData = audioBuffer.getChannelData(0);
    const windowSize = Math.floor(sampleRate * 0.1); // 100ms windows
    const energies = [];

    for (let i = 0; i < channelData.length; i += windowSize) {
        let energy = 0;
        for (let j = i; j < i + windowSize && j < channelData.length; j++) {
            energy += channelData[j] * channelData[j];
        }
        energies.push(energy / windowSize);
    }

    // Calculate coefficient of variation (lower = more consistent)
    const mean = energies.reduce((a, b) => a + b, 0) / energies.length;
    const stdDev = Math.sqrt(
        energies.reduce((sum, e) => sum + Math.pow(e - mean, 2), 0) / energies.length
    );

    const coefficientOfVariation = stdDev / mean;

    // Normalize to 0-1 scale (inverted so higher = more consistent)
    return Math.max(0, Math.min(1, 1 - coefficientOfVariation));
}

/**
 * Analyze entire interview session for patterns
 */
export function analyzeSessionPatterns(audioAnalyses) {
    if (!audioAnalyses || audioAnalyses.length === 0) {
        return { suspiciousPatterns: [], overallRisk: 'UNKNOWN' };
    }

    const suspiciousPatterns = [];
    let totalSuspicionScore = 0;

    // Check if all responses are suspiciously similar
    const avgSuspicionScore = audioAnalyses.reduce((sum, a) => sum + a.suspicionScore, 0) / audioAnalyses.length;
    totalSuspicionScore = avgSuspicionScore;

    if (avgSuspicionScore > 40) {
        suspiciousPatterns.push({
            type: 'CONSISTENT_READING_PATTERN',
            description: 'Multiple responses show reading characteristics',
            severity: 'HIGH'
        });
    }

    // Check for unnaturally consistent speech rates
    const wpms = audioAnalyses.map(a => a.details.estimatedWPM).filter(Boolean);
    if (wpms.length > 1) {
        const wpmVariance = calculateArrayVariance(wpms);
        if (wpmVariance < 10) {
            suspiciousPatterns.push({
                type: 'CONSISTENT_SPEECH_RATE',
                description: 'Speech rate is unnaturally consistent across responses',
                severity: 'MEDIUM'
            });
            totalSuspicionScore += 15;
        }
    }

    // Determine overall risk
    let overallRisk = 'LOW';
    if (totalSuspicionScore > 50) {
        overallRisk = 'HIGH';
    } else if (totalSuspicionScore > 30) {
        overallRisk = 'MEDIUM';
    }

    return {
        suspiciousPatterns,
        overallRisk,
        averageSuspicionScore: Math.round(avgSuspicionScore),
        totalAnalyses: audioAnalyses.length
    };
}

function calculateArrayVariance(arr) {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
}
