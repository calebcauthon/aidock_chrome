let conversationManager = null;
let headquarters = null;
const userManager = new UserManager();

async function initialize() {
  await userManager.loadUsername();

  when(userManager, 'login', (username) => {
    console.log("login event triggered with username: " + username);
    conversationManager = new ConversationManager();
    headquarters = createHeadquarters();
    loadSavedConversations();

    // Add this function to update the HQ with the username
    function updateHQWithUsername() {
      let username = userManager.getUsername();
      const usernameElement = document.querySelector('#hq-username');
      if (usernameElement) {
        usernameElement.textContent = username || 'Not logged in';
      }
    }

    updateHQWithUsername();
  });


  let username = null;
  if (!userManager.getUsername()) {
    username = await promptUserForLogin();

    if (username != null) {
      console.log("uname aint login event triggered with username: " + username);
      trigger(userManager, 'login', username);
    }
  } else {
    trigger(userManager, 'login', userManager.getUsername());
  }
}

initialize();