/* ── Auto-resize textarea ── */
const msgInput = document.getElementById("message");
const sendBtn  = document.getElementById("send-btn");

msgInput.addEventListener("input", () => {
  msgInput.style.height = "auto";
  msgInput.style.height = Math.min(msgInput.scrollHeight, 140) + "px";
});

/* ── Send on Enter (Shift+Enter = newline) ── */
msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

/* ── Scroll helper ── */
function scrollToBottom() {
  const box = document.getElementById("chat-box");
  box.scrollTop = box.scrollHeight;
}

/* ── Render a user message row ── */
function appendUserMessage(text) {
  const box = document.getElementById("chat-box");

  const row = document.createElement("div");
  row.className = "msg-row user";
  row.innerHTML = `
    <div class="avatar avatar-user">You</div>
    <div class="msg-content">
      <div class="msg-sender">You</div>
      <div class="msg-text">${escapeHtml(text)}</div>
    </div>
  `;
  box.appendChild(row);
  scrollToBottom();
}

/* ── Render skeleton loader, return the row so we can swap it later ── */
function appendSkeletonLoader() {
  const box = document.getElementById("chat-box");

  const row = document.createElement("div");
  row.className = "msg-row bot";
  row.id = "skeleton-row";
  row.innerHTML = `
    <div class="avatar avatar-bot">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M9.5 2a2.5 2.5 0 0 1 5 0v1h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2V2z"/>
        <path d="M9 12h6M9 16h4"/>
      </svg>
    </div>
    <div class="msg-content">
      <div class="msg-sender">Assistant</div>
      <div class="skeleton-wrapper" aria-label="Loading response…">
        <div class="skeleton-line w-90"></div>
        <div class="skeleton-line w-75"></div>
        <div class="skeleton-line w-55"></div>
      </div>
    </div>
  `;
  box.appendChild(row);
  scrollToBottom();
  return row;
}

/* ── Replace skeleton with real answer ── */
function replaceSkeletonWithAnswer(answer) {
  const row = document.getElementById("skeleton-row");
  if (!row) return;

  const wrapper = row.querySelector(".skeleton-wrapper");
  if (wrapper) {
    const container = document.createElement("div");
    container.className = "msg-text";

    if (answer.includes("[CONTACT_CARD]")) {
      const text = answer.replace("[CONTACT_CARD]", "").trim();

      if (text) {
        const textDiv = document.createElement("p");
        textDiv.style.marginBottom = "12px";
        textDiv.textContent = text;
        container.appendChild(textDiv);
      }

      const card = document.createElement("div");
      card.className = "contact-card";
      card.innerHTML = `
        <a href="https://www.linkedin.com/in/aditya-pal-7a2995414" target="_blank" class="contact-btn linkedin-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>
        <a href="mailto:adityapal.w@gmail.com" class="contact-btn email-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          Email
        </a>
      `;
      container.appendChild(card);

    } else {
      container.textContent = answer;
    }

    wrapper.replaceWith(container);
  }

  row.removeAttribute("id");
  scrollToBottom();
}

/* ── Main send function (same /chat endpoint, untouched) ── */
async function sendMessage() {
  const msg = msgInput.value.trim();
  if (!msg) return;

  /* disable input while waiting */
  sendBtn.disabled = true;
  msgInput.disabled = true;

  appendUserMessage(msg);
  msgInput.value = "";
  msgInput.style.height = "auto";

  appendSkeletonLoader();

  try {
    const response = await fetch("/chat", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ message: msg })
    });

    const data = await response.json();
    replaceSkeletonWithAnswer(data.answer);
  } catch (err) {
    replaceSkeletonWithAnswer("Something went wrong. Please try again.");
    console.error("Chat error:", err);
  } finally {
    sendBtn.disabled = false;
    msgInput.disabled = false;
    msgInput.focus();
  }
}

/* ── XSS-safe escape for user text ── */
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}