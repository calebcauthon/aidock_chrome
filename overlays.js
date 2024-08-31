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
      resetOverlayPosition(overlay); // Add this line
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
    if (titleElement.textContent.trim() === 'New Chat') {
      const messages = conversation.messages;
      const title = await callPromptEndpoint(messages[0].content, messages[1].content);
      if (title) {
        conversation.setTitle(title);
        conversationManager.saveConversationsToStorage();
        titleElement.textContent = title;
        const entryElement = headquarters.querySelector(`li[data-conversation-id="${conversation.id}"] .entry-question`);
        if (entryElement) {
          entryElement.textContent = title;
        }
      }
    }
  }

  function setupDraggable(overlay) {
    const handle = overlay.querySelector('.handle');
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    handle.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = overlay.offsetLeft;
      startTop = overlay.offsetTop;
      overlay.style.transition = 'none';
      overlay.style.bottom = 'auto';
      overlay.style.right = 'auto';
    }

    function drag(e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      overlay.style.left = `${startLeft + dx}px`;
      overlay.style.top = `${startTop + dy}px`;
    }

    function stopDragging() {
      isDragging = false;
      overlay.style.transition = '';
      overlay.setAttribute('data-custom-position', 'true'); // Add this line
    }
  }

  function setupResizable(overlay) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    overlay.appendChild(resizeHandle);

    let isResizing = false;
    let startX, startWidth;

    resizeHandle.addEventListener('mousedown', startResizing);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);

    function startResizing(e) {
      isResizing = true;
      startX = e.clientX;
      startWidth = parseInt(document.defaultView.getComputedStyle(overlay).width, 10);
      overlay.style.transition = 'none';
    }

    function resize(e) {
      if (!isResizing) return;
      const width = startWidth + (e.clientX - startX);
      overlay.style.width = `${width}px`;
    }

    function stopResizing() {
      isResizing = false;
      overlay.style.transition = '';
    }
  }

  const chatDiv = document.createElement('div');
  addEmptyChatWindowHtml(chatDiv, conversation);
  repositionOverlays();
  setupCloseButton(chatDiv);
  setupMinimizeButton(chatDiv);
  setupDraggable(chatDiv);
  setupResizable(chatDiv);

  const chatInput = chatDiv.querySelector('.continue-chat-input');

  chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      const followUpQuestion = chatInput.value.trim();
      if (followUpQuestion) {
        const conversation = conversationManager.getConversation(conversationId);
        conversation.addMessage('question', followUpQuestion);
        conversationManager.saveConversationsToStorage();

        trigger(chatDiv, "new-message", conversation);
        addQuestionHtml(chatDiv, followUpQuestion);
        
        // Update this part to send the entire conversation
        sendQuestionToBackend(followUpQuestion, conversation.messages)
          .then(answer => {
            conversation.addMessage('answer', answer);
            conversationManager.saveConversationsToStorage();
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

// Add this new function
function resetOverlayPosition(overlay) {
  overlay.style.left = '';
  overlay.style.top = '';
  overlay.style.bottom = '0';
  overlay.style.right = '0';
  overlay.style.width = ''; // Reset the width
  overlay.removeAttribute('data-custom-position');
}

// Modify the function that opens chats from headquarters
function openChatFromHeadquarters(conversationId) {
  const conversation = conversationManager.getConversation(conversationId);
  let overlay = document.querySelector(`#instructions-overlay[data-conversation-id="${conversationId}"]`);

  if (overlay) {
    resetOverlayPosition(overlay); // Add this line
    overlay.style.display = 'block';
  } else {
    overlay = createInstructionsOverlay(conversation, conversationId);
  }

  repositionOverlays();
}
