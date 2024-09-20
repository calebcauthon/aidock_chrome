const overlay = document.createElement('div');
overlay.id = 'extension-overlay';

const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Ask away';

overlay.appendChild(input);


const userManager = new UserManager();
let conversationManager = null;
let headquarters = null;

when(userManager, 'login', (username) => {
  conversationManager = new ConversationManager();
  headquarters = createHeadquarters();
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

  updateHQWithUsername();
});


let username = userManager.getUsername();

if (username == null) {
  promptUserForLogin().then(username => {
    if (username != null) {
      trigger(userManager, 'login', username);
    }
  });
} else {
  trigger(userManager, 'login', username);
}

