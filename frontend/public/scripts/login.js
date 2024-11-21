document.querySelector('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    try {
        const response = await fetch('http://localhost:3222/api/auth/login', { // Backend endpoint
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        
        

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            // Save userId for future use
            localStorage.setItem('userId', data.userId);
            window.location.href = '/home.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
