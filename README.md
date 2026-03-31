# Freelancer New Project Notifier 🚀

This Chrome Extension monitors Freelancer.com for new project notifications and unread messages — and sends them to your Telegram bot.

**How it works (architecture, WebSocket logic, data flow):** see [HOW_IT_WORKS.md](HOW_IT_WORKS.md).

## 📦 Features

- 🔔 Detects new projects and messages on Freelancer.com
- 📤 Sends real-time notifications to Telegram
- 💾 User-configurable Bot Token and Chat ID via popup UI
- 🌙 Automatically Dark/Light mode toggle based on System
- ♻️ Reset button to clear settings
- 🔄 Automatically refreshes content script when config is saved

---

## 🧪 Local Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **"Load unpacked"**
5. Select the folder with the extension files

---

## 🧾 How to Use

1. Click the extension icon in Chrome.
2. Enter your **Telegram Bot Token** and **Chat ID**.
3. Click **Save**. ✅
4. The extension will begin monitoring for updates.

> Note: It works on [https://www.freelancer.com/search/projects](https://www.freelancer.com/search/projects) only

---

## 🛡️ Permissions Used

- `storage`: Save bot token and chat ID (`chrome.storage.sync`)
- `tabs`: Find open Freelancer tabs to push config updates after save/clear
- `activeTab`: Available for tab-focused actions
- `scripting`: Reserved for programmatic injection if needed
- `host_permissions`: `https://www.freelancer.com/*` (page scripts), `https://api.telegram.org/*` (Telegram API from popup/injected page)

---

## 🧠 Built With

- Vanilla JS
- Chrome Manifest V3
- Telegram Bot API

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

[MIT](LICENSE)

