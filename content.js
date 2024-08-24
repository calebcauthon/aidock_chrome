const overlay = document.createElement('div');
overlay.id = 'extension-overlay';

const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Ask away';

overlay.appendChild(input);
document.body.appendChild(overlay);

// Update the event listener for the main input
input.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    const question = input.value.trim();
    if (question) {
      // Show loading overlay immediately
      const loadingOverlay = createInstructionsOverlay('Loading...', question);
      
      sendQuestionToBackend(question)
        .then(answer => {
          // Update the existing overlay with the answer
          updateInstructionsOverlay(loadingOverlay, answer, question);
        })
        .catch(error => {
          console.error('Error:', error);
          // Update the overlay with an error message
          updateInstructionsOverlay(loadingOverlay, 'An error occurred. Please try again.', question);
        });
      input.value = ''; // Clear the input after sending the question
    }
  }
});

function fadeOutAndRemove(element) {
  element.style.opacity = '0';
  setTimeout(() => {
    document.body.removeChild(element);
    repositionOverlays();
  }, 300); // Adjust this value to match your CSS transition duration
}

function repositionOverlays() {
  const overlays = document.querySelectorAll('#instructions-overlay');
  let rightPosition = 0;
  
  overlays.forEach((overlay, index) => {
    overlay.style.right = `${rightPosition}px`;
    rightPosition += overlay.offsetWidth;
  });
}

function updateInstructionsOverlay(overlay, content, question) {
  const instructionsBody = overlay.querySelector('.instructions-body');
  const chatInput = overlay.querySelector('.continue-chat-input');
  const minimizeBtn = overlay.querySelector('.minimize-btn');

  instructionsBody.innerHTML = `<h2>Question: ${question}</h2><p>${content}</p>`;

  let isMinimized = false;

  minimizeBtn.addEventListener('click', () => {
    isMinimized = !isMinimized;
    overlay.classList.toggle('minimized', isMinimized);
    instructionsBody.classList.toggle('minimized', isMinimized);
    chatInput.parentElement.classList.toggle('minimized', isMinimized);
    minimizeBtn.textContent = isMinimized ? '🔼' : '🔽';

    setTimeout(() => {
      overlay.style.height = isMinimized ? '40px' : '';
    }, isMinimized ? 300 : 0);
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