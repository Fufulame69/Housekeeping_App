import { customAuth } from './supabase-client.js';
import { getCurrentLanguage, setCurrentLanguage, t } from './translations.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Load user information
    await loadUserProfile();
    
    // Set current language in select
    const languageSelect = document.getElementById('language-select');
    const currentLang = getCurrentLanguage();
    languageSelect.value = currentLang;
    
    // Handle language change
    languageSelect.addEventListener('change', (e) => {
        const newLanguage = e.target.value;
        setCurrentLanguage(newLanguage);
        
        // Show success message
        showNotification(t('saveSuccess'), 'success');
    });
    
    // Handle logout
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', async () => {
        try {
            await customAuth.signOut();
            showNotification(t('logoutSuccess'), 'success');
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } catch (error) {
            console.error('Logout error:', error);
            showNotification(t('error') + ': ' + error.message, 'error');
        }
    });
});

// Load user profile information
async function loadUserProfile() {
    try {
        const user = await customAuth.getUser();
        if (user) {
            // Update user name and email display
            const userNameElement = document.getElementById('user-name');
            const userEmailElement = document.getElementById('user-email');
            
            if (userNameElement) {
                // Use user metadata name or fall back to email
                userNameElement.textContent = user.user_metadata?.full_name || user.email || 'User';
            }
            
            if (userEmailElement) {
                userEmailElement.textContent = user.email || 'user@example.com';
            }
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        showNotification(t('error') + ': ' + error.message, 'error');
    }
}

// Show notification message
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}