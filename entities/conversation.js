class Conversation {
  constructor(id, initialQuestion = null, title = "New Chat") {
    this.id = id;
    this.title = title;
    this.messages = [];
    if (initialQuestion) {
      this.addMessage('question', initialQuestion);
    }
  }

  addMessage(type, content) {
    this.messages.push({
      type,
      content,
      timestamp: new Date()
    });
  }

  setTitle(newTitle) {
    this.title = newTitle;
  }
}
