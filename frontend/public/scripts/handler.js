// handler.js

// Function to update the navbar based on user authentication
export async function updateNavbar() {
    try {
        const response = await fetch('http://54.211.108.140:3222/api/auth/session', {
            credentials: 'include',
        });

        const data = await response.json();
        const navbarSection = document.getElementById('navbar-user-section');

        if (data.loggedIn) {
            navbarSection.innerHTML = `
                <span class="text-warning me-2">Welcome, ${data.username}</span>
                <button class="btn btn-outline-light me-2" onclick="logout()">Log Out</button>
            `;
        } else {
            navbarSection.innerHTML = `
                <button type="button" class="btn btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#authModal">Login</button>
                <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#authModal">Sign-up</button>
            `;
        }
    } catch (error) {
        console.error('Error updating navbar:', error);
    }
}

// Function to log out the user
export async function logout() {
    try {
        const response = await fetch('http://54.211.108.140:3222/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            alert('Logout successful');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');

            // Update the navbar to reflect logged-out state
            await updateNavbar();

            // Redirect to the login page
            window.location.href = '/';
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

// Function to check user authentication
export async function checkAuthentication() {
    try {
        const response = await fetch('http://54.211.108.140:3222/api/auth/session', {
            credentials: 'include',
        });

        const data = await response.json();

        if (!data.loggedIn) {
            alert("ฮั่นแน่~ เรายังไม่รู้จักเลยน้า Log-in ก่อนค้าบ");
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        window.location.href = '/';
    }
}
