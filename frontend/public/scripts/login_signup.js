// login
document.querySelector('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameOrEmail = document.querySelector('#usernameForLogin').value;
    const password = document.querySelector('#passwordForLogin').value;

    try {
        const response = await fetch('http://54.211.108.140:3222/api/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernameOrEmail, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', data.username);

            // Update the navbar dynamically
            await updateNavbar();

            window.location.href = '/home.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});

// signup
document.querySelector('#signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.querySelector('#usernameForSignup').value;
    const email = document.querySelector('#emailForSignup').value;
    const password = document.querySelector('#passwordForSignup').value;

    try {
        const response = await fetch('http://54.211.108.140:3222/api/auth/signup', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            window.location.href = '/'; // Redirect to login page
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during signup:', error);
    }
});

// toggle
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Update Navbar
async function updateNavbar() {
    try {
        const response = await fetch('http://54.211.108.140:3222/api/auth/session', {
            credentials: 'include',
        });

        const data = await response.json();
        const navbarSection = document.getElementById('navbar-user-section');

        if (data.loggedIn) {
            navbarSection.innerHTML = `
                <span class="text-warning me-2">Welcome, ${data.username}</span>
                <button id="logoutButton" class="btn btn-outline-light me-2">Log Out</button>
            `;

            // Bind the logout function to the button
            document.getElementById('logoutButton').addEventListener('click', logout);
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

// Logout
async function logout() {
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
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

// Update the navbar on page load
document.addEventListener('DOMContentLoaded', async () => {
    await updateNavbar();
});

async function logout() {
    try {
        const response = await fetch('http://54.211.108.140:3222/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            alert('Logout successful');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');

            // Update the navbar to reflect the logged-out state
            await updateNavbar();
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

