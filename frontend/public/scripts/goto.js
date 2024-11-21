// Global Threads List (Keeps in sync with the database)
let threads = [];

// Fetch and display all threads
async function displayThreads() {
  const threadContainer = document.getElementById('threads-container');
  threadContainer.innerHTML = ''; // Clear existing threads

  try {
    const response = await fetch('http://3.211.14.24:3222/api/threads');
    if (!response.ok) throw new Error('Failed to fetch threads');
    threads = await response.json();

    threads.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));

    threads.forEach(thread => {
      const threadElement = document.createElement('div');
      threadElement.classList.add('thread', 'shadow-lg', 'mb-4', 'rounded-lg');
      threadElement.innerHTML = `
        <div class="thread-header p-3">
          <div class="position-relative">
            <button class="btn btn-sm btn-delete-x" onclick="deleteThread('${thread._id}')">x</button>
            <h3>
              <a href="#" class="thread-title text-decoration-none text-dark" onclick="goToThread('${thread._id}')">${thread.title}</a>
            </h3>
          </div>
          <div class="thread-body p-3">
            <p class="thread-description text-muted">${thread.description}</p>
          </div>
          <div class="thread-footer d-flex justify-content-between align-items-center p-3">
            <div class="btn-group">
              <button class="btn btn-outline-success btn-sm" onclick="updateLikes('${thread._id}', 'like')">
                Like (${thread.likes})
              </button>
              <button class="btn btn-outline-danger btn-sm" onclick="updateLikes('${thread._id}', 'dislike')">
                Dislike (${thread.dislikes})
              </button>
            </div>
            <span class="thread-replies text-muted">${thread.comments.length} replies</span>
            <button class="btn btn-primary btn-sm" onclick="goToThread('${thread._id}')">View Thread</button>
          </div>
        </div>
      `;
      threadContainer.appendChild(threadElement);
    });
  } catch (err) {
    console.error('Error fetching threads:', err);
  }
}

// Create a new thread
async function createNewThread() {
  const title = document.getElementById('thread-title').value.trim();
  const description = document.getElementById('thread-description').value.trim();

  if (title && description) {
    try {
      const response = await fetch('http://3.211.14.24:3222/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        await displayThreads(); // Refresh threads
        document.getElementById('thread-title').value = '';
        document.getElementById('thread-description').value = '';
      } else {
        alert('Error creating thread.');
      }
    } catch (err) {
      console.error('Error creating thread:', err);
    }
  } else {
    alert('Please fill in both title and description.');
  }
}

// Delete a thread
async function deleteThread(threadId) {
  try {
    const response = await fetch(`http://3.211.14.24:3222/api/threads/${threadId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      await displayThreads(); // Refresh threads after deletion
    } else {
      alert('Error deleting thread.');
    }
  } catch (err) {
    console.error('Error deleting thread:', err);
  }
}

// Update likes or dislikes for a thread
async function updateLikes(threadId, action) {
  try {
    const thread = threads.find(t => t._id === threadId);
    if (!thread) throw new Error('Thread not found');

    // Toggle like or dislike
    if (action === 'like') {
      thread.likes++;
    } else if (action === 'dislike') {
      thread.dislikes++;
    } else if (action === 'unlike') {
      thread.likes = Math.max(thread.likes - 1, 0); // Prevent negative counts
    } else if (action === 'undislike') {
      thread.dislikes = Math.max(thread.dislikes - 1, 0); // Prevent negative counts
    }
    
    // Save changes to the server
    const response = await fetch(`http://3.211.14.24:3222/api/threads/${threadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes: thread.likes, dislikes: thread.dislikes }),
    });

    if (response.ok) {
      const updatedThread = await response.json();
      threads = threads.map(t => (t._id === threadId ? updatedThread : t)); // Sync updated thread
      displayThreads(); // Refresh UI
    } else {
      alert('Error updating likes/dislikes.');
    }
  } catch (err) {
    console.error('Error updating likes/dislikes:', err);
  }
}
// View thread details and comments
async function goToThread(threadId) {
  try {
    const thread = threads.find(t => t._id === threadId);
    if (!thread) throw new Error('Thread not found');

    document.querySelector('main').style.display = 'none';
    document.getElementById('thread-view').style.display = 'block';

    document.getElementById('thread-title-view').textContent = thread.title;
    document.getElementById('thread-description-view').textContent = thread.description;
    document.getElementById('thread-id').textContent = threadId;

    await fetchComments(threadId); // Fetch comments for the thread
  } catch (err) {
    console.error('Error fetching thread details:', err);
  }
}

// Fetch comments for a specific thread
async function fetchComments(threadId) {
  try {
    const response = await fetch(`http://3.211.14.24:3222/api/threads/${threadId}/comments`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    const comments = await response.json();

    renderComments(comments); // Render fetched comments
  } catch (err) {
    console.error('Error fetching comments:', err);
  }
}

async function submitComment() {
  const threadId = document.getElementById('thread-id').textContent; // Get thread ID from the view
  const commentText = document.getElementById('comment-input').value.trim();

  if (!commentText) {
    alert('Please enter a comment.');
    return;
  }

  try {
    const response = await fetch(`http://3.211.14.24:3222/api/threads/${threadId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: commentText,
        user: 'Anonymous', // Replace with logged-in user if authentication exists
      }),
    });

    if (!response.ok) throw new Error('Failed to post comment');

    const newComment = await response.json();

    // Clear the input field
    document.getElementById('comment-input').value = '';

    // Update the comments UI
    const thread = threads.find(t => t._id === threadId);
    thread.comments.push(newComment); // Add the new comment locally
    renderComments(thread.comments);
  } catch (err) {
    console.error('Error posting comment:', err);
  }
}

// Render comments for a specific thread
function renderComments(comments) {
  const commentSection = document.getElementById('thread-comments');
  commentSection.innerHTML = ''; // Clear previous comments

  comments.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes)); // Sort comments by votes

  comments.forEach(comment => {
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment', 'mb-3');
    commentElement.innerHTML = `
      <div class="position-relative">
        <strong>${comment.user}</strong>: <p>${comment.text}</p>
      </div>
    `;
    commentSection.appendChild(commentElement);
  });
}


// Go back to threads list
function goBackToThreads() {
  document.querySelector('main').style.display = 'block';
  document.getElementById('thread-view').style.display = 'none';
}

// Initialize the thread list
displayThreads();
