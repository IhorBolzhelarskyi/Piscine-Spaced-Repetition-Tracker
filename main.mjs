import { getUserIds } from "./common.mjs";
import { getData } from "./storage.mjs";

const userSelect = document.getElementById("user-select");
const agendaList = document.getElementById("agenda-list");
const noAgendaMessage = document.getElementById("no-agenda-message");

function clearAgendaDisplay() {
  agendaList.innerHTML = "";
  agendaList.hidden = true;
  noAgendaMessage.hidden = true;
}

function formatDate(dateStr) {
  const date = new Date(dateStr + "T00:00:00Z");
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function displayAgenda(agenda) {
  clearAgendaDisplay();

  if (!agenda || agenda.length === 0) {
    noAgendaMessage.hidden = false;
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = agenda
    .filter(item => new Date(item.date + "T00:00:00Z") >= today)
    .sort((a, b) => new Date(a.date + "T00:00:00Z") - new Date(b.date + "T00:00:00Z"));

  if (filtered.length === 0) {
    noAgendaMessage.hidden = false;
    return;
  }

  for (const item of filtered) {
    const li = document.createElement("li");
    li.textContent = `${item.topic}, ${formatDate(item.date)}`;
    agendaList.appendChild(li);
  }

  agendaList.hidden = false;
}

function populateUserDropdown() {
  const users = getUserIds();
  users.forEach(userId => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userSelect.appendChild(option);
  });
}

function onUserChange() {
  clearAgendaDisplay();

  const selectedUser = userSelect.value;
  if (!selectedUser) return;

  const userData = getData(selectedUser);
  displayAgenda(userData);
}

function init() {
  populateUserDropdown();
  userSelect.addEventListener("change", onUserChange);
}

window.addEventListener("DOMContentLoaded", init);
