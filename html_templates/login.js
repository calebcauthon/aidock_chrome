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
