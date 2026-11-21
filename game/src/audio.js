// All sound is synthesised with the Web Audio API: no audio files, no network.
// Short oscillator blips for a find, a miss, a hint, a level clear and the win fanfare.
// The AudioContext is created lazily on the first user gesture, so browsers that
// block audio before interaction never see an error.

export function createAudio() {
  let context = null;
  let muted = false;

  function ensure() {
    if (context === null) {
      try {
        const AudioContext = window.AudioContext ?? window.webkitAudioContext;
        if (!AudioContext) return null;
        context = new AudioContext();
      } catch {
        return null;
      }
    }
    if (context.state === 'suspended') context.resume().catch(() => {});
    return context;
  }

  /** One note: a sine or triangle tone that slides a little and fades out. */
  function note(frequency, startAt, duration, type, volume) {
    const audio = ensure();
    if (audio === null || muted) return;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audio.currentTime + startAt);
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 1.06,
      audio.currentTime + startAt + duration,
    );
    gain.gain.setValueAtTime(0.0001, audio.currentTime + startAt);
    gain.gain.exponentialRampToValueAtTime(volume, audio.currentTime + startAt + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + startAt + duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(audio.currentTime + startAt);
    oscillator.stop(audio.currentTime + startAt + duration + 0.05);
  }

  return {
    /** True when the player muted the game (key M or the speaker button). */
    get muted() {
      return muted;
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    /** Warm-up call from the first pointer or key press. */
    unlock() {
      ensure();
    },
    start() {
      note(392, 0, 0.1, 'triangle', 0.12);
      note(523.25, 0.08, 0.14, 'triangle', 0.12);
      note(659.25, 0.16, 0.2, 'triangle', 0.12);
    },
    click() {
      note(660, 0, 0.07, 'triangle', 0.08);
    },
    found() {
      note(523.25, 0, 0.12, 'sine', 0.16);
      note(783.99, 0.09, 0.18, 'sine', 0.16);
    },
    miss() {
      note(196, 0, 0.18, 'sawtooth', 0.07);
      note(147, 0.08, 0.22, 'sawtooth', 0.06);
    },
    hint() {
      note(880, 0, 0.1, 'sine', 0.12);
      note(1174.66, 0.08, 0.14, 'sine', 0.12);
    },
    levelClear() {
      const steps = [523.25, 659.25, 783.99, 1046.5];
      steps.forEach((frequency, index) => note(frequency, index * 0.11, 0.22, 'triangle', 0.14));
    },
    win() {
      const steps = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
      steps.forEach((frequency, index) => note(frequency, index * 0.13, 0.26, 'triangle', 0.14));
    },
    tick() {
      note(1046.5, 0, 0.05, 'square', 0.04);
    },
  };
}
