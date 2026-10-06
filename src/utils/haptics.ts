/**
 * Haptic feedback utility using Web Vibration API
 * Provides tactile physical sensations on mobile devices
 */

export const haptics = {
  // Light touch for option selection or quick buttons
  tap() {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(18);
      } catch {
        // Ignore if blocked or unsupported
      }
    }
  },

  // Subtle pulse when rating confidence
  slider() {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {}
    }
  },

  // Rhythmic double pulse on solving accurately
  success() {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([35, 45, 65]);
      } catch {}
    }
  },

  // Quirky buzz on falling into an intuitive trap
  trap() {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([60, 40, 90]);
      } catch {}
    }
  },

  // Triumph pulse pattern when leveling up or discovering a new pattern
  levelUp() {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 50, 50, 50, 120]);
      } catch {}
    }
  },
};
