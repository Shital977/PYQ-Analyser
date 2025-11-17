// frontend/app.js

// Your FastAPI backend
const API_BASE = "http://localhost:8001";

// DOM Elements
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const uploadStatus = document.getElementById("uploadStatus");

const questionInput = document.getElementById("questionInput");
const askBtn = document.getElementById("askBtn");
const answerArea = document.getElementById("answerArea");

const chat = document.getElementById("chat");
const clearChatBtn = document.getElementById("clearChat");

// Add chat bubble
function addChat(role, text) {
  const div = document.createElement("div");
  div.className = "chat-row " + (role === "user" ? "user" : "bot");
  div.textContent = (role === "user" ? "You: " : "AI: ") + text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// ------------------ UPLOAD ------------------

uploadBtn.addEventListener("click", async () => {
  const files = fileInput.files;

  if (!files || files.length === 0) {
    uploadStatus.textContent = "Please select a file.";
    return;
  }

  uploadStatus.textContent = "Uploading and processing...";

  // Backend accepts only ONE file, so send the first file
  const form = new FormData();
  form.append("file", files[0]);

  try {
    const res = await fetch(API_BASE + "/upload", {
      method: "POST",
      body: form
    });

    const json = await res.json();

    if (res.ok) {
      uploadStatus.textContent = json.message || "File processed successfully!";
    } else {
      uploadStatus.textContent = "Error: " + (json.error || JSON.stringify(json));
    }
  } catch (err) {
    uploadStatus.textContent = "Upload failed: " + err.message;
  }
});

// ------------------ ASK QUESTION ------------------

askBtn.addEventListener("click", async () => {
  const q = questionInput.value.trim();
  if (!q) return;

  addChat("user", q);
  answerArea.textContent = "Thinking...";

  try {
    const res = await fetch(API_BASE + "/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q })
    });

    const json = await res.json();

    if (res.ok) {
      const ans = json.answer || "No answer returned.";
      addChat("bot", ans);
      answerArea.textContent = ans;
    } else {
      answerArea.textContent = "Error: " + (json.error || JSON.stringify(json));
    }
  } catch (err) {
    answerArea.textContent = "Request failed: " + err.message;
  }
});

// ------------------ CLEAR CHAT ------------------

clearChatBtn.addEventListener("click", () => {
  chat.innerHTML = "";
});
