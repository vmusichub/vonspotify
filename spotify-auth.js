console.log('Spotify Auth script loaded'); // Debugging

function checkAuthStatus() {
    console.log('Checking auth status...'); // Debugging
    
    // Check URL for success/error
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const success = urlParams.get('success');
    
    if (error) {
        const errorMsg = localStorage.getItem('spotify_auth_error') || 'Authentication failed';
        console.error('Auth error:', errorMsg);
        alert('Spotify login failed: ' + errorMsg);
        localStorage.removeItem('spotify_auth_error');
    }
    
    // Check localStorage for profile data
    const profilePicUrl = localStorage.getItem('spotify_pfp');
    const userName = localStorage.getItem('spotify_name');
    const pfpElement = document.getElementById('spotify_pfp');
    const nameElement = document.getElementById('spotify_name');
    const loginButton = document.getElementById('spotify_login');
    
    if (profilePicUrl && userName && pfpElement && nameElement && loginButton) {
        console.log('User is authenticated, updating UI...');
        
        pfpElement.src = profilePicUrl || 'https://via.placeholder.com/150';
        pfpElement.alt = `${userName}'s Spotify Profile Picture`;
        nameElement.textContent = userName;
        
        pfpElement.style.display = 'block';
        nameElement.style.display = 'block';
        loginButton.style.display = 'none';
    } else {
        console.log('No auth data found');
        loginButton.style.display = 'block';
    }
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAuthStatus);
} else {
    checkAuthStatus();
}

// Add click handler for login button
document.getElementById('spotify_login')?.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Login button clicked (from auth script)');
    
    const CLIENT_ID = '3644afee558843dd8aadaec4d0a6ebb1';
    const REDIRECT_URI = 'https://vmusichub.github.io/vonspotify/redirect.html';
    const SCOPE = 'user-read-private user-read-email';
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}`;
    
    console.log('Redirecting to Spotify auth:', authUrl);
    window.location.href = authUrl;
});
