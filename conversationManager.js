class Conversation {
  constructor(id, initialQuestion = null) {
    this.id = id;
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
}

class ConversationManager {
  constructor() {
    this.conversations = new Map();
    this.loadConversationsFromStorage();
  }

  createBlankConversation() {
    const id = this.generateId();
    const conversation = new Conversation(id);
    this.conversations.set(id, conversation);
    this.saveConversationsToStorage();
    return conversation;
  }

  createConversation(initialQuestion) {
    const id = this.generateId();
    const conversation = new Conversation(id, initialQuestion);
    this.conversations.set(id, conversation);
    this.saveConversationsToStorage();
    return conversation;
  }

  getConversation(id) {
    return this.conversations.get(id);
  }

  generateId() {
    return this.conversations.size + 1 + Math.random().toString(36).substring(2, 7);
  }

  saveConversationsToStorage() {
    const conversationsArray = Array.from(this.conversations.values());
    localStorage.setItem('lavendalChatbotConversations', JSON.stringify(conversationsArray));
  }

  loadConversationsFromStorage() {
    const savedConversations = localStorage.getItem('lavendalChatbotConversations');
    if (savedConversations) {
      const conversationsArray = JSON.parse(savedConversations);
      conversationsArray.forEach(conv => {
        const conversation = new Conversation(conv.id);
        conv.messages.forEach(msg => {
          conversation.addMessage(msg.type, msg.content);
        });
        this.conversations.set(conv.id, conversation);
      });
    }
  }

  deleteConversation(id) {
    this.conversations.delete(id);
    this.saveConversationsToStorage();
  }
}
