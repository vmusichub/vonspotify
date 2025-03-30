// spotify_auth.js - Final Version
document.addEventListener('DOMContentLoaded', function() {
    // Check for Spotify auth data in localStorage
    const profilePicUrl = localStorage.getItem('spotify_pfp');
    const userName = localStorage.getItem('spotify_name');
    const accessToken = localStorage.getItem('spotify_token');
    
    // Get DOM elements
    const pfpElement = document.getElementById('spotify_pfp');
    const nameElement = document.getElementById('spotify_name');
    const loginButton = document.getElementById('spotify_login');
    const logoutButton = document.getElementById('spotify_logout'); // Optional: Add logout button
    
    // If user is authenticated
    if (profilePicUrl && userName && accessToken) {
        if (pfpElement && nameElement && loginButton) {
            // Update profile display
            pfpElement.src = profilePicUrl;
            pfpElement.alt = `${userName}'s Spotify Profile Picture`;
            nameElement.textContent = userName;
            
            // Show profile, hide login button
            pfpElement.style.display = 'block';
            nameElement.style.display = 'block';
            loginButton.style.display = 'none';
            
            // Show logout button if exists
            if (logoutButton) {
                logoutButton.style.display = 'block';
            }
            
            // Optional: Fetch additional Spotify data
            fetchAdditionalSpotifyData(accessToken);
        }
    } else {
        // Clear any existing data if not fully authenticated
        localStorage.removeItem('spotify_pfp');
        localStorage.removeItem('spotify_name');
        localStorage.removeItem('spotify_token');
    }
    
    // Optional: Add logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('spotify_pfp');
            localStorage.removeItem('spotify_name');
            localStorage.removeItem('spotify_token');
            window.location.reload();
        });
    }
});

// Optional: Function to fetch additional Spotify data
function fetchAdditionalSpotifyData(accessToken) {
    // Example: Get user's top tracks or playlists
    fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Top tracks:', data);
        // You could display these in your UI
    })
    .catch(error => {
        console.error('Error fetching additional data:', error);
    });
}

// Handle the Spotify login button click (alternative to embed code)
document.getElementById('spotify_login')?.addEventListener('click', function(e) {
    e.preventDefault();
    const CLIENT_ID = '3644afee558843dd8aadaec4d0a6ebb1';
    const REDIRECT_URI = encodeURIComponent('https://vmusichub.github.io/vonspotify/redirect.html');
    const SCOPE = encodeURIComponent('user-read-private user-read-email user-top-read');
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;
    window.location.href = authUrl;
});
