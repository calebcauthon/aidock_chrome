function createInstructionsOverlayTemplate(question) {
  return `
    <div class="instructions-content">
      <div class="handle">${question}</div>
      <span class="minimize-btn">🔽</span>
      <span class="close-btn">&times;</span>
      <div class="instructions-body">
        <p>Loading...</p>
      </div>
      <div class="chat-input">
        <input type="text" placeholder="Ask away" class="continue-chat-input">
      </div>
    </div>
  `;
}

function updateInstructionsOverlayTemplate(question, content) {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `
    <div class="chat-row question-row">
      <div class="avatar-container">
        <div class="avatar-circle"></div>
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="avatar-name">You</span>
          <span class="timestamp">${timestamp}</span>
        </div>
        <div class="message-body">
          <p><strong>${question}</strong></p>
        </div>
      </div>
    </div>
    <div class="chat-row answer-row">
      <div class="avatar-container">
        <div class="avatar-circle"></div>
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="avatar-name">AI</span>
          <span class="timestamp">${timestamp}</span>
        </div>
        <div class="message-body">
          <p>${content}</p>
        </div>
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

function followUpQuestionLoadingTemplate(question) {
  return `
    <div class="chat-row question-row">
      <div class="avatar-container">
        <div class="avatar-circle"></div>
        <div class="avatar-name">You</div>
      </div>
      <div class="message-content">
        <p><strong>${ question }</strong></p>
      </div>
    </div>
    <div class="chat-row answer-row">
      <div class="message-content">
        <p>Thinking...</p>
      </div>
      <div class="avatar-container">
        <div class="avatar-circle"></div>
        <div class="avatar-name">AI</div>
      </div>
    </div>
  `;
}

function followUpQuestionAnswerTemplate(question, answer) {
  return `
    <div class="chat-row answer-row">
      <div class="message-content">
        <p>${ answer }</p>
      </div>
      <div class="avatar-container">
        <div class="avatar-circle"></div>
        <div class="avatar-name">AI</div>
      </div>
    </div>
  `;
}