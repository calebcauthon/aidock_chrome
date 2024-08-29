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

  createConversation(initialQuestion, title = "New Chat") {
    const id = this.generateId();
    const conversation = new Conversation(id, initialQuestion, title);
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
    const conversationsArray = Array.from(this.conversations.values()).map(conv => ({
      id: conv.id,
      title: conv.title,
      messages: conv.messages
    }));
    localStorage.setItem('lavendalChatbotConversations', JSON.stringify(conversationsArray));
  }

  loadConversationsFromStorage() {
    const savedConversations = localStorage.getItem('lavendalChatbotConversations');
    if (savedConversations) {
      const conversationsArray = JSON.parse(savedConversations);
      conversationsArray.forEach(conv => {
        const conversation = new Conversation(conv.id, null, conv.title);
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

  updateConversationTitle(id, newTitle) {
    const conversation = this.getConversation(id);
    if (conversation) {
      conversation.setTitle(newTitle);
      this.saveConversationsToStorage();
    }
  }
}
