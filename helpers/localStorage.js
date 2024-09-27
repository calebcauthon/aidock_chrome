const keys = {
  'LLM_ENDPOINT': 'llmEndpoint',
  'conversations': 'lavendalChatbotConversations',
  'settings': 'lavendalChatbotSettings'
}

async function getChromeStorageItem(key) {
  const data = await chrome.storage.sync.get(key);
  console.log('getting chrome storage item', key, data);
  return data[key];
}

async function setChromeStorageItem(key, value) {
  console.log('setting chrome storage item', key, value);
  await chrome.storage.sync.set({ [key]: value });
}

async function removeChromeStorageItem(key) {
  await chrome.storage.sync.remove(key);
}

function getLocalStorageItem(key) {
  return localStorage.getItem(keys[key]);
}

function setLocalStorageItem(key, value) {
  localStorage.setItem(keys[key], value);
}

async function clearAllLocalStorage() {
  localStorage.clear();
  await chrome.storage.sync.clear(() => {
    console.log('Chrome storage cleared successfully');
  });
}

async function resetAndRefresh() {
  await clearAllLocalStorage();
  window.location.reload();
}
