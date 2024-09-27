class UserManager {
  constructor() {
    this.username = null;
    this.loadUsername();
  }

  async loadUsername() {
    const username = await getChromeStorageItem('username');
    this.username = username;
    this.updateUsernameDisplay();
  }

  setUsername(newUsername) {
    this.username = newUsername;
    setChromeStorageItem('username', newUsername);
    this.updateUsernameDisplay();
  }

  setToken(newToken) {
    setChromeStorageItem('token', newToken);
    this.token = newToken;
  }

  async getToken() {
    if (!this.token) {
      await this.loadToken();
    }
    return this.token;
  }

  async loadToken() {
    const token = await getChromeStorageItem('token');
    this.token = token;
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
    removeChromeStorageItem('username');
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
