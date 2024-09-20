const overlay = document.createElement('div');
overlay.id = 'extension-overlay';

const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Ask away';

overlay.appendChild(input);


const userManager = new UserManager();

if (userManager.getUsername() === null) {
  console.log('User is not logged in');
  displayLoginOverlayTemplate(document.body);
}

const conversationManager = new ConversationManager();
let headquarters = createHeadquarters();
loadSavedConversations();

// Add this function to update the HQ with the username
function updateHQWithUsername() {
  chrome.storage.sync.get(['username'], function(result) {
    const usernameElement = document.querySelector('#hq-username');
    if (usernameElement) {
      usernameElement.textContent = result.username || 'Not logged in';
    }
  });
}

// Call this function after creating the headquarters
updateHQWithUsername();
