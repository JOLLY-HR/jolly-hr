/* ======================================
   --- Get User from URL ---
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
  renderDashboard();
  renderCalendar();
  renderMarketplace();
}

/* ======================================
   --- Get / Save Budget ---
   ====================================== */
function getBudget() {
  const b = localStorage.getItem(BUDGET_KEY);
  return b ? parseInt(b) : 5000;
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
  const spent = getEvents().reduce((sum, e) => sum + (e.cost || 0), 0);
  const remaining = total - spent;

  if (budgetRemaining) {
    budgetRemaining.innerHTML = `<strong>Remaining:</strong> $${remaining}`;
  }

  if (budgetInput) {
    budgetInput.value = total;
  }
}

if (budgetInput) {
  budgetInput.addEventListener("change", (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 0) val = 0;
    saveBudget(val);
    updateBudgetDisplay();
    renderMarketplace();
  });
}

/* ======================================
   --- Dashboard / Calendar ---
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
      li.textContent = `${e.date || "TBD"} – ${e.name} – ${e.status} ($${e.cost})`;
      list.appendChild(li);
    });
  }

  updateBudgetDisplay();
}

function renderCalendar() {
  renderDashboard(); // For MVP, calendar duplicates dashboard
}

/* ======================================
   --- Marketplace Events (Demo) ---
   ====================================== */
const MARKETPLACE_EVENTS = [
  {
    name: "Confetti Trivia Night",
    type: "self-serve",
    cost: 600,
    costRange: "$600",
    description: "Team trivia hosted by Confetti. Fun questions and virtual prizes!"
  },
  {
    name: "Office Pilates",
    type: "concierge",
    cost: 900,
    costRange: "$800–$1,200",
    description: "On-site pilates for desk workers. Instructor visits your office."
  },
  {
    name: "Team Happy Hour",
    type: "self-serve",
    cost: 400,
    costRange: "$400",
    description: "Casual team happy hour to unwind and build camaraderie."
  },
  {
    name: "Cooking Class",
    type: "concierge",
    cost: 1200,
    costRange: "$1,200–$1,500",
    description: "Private cooking session for employees to learn new recipes."
  },
  {
    name: "Escape Room Challenge",
    type: "concierge",
    cost: 1500,
    costRange: "$1,500–$2,000",
    description: "Team-building escape room experience."
  },
  {
    name: "Meditation Workshop",
    type: "self-serve",
    cost: 300,
    costRange: "$300",
    description: "Guided mindfulness and meditation session."
  },
  {
    name: "Office Yoga",
    type: "concierge",
    cost: 800,
    costRange: "$800–$1,000",
    description: "In-person yoga class to improve posture and relieve tension."
  }
];

/* ======================================
   --- Render Marketplace ---
   ====================================== */
function renderMarketplace() {
  const container = document.getElementById("events-list");
  if (!container) return;

  container.innerHTML = ""; // clear

  const remainingBudget = getBudget() - getEvents().reduce((sum, e) => sum + (e.cost || 0), 0);

  MARKETPLACE_EVENTS.forEach((e, i) => {
    const card = document.createElement("div");
    card.className = "card marketplace-event";

    const badgeText = e.type === "self-serve" ? "Self-Serve" : "Concierge";
    const badgeClass = e.type === "self-serve" ? "self" : "concierge";
    const costText = e.costRange || `$${e.cost}`;
    const descriptionText = e.description || "No description provided.";

    const canBook = e.cost <= remainingBudget;

    card.innerHTML = `
      <h3>${e.name}</h3>
      <span class="badge ${badgeClass}">${badgeText}</span>
      <p>${descriptionText}</p>
      <p><strong>Cost:</strong> ${costText}</p>
      <button class="button" id="book-${i}" ${!canBook ? "disabled" : ""}>
        ${canBook ? (e.type === "self-serve" ? "Book Now" : "Request Coordination") : "Over Budget"}
      </button>
    `;

    container.appendChild(card);

    if (canBook) {
      document.getElementById(`book-${i}`).addEventListener("click", () => {
        const eventToAdd = {
          name: e.name,
          date: e.date || "TBD",
          cost: e.cost,
          status: e.type === "self-serve" ? "🟢 Confirmed" : "🟡 Coordinating"
        };
        addEvent(eventToAdd);
        alert(`Event "${e.name}" added to your dashboard!`);
      });
    }
  });
}

/* ======================================
   --- Smooth Scrolling & Active Nav ---
   ====================================== */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

function setActiveLink() {
  let index = sections.length;

  while(--index && window.scrollY + 100 < sections[index].offsetTop) {}

  navLinks.forEach(link => link.classList.remove("active"));
  if(navLinks[index]) navLinks[index].classList.add("active");
}

window.addEventListener("scroll", setActiveLink);

/* ======================================
   --- Init ---
   ====================================== */
renderDashboard();
renderCalendar();
renderMarketplace();
updateBudgetDisplay();
setActiveLink();
