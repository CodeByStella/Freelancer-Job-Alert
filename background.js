chrome.runtime.onMessage.addListener((message) => {
  if (message.type !== 'telegramConfigUpdated') {
    return;
  }

  chrome.tabs.query({ url: 'https://www.freelancer.com/*' }, (tabs) => {
    for (const tab of tabs) {
      if (tab.id == null) continue;
      chrome.tabs.sendMessage(tab.id, message).catch(() => {});
    }
  });
});
