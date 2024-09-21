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
          <button id="logout-btn" class="btn-danger">Logout</button>
        </div>
      </div>
      <div class="resize-handle"></div>
    </div>
  `;
}

function loginOverlayTemplate() {
  const usernameId = 'login-username';
  const passwordId = 'login-password';
  const submitId = 'login-submit';
  const dismissId = 'login-dismiss';
  const containerId = 'login-container';
  const errorMessageId = 'login-error-message';
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
          <div id="${errorMessageId}" class="error-message" style="display: none; color: red; margin-bottom: 10px;"></div>
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

  let originalButtonColor = '';
  let originalButtonText = '';
  return {
    html: html,
    elementIds: {
      usernameId: usernameId,
      passwordId: passwordId,
      submitId: submitId,
      dismissId: dismissId,
      containerId: containerId,
      errorMessageId: errorMessageId
    }, 
    actions: {
      showErrorMessage: function(message) {
        document.getElementById(errorMessageId).textContent = message;
        document.getElementById(errorMessageId).style.display = 'block';
      },
      clearErrorMessage: function() {
        document.getElementById(errorMessageId).textContent = '';
        document.getElementById(errorMessageId).style.display = 'none';
      },
      showLoading: function() {
        const loginButton = document.getElementById(submitId);
        const dismissButton = document.getElementById(dismissId);
        loginButton.disabled = true;
        dismissButton.disabled = true;
        originalButtonColor = loginButton.style.background;
        originalButtonText = loginButton.innerHTML;
        loginButton.innerHTML = 'Authenticating...';
        loginButton.style.background = 'gray';
      },
      hideLoading: function() {
        document.getElementById(submitId).disabled = false;
        document.getElementById(dismissId).disabled = false;
        document.getElementById(submitId).innerHTML = 'Login';
        document.getElementById(submitId).style.background = originalButtonColor;
        document.getElementById(submitId).innerHTML = originalButtonText;
      },
      removeLoginOverlay: function() {
        const loginOverlay = document.getElementById('login-overlay');
        if (loginOverlay && loginOverlay.parentNode) {
          loginOverlay.parentNode.removeChild(loginOverlay);
        }
      }
    }
  };
}

function removeLoginOverlay(overlayElement) {
  if (overlayElement && overlayElement.parentNode) {
    overlayElement.parentNode.removeChild(overlayElement);
  }
}

function displayLoginOverlayTemplate(element) {
  function collectCredentials(elementIds) {
    const username = document.getElementById(elementIds.usernameId).value;
    const password = document.getElementById(elementIds.passwordId).value;

    return { username, password };
  }
  
  function appendHtmlToBody(html) {
    const loginOverlay = document.createElement('div');
    loginOverlay.innerHTML = html;
    element.appendChild(loginOverlay);
  }

  function preventDefaultBehaviors(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  async function updateUiWhileAuthenticating(actions, username, password) {
      actions.showLoading();
      const isAuthenticated = await userManager.authenticate(username, password);
      actions.hideLoading();

      return isAuthenticated;
  }

  function configureDismissButton(elementIds, actions, reject) {
    const dismissButton = document.getElementById(elementIds.dismissId);
    dismissButton.addEventListener('click', function() {
      actions.removeLoginOverlay();
      reject(new Error('Login dismissed'));
    });
  }

  return new Promise((resolve, reject) => {
    const { html, elementIds, actions } = loginOverlayTemplate();

    appendHtmlToBody(html);
    configureDismissButton(elementIds, actions, reject);

    const loginButton = document.getElementById(elementIds.submitId);
    loginButton.addEventListener('mousedown', async function(event) {
      preventDefaultBehaviors(event);
      actions.clearErrorMessage();

      const { username, password } = collectCredentials(elementIds);

      const isAuthenticated = await updateUiWhileAuthenticating(actions, username, password);

      if (isAuthenticated) {
        actions.removeLoginOverlay();
        resolve(username);
      } else {
        actions.showErrorMessage('Login failed!');
        reject('Login failed!');
      }
    });
  });
}

async function promptUserForLogin() {
  try {
    const overlayResult = await displayLoginOverlayTemplate(document.body);
    console.log("overlayResult: " + overlayResult);
    return overlayResult;
  } catch (error) {
    console.log("promptUserForLogin error: " + error);
    return null;
  }
}

function removeDockElements() {
  const dockElements = document.querySelectorAll('.aidock-element');
  dockElements.forEach(element => {
    element.remove();
  });
}
