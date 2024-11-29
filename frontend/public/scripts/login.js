let globalData; // Declare globally
document.querySelector('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const usernameOrEmail = document.querySelector('#usernameOrEmail').value;
    const password = document.querySelector('#password').value;

    try {
        const response = await fetch('http://54.211.108.140:3222/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernameOrEmail, password }),
        });

        const data = await response.json();
        globalData = data; // Assign to global variable
        console.log(data); // Log for verification

        if (response.ok) {
            alert(data.message);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', data.username);
            window.location.href = '/home.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});