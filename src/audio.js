// hero play/pause: drives the hidden <audio>; the button's label, icon and aria-pressed
// follow the audio's own play/pause events, so they stay right however playback changes
const PLAY_ICON = 'M2 1.5 L13 8 L2 14.5 Z';
const PAUSE_ICON = 'M2.5 1.5h3v13h-3z M8.5 1.5h3v13h-3z';

export function initAudioButton() {
  const button = document.querySelector('#sound-button');
  const audio = document.querySelector('#ambient-audio');
  if (!button || !audio) return;

  const label = button.querySelector('[data-label]');
  const icon = button.querySelector('[data-icon]');

  function sync() {
    const playing = !audio.paused;
    button.setAttribute('aria-pressed', String(playing));
    label.textContent = playing ? 'Pause sound' : 'Play sound';
    icon.setAttribute('d', playing ? PAUSE_ICON : PLAY_ICON);
  }

  button.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {}); // blocked or failed: the button simply stays on "Play"
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', sync);
  audio.addEventListener('pause', sync);
  sync();
}
