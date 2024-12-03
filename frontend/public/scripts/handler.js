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
                <div class="text-warning me-2">Welcome, ${data.username}</div>
                <button id="logoutButton" class="btn btn-outline-light me-2">Log Out</button>
            `;

            // Attach an event listener to the logout button
            document.getElementById('logoutButton').addEventListener('click', logout);
        } else {
            navbarSection.innerHTML = `
                <button type="button" class="btn btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#authModal" id="loginForm">Login</button>
                <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#authModal" id="signupForm">Sign-up</button>
            `;
        }
    } catch (error) {
        console.error('Error updating navbar:', error);
    }
}

// Function to log out the user
export async function logout() {
    try {
        console.log('Logging out...');
        const response = await fetch('http://54.211.108.140:3222/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
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
        console.log('Checking authentication...');
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
