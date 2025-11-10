import { customAuth } from './supabase-client.js';
import { t } from './translations.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = await customAuth.getUser();
    if (user) {
        window.location.href = 'dashboard.html';
    }
});

const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('Attempting login with:', username);

    const { data, error } = await customAuth.signInWithPassword({
        username,
        password,
    });

    if (error) {
        console.error('Login error:', error);
        alert(t('loginError') + error.message);
    } else {
        console.log('Login successful, redirecting to dashboard');
        window.location.href = 'dashboard.html';
    }
});
