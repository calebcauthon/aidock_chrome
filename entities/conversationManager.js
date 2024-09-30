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
    const username = userManager.getUsername();
    const conversationsArray = Array.from(this.conversations.values()).map(conv => ({
      id: conv.id,
      title: conv.title,
      messages: conv.messages,
      username: username // Add username to each conversation
    }));
    setLocalStorageItem('conversations', JSON.stringify({
      username: username,
      conversations: conversationsArray
    }));
  }

  loadConversationsFromStorage() {
    const savedData = getLocalStorageItem('conversations');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const currentUsername = userManager.getUsername();
      
      if (parsedData.username !== currentUsername) {
        // Clear conversations if username doesn't match
        this.clearConversations();
        return;
      }
      
      parsedData.conversations.forEach(conv => {
        const conversation = new Conversation(conv.id, null, conv.title);
        conv.messages.forEach(msg => {
          conversation.addMessage(msg.type, msg.content);
        });
        this.conversations.set(conv.id, conversation);
      });
    }
  }

  clearConversations() {
    this.conversations.clear();
    setLocalStorageItem('conversations', JSON.stringify({
      username: userManager.getUsername(),
      conversations: []
    }));
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
