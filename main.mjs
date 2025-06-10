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
 * Uses UTC to ensure consistent formatting across timezones.
 */
function formatDate(dateStr) {
  const date = new Date(dateStr + "T00:00:00Z"); // Parse as UTC to avoid timezone issues
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats a Date object into a YYYY-MM-DD string.
 * Defaults to current date if no date object is provided.
 * Ensures consistent string format for storage and input fields.
 */
function formatToDateString(date) {
  const currentDate = date ? new Date(date) : new Date(); // Use provided date or current date
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Calculates revision dates based on a topic and an input date string.
 * Implements the spaced repetition intervals: 7 days, 1 month, 3 months, 6 months, 12 months.
 * Critically handles month-end rollovers to maintain consistency (e.g., Jan 31 + 1 month -> Feb 28/29).
 */
export function calcRevisionDates(topic, inputDateStr) {
  const intervals = [{ days: 7 }, { months: 1 }, { months: 3 }, { months: 6 }, { months: 12 }];
  
  // Parse input date string as UTC to prevent timezone issues with calculations
  const inputDate = new Date(inputDateStr + "T00:00:00Z"); 
  const repetitions = [];

  intervals.forEach((interval) => {
    // Create a new Date object for each calculation to avoid modifying the original
    const newCopyDate = new Date(inputDate);
    
    // Get the original day of the month before adding intervals
    // Using getUTCDate for consistency with UTC parsing
    const originalDay = newCopyDate.getUTCDate(); 

    if (interval.hasOwnProperty("days")) {
      // Add days using UTC day setter
      newCopyDate.setUTCDate(newCopyDate.getUTCDate() + interval.days);
    } else {
      // Add months using UTC month setter
      newCopyDate.setUTCMonth(newCopyDate.getUTCMonth() + interval.months);
      
      // *** IMPORTANT FIX FOR MONTH-END ROLLOVER ***
      // If setting the month resulted in the day rolling over to the next month
      // (e.g., setting Feb 31st results in March 3rd, so current day '3' < original day '31'),
      // then set the date to the last day of the *calculated* month.
      // Setting day to 0 of the current month effectively gets the last day of the *previous* month.
      if (newCopyDate.getUTCDate() < originalDay) {
        newCopyDate.setUTCDate(0); 
      }
    }
    
    // Format the calculated date back to YYYY-MM-DD string
    const strDate = formatToDateString(newCopyDate);
    repetitions.push({ topic, date: strDate });
  });
  return repetitions;
}

/**
 * Displays the agenda list for the selected user,
 * showing only future or today's revision items in chronological order.
 * Hides/shows appropriate messages if agenda is empty or filtered.
 */
function displayAgenda(agenda) {
  clearAgendaDisplay(); // Start with a clean display

  // Show "no agenda" message if no data exists or array is empty
  if (!agenda || agenda.length === 0) {
    noAgendaMessage.hidden = false;
    return;
  }

  // Get today's date and reset time to midnight (UTC) for accurate comparison
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Using UTC here for consistency with T00:00:00Z parsing

  // Filter out past dates and sort remaining items chronologically
  const filtered = agenda
    .filter((item) => new Date(item.date + "T00:00:00Z").getTime() >= today.getTime()) // Compare timestamps
    .sort((a, b) => new Date(a.date + "T00:00:00Z").getTime() - new Date(b.date + "T00:00:00Z").getTime());

  // If no future agenda items after filtering, show "no agenda" message
  if (filtered.length === 0) {
    noAgendaMessage.hidden = false;
    return;
  }

  // Create and append list items for each filtered agenda entry
  for (const item of filtered) {
    const li = document.createElement("li");
    li.textContent = `${item.topic}, ${formatDate(item.date)}`;
    agendaList.appendChild(li);
  }

  // Show the agenda list (it was hidden by clearAgendaDisplay initially)
  agendaList.hidden = false;
}

/**
 * Populates the user dropdown with user IDs retrieved from common.mjs.
 */
function populateUserDropdown() {
  const users = getUserIds(); // Assumes getUserIds returns an array like ["1", "2", "3", "4", "5"]
  users.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`; // Display "User 1", "User 2", etc.
    userSelect.appendChild(option);
  });
}

/**
 * Event handler for when the user selects a different user from the dropdown.
 * Clears current display, fetches data for the new user, and displays their agenda.
 */
function onUserChange() {
  clearAgendaDisplay(); // Clear display before showing new user's data

  const selectedUser = userSelect.value;
  if (!selectedUser) { // If no user is selected (e.g., initial state or default empty option)
    return;
  }

  const userData = getData(selectedUser); // Get data from storage.mjs
  displayAgenda(userData); // Display the fetched agenda
}

/**
 * Event handler for the form submission.
 * Prevents default form submission, validates inputs, calculates revision dates,
 * stores new data, updates the display, and resets the form.
 */
function submitForm(e) {
  e.preventDefault(); // Prevent default form submission and page reload

  const selectedUserId = userSelect.value;
  if (!selectedUserId) {
    alert("Please select a user."); // Basic validation feedback
    return;
  }

  const topic = userInputTopic.value.trim();
  if (!topic) {
    alert("Please enter a topic."); // Basic validation feedback
    return;
  }

  const date = userInputDate.value;
  if (!date) { // This check is mostly for robustness if HTML 'required' is bypassed
    alert("Please select a date."); // Basic validation feedback
    return;
  }

  // Calculate the 5 revision dates
  const userNewData = calcRevisionDates(topic, date);
  
  // Add the new data to storage for the selected user
  addData(selectedUserId, userNewData);
  
  // Get the updated full agenda for the user and refresh the display
  const updatedUserData = getData(selectedUserId);
  displayAgenda(updatedUserData);
  
  // Reset the form inputs
  userForm.reset();
  // Set the date picker back to today's date
  userInputDate.value = formatToDateString();
}

/**
 * Initializes the application:
 * - Populates the user dropdown.
 * - Sets up event listeners for user selection and form submission.
 * - Sets the default date in the date picker to today.
 */
function init() {
  populateUserDropdown();
  userSelect.addEventListener("change", onUserChange);
  userForm.addEventListener("submit", submitForm);
  
  // Set the date input's default value to today's date on load
  userInputDate.value = formatToDateString();
}

// Start initialization when the DOM content is fully loaded to ensure all elements exist
window.addEventListener("DOMContentLoaded", init);