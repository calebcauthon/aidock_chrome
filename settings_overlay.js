function showSettingsOverlay() {
  let settingsOverlay = document.getElementById('settings-overlay');
  if (!settingsOverlay) {
    const div = document.createElement('div');
    div.innerHTML = settingsOverlayTemplate();
    document.body.appendChild(div);
    settingsOverlay = document.getElementById('settings-overlay');
    setupSettingsEvents(settingsOverlay);
  }
  settingsOverlay.classList.add('active');
}

function setupSettingsEvents(overlay) {
  const llmEndpointInput = overlay.querySelector('#llm-endpoint');
  llmEndpointInput.addEventListener('change', saveSettings);

  // Load saved settings
  loadSettings();

  const closeBtn = overlay.querySelector('.close-settings-btn');
  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  const resizeHandle = overlay.querySelector('.resize-handle');
  let isResizing = false;
  let lastDownX = 0;

  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    lastDownX = e.clientX;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const offsetRight = document.body.offsetWidth - (e.clientX - document.body.offsetLeft);
    const minWidth = 250; // Minimum width of the settings overlay
    const maxWidth = document.body.offsetWidth * 0.8; // Maximum width (80% of viewport)
    const newWidth = Math.min(Math.max(document.body.offsetWidth - offsetRight, minWidth), maxWidth);
    overlay.style.width = newWidth + 'px';
  });

  document.addEventListener('mouseup', () => {
    isResizing = false;
  });

  const logoutBtn = overlay.querySelector('#logout-btn');
  logoutBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    userManager.logOut();
    removeDockElements();
    initialize();
  });
}

function showSuccessMessage(message, element) {
  showMessage(message, 'green', element);
}

function showErrorMessage(message, element) {
  showMessage(message, 'red', element);
}

function showMessage(message, color, element) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.style.color = color;
  messageElement.style.marginBottom = '10px';
  element = element || document.getElementById('settings-overlay');
  element.insertBefore(messageElement, element.firstChild);
  
  setTimeout(() => {
    messageElement.remove();
  }, 3000);
}

function saveSettings() {
  const settings = {
    llmEndpoint: document.getElementById('llm-endpoint').value,
    documents: []
  };

  const documentElements = document.querySelectorAll('.document-item');
  documentElements.forEach(doc => {
    settings.documents.push({
      id: doc.dataset.id,
      name: doc.querySelector('.document-name').value,
      content: doc.querySelector('.document-content').value,
      scope: doc.querySelector('.document-scope').value,
      customUrl: doc.querySelector('.custom-url').value,
      roles: Array.from(doc.querySelectorAll('.role-checkboxes input:checked')).map(cb => cb.value)
    });
  });

  localStorage.setItem('lavendalChatbotSettings', JSON.stringify(settings));
}

function loadSettings() {
  const savedSettings = localStorage.getItem('lavendalChatbotSettings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    document.getElementById('llm-endpoint').value = settings.llmEndpoint || 'http://localhost:5000';
  }
}
