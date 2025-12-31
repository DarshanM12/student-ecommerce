// ============================================
// Authentication Module
// ============================================

const auth = {
    // Check if user is authenticated
    isAuthenticated() {
        const userEmail = localStorage.getItem('currentUser');
        return userEmail !== null;
    },

    // Get current user email
    getCurrentUser() {
        return localStorage.getItem('currentUser') || '';
    },

    // Login user (email validation for @dsce.in)
    login(email) {
        if (!email.endsWith('@dsce.in')) {
            return {
                success: false,
                message: 'Invalid email. Only @dsce.in emails are allowed.'
            };
        }

        localStorage.setItem('currentUser', email);
        return {
            success: true,
            message: 'Login successful'
        };
    },

    // Logout user
    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    },

    // Check if current user is admin
    isAdmin() {
        return this.getCurrentUser() === 'admin@dsce.in';
    }
};

// Initialize logout button listeners
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.logout();
        });
    }
});

