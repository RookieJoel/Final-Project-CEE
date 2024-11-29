async function updateNavbar() {
    try {
        const response = await fetch('http://54.211.108.140:3222/api/auth/session', { credentials: 'include' });
        const data = await response.json();

        const navbarContainer = document.querySelector('.text-end');
        if (data.loggedIn) {
            // Replace login/signup buttons with the username and logout button
            navbarContainer.innerHTML = `
                <span class="text-warning me-2">Welcome, ${data.username}</span>
                <button class="btn btn-outline-light me-2" onclick="logout()">Log Out</button>
            `;
        } else {
            // Keep login/signup buttons for non-logged-in users
            navbarContainer.innerHTML = `
                <button type="button" class="btn btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#authModal">Login</button>
                <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#authModal">Sign-up</button>
            `;
        }
    } catch (error) {
        console.error('Error updating navbar:', error);
    }
}

async function logout() {
    try {
        const response = await fetch('http://54.211.108.140:3222/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            alert('Logged out successfully');
            window.location.reload();
        } else {
            alert('Failed to log out');
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Run the navbar update function when the page loads
document.addEventListener('DOMContentLoaded', updateNavbar);
