// Initialize a list of threads
let threads = [];

// Display the list of threads
function displayThreads() {
    const threadContainer = document.getElementById('threads-container');
    threadContainer.innerHTML = '';  // Clear existing threads

    threads.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));

    threads.forEach(thread => {
        const threadElement = document.createElement('div');
        threadElement.classList.add('thread', 'shadow-lg', 'mb-4', 'rounded-lg');
        threadElement.innerHTML = `
            <div class="position-relative thread-header p-3">
                <button class="btn btn-sm btn-delete-x" onclick="deleteThread(${thread.id})">x</button>
                <h3>
                    <a href="#" class="thread-title text-decoration-none text-dark" onclick="goToThread(${thread.id})">${thread.title}</a>
                </h3>
            </div>
            <div class="thread-body p-3">
                <p class="thread-description text-muted">${thread.description}</p>
            </div>
            <div class="thread-footer d-flex justify-content-between align-items-center p-3">
                <div class="btn-group">
                    <!-- Like Button -->
                    <button class="btn ${thread.userVoted === 'like' ? 'btn-success' : 'btn-outline-success'} btn-sm" 
                            onclick="likeThread(${thread.id})">
                        Like (${thread.likes})
                    </button>
                    <!-- Dislike Button -->
                    <button class="btn ${thread.userVoted === 'dislike' ? 'btn-danger' : 'btn-outline-danger'} btn-sm" 
                            onclick="dislikeThread(${thread.id})">
                        Dislike (${thread.dislikes})
                    </button>
                </div>
                <span class="thread-replies text-muted">${getReplyCount(thread.comments)} replies</span>
                <button class="btn btn-primary btn-sm" onclick="goToThread(${thread.id})">View Thread</button>
            </div>
        `;
        threadContainer.appendChild(threadElement);
    });
}


// Delete thread
function deleteThread(threadId) {
    // Remove the thread from the array
    threads = threads.filter(thread => thread.id !== threadId);
    displayThreads(); // Re-render the thread list after deletion
}


// Like a thread
function likeThread(threadId) {
    const thread = threads.find(t => t.id === threadId);
    if (thread && thread.userVoted !== 'like') {
        if (thread.userVoted === 'dislike') {
            thread.dislikes--;  // Undo dislike if it was selected
        }
        thread.likes++;
        thread.userVoted = 'like'; // Set the vote state to 'like'
        displayThreads();
    }else{
        thread.likes--;
        thread.userVoted = 'null'; // Set the vote state to 'like'
        displayThreads();
    }
}

// Dislike a thread
function dislikeThread(threadId) {
    const thread = threads.find(t => t.id === threadId);
    if (thread && thread.userVoted !== 'dislike') {
        if (thread.userVoted === 'like') {
            thread.likes--;  // Undo like if it was selected
        }
        thread.dislikes++;
        thread.userVoted = 'dislike'; // Set the vote state to 'dislike'
        displayThreads();
    }else{
        thread.dislikes--;
        thread.userVoted = 'null'; // Set the vote state to 'like'
        displayThreads();
    }
}

// Get the number of replies for a thread
function getReplyCount(comments) {
    return comments.length;
}

// Create a new thread and add it to the list
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

        // Clear form fields
        document.getElementById('thread-title').value = '';
        document.getElementById('thread-description').value = '';

        displayThreads();
    } else {
        alert("Please fill in both title and description.");
    }
}

// Go to a specific thread to view comments
function goToThread(threadId) {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
        document.querySelector('main').style.display = 'none';
        document.getElementById('thread-view').style.display = 'block';

        document.getElementById('thread-title-view').textContent = thread.title;
        document.getElementById('thread-description-view').textContent = thread.description;
        renderComments(thread.comments);

        document.getElementById('thread-id').textContent = threadId;
    }
}

// Add like/dislike functionality for comments
function likeComment(commentId, threadId) {
    const thread = threads.find(t => t.id === threadId);
    const comment = thread.comments.find(c => c.id === commentId);

    if (comment && comment.userVoted !== 'like') {
        // Prevent multiple likes/dislikes
        if (comment.userVoted === 'dislike') {
            comment.dislikes--; // Undo the like if it was already liked
        }  
        comment.likes++; // Increment likes
        comment.userVoted = 'like'; // Set the vote to 'like'
        renderComments(thread.comments); // Re-render comments
    }else{
        comment.likes--;
        comment.userVoted = 'null'; // Set the vote state to 'like'
        renderComments(thread.comments);
    }
}

function dislikeComment(commentId, threadId) {
    const thread = threads.find(t => t.id === threadId);
    const comment = thread.comments.find(c => c.id === commentId);

    if (comment && comment.userVoted !== 'dislike') {
        // Prevent multiple likes/dislikes
        if (comment.userVoted === 'like') {
            comment.likes--; // Undo the like if it was already liked
        }  
        comment.dislikes++; // Increment likes
        comment.userVoted = 'dislike'; // Set the vote to 'like'
        renderComments(thread.comments); // Re-render comments
    }else{
        comment.dislikes--;
        comment.userVoted = 'null'; // Set the vote state to 'like'
        renderComments(thread.comments);
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
                <button class="btn btn-sm btn-delete-x" onclick="deleteComment(${comment.id}, ${comment.threadId})">x</button>
                <strong>${comment.user}</strong>: <p>${comment.text}</p>
                
                <div class="btn-group">
                    <!-- Like Button -->
                    <button class="btn ${comment.userVoted === 'like' ? 'btn-success' : 'btn-outline-success'} btn-sm" 
                            onclick="likeComment(${comment.id}, ${comment.threadId})">
                        Like (${comment.likes})
                    </button>
                    
                    <!-- Dislike Button -->
                    <button class="btn ${comment.userVoted === 'dislike' ? 'btn-danger' : 'btn-outline-danger'} btn-sm" 
                            onclick="dislikeComment(${comment.id}, ${comment.threadId})">
                        Dislike (${comment.dislikes})
                    </button>
                </div>
            </div>
        `;
        commentSection.appendChild(commentElement);
    });
}

// Delete comment
function deleteComment(commentId, threadId) {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
        // Find and remove the comment
        thread.comments = thread.comments.filter(comment => comment.id !== commentId);
        renderComments(thread.comments); // Re-render the comments after deletion
    }
}

// Submit a new comment to the thread
function submitComment() {
    const threadId = parseInt(document.getElementById('thread-id').textContent);
    const thread = threads.find(t => t.id === threadId);
    const commentText = document.getElementById('comment-input').value;

    if (commentText.trim() !== '') {
        const newComment = {
            id: thread.comments.length + 1,
            user: 'New User',
            text: commentText,
            likes: 0,
            dislikes: 0, // No vote by default
            threadId: threadId // Store the threadId in the comment for later use
        };

        thread.comments.push(newComment);
        renderComments(thread.comments);
        displayThreads();
        document.getElementById('comment-input').value = '';
    } else {
        alert('Please enter a comment.');
    }
}

// Go back to the threads list
function goBackToThreads() {
    document.getElementById('comment-input').value = '';
    document.querySelector('main').style.display = 'block';
    document.getElementById('thread-view').style.display = 'none';
}

// Initialize the thread list
displayThreads();