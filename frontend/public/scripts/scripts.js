// scripts.js

function loadPage(page) {
    fetch(page)
      .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.text();
      })
      .then(html => {
        document.getElementById('content').innerHTML = html;
      })
      .catch(error => console.error("There was a problem loading the page:", error));
  }
  