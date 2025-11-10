import { customAuth } from './supabase-client.js';
import { t } from './translations.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Check for and clear old session data that doesn't match expected format
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            // If user ID is a number (old format), clear the session
            if (user && typeof user.id === 'number') {
                console.log('Main.js - Detected old numeric ID format, clearing session');
                localStorage.removeItem('user');
                // Redirect to login page
                window.location.href = 'index.html';
                return;
            }
        } catch (error) {
            console.error('Main.js - Error parsing user data, clearing session:', error);
            localStorage.removeItem('user');
            window.location.href = 'index.html';
            return;
        }
    }
    
    const user = await customAuth.getUser();
    console.log('Main.js - User authentication check:', user);
    if (!user) {
        console.log('Main.js - No user found, redirecting to login');
        window.location.href = 'index.html';
    } else {
        console.log('Main.js - User authenticated:', user);
    }
});
