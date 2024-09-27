let conversationManager = null;
let headquarters = null;
const userManager = new UserManager();

let cancelLoginEvent = null;
async function initialize() {
  await userManager.loadUsername();

  if (cancelLoginEvent != null) { 
    cancelLoginEvent();
  }

  cancelLoginEvent = when(userManager, 'login', async (username) => { 
    const currentUrl = window.location.hostname;
    const isOrganizationWebsite = await checkIfOrganizationWebsite(currentUrl);
    if (isOrganizationWebsite.is_organization_website) {
      console.log(`This is an organization website. Organization ID: ${isOrganizationWebsite.organization_id}`);

      conversationManager = new ConversationManager();
      headquarters = createHeadquarters();
      loadSavedConversations();
    }
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