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
      conversationManager = new ConversationManager();
      headquarters = createHeadquarters();
      loadSavedConversations();
    }

    // New: Fetch and log session user info
    
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

// New function to fetch and log session user info
async function fetchAndLogSessionUserInfo() {
  try {
    const llmEndpoint = getLLMEndpoint();
    const loginToken = await userManager.getToken();

    const response = await fetch(`${llmEndpoint}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Login-Token': loginToken
      }
    });

    if (!response.ok) {
      userManager.logOut();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.login_token) {
      const role = data.role;
      const username = data.username;
      userManager.setToken(data.login_token);
      userManager.setUsername(username);
      userManager.setRole(role);
      userManager.setOrganizationId(data.organization_id);
    }
  } catch (error) {
    console.error('Error fetching session user info:', error);
  }
}

async function verifyAndInitialize() {
  const token = await userManager.getToken();
  if (token) {
    const isValid = await verifyToken(token);
    if (isValid) {
      await initialize();
    } else {
      userManager.logOut();
    }
  }
}


fetch(chrome.runtime.getURL('config.json'))
.then(response => response.json())
.then(config => {
  DEFAULT_LLM_ENDPOINT = config.llmEndpoint;
})
.then(async () => {
  await userManager.loadOrganizationId();
  await userManager.loadOrganizationSettings();
  const username = await userManager.getUsername();
  if (username == null) {
    await fetchAndLogSessionUserInfo();
  } else {
    await verifyAndInitialize();
  }
});
