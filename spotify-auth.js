document.addEventListener('DOMContentLoaded', function() {
    // Check for Spotify auth data in localStorage
    const profilePicUrl = localStorage.getItem('spotify_pfp');
    const userName = localStorage.getItem('spotify_name');
    
    // Get DOM elements
    const pfpElement = document.getElementById('spotify_pfp');
    const nameElement = document.getElementById('spotify_name');
    const loginButton = document.getElementById('spotify_login');
    
    // If user is authenticated
    if (profilePicUrl && userName) {
        if (pfpElement && nameElement && loginButton) {
            // Update profile display
            pfpElement.src = profilePicUrl || 'https://via.placeholder.com/150';
            pfpElement.alt = `${userName}'s Spotify Profile Picture`;
            nameElement.textContent = userName;
            
            // Show profile, hide login button
            pfpElement.style.display = 'block';
            nameElement.style.display = 'block';
            loginButton.style.display = 'none';
        }
    } else {
        // Clear any existing data if not fully authenticated
        localStorage.removeItem('spotify_pfp');
        localStorage.removeItem('spotify_name');
        localStorage.removeItem('spotify_token');
    }
});

// Handle the Spotify login button click
document.getElementById('spotify_login')?.addEventListener('click', function(e) {
    e.preventDefault();
    const CLIENT_ID = '3644afee558843dd8aadaec4d0a6ebb1';
    const REDIRECT_URI = 'https://vmusichub.github.io/vonspotify/redirect.html';
    const SCOPE = 'user-read-private user-read-email';
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}`;
    window.location.href = authUrl;
});
