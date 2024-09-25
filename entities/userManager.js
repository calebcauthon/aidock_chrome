class UserManager {
  constructor() {
    this.username = null;
    this.loadUsername();
  }

  async loadUsername() {
    const result = await chrome.storage.sync.get(['username']);
    this.username = result.username;
    this.updateUsernameDisplay();
  }

  setUsername(newUsername) {
    this.username = newUsername;
    chrome.storage.sync.set({ 'username': newUsername }, () => {
      this.updateUsernameDisplay();
    });
  }

  setToken(newToken) {
    chrome.storage.sync.set({ 'token': newToken });
    this.token = newToken;
  }

  async getToken() {
    if (!this.token) {
      await this.loadToken();
    }
    return this.token;
  }

  async loadToken() {
    const result = await chrome.storage.sync.get(['token']);
    this.token = result.token;
  }

  getUsername() {
    return this.username;
  }

  updateUsernameDisplay() {
    const usernameElement = document.querySelector('#hq-username');
    if (usernameElement) {
      console.log("updating username display to: " + this.getUsername());
      usernameElement.textContent = this.getUsername();
    }

  }

  logOut() {
    this.username = null;
    chrome.storage.sync.remove('username');
    this.updateUsernameDisplay();
  }

  async authenticate(username, password) {
    const { isAuthenticated, token } = await authenticateUser(username, password);
    if (isAuthenticated) {
      this.setUsername(username);
      this.setToken(token);
    }
    return isAuthenticated;
  }
}
