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

function createInstructionsOverlay(content, question) {
  const instructionsOverlay = document.createElement('div');
  instructionsOverlay.id = 'instructions-overlay';
  instructionsOverlay.style.opacity = '0';
  
  instructionsOverlay.innerHTML = `
    <div class="instructions-content">
      <div class="handle">${question}</div>
      <span class="close-btn">&times;</span>
      <div class="instructions-body">
        <p>${content}</p>
      </div>
      <div class="chat-input">
        <input type="text" placeholder="Ask away" class="continue-chat-input">
      </div>
      <div class="resize-handle"></div>
    </div>
  `;
  
  document.body.appendChild(instructionsOverlay);
  
  // Set random position
  setRandomPosition(instructionsOverlay);
  
  // Trigger reflow to ensure the opacity transition works
  instructionsOverlay.offsetHeight;
  
  // Set opacity to 1 to start the fade-in effect
  instructionsOverlay.style.opacity = '1';
  
  // Add event listener to close button
  const closeBtn = instructionsOverlay.querySelector('.close-btn');
  closeBtn.addEventListener('click', function() {
    fadeOutAndRemove(instructionsOverlay);
  });

  // Make the overlay draggable and resizable
  makeDraggable(instructionsOverlay);
  makeResizable(instructionsOverlay);

  return instructionsOverlay;
}

function updateInstructionsOverlay(overlay, content, question) {
  const instructionsBody = overlay.querySelector('.instructions-body');
  instructionsBody.innerHTML = `<p>${content}</p>`;
  
  // Update the chat input event listener
  const chatInput = overlay.querySelector('.continue-chat-input');
  chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      const followUpQuestion = chatInput.value.trim();
      if (followUpQuestion) {
        // Show loading message
        instructionsBody.innerHTML += `<p><strong>Q: ${followUpQuestion}</strong></p><p>Loading...</p>`;
        instructionsBody.scrollTop = instructionsBody.scrollHeight;
        
        sendQuestionToBackend(followUpQuestion)
          .then(answer => {
            // Update the existing overlay with the new answer
            const loadingParagraph = instructionsBody.lastElementChild;
            loadingParagraph.textContent = answer;
            instructionsBody.scrollTop = instructionsBody.scrollHeight;
          })
          .catch(error => {
            console.error('Error:', error);
            const loadingParagraph = instructionsBody.lastElementChild;
            loadingParagraph.textContent = 'An error occurred. Please try again.';
          });
        chatInput.value = ''; // Clear the input after sending the question
      }
    }
  });
}

function fadeOutAndRemove(element) {
  element.style.opacity = '0';
  setTimeout(() => {
    document.body.removeChild(element);
  }, 300); // Adjust this value to match your CSS transition duration
}

function setRandomPosition(element) {
  const minX = window.innerWidth * 0.1;
  const maxX = window.innerWidth * 0.9 - element.offsetWidth;
  
  const minY = window.innerHeight * 0.1;
  const maxY = window.innerHeight * 0.9 - element.offsetHeight;
  
  const randomX = Math.floor(Math.random() * (maxX - minX) + minX);
  const randomY = Math.floor(Math.random() * (maxY - minY) + minY);
  
  element.style.left = randomX + 'px';
  element.style.top = randomY + 'px';
}

// This will ensure that makeDraggable and makeResizable are available
if (typeof makeDraggable === 'undefined' || typeof makeResizable === 'undefined') {
  console.error('makeDraggable or makeResizable functions are not defined. Make sure draggable-resizable.js is loaded before content.js');
}