document.querySelector('#signupForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    try {
        const response = await fetch('http://localhost:3222/api/auth/signup', { // Backend endpoint
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        
        

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            window.location.href = '/';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during signup:', error);
    }
});
