function createInstructionsOverlayTemplate(conversation) {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const messages = conversation.messages;
  const question = messages.find(message => message.type === 'question');
  const answer = messages.find(message => message.type === 'answer');
  const title = question ? question.content : "New Chat";
  return `
    <div class="instructions-content">
      <div class="handle instructions-title">${title}</div>
      <span class="minimize-btn">🔽</span>
      <span class="close-btn">&times;</span>
      <div class="instructions-body">
        ${question ? `
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
              <p><strong>${question.content}</strong></p>
            </div>
          </div>
        </div>
        ` : ''}
        ${answer ? `
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
              <p>${answer.content}</p>
            </div>
          </div>
        </div>
        ` : ''}
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
      <div class="handle">
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
      <div class="instructions-body">
        <ul id="question-list" class="question-list"></ul>
      </div>
    </div>
  `;
}

function headquartersEntryTemplate(timestamp, question, messageCount) {
  return `
    <div class="entry-header">
      <span class="entry-message-count">(${ messageCount })</span>
      <span class="entry-timestamp">${ timestamp }</span>
      <span class="entry-question">${ question }</span>
    </div>
  `;
}

function followUpQuestionLoadingTemplate(question) {
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
          <p>Thinking...</p>
        </div>
      </div>
    </div>
  `;
}

function followUpQuestionAnswerTemplate(question, answer) {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `
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
          <p>${answer}</p>
        </div>
      </div>
    </div>
  `;
}

function settingsOverlayTemplate() {
  return `
    <div id="settings-overlay" class="settings-overlay">
      <div class="settings-content">
        <h2>Settings <span class="close-settings-btn">&times;</span></h2>
        <div class="setting-group">
          <label for="llm-endpoint">LLM Server Endpoint:</label>
          <input type="text" id="llm-endpoint" name="llm-endpoint">
        </div>
        <div class="setting-group">
          <h3>Documents</h3>
          <button id="add-document-btn">Add Document</button>
          <ul id="document-list"></ul>
        </div>
      </div>
      <div class="resize-handle"></div>
    </div>
  `;
}

function documentTemplate(id) {
  return `
    <li class="document-item" data-id="[[id]]">
      <input type="text" class="document-name" placeholder="Document Name">
      <textarea class="document-content" placeholder="Document Content"></textarea>
      <div class="document-settings">
        <select class="document-scope">
          <option value="entire-domain">Entire Domain</option>
          <option value="this-page">Just this page</option>
          <option value="custom-url">Custom URL</option>
        </select>
        <input type="text" class="custom-url" placeholder="Custom URL" style="display: none;">
        <div class="role-checkboxes">
          <label><input type="checkbox" value="admin"> Admin</label>
          <label><input type="checkbox" value="manager"> Manager</label>
          <label><input type="checkbox" value="employee"> Employee</label>
          <label><input type="checkbox" value="customer"> Customer</label>
        </div>
      </div>
      <button class="remove-document-btn">Remove</button>
    </li>
  `;
}


