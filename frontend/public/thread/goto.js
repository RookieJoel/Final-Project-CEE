let threads = [
    {
      id: 1,
      title: 'How to create a simple website',
      description: 'Learn how to create a basic webpage with HTML, CSS, and JavaScript.',
      likes: 0,
      dislikes: 0,
      comments: [
        { user: 'Alice', text: 'Great tutorial! Thanks for sharing.' },
        { user: 'Bob', text: 'Can you provide a demo?' }
      ]
    },
    {
      id: 2,
      title: 'How to add a contact form to your site',
      description: 'Need help with integrating a contact form to your website? Here’s a step-by-step guide.',
      likes: 0,
      dislikes: 0,
      comments: [
        { user: 'Charlie', text: 'This is exactly what I needed, awesome!' }
      ]
    }
  ];
  
  function displayThreads() {
    const threadList = document.getElementById('thread-list');
    threadList.innerHTML = '';
  
    threads.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
  
    threads.forEach(thread => {
      const threadElement = document.createElement('div');
      threadElement.classList.add('thread', 'shadow-lg', 'mb-4', 'rounded-lg');
      threadElement.innerHTML = `
        <div class="thread-header p-3">
          <h3><a href="#" class="thread-title text-decoration-none text-dark" onclick="goToThread(${thread.id})">${thread.title}</a></h3>
        </div>
        <div class="thread-body p-3">
          <p class="thread-description text-muted">${thread.description}</p>
        </div>
        <div class="thread-footer d-flex justify-content-between align-items-center p-3">
          <div class="btn-group">
            <button class="btn btn-outline-success btn-sm" onclick="likeThread(${thread.id})">Like (${thread.likes})</button>
            <button class="btn btn-outline-danger btn-sm" onclick="dislikeThread(${thread.id})">Dislike (${thread.dislikes})</button>
          </div>
          <span class="thread-replies text-muted">${getReplyCount(thread.comments)} replies</span>
          <button class="btn btn-primary btn-sm" onclick="goToThread(${thread.id})">View Thread</button>
        </div>
      `;
      threadList.appendChild(threadElement);
    });
  }
  
  function likeThread(threadId) {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      thread.likes++;
      displayThreads();
    }
  }
  
  function dislikeThread(threadId) {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      thread.dislikes++;
      displayThreads();
    }
  }
  
  function getReplyCount(comments) {
    return comments.length;
  }
  
  function createNewThread() {
    const title = document.getElementById('thread-title').value;
    const description = document.getElementById('thread-description').value;
  
    if (title && description) {
      const newThread = {
        id: threads.length + 1,
        title: title,
        description: description,
        likes: 0,
        dislikes: 0,
        comments: []
      };
  
      threads.push(newThread);
  
      // Close modal and reset the form
      const modal = new bootstrap.Modal(document.getElementById('createThreadModal'));
      modal.hide();
  
      // Reset form values
      document.getElementById('thread-title').value = '';
      document.getElementById('thread-description').value = '';
  
      // Refresh the thread list
      displayThreads();
    } else {
      alert("Please fill in both title and description.");
    }
  }
  
  function goToThread(threadId) {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      document.querySelector('main').style.display = 'none';
      document.getElementById('thread-view').style.display = 'block';
      document.getElementById('thread-id').textContent = threadId;
  
      renderComments(thread.comments);
    }
  }
  
  function renderComments(comments) {
    const commentSection = document.getElementById('thread-comments');
    commentSection.innerHTML = '';
    comments.forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.classList.add('comment');
      commentElement.innerHTML = `
        <strong>${comment.user}</strong>: <p>${comment.text}</p>
      `;
      commentSection.appendChild(commentElement);
    });
  }
  
  function submitComment() {
    const threadId = parseInt(document.getElementById('thread-id').textContent);
    const thread = threads.find(t => t.id === threadId);
    const commentText = document.getElementById('comment-input').value;
  
    if (commentText.trim() !== '') {
      thread.comments.push({ user: 'New User', text: commentText });
      renderComments(thread.comments);
      displayThreads();
      document.getElementById('comment-input').value = '';
    } else {
      alert('Please enter a comment.');
    }
  }
  
  function goBackToThreads() {
    document.querySelector('main').style.display = 'block';
    document.getElementById('thread-view').style.display = 'none';
  }
  
  displayThreads();
  