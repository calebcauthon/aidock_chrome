let DEFAULT_LLM_ENDPOINT = '';
function getLLMEndpoint() {
  const savedSettings = getLocalStorageItem('settings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    return settings.llmEndpoint || DEFAULT_LLM_ENDPOINT;
  }
  return DEFAULT_LLM_ENDPOINT;
}

async function sendQuestionToBackend(question, conversationMessages) {
  const url = window.location.href;
  const pageTitle = document.title;
  const selectedText = window.getSelection().toString();
  const activeElement = document.activeElement.tagName.toLowerCase();
  const scrollPosition = window.scrollY;

  const data = {
    question: question,
    url: url,
    pageTitle: pageTitle,
    selectedText: selectedText,
    activeElement: activeElement,
    scrollPosition: scrollPosition,
    conversationMessages: conversationMessages,
  };

  const llmEndpoint = getLLMEndpoint();

  const loginToken = await userManager.getToken();
  return fetch(`${llmEndpoint}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Login-Token': loginToken
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      throw new Error(data.error);
    }
    return data.answer;
  });
}

function callPromptEndpoint(question, answer) {
  const llmEndpoint = getLLMEndpoint();
  const login_token = "fake-token";

  return fetch(`${llmEndpoint}/prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, answer, login_token }),
  })
  .then(response => response.json())
  .then(data => data.title)
  .catch(error => {
    console.error('Error calling /prompt:', error);
    return null;
  });
}

async function getContextDocuments() {
  const llmEndpoint = getLLMEndpoint();

  const response = await fetch(`${llmEndpoint}/context_docs/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

async function getContextDocument(docId) {
  const llmEndpoint = getLLMEndpoint();

  const response = await fetch(`${llmEndpoint}/context_docs/${docId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

async function saveDocument(contextDocument) {
  const llmEndpoint = getLLMEndpoint();
  const isUpdate = !!contextDocument.id;
  const endpoint = isUpdate ? `/context_docs/${contextDocument.id}` : '/context_docs/';

  try {
    const response = await fetch(`${llmEndpoint}${endpoint}`, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contextDocument)
    });

    const data = await response.json();

    if (data.id || (isUpdate && data.message)) {
      await loadDocuments();
      showSuccessMessage('Document saved successfully!');
      return true; // Indicate success
    } else {
      console.error('Error saving document:', data.error);
      showErrorMessage('Error saving document. Please try again.');
      return false; // Indicate failure
    }
  } catch (error) {
    console.error('Error:', error);
    showErrorMessage('An error occurred. Please try again.');
    return false; // Indicate failure
  }
}

async function deleteDocument(docId) {
  const llmEndpoint = getLLMEndpoint();

  try {
    const response = await fetch(`${llmEndpoint}/context_docs/${docId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.message && data.message.toLowerCase().includes('success')) {
      showSuccessMessage('Document deleted successfully');
      return true;
    } else {
      showErrorMessage(data.error || 'Error deleting document');
      return false;
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    showErrorMessage('An error occurred while deleting the document. Please try again.');
    return false;
  }
}

async function authenticateUser(username, password) {
  const llmEndpoint = getLLMEndpoint();

  try {
    const response = await fetch(`${llmEndpoint}/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.token) {
      userManager.setUsername(username);
      return { isAuthenticated: true, token: data.token };
    } else {
      showErrorMessage(data.error || 'Authentication failed', document.body);
      return { isAuthenticated: false, token: null };
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    showErrorMessage('An error occurred during authentication. Please try again.', document.body);
    return { isAuthenticated: false, token: null };
  }
}

fetch(chrome.runtime.getURL('config.json'))
.then(response => response.json())
.then(config => {
  DEFAULT_LLM_ENDPOINT = config.llmEndpoint;
});
