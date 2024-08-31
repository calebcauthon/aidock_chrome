function createInstructionsOverlayTemplate(conversation) {
  const title = conversation.title ? conversation.title : "New Chat";
  return `
    <div class="instructions-content">
      <div class="handle">
        <div class="instructions-title">${title}</div>
        <div class="icons">
          <span class="minimize-btn">🔽</span>
          <span class="close-btn">&times;</span>
        </div>
      </div>
      <span class="minimize-btn">🔽</span>
      <span class="close-btn">&times;</span>
      <div class="instructions-body">
        ${conversation.messages.map(message => {
          const timestamp = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const isQuestion = message.type === 'question';
          return `
            <div class="chat-row ${isQuestion ? 'question-row' : 'answer-row'}">
              <div class="avatar-container">
                <div class="avatar-circle"></div>
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="avatar-name">${isQuestion ? 'You' : 'AI'}</span>
                  <span class="timestamp">${timestamp}</span>
                </div>
                <div class="message-body">
                  <p>${isQuestion ? `<strong>${message.content}</strong>` : message.content}</p>
                </div>
              </div>
            </div>
          `;
        }).join('')}
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
      <div class="instructions-body">
        <ul id="question-list" class="question-list"></ul>
      </div>
    </div>
  `;
}

function headquartersEntryTemplate(timestamp, question, messageCount) {
  return `
    <div class="entry-header">
      <span class="entry-message-count">(${messageCount})</span>
      <span class="entry-timestamp">${timestamp}</span>
      <span class="entry-question">${question}</span>
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
          <button id="add-document-btn">Add Userguide</button>
          <table id="document-list"></table>
          <div id="document-edit-form" style="display: none;"></div>
        </div>
      </div>
      <div class="resize-handle"></div>
    </div>
  `;
}

function documentEditTemplate() {
  return `
    <form id="document-edit-form" class="document-edit-form">
      <input type="hidden" id="edit-document-id">
      <div class="form-group">
        <label for="edit-document-name">Userguide Name</label>
        <input type="text" id="edit-document-name" placeholder="Enter userguide name">
      </div>
      <div class="form-group">
        <label for="edit-document-content">Userguide Content</label>
        <textarea id="edit-document-content" placeholder="Enter userguide content"></textarea>
      </div>
      <div class="form-group">
        <label for="edit-document-scope">Scope</label>
        <select id="edit-document-scope">
          <option value="entire-domain">Entire Domain</option>
          <option value="this-page">Just this page</option>
          <option value="custom-url">Custom URL</option>
        </select>
      </div>
      <div class="form-group">
        <label for="edit-document-custom-url">Custom URL</label>
        <input type="text" id="edit-document-custom-url" placeholder="Enter custom URL">
      </div>
      <div class="form-group">
        <label>Roles</label>
        <div class="role-checkboxes">
          <label><input type="checkbox" class="edit-role-checkbox" id="edit-role-admin" value="admin"> Admin</label>
          <label><input type="checkbox" class="edit-role-checkbox" id="edit-role-manager" value="manager"> Manager</label>
          <label><input type="checkbox" class="edit-role-checkbox" id="edit-role-employee" value="employee"> Employee</label>
          <label><input type="checkbox" class="edit-role-checkbox" id="edit-role-customer" value="customer"> Customer</label>
        </div>
      </div>
      <div class="form-group">
        <button id="save-document-btn" class="btn-primary">Save</button>
        <button id="cancel-edit-btn" class="btn-secondary">Cancel</button>
        <button id="delete-document-btn" class="btn-danger">Delete</button>
      </div>
    </form>
  `;
}

function documentTemplate(contextDocument) {
  return `
    <tr class="document-item" data-id="${contextDocument.id}">
      <td class="document-name">${contextDocument.document_name}</td>
      <td class="document-actions">
        <button class="edit-document-btn" data-id="${contextDocument.id}">
          <span class="pencil-btn"></span>
        </button>
      </td>
    </tr>
  `;
}



