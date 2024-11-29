// login
document.querySelector('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameOrEmail = document.querySelector('#usernameForLogin').value;
    const password = document.querySelector('#passwordForLogin').value;

    try {
        const response = await fetch('http://54.211.108.140:3222/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernameOrEmail, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            localStorage.setItem('userId', data.userId); // Save user ID
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