function getLLMEndpoint() {
  const savedSettings = localStorage.getItem('lavendalChatbotSettings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    return settings.llmEndpoint || 'http://localhost:5000';
  }
  return 'http://localhost:5000'; // Default fallback
}

function sendQuestionToBackend(question) {
  const url = window.location.href;
  const pageTitle = document.title;
  const selectedText = window.getSelection().toString();
  const activeElement = document.activeElement.tagName.toLowerCase();
  const scrollPosition = window.scrollY;

  const data = {
    question: question,
    url: url,
    pageTitle: pageTitle,
    selectedText: selectedText,
    activeElement: activeElement,
    scrollPosition: scrollPosition
  };

  const llmEndpoint = getLLMEndpoint();

  return fetch(`${llmEndpoint}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      throw new Error(data.error);
    }
    return data.answer;
  });
}

function callPromptEndpoint(question, answer) {
  const llmEndpoint = getLLMEndpoint();

  return fetch(`${llmEndpoint}/prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, answer }),
  })
  .then(response => response.json())
  .then(data => data.title)
  .catch(error => {
    console.error('Error calling /prompt:', error);
    return null;
  });
}
