function headquartersTemplate() {
  return `
    <div class="instructions-content aidock-font aidock-element">
      <div class="handle" style="cursor: ew-resize;">
        <div class="avatar-container">
          <div class="avatar-circle"></div>
        </div>
        <span class="title">Messaging</span>
        <div class="icons">
          <span class="minimize-btn">🔽</span>
          <span class="new-chat-btn">✏️</span>
          <span class="settings-btn">⚙️</span>
        </div>
      </div>
      <div class="user-info">
        <span id="hq-username">User</span>
      </div>
      <div class="instructions-body">
        <ul id="question-list" class="question-list"></ul>
      </div>
    </div>
  `;
}

function headquartersEntryTemplate(title) {
  return `
    <span class="entry-question aidock-element">${title}</span>
    <button class="delete-chat-btn aidock-element" title="Delete chat">🗑️</button>
  `;
}

function removeDockElements() {
  const dockElements = document.querySelectorAll('.aidock-element');
  dockElements.forEach(element => {
    element.remove();
  });
}
