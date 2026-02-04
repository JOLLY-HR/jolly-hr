/* ======================================
   --- Get user from URL ---
   ====================================== */
function getUser() {
  const params = new URLSearchParams(window.location.search);
  return params.get("user") || "default";
}

const USER = getUser();
const STORAGE_KEY = `culture_events_${USER}`;
const BUDGET_KEY = `culture_budget_${USER}`;

/* ======================================
   --- Get / Save Events ---
   ====================================== */
function getEvents() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function addEvent(event) {
  const events = getEvents();
  events.push(event);
  saveEvents(events);
}

/* ======================================
   --- Get / Save Budget ---
   ====================================== */
function getBudget() {
  const b = localStorage.getItem(BUDGET_KEY);
  return b ? parseInt(b) : 5000; // default $5,000
}

function saveBudget(amount) {
  localStorage.setItem(BUDGET_KEY, amount);
}

/* ======================================
   --- Budget Input Handling ---
   ====================================== */
const budgetInput = document.getElementById("budget-input");
const budgetRemaining = document.getElementById("budget-remaining");

function updateBudgetDisplay() {
  const total = getBudget();
  const events = getEvents();
  const spent = events.reduce((sum, e) => sum + (e.cost || 0), 0);
  const remaining = total - spent;

  if (budgetRemaining) {
    budgetRemaining.innerHTML = `<strong>Remaining:</strong> $${remaining}`;
  }

  if (budgetInput) {
    budgetInput.value = total;
  }
}

/* Save new budget when user changes input */
if (budgetInput) {
  budgetInput.addEventListener("change", (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 0) val = 0;
    saveBudget(val);
    updateBudgetDisplay();
  });
}

/* ======================================
   --- Render Dashboard ---
   ====================================== */
function renderDashboard() {
  const list = document.getElementById("upcoming-events");
  if (!list) return;

  const events = getEvents();
  list.innerHTML = "";

  if (events.length === 0) {
    list.innerHTML = "<li>No events scheduled yet.</li>";
  } else {
    events.forEach(e => {
      const li = document.createElement("li");
      li.textContent = `${e.date || "TBD"} – ${e.name} – ${e.status}`;
      list.appendChild(li);
    });
  }

  updateBudgetDisplay();
}

/* ======================================
   --- Render Calendar ---
   ====================================== */
function renderCalendar() {
  const list = document.getElementById("calendar-events");
  if (!list) return;

  const events = getEvents();
  list.innerHTML = "";

  events.forEach(e => {
    const li = document.createElement("li");
    li.textContent = `${e.date || "TBD"} – ${e.name} – ${e.status}`;
    list.appendChild(li);
  });
}

/* ======================================
   --- Demo Helpers (Optional Buttons) ---
   ====================================== */
function bookSelfServeDemo() {
  addEvent({
    name: "Confetti Trivia Night",
    date: "Feb 20",
    cost: 600,
    status: "🟢 Confirmed"
  });
  renderDashboard();
  renderCalendar();
}

function requestConciergeDemo() {
  addEvent({
    name: "Office Pilates",
    date: "TBD",
    cost: 900,
    status: "🟡 Coordinating"
  });
  renderDashboard();
  renderCalendar();
}

/* ======================================
   --- Prefill Demo Events If None Exist ---
   ====================================== */
if (!getEvents().length) {
  addEvent({ name: "Confetti Trivia Night", date: "Feb 20", cost: 600, status: "🟢 Confirmed" });
  addEvent({ name: "Office Pilates", date: "TBD", cost: 900, status: "🟡 Coordinating" });
}

/* ======================================
   --- Init: Render Everything ---
   ====================================== */
renderDashboard();
renderCalendar();
updateBudgetDisplay();
