let conversationManager = null;
let headquarters = null;
const userManager = new UserManager();

let cancelLoginEvent = null;
async function initialize() {
  await userManager.loadUsername();

  if (cancelLoginEvent != null) { 
    cancelLoginEvent();
  }

  cancelLoginEvent = when(userManager, 'login', (username) => {
    console.log("login event triggered with username: " + username);
    conversationManager = new ConversationManager();

    headquarters = createHeadquarters();
    loadSavedConversations();
  });


  let username = null;
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