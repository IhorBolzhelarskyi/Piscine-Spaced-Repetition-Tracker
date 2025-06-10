// Import functions to get user IDs and data from storage
import { getUserIds } from "./common.mjs";
import { getData } from "./storage.mjs";
import { addData } from "./storage.mjs";

// DOM elements for interaction and display
const userSelect = document.getElementById("user-select");
const agendaList = document.getElementById("agenda-list");
const noAgendaMessage = document.getElementById("no-agenda-message");
const userInputDate = document.querySelector(`#date`);
const userForm = document.querySelector(`form`);
const userInputTopic = document.querySelector("#topic");

/**
 * Clears agenda display: empties list and hides both list and no-data message
 */
function clearAgendaDisplay() {
  agendaList.innerHTML = "";
  agendaList.hidden = true;
  noAgendaMessage.hidden = true;
}

/**
 * Formats a date string (YYYY-MM-DD) into a readable format
 * e.g. "2025-07-26" -> "July 26, 2025"
 */
function formatDate(dateStr) {
  const date = new Date(dateStr + "T00:00:00Z"); // UTC to avoid timezone issues
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// format date to sting
function formatToDateString(date) {
  const currentDate = date ? new Date(date) : new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Calculate revision dates
export function calcRevisionDates(topic, inputDateStr) {
  const intervals = [{ days: 7 }, { months: 1 }, { months: 3 }, { months: 6 }, { months: 12 }];
  const inputDate = new Date(inputDateStr);
  const repetitions = [];
  intervals.forEach((interval) => {
    const newCopyDate = new Date(inputDate);
    if (interval.hasOwnProperty("days")) {
      newCopyDate.setDate(newCopyDate.getDate() + interval.days);
    } else {
      newCopyDate.setMonth(newCopyDate.getMonth() + interval.months);
    }
    const strDate = formatToDateString(newCopyDate);
    repetitions.push({ topic, date: strDate });
  });
  return repetitions;
}
/**
 * Displays the agenda list for the selected user,
 * showing only future or today's revision items
 */
function displayAgenda(agenda) {
  clearAgendaDisplay();

  // If no agenda or empty, show "no agenda" message
  if (!agenda || agenda.length === 0) {
    noAgendaMessage.hidden = false;
    return;
  }

  // Get today's date with time reset to midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter agenda to include only today or future dates, then sort ascending
  const filtered = agenda
    .filter((item) => new Date(item.date + "T00:00:00Z") >= today)
    .sort((a, b) => new Date(a.date + "T00:00:00Z") - new Date(b.date + "T00:00:00Z"));

  // If no future agenda items, show "no agenda" message
  if (filtered.length === 0) {
    noAgendaMessage.hidden = false;
    return;
  }

  // Create and append list items for each agenda entry
  for (const item of filtered) {
    const li = document.createElement("li");
    li.textContent = `${item.topic}, ${formatDate(item.date)}`;
    agendaList.appendChild(li);
  }

  // Show the agenda list
  agendaList.hidden = false;
}

/**
 * Populates the user dropdown with user IDs from storage
 */
function populateUserDropdown() {
  const users = getUserIds();
  users.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userSelect.appendChild(option);
  });
}

/**
 * Event handler for user selection change
 * Fetches user data and displays the filtered agenda
 */
function onUserChange() {
  clearAgendaDisplay();

  const selectedUser = userSelect.value;
  if (!selectedUser) return;

  const userData = getData(selectedUser);
  displayAgenda(userData);
}

// Event handler for userForm, add topics and dates to local storage and display them in UI
function submitForm(e) {
  e.preventDefault();
  const selectedUserId = userSelect.value;
  if (!selectedUserId) return;

  const topic = userInputTopic.value.trim();
  if (!topic) return;

  const date = userInputDate.value;
  const userNewData = calcRevisionDates(topic, date);
  addData(selectedUserId, userNewData);
  const updatedUserData = getData(selectedUserId);
  displayAgenda(updatedUserData);
  userForm.reset();
  userInputDate.value = formatToDateString();
}

/**
 * Initializes the app by populating dropdown and setting event listener
 */
function init() {
  populateUserDropdown();
  userSelect.addEventListener("change", onUserChange);
  userForm.addEventListener("submit", submitForm);
  //set input type date to current date
  userInputDate.value = formatToDateString();
}

// Start initialization when the DOM content is fully loaded
window.addEventListener("DOMContentLoaded", init);
