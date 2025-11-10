// Translation dictionary for the Minibar Inventory App
export const translations = {
    en: {
        // Navigation
        navRooms: "Rooms",
        navDashboard: "Dashboard",
        navActivity: "Activity",
        navProfile: "Profile",
        
        // Login page
        appTitle: "Minibar Inventory",
        username: "Username",
        password: "Password",
        login: "Login",
        forgotPassword: "Forgot Password?",
        
        // Dashboard page
        currentStockLevels: "Current Stock Levels",
        totalStock: "Total Stock",
        current: "Current",
        lowStockAlerts: "Low Stock Alerts",
        topConsumedItems: "Top Consumed Items",
        
        // Profile page
        profile: "Profile",
        settings: "Settings",
        language: "Language",
        selectLanguage: "Select Language",
        english: "English",
        spanish: "Spanish",
        logout: "Logout",
        
        // Common
        loading: "Loading...",
        error: "Error",
        success: "Success",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        add: "Add",
        search: "Search",
        filter: "Filter",
        back: "Back",
        next: "Next",
        previous: "Previous",
        close: "Close",
        confirm: "Confirm",
        yes: "Yes",
        no: "No",
        
        // Messages
        loginError: "Error logging in: ",
        loginSuccess: "Login successful",
        logoutSuccess: "Logged out successfully",
        saveSuccess: "Saved successfully",
        saveError: "Error saving: ",
        deleteSuccess: "Deleted successfully",
        deleteError: "Error deleting: ",
        networkError: "Network error. Please check your connection.",
        unauthorizedError: "Unauthorized access. Please login again.",
    },
    es: {
        // Navigation
        navRooms: "Habitaciones",
        navDashboard: "Panel de Control",
        navActivity: "Actividad",
        navProfile: "Perfil",
        
        // Login page
        appTitle: "Inventario de Minibar",
        username: "Nombre de Usuario",
        password: "Contraseña",
        login: "Iniciar Sesión",
        forgotPassword: "¿Olvidaste tu Contraseña?",
        
        // Dashboard page
        currentStockLevels: "Niveles Actuales de Inventario",
        totalStock: "Inventario Total",
        current: "Actual",
        lowStockAlerts: "Alertas de Inventario Bajo",
        topConsumedItems: "Artículos Más Consumidos",
        
        // Profile page
        profile: "Perfil",
        settings: "Configuración",
        language: "Idioma",
        selectLanguage: "Seleccionar Idioma",
        english: "Inglés",
        spanish: "Español",
        logout: "Cerrar Sesión",
        
        // Common
        loading: "Cargando...",
        error: "Error",
        success: "Éxito",
        cancel: "Cancelar",
        save: "Guardar",
        delete: "Eliminar",
        edit: "Editar",
        add: "Agregar",
        search: "Buscar",
        filter: "Filtrar",
        back: "Atrás",
        next: "Siguiente",
        previous: "Anterior",
        close: "Cerrar",
        confirm: "Confirmar",
        yes: "Sí",
        no: "No",
        
        // Messages
        loginError: "Error al iniciar sesión: ",
        loginSuccess: "Inicio de sesión exitoso",
        logoutSuccess: "Sesión cerrada exitosamente",
        saveSuccess: "Guardado exitosamente",
        saveError: "Error al guardar: ",
        deleteSuccess: "Eliminado exitosamente",
        deleteError: "Error al eliminar: ",
        networkError: "Error de red. Por favor verifica tu conexión.",
        unauthorizedError: "Acceso no autorizado. Por favor inicia sesión nuevamente.",
    }
};

// Current language state
let currentLanguage = localStorage.getItem('language') || 'en';

// Function to get current language
export function getCurrentLanguage() {
    return currentLanguage;
}

// Function to set current language
export function setCurrentLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        updatePageLanguage();
    }
}

// Function to get translation
export function t(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

// Function to update page language
function updatePageLanguage() {
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = t(key);
        
        if (element.tagName === 'INPUT' && element.type === 'submit') {
            element.value = translation;
        } else if (element.tagName === 'INPUT' && element.placeholder) {
            element.placeholder = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // Update all elements with data-translate-placeholder attribute
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        const translation = t(key);
        element.placeholder = translation;
    });
    
    // Update page title
    const titleKey = document.title.replace('Minibar Inventory - ', '').replace('Inventario de Minibar - ', '');
    if (titleKey && t(titleKey)) {
        document.title = `${t('appTitle')} - ${t(titleKey)}`;
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    updatePageLanguage();
});