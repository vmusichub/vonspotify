// Spotify Authentication Handler for Carrd.co
// Version 2.0 - Complete Fix for Auth Flow

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Spotify Auth JS loaded');
    
    // First check if we're returning from auth with hash parameters
    checkUrlForAuthResponse();
    
    // Then check existing auth status
    checkAuthStatus();
    
    // Finally set up the login button
    setupLoginButton();
});

// Check URL for auth response (in case of redirect back)
function checkUrlForAuthResponse() {
    const hash = window.location.hash;
    if (hash.includes('spotify_auth_complete')) {
        // This would be set in your redirect.html after successful auth
        checkAuthStatus();
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Check if user is already authenticated
function checkAuthStatus() {
    const profilePicUrl = localStorage.getItem('spotify_pfp');
    const userName = localStorage.getItem('spotify_name');
    const accessToken = localStorage.getItem('spotify_token');
    
    const pfpElement = document.getElementById('spotify_pfp');
    const nameElement = document.getElementById('spotify_name');
    const loginButton = document.getElementById('spotify_login');

    if (accessToken && profilePicUrl && userName) {
        console.log('User is authenticated');
        if (pfpElement) {
            pfpElement.src = profilePicUrl || 'https://via.placeholder.com/150';
            pfpElement.style.display = 'block';
            pfpElement.alt = `${userName}'s Spotify Profile Picture`;
        }
        
        if (nameElement) {
            nameElement.textContent = userName;
            nameElement.style.display = 'block';
        }
        
        if (loginButton) {
            loginButton.style.display = 'none';
        }
    } else {
        console.log('No active session found');
        // Clear any partial auth data
        localStorage.removeItem('spotify_pfp');
        localStorage.removeItem('spotify_name');
        localStorage.removeItem('spotify_token');
    }
}

// Set up the login button functionality
function setupLoginButton() {
    const loginBtn = document.getElementById('spotify_login');
    if (!loginBtn) {
        console.error('Login button not found!');
        return;
    }

    // Remove any default behaviors
    loginBtn.onclick = null;
    loginBtn.href = 'javascript:void(0)';
    loginBtn.removeAttribute('target');
    
    // Add proper click handler
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log('Initiating Spotify auth flow');
        
        const CLIENT_ID = '3644afee558843dd8aadaec4d0a6ebb1';
        const REDIRECT_URI = 'https://vmusichub.github.io/vonspotify/redirect.html';
        const SCOPE = 'user-read-private user-read-email';
        
        const authUrl = new URL('https://accounts.spotify.com/authorize');
        authUrl.searchParams.append('client_id', CLIENT_ID);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
        authUrl.searchParams.append('scope', SCOPE);
        authUrl.searchParams.append('show_dialog', 'true'); // Force fresh login
        
        console.log('Redirecting to:', authUrl.toString());
        
        // Force navigation
        window.location.href = authUrl.toString();
        return false;
    }, true); // Use capture phase to ensure we get the event first
}

// Optional: Add this if you want to handle logout
function setupLogout() {
    const logoutBtn = document.getElementById('spotify_logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('spotify_pfp');
            localStorage.removeItem('spotify_name');
            localStorage.removeItem('spotify_token');
            window.location.reload();
        });
    }
}
