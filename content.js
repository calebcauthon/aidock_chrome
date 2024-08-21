const overlay = document.createElement('div');
overlay.id = 'extension-overlay';

const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Ask away';

overlay.appendChild(input);
document.body.appendChild(overlay);

// Add event listener for Enter key press
input.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    const question = input.value.trim();
    if (question) {
      sendQuestionToBackend(question);
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
    document.body.removeChild(instructionsOverlay);
  });

  // Make the overlay draggable
  makeDraggable(instructionsOverlay);

  // Make the overlay resizable
  makeResizable(instructionsOverlay);
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