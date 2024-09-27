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

  // Populate user information
  populateUserInfo();

  const closeBtn = overlay.querySelector('.close-settings-btn');
  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  const librarianLink = overlay.querySelector('#librarian-link');
  librarianLink.href = `${getLLMEndpoint()}/librarian`;

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

  const resetBtn = document.getElementById('reset-btn');
  resetBtn.addEventListener('click', handleResetClick);
}

function populateUserInfo() {
  const userNameElement = document.getElementById('settings-user-name');
  const userRoleElement = document.getElementById('settings-user-role');

  if (userManager.getUsername()) {
    userNameElement.textContent = userManager.getUsername() || 'Unknown';
    userRoleElement.textContent = userManager.getRole() || 'Unknown';
  } else {
    userNameElement.textContent = 'Not logged in';
    userRoleElement.textContent = 'N/A';
  }
}

async function handleResetClick() {
  if (confirm('Are you sure you want to reset? This will clear all local data and refresh the page.')) {
    await resetAndRefresh();
  }
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

  setLocalStorageItem('settings', JSON.stringify(settings));
}

function loadSettings() {
  const savedSettings = getLocalStorageItem('settings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    document.getElementById('llm-endpoint').value = settings.llmEndpoint || 'http://localhost:5000';
  }
}
