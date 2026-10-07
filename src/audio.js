// hero play/pause: toggles the hidden <audio> and swaps label/icon/aria-pressed
export function initAudioButton() {
  const button = document.querySelector('#sound-button');
  const audio = document.querySelector('#ambient-audio');
  if (!button || !audio) return;

  const label = button.querySelector('[data-label]');
  const icon = button.querySelector('[data-icon]');

  button.addEventListener('click', async () => {
    const playing = button.getAttribute('aria-pressed') === 'true';
    try {
      if (playing) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch {
      return; // no audio file yet, or the browser blocked playback
    }
    const next = !playing;
    button.setAttribute('aria-pressed', String(next));
    label.textContent = next ? 'PAUSE SOUND' : 'PLAY SOUND';
    icon.setAttribute(
      'd',
      next ? 'M2.5 1.5h3v13h-3z M8.5 1.5h3v13h-3z' : 'M2 1.5 L13 8 L2 14.5 Z'
    );
  });
}
