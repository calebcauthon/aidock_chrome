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
    createInstructionsOverlay();
  }
});

function createInstructionsOverlay() {
  const instructionsOverlay = document.createElement('div');
  instructionsOverlay.id = 'instructions-overlay';
  
  instructionsOverlay.innerHTML = `
    <div class="instructions-content">
      <span class="close-btn">&times;</span>
      <h2>Instructions</h2>
      <p>This is a sample instruction.</p>
      <p>You can add more details here.</p>
    </div>
  `;
  
  document.body.appendChild(instructionsOverlay);
  
  // Add event listener to close button
  const closeBtn = instructionsOverlay.querySelector('.close-btn');
  closeBtn.addEventListener('click', function() {
    document.body.removeChild(instructionsOverlay);
  });
}