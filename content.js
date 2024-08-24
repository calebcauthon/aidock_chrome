const overlay = document.createElement('div');
overlay.id = 'extension-overlay';

const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Ask away';

overlay.appendChild(input);
document.body.appendChild(overlay);

let headquarters;
const conversationManager = new Conversations();

// Update the event listener for the main input
input.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    const question = input.value.trim();
    if (question) {
      if (!headquarters) {
        headquarters = createHeadquarters();
      }
      
      // Create a new conversation
      const conversation = conversationManager.createConversation(question);
      
      // Show loading overlay immediately
      const loadingOverlay = createInstructionsOverlay('Loading...', question);
      
      sendQuestionToBackend(question)
        .then(answer => {
          // Add answer to the conversation
          conversation.addMessage('answer', answer);
          
          // Update the existing overlay with the answer
          const updatedOverlay = updateInstructionsOverlay(loadingOverlay, answer, question);
          // Add entry to headquarters
          addEntryToHeadquarters(question, answer, updatedOverlay);
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
  const overlays = document.querySelectorAll('#instructions-overlay:not(#headquarters)');
  let rightPosition = headquarters.offsetWidth;
  
  overlays.forEach((overlay) => {
    if (overlay.style.display !== 'none') {
      overlay.style.right = `${rightPosition}px`;
      rightPosition += overlay.offsetWidth;
    }
  });
}