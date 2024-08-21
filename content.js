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

function sendQuestionToBackend(question) {
  const url = window.location.href;
  const pageTitle = document.title;
  const selectedText = window.getSelection().toString();
  const activeElement = document.activeElement.tagName.toLowerCase();
  const scrollPosition = window.scrollY;

  const data = {
    question: question,
    url: url,
    pageTitle: pageTitle,
    selectedText: selectedText,
    activeElement: activeElement,
    scrollPosition: scrollPosition
  };

  fetch('http://localhost:5000/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      if (data.answer) {
        createInstructionsOverlay(data.answer, question);
      } else if (data.error) {
        console.error('Error:', data.error);
        // Handle error (e.g., show an error message to the user)
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      // Handle network errors
    });
}

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
  const maxX = window.innerWidth - element.offsetWidth;
  const maxY = window.innerHeight - element.offsetHeight;
  
  const minY = window.innerHeight * 0.1;
  const maxYAdjusted = window.innerHeight * 0.9 - element.offsetHeight;
  
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * (maxYAdjusted - minY) + minY);
  
  element.style.left = randomX + 'px';
  element.style.top = randomY + 'px';
}

// This will ensure that makeDraggable and makeResizable are available
if (typeof makeDraggable === 'undefined' || typeof makeResizable === 'undefined') {
  console.error('makeDraggable or makeResizable functions are not defined. Make sure draggable-resizable.js is loaded before content.js');
}