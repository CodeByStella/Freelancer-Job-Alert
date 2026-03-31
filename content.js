let pageScriptInjected = false;

loadCredentialsAndObserve();

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'telegramConfigUpdated') {
    loadCredentialsAndObserve();
  }
  sendResponse({ received: true });
});

function postCredentialsToPage(botToken, chatId) {
  window.postMessage(
    {
      type: 'FROM_EXTENSION',
      credentials: { botToken: botToken || '', chatId: chatId || '' },
    },
    '*'
  );
}

function loadCredentialsAndObserve() {
  chrome.storage.sync.get(['botToken', 'chatId'], (result) => {
    const botToken = result.botToken;
    const chatId = result.chatId;

    if (!botToken || !chatId) {
      if (pageScriptInjected) {
        postCredentialsToPage('', '');
      }
      console.warn('Freelancer Notifier: Telegram credentials not set.');
      return;
    }

    if (!pageScriptInjected) {
      pageScriptInjected = true;
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('inject.js');
      script.onload = () => {
        script.remove();
        postCredentialsToPage(botToken, chatId);
      };
      (document.head || document.documentElement).appendChild(script);
    } else {
      postCredentialsToPage(botToken, chatId);
    }
  });
}
