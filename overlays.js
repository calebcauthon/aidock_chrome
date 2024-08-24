function createInstructionsOverlay(content, question, conversationId) {
  const instructionsOverlay = document.createElement('div');
  instructionsOverlay.id = 'instructions-overlay';
  instructionsOverlay.style.opacity = '0';
  instructionsOverlay.setAttribute('data-conversation-id', conversationId);
  
  instructionsOverlay.innerHTML = instructionsOverlayTemplate(question, content);
  
  document.body.appendChild(instructionsOverlay);
  
  repositionOverlays();
  
  instructionsOverlay.offsetHeight;
  
  instructionsOverlay.style.opacity = '1';
  
  // Fix: Use instructionsOverlay instead of overlay
  const closeBtn = instructionsOverlay.querySelector('.close-btn');
  closeBtn.addEventListener('click', function() {
    instructionsOverlay.style.display = 'none';
    repositionOverlays();
  });

  const minimizeBtn = instructionsOverlay.querySelector('.minimize-btn');
  minimizeBtn.addEventListener('click', function() {
    const instructionsBody = instructionsOverlay.querySelector('.instructions-body');
    const chatInput = instructionsOverlay.querySelector('.chat-input');
    
    instructionsBody.classList.toggle('minimized');
    chatInput.classList.toggle('minimized');
    
    this.textContent = instructionsBody.classList.contains('minimized') ? '🔼' : '🔽';
  });

  return instructionsOverlay;
}

function updateInstructionsOverlay(overlay, content, question) {
  const instructionsBody = overlay.querySelector('.instructions-body');
  const chatInput = overlay.querySelector('.continue-chat-input');
  const minimizeBtn = overlay.querySelector('.minimize-btn');

  instructionsBody.innerHTML = `<h2>Question: ${question}</h2><p>${content}</p>`;

  let isMinimized = false;

  minimizeBtn.addEventListener('click', () => {
    toggleMinimize(overlay, instructionsBody, chatInput, minimizeBtn, isMinimized);
    isMinimized = !isMinimized;
  });

  chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      const followUpQuestion = chatInput.value.trim();
      if (followUpQuestion) {
        // Get the conversation ID from the overlay's data attribute
        const conversationId = parseInt(overlay.getAttribute('data-conversation-id'));
        const conversation = conversationManager.getConversation(conversationId);
        
        conversation.addMessage('question', followUpQuestion);
        
        instructionsBody.innerHTML += `<p><strong>Q: ${followUpQuestion}</strong></p><p>Loading...</p>`;
        instructionsBody.scrollTop = instructionsBody.scrollHeight;
        
        sendQuestionToBackend(followUpQuestion)
          .then(answer => {
            conversation.addMessage('answer', answer);
            
            const loadingParagraph = instructionsBody.lastElementChild;
            loadingParagraph.textContent = answer;
            instructionsBody.scrollTop = instructionsBody.scrollHeight;
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

  return overlay; // Return the updated overlay
}

function toggleMinimize(overlay, instructionsBody, chatInput, minimizeBtn, isMinimized) {
  overlay.classList.toggle('minimized', !isMinimized);
  instructionsBody.classList.toggle('minimized', !isMinimized);
  chatInput.parentElement.classList.toggle('minimized', !isMinimized);
  minimizeBtn.textContent = !isMinimized ? '🔼' : '🔽';

  setTimeout(() => {
    overlay.style.height = !isMinimized ? '40px' : '';
  }, !isMinimized ? 300 : 0);
}

function createHeadquarters() {
  const headquarters = document.createElement('div');
  headquarters.id = 'headquarters';
  headquarters.className = 'instructions-overlay';
  
  headquarters.innerHTML = headquartersTemplate();
  
  document.body.appendChild(headquarters);
  
  const minimizeBtn = headquarters.querySelector('.minimize-btn');
  minimizeBtn.addEventListener('click', () => toggleMinimize(headquarters));
  
  return headquarters;
}

function addEntryToHeadquarters(question, answer, overlay) {
  const questionList = headquarters.querySelector('#question-list');
  const listItem = document.createElement('li');
  const timestamp = new Date().toLocaleTimeString();
  const truncatedAnswer = answer.substring(0, 20) + (answer.length > 20 ? '...' : '');
  
  listItem.innerHTML = headquartersEntryTemplate(timestamp, question, truncatedAnswer);
  
  listItem.addEventListener('click', () => {
    showOverlay(overlay);
  });
  
  questionList.insertBefore(listItem, questionList.firstChild);
}

function showOverlay(overlay) {
  overlay.style.display = 'flex';
  repositionOverlays();
}

function toggleMinimize(overlay) {
  const instructionsBody = overlay.querySelector('.instructions-body');
  const minimizeBtn = overlay.querySelector('.minimize-btn');
  
  overlay.classList.toggle('minimized');
  instructionsBody.classList.toggle('minimized');
  minimizeBtn.textContent = overlay.classList.contains('minimized') ? '🔼' : '🔽';
  
  if (overlay.id === 'headquarters') {
    overlay.style.height = overlay.classList.contains('minimized') ? '40px' : '';
  }
}