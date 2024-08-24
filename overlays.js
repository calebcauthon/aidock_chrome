function createInstructionsOverlay(content, question) {
  const instructionsOverlay = document.createElement('div');
  instructionsOverlay.id = 'instructions-overlay';
  instructionsOverlay.style.opacity = '0';
  
  instructionsOverlay.innerHTML = `
    <div class="instructions-content">
      <div class="handle">${question}</div>
      <span class="minimize-btn">🔽</span>
      <span class="close-btn">&times;</span>
      <div class="instructions-body">
        <p>${content}</p>
      </div>
      <div class="chat-input">
        <input type="text" placeholder="Ask away" class="continue-chat-input">
      </div>
    </div>
  `;
  
  // Remove the existing positioning logic and add the new overlay to the document
  document.body.appendChild(instructionsOverlay);
  
  // Reposition all overlays, including the new one
  repositionOverlays();
  
  // Trigger reflow to ensure the opacity transition works
  instructionsOverlay.offsetHeight;
  
  // Set opacity to 1 to start the fade-in effect
  instructionsOverlay.style.opacity = '1';
  
  // Add event listener to close button
  const closeBtn = instructionsOverlay.querySelector('.close-btn');
  closeBtn.addEventListener('click', function() {
    fadeOutAndRemove(instructionsOverlay);
  });

  // Add event listener to minimize button
  const minimizeBtn = instructionsOverlay.querySelector('.minimize-btn');
  minimizeBtn.addEventListener('click', function() {
    const instructionsBody = instructionsOverlay.querySelector('.instructions-body');
    const chatInput = instructionsOverlay.querySelector('.chat-input');
    
    instructionsBody.classList.toggle('minimized');
    chatInput.classList.toggle('minimized');
    
    // Toggle emoji
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
        instructionsBody.innerHTML += `<p><strong>Q: ${followUpQuestion}</strong></p><p>Loading...</p>`;
        instructionsBody.scrollTop = instructionsBody.scrollHeight;
        
        sendQuestionToBackend(followUpQuestion)
          .then(answer => {
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