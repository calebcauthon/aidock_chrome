function instructionsOverlayTemplate(question, content) {
  return `
    <div class="instructions-content">
      <div class="handle">${ question }</div>
      <span class="minimize-btn">🔽</span>
      <span class="close-btn">&times;</span>
      <div class="instructions-body">
        <p>${ content }</p>
      </div>
      <div class="chat-input">
        <input type="text" placeholder="Ask away" class="continue-chat-input">
      </div>
    </div>
  `;
}

function headquartersTemplate() {
  return `
    <div class="instructions-content">
      <div class="handle">Past Inquiries</div>
      <span class="minimize-btn">🔽</span>
      <div class="instructions-body">
        <ul id="question-list" class="question-list"></ul>
      </div>
    </div>
  `;
}

function headquartersEntryTemplate(timestamp, question, truncatedAnswer) {
  return `
    <div class="entry-header">
      <span class="entry-timestamp">${ timestamp }</span>
      <span class="entry-question">${ question }</span>
    </div>
    <div class="entry-preview">${ truncatedAnswer }</div>
  `;
}