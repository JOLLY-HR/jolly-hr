const STORAGE_KEY = "culture_events";

/* --- Utilities --- */
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

/* --- Dashboard population --- */
function renderDashboard() {
  const list = document.getElementById("upcoming-events");
  if (!list) return;

  const events = getEvents();
  list.innerHTML = "";

  if (events.length === 0) {
    list.innerHTML = "<li>No events scheduled yet.</li>";
    return;
  }

  events.forEach(e => {
    const li = document.createElement("li");
    li.textContent = `${e.date || "TBD"} – ${e.name} – ${e.status}`;
    list.appendChild(li);
  });
}

/* --- Calendar population --- */
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

/* --- Demo helpers (optional buttons) --- */
function bookSelfServeDemo() {
  addEvent({
    name: "Confetti Trivia Night",
    date: "Feb 20",
    cost: 600,
    status: "🟢 Confirmed"
  });
  window.location.href = "index.html";
}

function requestConciergeDemo() {
  addEvent({
    name: "Office Pilates",
    date: "TBD",
    cost: 900,
    status: "🟡 Coordinating"
  });
  window.location.href = "index.html";
}

/* --- Init --- */
renderDashboard();
renderCalendar();
