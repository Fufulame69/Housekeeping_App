import supabase from './supabase-client.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        window.location.href = 'dashboard.html';
    }
});

const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', async () => {
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        alert('Error logging in: ' + error.message);
    } else {
        window.location.href = 'dashboard.html';
    }
});
