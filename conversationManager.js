class Conversation {
  constructor(id, initialQuestion) {
    this.id = id;
    this.messages = [{
      type: 'question',
      content: initialQuestion,
      timestamp: new Date()
    }];
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

  createConversation(initialQuestion) {
    const id = this.conversations.length + 1;
    const conversation = new Conversation(id, initialQuestion);
    this.conversations.push(conversation);
    return conversation;
  }

  getConversation(id) {
    return this.conversations.find(conv => conv.id === id);
  }
}
