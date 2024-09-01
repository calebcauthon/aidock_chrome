function maximizeOverlay(overlay) {
  const instructionsBody = overlay.querySelector('.instructions-body');
  instructionsBody.classList.remove('minimized');
  overlay.classList.remove('minimized');
  overlay.style.height = '';
}

function fadeOutAndRemove(element) {
  element.style.opacity = '0';
  setTimeout(() => {
    document.body.removeChild(element);
    repositionOverlays();
  }, 300); // Adjust this value to match your CSS transition duration
}

function repositionOverlays() {
  const overlays = document.querySelectorAll('#instructions-overlay:not(#headquarters)');
  let rightPosition = headquarters.offsetWidth;
  
  overlays.forEach((overlay, index) => {
    if (overlay.style.display !== 'none') {
      overlay.style.right = `${rightPosition + (index * 10)}px`;
      rightPosition += overlay.offsetWidth + (index * 10)
    }
  });
}

function showOverlay(overlay) {
  overlay.style.display = 'flex';
  repositionOverlays();
}

function toggleMinimize(overlay) {
  overlay.classList.toggle('minimized');
  const instructionsBody = overlay.querySelector('.instructions-body');
  const chatInput = overlay.querySelector('.chat-input');
  
  if (instructionsBody) instructionsBody.classList.toggle('minimized');
  if (chatInput) chatInput.classList.toggle('minimized');
  
  const minimizeBtn = overlay.querySelector('.minimize-btn');
  if (minimizeBtn) {
    minimizeBtn.textContent = overlay.classList.contains('minimized') ? '🔼' : '🔽';
  }
}
