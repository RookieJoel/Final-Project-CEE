// Global Threads List (Keeps in sync with the database)
let threads = [];

// Fetch and display all threads
// Fetch and display all threads
async function displayThreads(initialLoad = true) {
  const userId = localStorage.getItem('userId'); // Get current user ID
  const username = localStorage.getItem('username') || 'Anonymous'; // Get the current user's username
  const threadContainer = document.getElementById('threads-container');

  if (initialLoad) {
    threadContainer.innerHTML = '';

    try {
      const response = await fetch('http://54.211.108.140:3222/api/threads');
      if (!response.ok) throw new Error('Failed to fetch threads');
      threads = await response.json();
    } catch (err) {
      console.error('Error fetching threads:', err);
      return;
    }
  }
  threads.sort((a, b) => {
    const aLikesDislikesCount = a.likes.length + a.dislikes.length;
    const bLikesDislikesCount = b.likes.length + b.dislikes.length;
    return bLikesDislikesCount - aLikesDislikesCount; // Sort in descending order
  });

  threads.forEach(thread => {
    const threadElement = document.querySelector(`[data-thread-id="${thread._id}"]`);
    if (!threadElement) {
      // Create a new thread element
      const newThreadElement = document.createElement('div');
      newThreadElement.classList.add('thread', 'shadow-lg', 'mb-4', 'rounded-lg');
      newThreadElement.dataset.threadId = thread._id;
      
      // Conditionally render the delete button
      const isUserThreadOwner = thread.username === username;

      newThreadElement.innerHTML = `
        <div class="thread-header p-3">
          <div class="position-relative">
            <h3>
              <a href="#" class="thread-title text-decoration-none text-white" onclick="goToThread('${thread._id}')">${thread.title}</a>
              ${isUserThreadOwner ? `<button class="btn btn-sm btn-delete-x text-white" onclick="deleteThread('${thread._id}')">X</button>` : ''}
            </h3>
          </div>
          <div class="thread-body p-3">
            <span class="thread-posted-by text-muted">Posted by: ${thread.username}</span>
            <p class="thread-description text-muted text-white">${thread.description}</p>
          </div>
          <div class="thread-footer d-flex justify-content-between align-items-center p-3">
            <div class="btn-group">
              <button class="btn btn-outline-success btn-sm btn-like ${thread.likes.includes(userId) ? 'btn-liked' : ''}" 
                onclick="updateLikes('${thread._id}', 'like')">
                Like (${thread.likes.length})
              </button>
              <button class="btn btn-outline-danger btn-sm btn-dislike ${thread.dislikes.includes(userId) ? 'btn-disliked' : ''}" 
                onclick="updateLikes('${thread._id}', 'dislike')">
                Dislike (${thread.dislikes.length})
              </button>
            </div>
            <span class="thread-replies text-muted">${thread.comments.length} replies</span>
            <button class="btn btn-primary btn-sm" onclick="goToThread('${thread._id}')">View Thread</button>
          </div>
        </div>
      `;

      threadContainer.appendChild(newThreadElement);
    } else {
      // Update existing thread element
      const likeButton = threadElement.querySelector('.btn-like');
      const dislikeButton = threadElement.querySelector('.btn-dislike');

      likeButton.innerHTML = `Like (${thread.likes.length})`;
      dislikeButton.innerHTML = `Dislike (${thread.dislikes.length})`;

      // Toggle the `btn-liked` class for buttons
      likeButton.classList.toggle('btn-liked', thread.likes.includes(userId));
      dislikeButton.classList.toggle('btn-liked', thread.dislikes.includes(userId));
    }
  });
}


// Create a new thread
async function createNewThread() {
  const title = document.getElementById('thread-title').value.trim();
  const description = document.getElementById('thread-description').value.trim();
  const username = localStorage.getItem('username') || 'Anonymous'; // Get username

  if (title && description) {
    try {
      const response = await fetch('http://54.211.108.140:3222/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, username }), // Include username when creating thread
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
    const response = await fetch(`http://54.211.108.140:3222/api/threads/${threadId}`, {
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

async function fetchThreadDetails(threadId) {
  try {
      const response = await fetch(`http://54.211.108.140:3222/api/threads/${threadId}`);
      const thread = await response.json();
      const userId = localStorage.getItem('userId');

      if (thread.likedBy.includes(userId)) {
          document.getElementById('like-button').disabled = true;  // Disable like button
      }
      if (thread.dislikedBy.includes(userId)) {
          document.getElementById('dislike-button').disabled = true;  // Disable dislike button
      }
      
      // Update UI with the thread data
      // ...
  } catch (err) {
      console.error('Error fetching thread details:', err);
  }
}

async function updateLikes(threadId, action) {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('You must be logged in to like or dislike a thread.');
    return;
  }

  try {
    const response = await fetch(`http://54.211.108.140:3222/api/threads/${threadId}/likes`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action }),
    });

    if (!response.ok) throw new Error('Failed to update likes/dislikes');
    const updatedThread = await response.json();

    // Update the thread locally
    const threadIndex = threads.findIndex(t => t._id === threadId);
    if (threadIndex !== -1) threads[threadIndex] = updatedThread;

    // Refresh the specific thread UI
    displayThreads(false);

    const threadElement = document.querySelector(`[data-thread-id="${threadId}"]`);
    const likeButton = threadElement.querySelector('.btn-like');
    const dislikeButton = threadElement.querySelector('.btn-dislike');

     likeButton.classList.toggle('btn-liked', updatedThread.likes.includes(userId));
    dislikeButton.classList.toggle('btn-disliked', updatedThread.dislikes.includes(userId));

    // If the user likes, ensure the dislike button is not in the disliked state
    if (action === 'like') {
      dislikeButton.classList.remove('btn-disliked');
    }

    // If the user dislikes, ensure the like button is not in the liked state
    if (action === 'dislike') {
      likeButton.classList.remove('btn-liked');
    }
  } catch (err) {
    console.error('Error updating likes/dislikes:', err);
  }
}



// Handle like button click (toggle like/unlike)
async function handleLike(threadId) {
  await updateLikes(threadId, 'like'); // Call updateLikes with 'like' action
}

// Handle dislike button click (toggle dislike/undislike)
async function handleDislike(threadId) {
  await updateLikes(threadId, 'dislike'); // Call updateLikes with 'dislike' action
}


// Fetch comments for a specific thread
async function fetchComments(threadId) {
  try {
    const response = await fetch(`http://54.211.108.140:3222/api/threads/${threadId}/comments`);
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
  const username = localStorage.getItem('username') || 'Anonymous';

  if (!commentText) {
    alert('Please enter a comment.');
    return;
  }

  try {
    const response = await fetch(`http://54.211.108.140:3222/api/threads/${threadId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: commentText,
        user: username // Replace with logged-in user if authentication exists
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
      <div class="position-relative-inthread">
        <strong style="padding-left: 20px;font-size: 22px;">${comment.user}</strong>: <p style="margin-left: 40px;font-size: 20px;">${comment.text}</p>
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

async function checkAuthentication() {
  try {
      const response = await fetch('http://54.211.108.140:3222/api/auth/session', {
          credentials: 'include', // Include cookies for session-based auth
      });

      const data = await response.json();

      if (!data.loggedIn) {
          // If not logged in, redirect to the login page
          alert("ฮั่นแน่~ เรายังไม่รู้จักเลยน้า Log-in ก่อนค้าบ");
          window.location.href = '/';
      }
  } catch (error) {
      console.error('Error checking authentication:', error);
      // Redirect to the login page in case of an error
      window.location.href = '/';
  }
}

// Run the authentication check on page load
document.addEventListener('DOMContentLoaded', checkAuthentication);


