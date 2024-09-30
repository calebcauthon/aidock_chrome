class UserManager {
  constructor() {
    this.username = null;
    this.loadUsername();
    this.loadRole();
    this.organizationSettings = null;
  }

  async loadUsername() {
    const username = await getChromeStorageItem('username');
    this.username = username;
    this.updateUsernameDisplay();
    return username;
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

  setRole(newRole) {
    this.role = newRole;
    setChromeStorageItem('role', newRole);
  }

  async loadRole() {
    const role = await getChromeStorageItem('role');
    this.role = role;
  }

  getRole() {
    return this.role;
  }

  setOrganizationId(newOrganizationId) {
    this.organizationId = newOrganizationId;
    setChromeStorageItem('organizationId', newOrganizationId);
  }

  getOrganizationId() {
    return this.organizationId;
  } 

  async loadOrganizationId() {
    const organizationId = await getChromeStorageItem('organizationId');
    this.organizationId = organizationId;
  }

  async loadOrganizationSettings() {
    const settings = await fetchOrganizationSettings();
    this.organizationSettings = settings;
    return settings;
  }

  getOrganizationSettings() {
    return this.organizationSettings;
  }

  getUsername() {
    return this.username;
  }

  updateUsernameDisplay() {
    const usernameElement = document.querySelector('#hq-username');
    if (usernameElement) {
      usernameElement.textContent = this.getUsername();
    }

  }

  logOut() {
    this.username = null;
  clearAllLocalStorage();
    removeChromeStorageItem('username');
    removeChromeStorageItem('role');
    removeChromeStorageItem('token');
    removeChromeStorageItem('organizationId');
    this.updateUsernameDisplay();
  }

  async authenticate(username, password) {
    const { isAuthenticated, token, role, organization_id } = await authenticateUser(username, password);
    if (isAuthenticated) {
      this.setUsername(username);
      this.setToken(token);
      this.setRole(role);
      this.setOrganizationId(organization_id);
    }
    return isAuthenticated;
  }

  getOrganizationSetting(settingName, defaultValue = null) {
    if (this.organizationSettings && this.organizationSettings.hasOwnProperty(settingName)) {
      return this.organizationSettings[settingName];
    }
    return defaultValue;
  }
}
