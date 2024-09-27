function settingsOverlayTemplate() {
  return `
    <div id="settings-overlay" class="settings-overlay aidock-element">
      <div class="settings-content">
        <h2>Settings <span class="close-settings-btn">&times;</span></h2>
        <div class="setting-group">
          <label for="llm-endpoint">LLM Server Endpoint:</label>
          <input type="text" id="llm-endpoint" name="llm-endpoint" placeholder="Leave this blank">
        </div>
        <div class="setting-group">
          <a id="librarian-link" href="" class="btn-primary" target="_blank">⚙️ Configure KT Dock</a>
        </div>
        <div class="setting-group">
          <button id="logout-btn" class="btn-danger">Logout</button>
        </div>
        <div class="setting-group">
          <button id="reset-btn" class="btn-danger">🔄 Reset</button>
        </div>
      </div>
      <div class="resize-handle"></div>
    </div>
  `;
}
