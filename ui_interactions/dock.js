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
  
  // Replace the settings button with a link
  const settingsLink = headquarters.querySelector('.settings-btn');
  updateSettingsLink(settingsLink);

  // Add this line to enable dragging
  setupHeadquartersDragging(headquarters);

  return headquarters;
}

// Add this new function to update the settings link
async function updateSettingsLink(settingsLink) {
  const token = await userManager.getToken();
  const baseUrl = userManager.getRole() === 'librarian' ? `${getLLMEndpoint()}/librarian` : `${getLLMEndpoint()}/profile`;
  const url = token ? `${baseUrl}?login_token=${token}` : baseUrl;
  
  settingsLink.href = url;
  settingsLink.target = '_blank';
  settingsLink.title = 'Open settings in a new tab';
  settingsLink.style.textDecoration = 'none';
  settingsLink.style.color = 'inherit';
}

function loadSavedConversations() {
  conversationManager.conversations.forEach((conversation) => {
    const lastAnswer = conversation.messages.filter(msg => msg.type === 'answer').pop();
    const overlay = createInstructionsOverlay(conversation, conversation.id);
    addEntryToHeadquarters(conversation.title, lastAnswer ? lastAnswer.content : null, overlay);
    
    // Scroll to the bottom of the conversation
    scrollChatToBottom(overlay);
    
    overlay.style.display = 'none';
  });
}

function addEntryToHeadquarters(title, answer, overlay) {
  const questionList = headquarters.querySelector('#question-list');
  const listItem = document.createElement('li');
  
  listItem.innerHTML = headquartersEntryTemplate(title);
  listItem.setAttribute('data-conversation-id', overlay.getAttribute('data-conversation-id'));
  
  const deleteBtn = listItem.querySelector('.delete-chat-btn');
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
  
  listItem.addEventListener('click', () => {
    showOverlay(overlay);
  });
  
  questionList.insertBefore(listItem, questionList.firstChild);
}

function setupHeadquartersDragging(headquarters) {
  const handle = headquarters.querySelector('.handle');
  let isDragging = false;
  let startX, startLeft;

  handle.addEventListener('mousedown', startDragging);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDragging);

  function startDragging(e) {
    isDragging = true;
    startX = e.clientX;
    startLeft = headquarters.offsetLeft;
    headquarters.style.transition = 'none';
  }

  function drag(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    let newLeft = startLeft + dx;
    
    // Constrain the movement to the viewport width
    const maxLeft = window.innerWidth - headquarters.offsetWidth;
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    
    headquarters.style.left = `${newLeft}px`;
    headquarters.style.right = 'auto';
  }

  function stopDragging() {
    isDragging = false;
    headquarters.style.transition = '';
  }
}

function scrollChatToBottom(chatOverlay) {
  const instructionsBody = chatOverlay.querySelector('.instructions-body');
  if (instructionsBody) {
    instructionsBody.scrollTop = instructionsBody.scrollHeight;
  }
}
