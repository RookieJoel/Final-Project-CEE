document.querySelector('#signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

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
