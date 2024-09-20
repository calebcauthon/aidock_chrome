class UserManager {
  constructor() {
    this.username = null;
    this.loadUsername();
  }

  loadUsername() {
    chrome.storage.sync.get(['username'], (result) => {
      this.username = result.username;
      this.updateUsernameDisplay();
    });
  }

  setUsername(newUsername) {
    this.username = newUsername;
    chrome.storage.sync.set({ 'username': newUsername }, () => {
      console.log('Username is set to', newUsername);
      this.updateUsernameDisplay();
    });
  }

  getUsername() {
    return this.username;
  }

  updateUsernameDisplay() {
    const usernameElement = document.querySelector('#hq-username');
    if (usernameElement) {
      usernameElement.textContent = this.username;
    }
  }

  logOut() {
    this.username = null;
    chrome.storage.sync.remove('username');
    this.updateUsernameDisplay();
  }
}
