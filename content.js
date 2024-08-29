const overlay = document.createElement('div');
overlay.id = 'extension-overlay';

const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Ask away';

overlay.appendChild(input);


const conversationManager = new ConversationManager();
let headquarters = createHeadquarters();
loadSavedConversations();
