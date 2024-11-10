// Script to display the current time
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').innerText = `${hours}:${minutes}:${seconds}`;
  }

  // Script to display the current date
  function updateDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    document.getElementById('date').innerText = `${day}/${month}/${year}`;
  }

  // Update clock and date every second
  setInterval(updateClock, 1000);
  setInterval(updateDate, 1000);

  // Set current month and year
  let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function updateCalendar() {
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", 
    "August", "September", "October", "November", "December"
  ];
  
  // Set the month and year
  document.querySelector(".month li:nth-child(3)").innerHTML = `${monthNames[currentMonth]}<br /><span style="font-size: 18px">${currentYear}</span>`;

  // Get the first day of the month and the total days in the month
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Clear any previous days
  const daysContainer = document.querySelector(".days");
  daysContainer.innerHTML = '';

  // Add empty <li> elements to align the first day correctly
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    const emptyDay = document.createElement("li");
    emptyDay.classList.add("empty");
    daysContainer.appendChild(emptyDay);
  }

  // Generate the days for the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("li");
    dayElement.textContent = day;
    daysContainer.appendChild(dayElement);
  }
}

// Functions to move to next and previous months
function nextMonth() {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear += 1;
  } else {
    currentMonth += 1;
  }
  updateCalendar();
}

function prevMonth() {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear -= 1;
  } else {
    currentMonth -= 1;
  }
  updateCalendar();
}

// Event listeners for next and prev buttons
document.querySelector(".next").addEventListener("click", nextMonth);
document.querySelector(".prev").addEventListener("click", prevMonth);

// Initialize the calendar on page load
updateCalendar();

  




  