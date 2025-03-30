// Define constants
const REDIRECT_URI = 'https://vmusichub.github.io/VonSpotify/redirect.html';
const BACKEND_URL = 'https://your-backend.com/auth'; // Change this to your actual backend URL

// This function will be called after the authorization code is received
function authenticateSpotify(code) {
    axios.post(`${BACKEND_URL}/callback`, { code })
        .then(response => {
            const accessToken = response.data.access_token;
            fetchUserProfile(accessToken);
        })
        .catch(error => {
            console.error('Error exchanging code for token:', error);
            alert('Authentication failed.');
            window.location.href = 'https://vmusichub.com/#vonspotify';
        });
}

// This function fetches the user's Spotify profile using the access token
function fetchUserProfile(accessToken) {
    axios.get('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    .then(response => {
        updateProfile(response.data);
    })
    .catch(error => {
        console.error('Error fetching user profile:', error);
        alert('Could not fetch user profile.');
    });
}

// This function updates the profile picture and name in your Carrd site
function updateProfile(userData) {
    const profilePicUrl = userData.images.length > 0 ? userData.images[0].url : '';
    const userName = userData.display_name || 'Spotify User';

    // Update the Carrd elements using JavaScript
    document.getElementById('spotify_pfp').src = profilePicUrl;
    document.getElementById('spotify_name').textContent = userName;

    // Make the elements visible
    document.getElementById('spotify_pfp').style.visibility = 'visible';
    document.getElementById('spotify_name').style.visibility = 'visible';

    // Optionally, hide the login button after successful login
    document.getElementById('spotify_login').style.visibility = 'hidden';
}
