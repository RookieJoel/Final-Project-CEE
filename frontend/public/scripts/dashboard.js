document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch(`/api/auth/dashboard/${userId}`);
        const data = await response.json();

        if (response.ok) {
            document.querySelector('#welcomeMessage').textContent = `Welcome, User ID: ${data.userId}`;
        } else {
            alert('Access denied!');
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Error:', error);
        window.location.href = '/login.html';
    }
});
