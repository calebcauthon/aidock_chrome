const overlay = document.createElement('div');
overlay.id = 'extension-overlay';

const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Ask away';

overlay.appendChild(input);

let conversationManager = null;
let headquarters = null;
const userManager = new UserManager();

async function initialize() {
  await userManager.loadUsername();

  when(userManager, 'login', (username) => {
    conversationManager = new ConversationManager();
    headquarters = createHeadquarters();
    loadSavedConversations();

    // Add this function to update the HQ with the username
    function updateHQWithUsername() {
      username = userManager.getUsername();
      const usernameElement = document.querySelector('#hq-username');
      if (usernameElement) {
        usernameElement.textContent = username || 'Not logged in';
      }
    }

    updateHQWithUsername();
  });


  if (!userManager.getUsername()) {
    username = await promptUserForLogin();
    if (username != null) {
      trigger(userManager, 'login', username);
    }
  } else {
    trigger(userManager, 'login', userManager.getUsername());
  }
}

initialize();