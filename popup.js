document.addEventListener('DOMContentLoaded', () => {
  const botTokenInput = document.getElementById('botToken');
  const chatIdInput = document.getElementById('chatId');
  const saveBtn = document.getElementById('saveBtn');
  const testBtn = document.getElementById('testBtn');
  const resetBtn = document.getElementById('resetBtn');
  const feedbackMsg = document.getElementById('feedbackMsg');

  /** Typical Telegram bot token: digits, colon, then 35+ URL-safe chars (length can vary slightly). */
  function isPlausibleBotToken(token) {
    return /^\d+:[A-Za-z0-9_-]{30,}$/.test(token);
  }

  function showFeedback(kind, text) {
    feedbackMsg.className = 'msg';
    if (!text) {
      feedbackMsg.style.display = 'none';
      return;
    }
    feedbackMsg.textContent = text;
    feedbackMsg.classList.add(kind);
    feedbackMsg.style.display = 'block';
  }

  function notifyContentScripts() {
    chrome.runtime.sendMessage({ type: 'telegramConfigUpdated' }, () => {
      void chrome.runtime.lastError;
    });
  }

  chrome.storage.sync.get(['botToken', 'chatId'], (result) => {
    if (result.botToken) botTokenInput.value = result.botToken;
    if (result.chatId) chatIdInput.value = result.chatId;
  });

  saveBtn.addEventListener('click', () => {
    const botToken = botTokenInput.value.trim();
    const chatId = chatIdInput.value.trim();

    if (!botToken || !chatId) {
      showFeedback('error', 'Enter both bot token and chat ID.');
      return;
    }

    if (!isPlausibleBotToken(botToken)) {
      showFeedback(
        'error',
        'Token format looks wrong. It should look like 123456789:AAH… (digits, colon, long secret).'
      );
      return;
    }

    saveBtn.disabled = true;
    chrome.storage.sync.set({ botToken, chatId }, () => {
      saveBtn.disabled = false;
      showFeedback('success', 'Saved. Freelancer tabs will pick this up automatically.');
      notifyContentScripts();
    });
  });

  testBtn.addEventListener('click', async () => {
    const botToken = botTokenInput.value.trim();
    const chatId = chatIdInput.value.trim();

    if (!botToken || !chatId) {
      showFeedback('error', 'Enter both fields before testing.');
      return;
    }

    if (!isPlausibleBotToken(botToken)) {
      showFeedback('error', 'Fix the token format before testing.');
      return;
    }

    testBtn.disabled = true;
    showFeedback('info', 'Sending test message…');

    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: 'Freelancer Job Alert: test OK. You will get a message when a new project event arrives on an open Freelancer tab.',
        }),
      });
      const data = await res.json();

      if (data.ok) {
        showFeedback('success', 'Test message sent. Check Telegram.');
      } else {
        showFeedback(
          'error',
          data.description || 'Telegram rejected the request. Check token, chat ID, and that you started the bot.'
        );
      }
    } catch (e) {
      showFeedback('error', 'Network error. Check your connection and try again.');
    } finally {
      testBtn.disabled = false;
    }
  });

  resetBtn.addEventListener('click', () => {
    chrome.storage.sync.remove(['botToken', 'chatId'], () => {
      botTokenInput.value = '';
      chatIdInput.value = '';
      showFeedback('info', 'Saved credentials cleared.');
      notifyContentScripts();
    });
  });
});
