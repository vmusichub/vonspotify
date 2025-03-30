function initSpotifyAuth() {
    console.log('Initializing Spotify auth');
    
    // Check for auth data
    var profilePic = localStorage.getItem('spotify_pfp');
    var userName = localStorage.getItem('spotify_name');
    var pfpElement = document.getElementById('spotify_pfp');
    var nameElement = document.getElementById('spotify_name');
    var loginBtn = document.getElementById('spotify_login');
    
    if (profilePic && userName) {
        console.log('User authenticated');
        if (pfpElement) {
            pfpElement.src = profilePic;
            pfpElement.style.display = 'block';
        }
        if (nameElement) {
            nameElement.textContent = userName;
            nameElement.style.display = 'block';
        }
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
    } else {
        console.log('No auth data found');
        if (loginBtn) {
            loginBtn.style.display = 'block';
        }
    }
}

// Wait for Carrd to be ready
if (window._carrd && window._carrd.loaded) {
    initSpotifyAuth();
} else {
    document.addEventListener('_carrd-loaded', initSpotifyAuth);
}
