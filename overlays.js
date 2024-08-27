function createInstructionsOverlay(conversation, conversationId) {
  function addQuestionHtml(overlay, question) {
    const instructionsBody = overlay.querySelector('.instructions-body');
    instructionsBody.innerHTML += followUpQuestionLoadingTemplate(question);
    instructionsBody.scrollTop = instructionsBody.scrollHeight;
  }

  function addEmptyChatWindowHtml(overlay, conversation) {
    overlay.id = 'instructions-overlay';
    overlay.offsetHeight;
    overlay.style.opacity = '1';
    overlay.setAttribute('data-conversation-id', conversationId);
    overlay.innerHTML = createInstructionsOverlayTemplate(conversation);
    document.body.appendChild(overlay);
  }

  function setupCloseButton(overlay) {
    const closeBtn = chatDiv.querySelector('.close-btn');
    closeBtn.addEventListener('click', function() {
      overlay.style.display = 'none';
      repositionOverlays();
    });
  }

  function setupMinimizeButton(overlay) {
    const minimizeBtn = chatDiv.querySelector('.minimize-btn');
    minimizeBtn.addEventListener('click', function() {
      toggleMinimize(overlay);
    });
  }

  function replaceLoadingHtmlWithAnswer(overlay, question, answer) {
    const instructionsBody = overlay.querySelector('.instructions-body');
    const loadingParagraph = instructionsBody.lastElementChild;
    loadingParagraph.innerHTML = followUpQuestionAnswerTemplate(question, answer);
    instructionsBody.scrollTop = instructionsBody.scrollHeight;
  }

  async function comeUpWithTitle(overlay, conversation) {
    const titleElement = overlay.querySelector('.instructions-title');
    if (titleElement.textContent.trim() !== 'New Chat') {
      return;
    }

    const messages = conversation.messages;
    const title = await callPromptEndpoint(messages[0].content, messages[1].content);
    if (title) {
      if (titleElement && titleElement.textContent.trim() === 'New Chat') {
        titleElement.textContent = title;
        const entryElement = headquarters.querySelector(`li[data-conversation-id="${conversation.id}"] .entry-question`);
        if (entryElement && entryElement.textContent.trim() === 'New Chat') {
          entryElement.textContent = title;
        }
      }
    }
  }

  const chatDiv = document.createElement('div');
  addEmptyChatWindowHtml(chatDiv, conversation);
  repositionOverlays();
  setupCloseButton(chatDiv);
  setupMinimizeButton(chatDiv);

  const chatInput = chatDiv.querySelector('.continue-chat-input');

  chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      const followUpQuestion = chatInput.value.trim();
      if (followUpQuestion) {

        const conversation = conversationManager.getConversation(conversationId);
        conversation.addMessage('question', followUpQuestion);

        trigger(chatDiv, "new-message", conversation);
        addQuestionHtml(chatDiv, followUpQuestion);
        
        sendQuestionToBackend(followUpQuestion)
          .then(answer => {
            conversation.addMessage('answer', answer);
            replaceLoadingHtmlWithAnswer(chatDiv, followUpQuestion, answer);
            trigger(chatDiv, "new-answer", conversation);
          })
          .catch(error => {
            console.error('Error:', error);
            const loadingParagraph = instructionsBody.lastElementChild;
            loadingParagraph.textContent = 'An error occurred. Please try again.';
          });
        chatInput.value = '';
      }
    }
  });

  when(chatDiv, "new-answer", async (updatedConversation) => {
    if (updatedConversation.messages.filter(msg => msg.type === 'question').length < 1 || 
        updatedConversation.messages.filter(msg => msg.type === 'answer').length < 1) {
      return;
    }

    comeUpWithTitle(chatDiv, updatedConversation);
  });

  return chatDiv;
}

function updateInstructionsOverlay(overlay, content, question) {
  const instructionsBody = overlay.querySelector('.instructions-body');
  const minimizeBtn = overlay.querySelector('.minimize-btn');

  instructionsBody.innerHTML = updateInstructionsOverlayTemplate(question, content);

  minimizeBtn.addEventListener('click', () => {
    toggleMinimize(overlay);
  });

  return overlay; // Return the updated overlay
}

function createHeadquarters() {
  const headquarters = document.createElement('div');
  headquarters.id = 'headquarters';
  headquarters.className = 'instructions-overlay';
  
  headquarters.innerHTML = headquartersTemplate();
  maximizeOverlay(headquarters);
  
  document.body.appendChild(headquarters);
  
  const minimizeBtn = headquarters.querySelector('.minimize-btn');
  minimizeBtn.addEventListener('click', () => toggleMinimize(headquarters));

  const pencilBtn = headquarters.querySelector('.new-chat-btn');
  pencilBtn.addEventListener('click', () => {
    const conversation = conversationManager.createBlankConversation();
    conversation.addMessage('answer', 'What do you need help with?');
    const newOverlay = createInstructionsOverlay(conversation, conversation.id);
    addEntryToHeadquarters("New Chat", null, newOverlay);
    const newOverlayInput = newOverlay.querySelector('.continue-chat-input');
    if (newOverlayInput) {
      newOverlayInput.focus();
    }
  });
  
  const settingsBtn = headquarters.querySelector('.settings-btn');
  settingsBtn.addEventListener('click', () => {
    showSettingsOverlay();
  });

  return headquarters;
}

function addEntryToHeadquarters(question, answer, overlay) {
  const questionList = headquarters.querySelector('#question-list');
  const listItem = document.createElement('li');
  const timestamp = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  
  listItem.innerHTML = headquartersEntryTemplate(timestamp, question, 0);
  listItem.setAttribute('data-conversation-id', overlay.getAttribute('data-conversation-id'));
  when(overlay, "new-message", (conversation) => {
    const questionCount = conversation.messages.filter(message => message.type === 'question').length;
    listItem.innerHTML = headquartersEntryTemplate(timestamp, question, questionCount);
  });
  
  
  listItem.addEventListener('click', () => {
    showOverlay(overlay);
  });
  
  questionList.insertBefore(listItem, questionList.firstChild);
}

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

function loadDocuments() {
  const documentList = document.getElementById('document-list');
  documentList.innerHTML = '<tr><th>Name</th><th>Scope</th><th>Actions</th></tr>';

  const savedSettings = localStorage.getItem('lavendalChatbotSettings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    settings.documents.forEach(doc => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${doc.name}</td>
        <td>${doc.scope}</td>
        <td>
          <button class="edit-document-btn" data-id="${doc.id}">Edit</button>
          <button class="delete-document-btn" data-id="${doc.id}">Delete</button>
        </td>
      `;
      documentList.appendChild(row);
    });
  }

  setupDocumentActions();
}

function setupDocumentActions() {
  const editButtons = document.querySelectorAll('.edit-document-btn');
  const deleteButtons = document.querySelectorAll('.delete-document-btn');

  editButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const docId = e.target.getAttribute('data-id');
      showDocumentEditForm(docId);
    });
  });

  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const docId = e.target.getAttribute('data-id');
      deleteDocument(docId);
    });
  });
}

function showDocumentEditForm(docId = null) {
  const editForm = document.getElementById('document-edit-form');
  editForm.innerHTML = documentEditTemplate();

  if (docId) {
    const savedSettings = localStorage.getItem('lavendalChatbotSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      const doc = settings.documents.find(d => d.id === docId);
      if (doc) {
        editForm.querySelector('#edit-document-id').value = doc.id;
        editForm.querySelector('#edit-document-name').value = doc.name;
        editForm.querySelector('#edit-document-content').value = doc.content;
        editForm.querySelector('#edit-document-scope').value = doc.scope;
        editForm.querySelector('#edit-document-custom-url').value = doc.customUrl;
        doc.roles.forEach(role => {
          editForm.querySelector(`#edit-role-${role}`).checked = true;
        });
      }
    }
  }

  const saveBtn = editForm.querySelector('#save-document-btn');
  saveBtn.addEventListener('click', saveDocument);

  editForm.style.display = 'block';
}

function saveDocument() {
  const editForm = document.getElementById('document-edit-form');
  const docId = editForm.querySelector('#edit-document-id').value;
  const name = editForm.querySelector('#edit-document-name').value;
  const content = editForm.querySelector('#edit-document-content').value;
  const scope = editForm.querySelector('#edit-document-scope').value;
  const customUrl = editForm.querySelector('#edit-document-custom-url').value;
  const roles = Array.from(editForm.querySelectorAll('.edit-role-checkbox:checked')).map(cb => cb.value);

  const contextDocument = { url: customUrl, document_name: name, document_text: content };

  const endpoint = docId ? '/context_docs/update_document' : '/context_docs/';
  const llmEndpoint = getLLMEndpoint();

  fetch(`${llmEndpoint}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contextDocument)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      updateLocalStorage(contextDocument);
      loadDocuments();
      editForm.style.display = 'none';
    } else {
      console.error('Error saving document:', data.error);
    }
  })
  .catch(error => console.error('Error:', error));
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

    const documentList = document.getElementById('document-list');
    documentList.innerHTML = '';
    settings.documents.forEach(doc => {
      const newDocElement = document.createElement('li');
      newDocElement.innerHTML = documentTemplate(doc.id);
      documentList.appendChild(newDocElement);
      setupDocumentEvents(newDocElement);

      newDocElement.querySelector('.document-name').value = doc.name;
      newDocElement.querySelector('.document-content').value = doc.content;
      newDocElement.querySelector('.document-scope').value = doc.scope;
      newDocElement.querySelector('.custom-url').value = doc.customUrl;
      newDocElement.querySelector('.custom-url').style.display = doc.scope === 'custom-url' ? 'block' : 'none';
      doc.roles.forEach(role => {
        newDocElement.querySelector(`.role-checkboxes input[value="${role}"]`).checked = true;
      });
    });
  }
}
