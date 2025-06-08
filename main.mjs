import { getUserIds } from "./common.mjs";

const userSelect = document.getElementById('user-select');

function populateDropdown() {
  const users = getUserIds();
  users.forEach(userId => {
    const option = document.createElement('option');
    option.value = userId;
    option.textContent = `User ${userId}`;
    userSelect.appendChild(option);
  });
}

window.onload = () => {
  populateDropdown();
};
