// API URL
const API_URL = "https://api.rootnet.in/covid19-in/stats/latest";

// DOM Elements
const stateInput = document.getElementById("stateInput");
const searchBtn = document.getElementById("searchBtn");
const loadingMessage = document.getElementById("loadingMessage");
const noDataMessage = document.getElementById("noDataMessage");
const statsContainer = document.getElementById("statsContainer");
const stateTitle = document.getElementById("stateTitle");

const totalCasesEl = document.getElementById("totalCases");
const indianCasesEl = document.getElementById("indianCases");
const foreignCasesEl = document.getElementById("foreignCases");
const dischargedEl = document.getElementById("discharged");
const deathsEl = document.getElementById("deaths");

const recoveryRateEl = document.getElementById("recoveryRate");
const mortalityRateEl = document.getElementById("mortalityRate");

// Chart variable (global to update later)
let covidChart = null;

// Utility functions
function show(element) { element.style.display = "block"; }
function hide(element) { element.style.display = "none"; }

function formatNumber(n) {
  if (n === undefined || n === null) return "-";
  return Number(n).toLocaleString("en-IN");
}

// State Mapping Logic
function mapInputToState(statesList, input) {
  const low = input.trim().toLowerCase();
  if (!low) return null;

  // Exact Match
  for (const s of statesList) {
    if (s.loc && s.loc.toLowerCase() === low) return s;
  }

  // Partial Match
  for (const s of statesList) {
    if (s.loc && s.loc.toLowerCase().includes(low)) return s;
  }

  const shortMap = {
    "up": "uttar pradesh", "tn": "tamil nadu", "mp": "madhya pradesh",
    "mh": "maharashtra", "gj": "gujarat", "dl": "delhi",
    "wb": "west bengal", "ka": "karnataka", "br": "bihar", "rj": "rajasthan"
  };
  if (shortMap[low]) {
    for (const s of statesList) {
      if (s.loc && s.loc.toLowerCase() === shortMap[low]) return s;
    }
  }

  return null;
}

// Main Function to Fetch and Show Data
async function searchState() {
  const stateName = stateInput.value.trim();
  if (!stateName) {
    alert("Please enter a state name");
    return;
  }

  show(loadingMessage);
  hide(noDataMessage);
  hide(statsContainer);

  try {
    const resp = await fetch(API_URL, { cache: "no-store" });
    if (!resp.ok) throw new Error("Network Issue");
    const json = await resp.json();

    const regional = json?.data?.regional || [];
    const matched = mapInputToState(regional, stateName);
    if (!matched) {
      hide(loadingMessage);
      show(noDataMessage);
      return;
    }

    hide(loadingMessage);
    show(statsContainer);

    // Update Text Data
    stateTitle.textContent = matched.loc || "Unknown";
    const total = matched.totalConfirmed ?? (matched.confirmedCasesIndian + matched.confirmedCasesForeign);
    const discharged = matched.discharged ?? 0;
    const deaths = matched.deaths ?? 0;

    totalCasesEl.textContent = formatNumber(total);
    dischargedEl.textContent = formatNumber(discharged);
    deathsEl.textContent = formatNumber(deaths);
    indianCasesEl.textContent = formatNumber(matched.confirmedCasesIndian || 0);
    foreignCasesEl.textContent = formatNumber(matched.confirmedCasesForeign || 0);

    const recRate = total ? (discharged / total) * 100 : 0;
    const mortRate = total ? (deaths / total) * 100 : 0;
    recoveryRateEl.textContent = recRate.toFixed(2) + "%";
    mortalityRateEl.textContent = mortRate.toFixed(2) + "%";

    // Update Chart
    updateChart(total, discharged, deaths);

  } catch (err) {
    console.error("Error fetching data:", err);
    hide(loadingMessage);
    show(noDataMessage);
  }
}

// Chart.js - Update Graph Function
function updateChart(total, recovered, deaths) {
  const ctx = document.getElementById("covidChart").getContext("2d");

  if (covidChart) {
    covidChart.destroy();
  }

  covidChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Total Cases", "Recovered", "Deaths"],
      datasets: [{
        label: "COVID-19 Cases",
        data: [total, recovered, deaths],
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Event Listeners
searchBtn.addEventListener("click", searchState);
stateInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchState();
});
