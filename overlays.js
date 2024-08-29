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
        conversationManager.saveConversationsToStorage(); // Add this line

        trigger(chatDiv, "new-message", conversation);
        addQuestionHtml(chatDiv, followUpQuestion);
        
        sendQuestionToBackend(followUpQuestion)
          .then(answer => {
            conversation.addMessage('answer', answer);
            conversationManager.saveConversationsToStorage(); // Add this line
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
