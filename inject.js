var TELEGRAM_BOT_TOKEN = '';
var TELEGRAM_CHAT_ID = '';

window.addEventListener('message', function (event) {
  if (event.source !== window) return;

  if (event.data.type === 'FROM_EXTENSION') {
    const credentials = event.data.credentials;
    TELEGRAM_BOT_TOKEN = credentials.botToken || '';
    TELEGRAM_CHAT_ID = credentials.chatId || '';
  }
});

async function sendTelegramMessage(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);
    }
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
}

function observeForNotification() {
  if (window.__freelancerNotifierWsPatched) {
    return;
  }
  window.__freelancerNotifierWsPatched = true;

  const OriginalWebSocket = window.WebSocket;

  function CustomWebSocket(url, protocols) {
    const ws = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);

    ws.addEventListener('message', function (event) {
      try {
        let raw = event.data;

        if (typeof raw !== 'string') {
          return;
        }

        console.debug('Freelancer Notifier: WS message received', raw);

        if (raw.startsWith('a')) {
          raw = raw.slice(1);
        }

        const outer = JSON.parse(raw);
        if (!Array.isArray(outer) || outer.length === 0) {
          return;
        }

        const data = JSON.parse(outer[0]);
        if (data?.body?.type === 'project') {
          const jobString = data.body.data.jobString || 'New Project';

          sendTelegramMessage(jobString);

          console.log('[Freelancer Notifier] Project:', jobString);
        }
      } catch (err) {
        console.debug('Freelancer Notifier: WS message parse skip', err);
      }
    });

    return ws;
  }

  CustomWebSocket.prototype = OriginalWebSocket.prototype;
  window.WebSocket = CustomWebSocket;

  console.log('[Freelancer Notifier] WebSocket monitor active');
}

observeForNotification();
