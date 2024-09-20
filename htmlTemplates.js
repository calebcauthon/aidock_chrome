function createInstructionsOverlayTemplate(conversation) {
  const title = conversation.title ? conversation.title : "New Chat";
  return `
    <div class="instructions-content aidock-font aidock-element">
      <div class="handle">
        <div class="instructions-title">${title}</div>
      </div>
      <span class="minimize-btn">🔽</span>
      <span class="close-btn">&times;</span>
      <div class="instructions-body">
        ${conversation.messages.map(message => {
          const isQuestion = message.type === 'question';
          return `
            <div class="chat-row ${isQuestion ? 'question-row' : 'answer-row'}">
              <div class="avatar-container">
                ${!isQuestion ? '' : '<div class="avatar-circle"></div>'}
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="avatar-name">${isQuestion ? 'You' : 'AI'}</span>
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
  return `
    <div class="chat-row question-row aidock-element">
      <div class="avatar-container">
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="avatar-name">You</span>
        </div>
        <div class="message-body">
          <p><strong>${question}</strong></p>
        </div>
      </div>
    </div>
    <div class="chat-row answer-row">
      <div class="avatar-container">
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="avatar-name">AI</span>
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

function followUpQuestionLoadingTemplate(question) {
  return `
    <div class="chat-row question-row aidock-element">
      <div class="avatar-container">
        <div class="avatar-circle"></div>
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="avatar-name">You</span>
        </div>
        <div class="message-body">
          <p><strong>${question}</strong></p>
        </div>
      </div>
    </div>
    <div class="chat-row answer-row aidock-element">
      <div class="avatar-container">
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="avatar-name">AI</span>
        </div>
        <div class="message-body">
          <p>Thinking...</p>
        </div>
      </div>
    </div>
  `;
}

function followUpQuestionAnswerTemplate(question, answer) {
  return `
    <div class="chat-row answer-row aidock-element">
      <div class="avatar-container">
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="avatar-name">AI</span>
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
    <div id="settings-overlay" class="settings-overlay aidock-element">
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
        <div class="setting-group">
          <button id="logout-btn" class="btn-danger">Logout</button>
        </div>
      </div>
      <div class="resize-handle"></div>
    </div>
  `;
}

function documentEditTemplate() {
  return `
    <form id="document-edit-form" class="document-edit-form aidock-element">
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
    <tr class="document-item aidock-element" data-id="${contextDocument.id}">
      <td class="document-name">${contextDocument.document_name}</td>
      <td class="document-actions">
        <button class="edit-document-btn" data-id="${contextDocument.id}">
          <span class="pencil-btn"></span>
        </button>
      </td>
    </tr>
  `;
}

function loginOverlayTemplate() {
  const usernameId = 'login-username';
  const passwordId = 'login-password';
  const submitId = 'login-submit';
  const dismissId = 'login-dismiss';
  const containerId = 'login-container';
  const html = `
    <div id="login-overlay" class="overlay aidock-element">
      <style>
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .overlay-content {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
      </style>
      <div class="overlay-content">
        <h2>Login</h2>
        <form id="login-form">
          <div class="form-group">
            <label for="${usernameId}">Username</label>
            <input type="text" id="${usernameId}" name="username" placeholder="Enter your username" required>
          </div>
          <div class="form-group">
            <label for="${passwordId}">Password</label>
            <input type="password" id="${passwordId}" name="password" placeholder="Enter your password" required>
          </div>
          <div class="form-actions">
            <button type="submit" id="${submitId}" class="btn-primary">Submit</button>
            <button type="button" id="${dismissId}" class="btn-secondary">Dismiss</button>
          </div>
        </form>
      </div>
    </div>
  `;

  return {
    html: html,
    elementIds: {
      usernameId: usernameId,
      passwordId: passwordId,
      submitId: submitId,
      dismissId: dismissId,
      containerId: containerId
    }
  };
}

function removeLoginOverlay(overlayElement) {
  if (overlayElement && overlayElement.parentNode) {
    overlayElement.parentNode.removeChild(overlayElement);
  }
}

function displayLoginOverlayTemplate(element) {
  return new Promise((resolve, reject) => {
    const loginOverlay = document.createElement('div');
    const { html, elementIds } = loginOverlayTemplate();
    loginOverlay.innerHTML = html;
    element.appendChild(loginOverlay);

    const dismissButton = document.getElementById(elementIds.dismissId);
    dismissButton.addEventListener('click', function() {
      removeLoginOverlay(loginOverlay);
      reject(new Error('Login dismissed'));
    });

    const loginButton = document.getElementById(elementIds.submitId);
    loginButton.addEventListener('click', async function(event) {
      event.preventDefault(); // Prevent form submission
      event.stopPropagation(); // Stop event propagation
      const username = document.getElementById(elementIds.usernameId).value;
      const password = document.getElementById(elementIds.passwordId).value;
      await userManager.authenticate(username, password);
      removeLoginOverlay(loginOverlay);
      resolve(username);
    });
  });
}

async function promptUserForLogin() {
  try {
    return await displayLoginOverlayTemplate(document.body);
  } catch (error) {
    return null;
  }
}

function removeDockElements() {
  const dockElements = document.querySelectorAll('.aidock-element');
  dockElements.forEach(element => {
    element.remove();
  });
}
