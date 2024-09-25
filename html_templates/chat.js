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
