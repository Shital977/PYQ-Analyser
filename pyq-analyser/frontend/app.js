
const API_BASE = "http://localhost:8000";

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

  const form = new FormData();
  form.append("file", files[0]);

  try {
    // 1️⃣ Upload file
    const uploadRes = await fetch(API_BASE + "/upload", {
      method: "POST",
      body: form
    });

    const uploadJson = await uploadRes.json();

    if (!uploadRes.ok) {
      uploadStatus.textContent =
        "Upload failed: " + (uploadJson.error || "Unknown error");
      return;
    }

    uploadStatus.textContent = "File uploaded. Analyzing questions...";

    // 2️⃣ NOW analyze (guaranteed after upload)
    const analyzeRes = await fetch(
      API_BASE + "/analyze-question-paper",
      { method: "POST" }
    );

    const analyzeJson = await analyzeRes.json();

    if (!analyzeRes.ok || !analyzeJson.solutions) {
      uploadStatus.textContent =
        "Paper uploaded, but no questions detected.";
      return;
    }

    // 3️⃣ Update UI state
    solvedPaperData = analyzeJson;

    document.getElementById("totalQuestions").textContent =
      `Total Questions Solved: ${analyzeJson.total_questions}`;

    const btn = document.getElementById("viewAnswersBtn");
    btn.disabled = false;
    btn.classList.add("active");

    uploadStatus.textContent =
      "Question paper analyzed successfully.";

  } catch (err) {
    uploadStatus.textContent = "Error: " + err.message;
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

let solvedPaperData = null;

// New UI elements (already added in HTML)
const totalQuestionsEl = document.getElementById("totalQuestions");
const viewAnswersBtn = document.getElementById("viewAnswersBtn");
const answerModal = document.getElementById("answerModal");
const fullAnswerSheet = document.getElementById("fullAnswerSheet");
const closeModalBtn = document.getElementById("closeModal");

// Hook into existing upload flow WITHOUT modifying it
uploadBtn.addEventListener("click", async () => {
  // Wait a bit so upload finishes first
  setTimeout(async () => {
    try {
      const res = await fetch(API_BASE + "/analyze-question-paper", {
        method: "POST"
      });

      const data = await res.json();

      if (!res.ok || !data.solutions) {
        console.warn("Question paper analysis failed");
        return;
      }

      // Store solved paper
      solvedPaperData = data;

      // Update preview UI
      totalQuestionsEl.textContent =
        `Total Questions Solved: ${data.total_questions}`;

      viewAnswersBtn.disabled = false;
      viewAnswersBtn.classList.add("active");

    } catch (err) {
      console.error("Analysis error:", err);
    }
  }, 1500); // small delay to ensure upload finishes
});

// Open full answer sheet
viewAnswersBtn.addEventListener("click", () => {
  if (!solvedPaperData) return;

  fullAnswerSheet.innerHTML = "";

  solvedPaperData.solutions.forEach((item, index) => {
    const block = document.createElement("div");
    block.className = "qa-block";

    block.innerHTML = `
      <h3>Q${index + 1}. ${item.question}</h3>
      <p>${item.answer}</p>
      <hr />
    `;

    fullAnswerSheet.appendChild(block);
  });

  answerModal.classList.remove("hidden");
});

// Close modal
closeModalBtn.addEventListener("click", () => {
  answerModal.classList.add("hidden");
});
