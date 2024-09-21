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
    const isAuthenticated = await authenticateUser(username, password);
    if (isAuthenticated) {
      this.setUsername(username);
    }
    return isAuthenticated;
  }
}
