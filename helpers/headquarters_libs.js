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

function loadSavedConversations() {
  conversationManager.conversations.forEach((conversation) => {
    const lastAnswer = conversation.messages.filter(msg => msg.type === 'answer').pop();
    const overlay = createInstructionsOverlay(conversation, conversation.id);
    addEntryToHeadquarters(conversation.title, lastAnswer ? lastAnswer.content : null, overlay);
  });
}

function addEntryToHeadquarters(title, answer, overlay) {
  const questionList = headquarters.querySelector('#question-list');
  const listItem = document.createElement('li');
  const timestamp = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  
  listItem.innerHTML = headquartersEntryTemplate(timestamp, title, 0);
  listItem.setAttribute('data-conversation-id', overlay.getAttribute('data-conversation-id'));
  
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete-chat-btn');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const conversationId = listItem.getAttribute('data-conversation-id');
    conversationManager.deleteConversation(conversationId);
    listItem.remove();
    const overlayToRemove = document.querySelector(`#instructions-overlay[data-conversation-id="${conversationId}"]`);
    if (overlayToRemove) {
      overlayToRemove.remove();
    }
  });
  
  listItem.appendChild(deleteBtn);
  
  listItem.addEventListener('click', () => {
    showOverlay(overlay);
  });
  
  questionList.insertBefore(listItem, questionList.firstChild);
}
