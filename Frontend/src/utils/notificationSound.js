/**
 * Notification Sound Manager
 * Uses the Web Audio API to generate a pleasant notification chime
 * without requiring any external audio files.
 */

let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Play a pleasant two-tone notification chime.
 * Uses Web Audio API — no files needed, works offline.
 */
export const playNotificationSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Master volume
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.3, now);
    masterGain.connect(ctx.destination);

    // First tone — a gentle "ding" (E5 = 659 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659, now);
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.start(now);
    osc1.stop(now + 0.4);

    // Second tone — higher "ding" (A5 = 880 Hz), slightly delayed
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.15);
    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.setValueAtTime(0.3, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.6);

    // Third tone — soft sparkle (C#6 = 1109 Hz)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(1109, now + 0.25);
    gain3.gain.setValueAtTime(0.001, now);
    gain3.gain.setValueAtTime(0.15, now + 0.25);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc3.connect(gain3);
    gain3.connect(masterGain);
    osc3.start(now + 0.25);
    osc3.stop(now + 0.7);

  } catch (err) {
    // Silently fail — audio is a nice-to-have, never block the UX
    console.warn("[Sound] Audio playback skipped:", err.message);
  }
};

export default playNotificationSound;
