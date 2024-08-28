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
  loadDocuments(); // Add this line to load documents when opening settings
}

function setupSettingsEvents(overlay) {
  const addDocumentBtn = overlay.querySelector('#add-document-btn');
  addDocumentBtn.addEventListener('click', () => {
    showDocumentEditForm();
  });

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
}

async function loadDocuments() {
  const documentList = document.getElementById('document-list');
  documentList.innerHTML = '<tr><th>Name</th></tr>';

  const contextDocuments = await getContextDocuments();

  if (contextDocuments) {
    contextDocuments.forEach(contextDocument => {
      const row = document.createElement('tr');
      row.innerHTML = documentTemplate(contextDocument);
      documentList.appendChild(row);
    });
  }

  setupDocumentActions();
}

function setupDocumentActions() {
  const editButtons = document.querySelectorAll('.edit-document-btn');

  editButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const docId = e.target.closest('.edit-document-btn').getAttribute('data-id');
      showDocumentEditForm(docId);
      
      // Hide the document list and show the edit form
      document.getElementById('document-list').style.display = 'none';
      document.getElementById('document-edit-form').style.display = 'block';
    });
  });
}

async function showDocumentEditForm(docId = null) {
  const editForm = document.getElementById('document-edit-form');
  editForm.innerHTML = documentEditTemplate();

  if (docId) {
    try {
      const doc = await getContextDocument(docId);
      if (doc) {
        editForm.querySelector('#edit-document-id').value = doc.id;
        editForm.querySelector('#edit-document-name').value = doc.document_name;
        editForm.querySelector('#edit-document-content').value = doc.document_text;
        editForm.querySelector('#edit-document-scope').value = doc.scope || 'entire-domain';
        editForm.querySelector('#edit-document-custom-url').value = doc.url;
        // Assuming roles are stored in the backend, update this part accordingly
        // doc.roles.forEach(role => {
        //   editForm.querySelector(`#edit-role-${role}`).checked = true;
        // });
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      // Display error message to user
    }
  }

  const saveBtn = editForm.querySelector('#save-document-btn');
  saveBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission
    const contextDocument = getContextDocumentFromForm();
    saveDocument(contextDocument);
  });

  const cancelBtn = editForm.querySelector('#cancel-edit-btn');
  cancelBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission
    cancelEdit();
  });

  editForm.style.display = 'block';
}

function cancelEdit() {
  hideEditForm();
}

function hideEditForm() {
  const editForm = document.getElementById('document-edit-form');
  editForm.style.display = 'none';
  document.getElementById('document-list').style.display = 'table';
}

function showSuccessMessage(message) {
  showMessage(message, 'green');
}

function showErrorMessage(message) {
  showMessage(message, 'red');
}

function showMessage(message, color) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.style.color = color;
  messageElement.style.marginBottom = '10px';
  const settingsOverlay = document.getElementById('settings-overlay');
  settingsOverlay.insertBefore(messageElement, settingsOverlay.firstChild);
  
  setTimeout(() => {
    messageElement.remove();
  }, 3000);
}

function deleteDocument(docId) {
  const llmEndpoint = getLLMEndpoint();

  fetch(`${llmEndpoint}/context_docs/delete_document`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: docId })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      removeDocumentFromLocalStorage(docId);
      loadDocuments();
    } else {
      console.error('Error deleting document:', data.error);
    }
  })
  .catch(error => console.error('Error:', error));
}

function updateLocalStorage(contextDocument) {
  const savedSettings = localStorage.getItem('lavendalChatbotSettings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    const index = settings.documents.findIndex(d => d.id === contextDocument.id);
    if (index !== -1) {
      settings.documents[index] = contextDocument;
    } else {
      settings.documents.push(contextDocument);
    }
    localStorage.setItem('lavendalChatbotSettings', JSON.stringify(settings));
  }
}

function removeDocumentFromLocalStorage(docId) {
  const savedSettings = localStorage.getItem('lavendalChatbotSettings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    settings.documents = settings.documents.filter(d => d.id !== docId);
    localStorage.setItem('lavendalChatbotSettings', JSON.stringify(settings));
  }
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

// New helper function to get contextDocument from the form
function getContextDocumentFromForm() {
  const editForm = document.getElementById('document-edit-form');
  return {
    id: editForm.querySelector('#edit-document-id').value,
    url: editForm.querySelector('#edit-document-custom-url').value,
    document_name: editForm.querySelector('#edit-document-name').value,
    document_text: editForm.querySelector('#edit-document-content').value,
    scope: editForm.querySelector('#edit-document-scope').value,
    roles: Array.from(editForm.querySelectorAll('.edit-role-checkbox:checked')).map(cb => cb.value)
  };
}
