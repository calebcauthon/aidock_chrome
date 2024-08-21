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