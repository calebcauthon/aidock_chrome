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
  instructionsOverlay.style.opacity = '0';
  
  instructionsOverlay.innerHTML = `
    <div class="instructions-content">
      <div class="handle">Instructions</div>
      <span class="close-btn">&times;</span>
      <div class="instructions-body">
        <p>This is a sample instruction.</p>
        <p>You can add more details here.</p>
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
  
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);
  
  element.style.left = randomX + 'px';
  element.style.top = randomY + 'px';
}

function makeDraggable(element) {
  const handle = element.querySelector('.handle');
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  handle.addEventListener('mousedown', startDragging);

  function startDragging(e) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = element.offsetLeft;
    startTop = element.offsetTop;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
  }

  function drag(e) {
    if (isDragging) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      element.style.left = startLeft + deltaX + 'px';
      element.style.top = startTop + deltaY + 'px';
    }
  }

  function stopDragging() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDragging);
  }
}

function makeResizable(element) {
  const resizeHandle = element.querySelector('.resize-handle');
  let isResizing = false;
  let startX, startY, startWidth, startHeight;

  resizeHandle.addEventListener('mousedown', startResizing);

  function startResizing(e) {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = element.offsetWidth;
    startHeight = element.offsetHeight;
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);
  }

  function resize(e) {
    if (isResizing) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      element.style.width = startWidth + deltaX + 'px';
      element.style.height = startHeight + deltaY + 'px';
    }
  }

  function stopResizing() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResizing);
  }
}