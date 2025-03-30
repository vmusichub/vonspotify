// Spotify Authentication for Carrd - Full Solution
// Handles Carrd's forced URL requirement

document.addEventListener('DOMContentLoaded', function() {
    // 1. Check for existing authentication
    checkAuthStatus();
    
    // 2. Set up the login button with Carrd workaround
    const loginBtn = document.getElementById('spotify_login');
    if (loginBtn) {
        // Carrd workaround - prevent default navigation
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            initiateSpotifyAuth();
            return false;
        }, true); // Use capture phase
        
        // Additional safety - override any Carrd-generated onclick
        loginBtn.onclick = null;
    }
});

function checkAuthStatus() {
    const profilePic = localStorage.getItem('spotify_pfp');
    const username = localStorage.getItem('spotify_name');
    
    if (profilePic && username) {
        const pfpElement = document.getElementById('spotify_pfp');
        const nameElement = document.getElementById('spotify_name');
        
        if (pfpElement) {
            pfpElement.src = profilePic;
            pfpElement.style.display = 'block';
        }
        
        if (nameElement) {
            nameElement.textContent = username;
            nameElement.style.display = 'block';
        }
    }
}

function initiateSpotifyAuth() {
    const CLIENT_ID = '3644afee558843dd8aadaec4d0a6ebb1';
    const REDIRECT_URI = encodeURIComponent('https://vmusichub.github.io/vonspotify/redirect.html');
    const SCOPE = encodeURIComponent('user-read-private user-read-email');
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&show_dialog=true`;
    
    // Forced delay to ensure Carrd doesn't intercept
    setTimeout(() => {
        window.location.href = authUrl;
    }, 50);
}

// Safety measure - override any window.onload handlers Carrd might add
window.addEventListener('load', function() {
    const loginBtn = document.getElementById('spotify_login');
    if (loginBtn) {
        loginBtn.href = 'javascript:void(0)';
        loginBtn.onclick = null;
    }
}, false);
