function headquartersTemplate(titleText) {
  return `
    <div class="instructions-content aidock-font aidock-element">
      <div class="handle" style="cursor: ew-resize;">
        <div class="avatar-container">
          <div class="avatar-circle"></div>
        </div>
        <span class="title">${titleText}</span>
        <div class="icons">
          <span class="minimize-btn">🔽</span>
          <span class="new-chat-btn">✏️</span>
          <a href="#" class="settings-btn">⚙️</a>
        </div>
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
