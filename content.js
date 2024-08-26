const overlay = document.createElement('div');
overlay.id = 'extension-overlay';

const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Ask away';

overlay.appendChild(input);
//document.body.appendChild(overlay);

let headquarters = createHeadquarters();
const conversationManager = new Conversations();

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
  
  overlays.forEach((overlay, index) => {
    if (overlay.style.display !== 'none') {
      overlay.style.right = `${rightPosition + (index * 10)}px`;
      rightPosition += overlay.offsetWidth + (index * 10)
    }
  });
}