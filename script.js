// ===== WEDDING CHECKLIST DATA =====
const checklistData = [
  {
    month: "12 Months Before",
    icon: "📅",
    tasks: [
      "Set your overall wedding budget",
      "Start the guest list draft",
      "Research and book your venue",
      "Choose your wedding date",
      "Start researching vendors",
      "Hire a wedding planner (if using one)",
    ]
  },
  {
    month: "10 Months Before",
    icon: "📸",
    tasks: [
      "Book your photographer & videographer",
      "Book your caterer or choose venue catering",
      "Book DJ, band, or entertainment",
      "Start thinking about your wedding party",
    ]
  },
  {
    month: "8 Months Before",
    icon: "👗",
    tasks: [
      "Shop for your wedding dress/suit",
      "Start browsing bridesmaid/groomsmen attire",
      "Book your florist",
      "Book your officiant",
      "Order save-the-dates",
    ]
  },
  {
    month: "6 Months Before",
    icon: "💐",
    tasks: [
      "Choose your wedding theme & colors",
      "Design and order invitations",
      "Book hair & makeup artists",
      "Plan honeymoon and book travel",
      "Register for wedding gifts",
    ]
  },
  {
    month: "4 Months Before",
    icon: "✉️",
    tasks: [
      "Send out wedding invitations",
      "Order wedding cake or desserts",
      "Buy wedding rings",
      "Plan the rehearsal dinner",
      "Book wedding-night accommodations",
    ]
  },
  {
    month: "2 Months Before",
    icon: "✂️",
    tasks: [
      "Final dress/suit fittings",
      "Track RSVPs and follow up",
      "Create the seating chart",
      "Write your vows",
      "Finalize day-of timeline with vendors",
    ]
  },
  {
    month: "1 Month Before",
    icon: "🎵",
    tasks: [
      "Confirm all vendor details",
      "Break in your wedding shoes",
      "Finalize the ceremony readings",
      "Compile your music playlist / requests",
      "Prepare tips/gifts for vendors & wedding party",
    ]
  },
  {
    month: "Wedding Week",
    icon: "💍",
    tasks: [
      "Attend the rehearsal & rehearsal dinner",
      "Delegate day-of responsibilities",
      "Pack an emergency kit",
      "Lay out your outfit and accessories",
      "Relax, breathe, and enjoy — you've earned it! 🎉",
    ]
  }
];

// ===== BUDGET CATEGORIES =====
const budgetCategories = [
  { name: "Venue & Catering", icon: "🏰", pct: 0.45, color: "#d4a843" },
  { name: "Photography & Video", icon: "📸", pct: 0.12, color: "#c0392b" },
  { name: "Music & Entertainment", icon: "🎶", pct: 0.08, color: "#8e44ad" },
  { name: "Flowers & Décor", icon: "💐", pct: 0.08, color: "#27ae60" },
  { name: "Wedding Attire", icon: "👗", pct: 0.07, color: "#2980b9" },
  { name: "Invitations & Paper", icon: "✉️", pct: 0.03, color: "#e67e22" },
  { name: "Hair & Makeup", icon: "💄", pct: 0.03, color: "#e74c3c" },
  { name: "Rings", icon: "💍", pct: 0.03, color: "#f39c12" },
  { name: "Transportation", icon: "🚗", pct: 0.02, color: "#1abc9c" },
  { name: "Miscellaneous / Buffer", icon: "🎁", pct: 0.09, color: "#95a5a6" },
];

// ===== DOM READY =====
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initChecklist();
  initBudgetCalculator();
});

// ===== NAVBAR SCROLL =====
function initNavbar() {
  const navbar = document.getElementById("navbar");
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle("scrolled", window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const toggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      toggle.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach(el => observer.observe(el));
}

// ===== INTERACTIVE CHECKLIST =====
function initChecklist() {
  const container = document.getElementById("checklistContainer");
  const saved = JSON.parse(localStorage.getItem("wp-checklist") || "{}");

  let totalTasks = 0;
  checklistData.forEach(group => { totalTasks += group.tasks.length; });

  checklistData.forEach((group, gi) => {
    const monthDiv = document.createElement("div");
    monthDiv.className = "checklist-month" + (gi === 0 ? " open" : "");

    const completedInGroup = group.tasks.filter((_, ti) => saved[`${gi}-${ti}`]).length;

    monthDiv.innerHTML = `
      <div class="month-header">
        <div class="month-title">
          <span class="month-icon">${group.icon}</span>
          ${group.month}
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span class="month-count">${completedInGroup}/${group.tasks.length}</span>
          <span class="month-toggle">▼</span>
        </div>
      </div>
      <div class="month-tasks">
        ${group.tasks.map((task, ti) => {
          const checked = saved[`${gi}-${ti}`] ? "checked" : "";
          const completed = saved[`${gi}-${ti}`] ? " completed" : "";
          return `
            <div class="task-item${completed}" data-gi="${gi}" data-ti="${ti}">
              <input type="checkbox" class="task-checkbox" id="task-${gi}-${ti}" ${checked}>
              <label class="task-label" for="task-${gi}-${ti}">${task}</label>
            </div>
          `;
        }).join("")}
      </div>
    `;

    // Toggle open/close
    monthDiv.querySelector(".month-header").addEventListener("click", () => {
      monthDiv.classList.toggle("open");
    });

    container.appendChild(monthDiv);
  });

  // Checkbox handling
  container.addEventListener("change", (e) => {
    if (e.target.classList.contains("task-checkbox")) {
      const item = e.target.closest(".task-item");
      const key = `${item.dataset.gi}-${item.dataset.ti}`;
      const saved = JSON.parse(localStorage.getItem("wp-checklist") || "{}");
      if (e.target.checked) {
        saved[key] = true;
        item.classList.add("completed");
      } else {
        delete saved[key];
        item.classList.remove("completed");
      }
      localStorage.setItem("wp-checklist", JSON.stringify(saved));
      updateProgress();
      updateMonthCounts();
    }
  });

  updateProgress();

  function updateProgress() {
    const saved = JSON.parse(localStorage.getItem("wp-checklist") || "{}");
    const done = Object.keys(saved).length;
    const pct = Math.round((done / totalTasks) * 100);
    document.getElementById("progressCount").textContent = `${done} / ${totalTasks} tasks`;
    document.getElementById("progressFill").style.width = pct + "%";
  }

  function updateMonthCounts() {
    const saved = JSON.parse(localStorage.getItem("wp-checklist") || "{}");
    container.querySelectorAll(".checklist-month").forEach((monthDiv, gi) => {
      const tasks = checklistData[gi].tasks;
      const completedCount = tasks.filter((_, ti) => saved[`${gi}-${ti}`]).length;
      monthDiv.querySelector(".month-count").textContent = `${completedCount}/${tasks.length}`;
    });
  }
}

// ===== BUDGET CALCULATOR =====
function initBudgetCalculator() {
  const input = document.getElementById("budgetInput");
  const presetsContainer = document.getElementById("budgetPresets");
  let currentBudget = 30000;

  renderBudget(currentBudget);

  // Format input
  input.addEventListener("input", () => {
    const raw = input.value.replace(/[^0-9]/g, "");
    const num = parseInt(raw) || 0;
    if (num > 0) {
      input.value = "$" + num.toLocaleString();
      currentBudget = num;
      renderBudget(num);
      // Update active preset
      presetsContainer.querySelectorAll(".preset-btn").forEach(btn => {
        btn.classList.toggle("active", parseInt(btn.dataset.amount) === num);
      });
    }
  });

  input.addEventListener("focus", () => {
    if (!input.value || input.value === "$0") input.value = "";
  });

  // Preset buttons
  presetsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("preset-btn")) {
      const amount = parseInt(e.target.dataset.amount);
      currentBudget = amount;
      input.value = "$" + amount.toLocaleString();
      renderBudget(amount);
      presetsContainer.querySelectorAll(".preset-btn").forEach(btn => {
        btn.classList.toggle("active", btn === e.target);
      });
    }
  });

  function renderBudget(total) {
    const breakdown = document.getElementById("budgetBreakdown");
    breakdown.innerHTML = budgetCategories.map(cat => {
      const amount = Math.round(total * cat.pct);
      const pctDisplay = Math.round(cat.pct * 100);
      return `
        <div class="budget-item">
          <div class="budget-item-icon" style="background: ${cat.color}20;">${cat.icon}</div>
          <div class="budget-item-info">
            <div class="budget-item-row">
              <span class="budget-item-name">${cat.name}</span>
              <span class="budget-item-amount">$${amount.toLocaleString()}</span>
            </div>
            <div class="budget-item-bar">
              <div class="budget-item-fill" style="width: ${pctDisplay}%; background: ${cat.color};"></div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }
}
