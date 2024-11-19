// Script to display the current time
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("clock").innerText = `${hours}:${minutes}:${seconds}`;
}

// Script to display the current date
function updateDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  document.getElementById("date").innerText = `${day}/${month}/${year}`;
}

// Update clock and date every second
setInterval(updateClock, 1000);
setInterval(updateDate, 1000);

// Set current month and year
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function updateCalendar() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Update current month and year
  document.querySelector(
    ".month li:nth-child(3)"
  ).innerHTML = `${monthNames[currentMonth]}<br /><span style="font-size: 18px">${currentYear}</span>`;

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const daysContainer = document.querySelector(".days");
  daysContainer.innerHTML = "";

  // Get today's date
  const today = new Date();
  const isToday =
    today.getFullYear() === currentYear &&
    today.getMonth() === currentMonth;

  const currentDay = today.getDate();

  // Fill the empty spaces before the first day of the month
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    const emptyDay = document.createElement("li");
    emptyDay.classList.add("empty");
    daysContainer.appendChild(emptyDay);
  }

  // Add actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("li");
    dayElement.textContent = day;

    // Highlight today's date
    if (isToday && day === currentDay) {
      dayElement.classList.add("today");
    }

    daysContainer.appendChild(dayElement);
  }
}

// Functions to move to next and previous months
function nextMonth() {
  currentMonth = (currentMonth + 1) % 12;
  if (currentMonth === 0) currentYear++;
  updateCalendar();
}

function prevMonth() {
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  if (currentMonth === 11) currentYear--;
  updateCalendar();
}

document.querySelector(".next").addEventListener("click", nextMonth);
document.querySelector(".prev").addEventListener("click", prevMonth);

updateCalendar();

// ************************************** To-Do List Functionality

document.addEventListener("DOMContentLoaded", () => {
  // Button event listeners
  const addButton = document.getElementById("add-newrow");
  addButton.addEventListener("click", () => {
    handleCreateItem();
  });

  const filterButton = document.getElementById("filter-button");
  filterButton.addEventListener("click", () => {
    handleFilterItem();
  });
});

/**
 * Function to create a new item in the to-do list
 */
function handleCreateItem() {
  const taskInput = document.getElementById("taskInput").value;
  const categorySelect = document.getElementById("categorySelect").value;

  // Validate if taskInput is not empty
  if (taskInput.trim() !== "") {
    const taskList = document.getElementById("taskList");

    // Create a new list item for the task
    const listItem = document.createElement("li");
    listItem.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    // Create the delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "btn-danger", "ms-3");
    deleteButton.addEventListener("click", () => {
      taskList.removeChild(listItem); // Remove the task when the button is clicked
    });

    // Create a span for task text and category
    const taskDetails = document.createElement("span");
    taskDetails.classList.add("task-details");
    taskDetails.innerHTML = `
      <span class="task-text">${taskInput}</span>
      <span class="category-text"><strong>${categorySelect}</strong></span>
    `;

    // Add the task details and delete button to the list item
    listItem.appendChild(taskDetails);
    listItem.appendChild(deleteButton);

    // Add the new task to the list
    taskList.appendChild(listItem);

    // Clear the input field
    document.getElementById("taskInput").value = "";
  }
}

function addTask(task, category) {
  const maxLength = 100; // จำนวนตัวอักษรสูงสุด
  if (task.length > maxLength) {
    task = task.substring(0, maxLength) + "...";
  }
  const taskList = document.getElementById("taskList");
  const newTask = document.createElement("li");
  newTask.className = "todo-item";
  newTask.innerHTML = `<span class="todo-text">${task}</span> <span class="badge bg-warning">${category}</span>`;
  taskList.appendChild(newTask);
}

// ******************* Page Loading and Pagination *******************

document.addEventListener("DOMContentLoaded", () => {
  // Function to load announcements based on the selected page
  const loadPage = (pageNumber) => {
    console.log(`Loading announcements for page ${pageNumber}`);

    // Hide all announcements before displaying the current page
    const allAnnouncements = document.querySelectorAll(".announcement-box");
    allAnnouncements.forEach((announcement) => {
      announcement.style.display = "none";
    });

    // Calculate the start and end index for announcements to display
    const startIndex = (pageNumber - 1) * 3; // 3 announcements per page
    const endIndex = startIndex + 3;

    // Display the announcements for the selected page
    for (let i = startIndex; i < endIndex; i++) {
      const announcement = document.getElementById(`announcement${i + 1}`);
      if (announcement) {
        announcement.style.display = "block";
      }
    }

    // Update the active page styling
    const pageLinks = document.querySelectorAll(".text-warning");
    pageLinks.forEach((link) => {
      link.classList.remove("active"); // Remove active class from all pages
    });

    // Add the active class to the selected page
    const activeLink = document.querySelector(
      `.text-warning[data-page='${pageNumber}']`
    );
    if (activeLink) {
      activeLink.classList.add("active");
    }
  };

  // Set current page to page 1 by default
  let currentPage = 1;

  // Get all pagination links
  const pageLinks = document.querySelectorAll(".text-warning");

  // Event listener for each pagination link
  pageLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent the page from reloading
      const pageNumber = parseInt(e.target.getAttribute("data-page"));

      loadPage(pageNumber); // Load the selected page
    });
  });

  // Load the current page when the page is fully loaded
  loadPage(currentPage); // Default to page 1
});

/** 
 * Function to filter items (if needed)
 */
function handleFilterItem() {
  console.log("Filtering items...");
}

// Function to highlight today's date
function highlightToday() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth(); // January is 0
  const year = today.getFullYear();

  if (month === displayedMonth && year === displayedYear) {
    const days = document.querySelectorAll('.days li');
    days.forEach(dayElement => {
      if (parseInt(dayElement.textContent) === day) {
        dayElement.classList.add('today');
      }
    });
  }
}


// Highlight today when the page loads
document.addEventListener('DOMContentLoaded', highlightToday);


