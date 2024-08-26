class Conversation {
  constructor(id, initialQuestion) {
    this.id = id;
    if (initialQuestion) {
      this.messages = [{
        type: 'question',
        content: initialQuestion,
        timestamp: new Date()
      }];
    } else {
      this.messages = [];
    }
  }

  addMessage(type, content) {
    this.messages.push({
      type,
      content,
      timestamp: new Date()
    });
  }
}

class Conversations {
  constructor() {
    this.conversations = [];
  }

  createBlankConversation() {
    const id = this.conversations.length + 1 + Math.random().toString(36).substring(2, 7);
    const conversation = new Conversation(id);
    this.conversations.push(conversation);
    return conversation;
  }

  createConversation(initialQuestion) {
    const id = this.conversations.length + 1 + Math.random().toString(36).substring(2, 7);
    const conversation = new Conversation(id, initialQuestion);
    this.conversations.push(conversation);
    return conversation;
  }

  getConversation(id) {
    return this.conversations.find(conv => conv.id === id);
  }
}
