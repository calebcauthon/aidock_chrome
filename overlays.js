function createInstructionsOverlay(conversation, conversationId) {
  function addQuestionHtml(overlay, question) {
    const instructionsBody = overlay.querySelector('.instructions-body');
    instructionsBody.innerHTML += followUpQuestionLoadingTemplate(question);
    instructionsBody.scrollTop = instructionsBody.scrollHeight;
  }

  function addEmptyInstructionsOverlayHtml(overlay, conversation) {
    overlay.id = 'instructions-overlay';
    overlay.offsetHeight;
    overlay.style.opacity = '1';
    overlay.setAttribute('data-conversation-id', conversationId);
    overlay.innerHTML = createInstructionsOverlayTemplate(conversation);
    document.body.appendChild(overlay);
  }

  function setupCloseButton(overlay) {
    const closeBtn = instructionsOverlay.querySelector('.close-btn');
    closeBtn.addEventListener('click', function() {
      overlay.style.display = 'none';
      repositionOverlays();
    });
  }

  const instructionsOverlay = document.createElement('div');
  addEmptyInstructionsOverlayHtml(instructionsOverlay, conversation);
  repositionOverlays();
  setupCloseButton(instructionsOverlay);
  

  const minimizeBtn = instructionsOverlay.querySelector('.minimize-btn');
  minimizeBtn.addEventListener('click', function() {
    toggleMinimize(instructionsOverlay);
  });

  const chatInput = instructionsOverlay.querySelector('.continue-chat-input');

  chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      const followUpQuestion = chatInput.value.trim();
      if (followUpQuestion) {
        // Get the conversation ID from the overlay's data attribute
        const conversation = conversationManager.getConversation(conversationId);
        
        conversation.addMessage('question', followUpQuestion);
        trigger(instructionsOverlay, "new-message", conversation);
        
        addQuestionHtml(instructionsOverlay, followUpQuestion);
        
        sendQuestionToBackend(followUpQuestion)
          .then(answer => {
            conversation.addMessage('answer', answer);
            
            const instructionsBody = instructionsOverlay.querySelector('.instructions-body');
            const loadingParagraph = instructionsBody.lastElementChild;
            loadingParagraph.innerHTML = followUpQuestionAnswerTemplate(followUpQuestion, answer);
            instructionsBody.scrollTop = instructionsBody.scrollHeight;
            trigger(instructionsOverlay, "new-answer", conversation);
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

  when(instructionsOverlay, "new-answer", async (updatedConversation) => {
    if (updatedConversation.messages.filter(msg => msg.type === 'question').length < 1 || 
        updatedConversation.messages.filter(msg => msg.type === 'answer').length < 1) {
      return;
    }


    const titleElement = instructionsOverlay.querySelector('.instructions-title');
    if (titleElement.textContent.trim() !== 'New Chat') {
      return;
    }

    const messages = updatedConversation.messages;
    const title = await callPromptEndpoint(messages[0].content, messages[1].content);
    if (title) {
      if (titleElement && titleElement.textContent.trim() === 'New Chat') {
        titleElement.textContent = title;
        const entryElement = headquarters.querySelector(`li[data-conversation-id="${updatedConversation.id}"] .entry-question`);
        if (entryElement && entryElement.textContent.trim() === 'New Chat') {
          entryElement.textContent = title;
        }
      }
    }
  });

  return instructionsOverlay;
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
