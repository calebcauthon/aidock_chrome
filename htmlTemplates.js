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