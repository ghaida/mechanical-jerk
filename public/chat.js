const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// Conversation history for context
const conversationHistory = [];

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  // Add user message to DOM
  appendMessage('user', text);
  conversationHistory.push({ role: 'user', content: text });
  chatInput.value = '';

  // Disable input while waiting
  chatInput.disabled = true;
  sendBtn.disabled = true;

  // Show typing indicator
  const typing = showTypingIndicator();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversationHistory }),
    });
    const data = await res.json();

    // Remove typing indicator
    typing.remove();

    if (data.error) {
      appendMessage('bot', data.error);
    } else {
      appendMessage('bot', data.response);
      conversationHistory.push({ role: 'assistant', content: data.response });
    }
  } catch {
    typing.remove();
    appendMessage('bot', 'Connection lost. Even the wifi is a skill issue rn.');
  }

  chatInput.disabled = false;
  sendBtn.disabled = false;
  chatInput.focus();
});

function appendMessage(role, text) {
  const msg = document.createElement('div');
  msg.className = `msg ${role}`;

  if (role === 'bot') {
    msg.innerHTML = `
      <div class="bot-header">
        <div class="bot-icon">\u{1F916}</div>
        <span class="bot-name">Mechanical Jerk</span>
      </div>
      <div class="bot-text">${escapeHTML(text)}</div>
      <div class="reaction">
        <span data-reaction="based">\u{1F4AA} Based</span>
        <span data-reaction="cope">\u{1F5D1} Cope</span>
      </div>`;
  } else {
    msg.textContent = text;
  }

  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  const typing = document.createElement('div');
  typing.className = 'msg bot typing-indicator';
  typing.innerHTML = `
    <div class="bot-header">
      <div class="bot-icon">\u{1F916}</div>
      <span class="bot-name">Mechanical Jerk</span>
    </div>
    <div class="bot-text typing-dots">
      <span></span><span></span><span></span>
    </div>`;
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return typing;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Reaction button clicks (cosmetic only)
chatMessages.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-reaction]');
  if (!btn) return;
  const siblings = btn.parentElement.querySelectorAll('span');
  siblings.forEach(s => s.classList.remove('active'));
  btn.classList.add('active');
});
