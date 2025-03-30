// spotify_auth.js

// Spotify credentials and redirect URI
const clientId = '3644afee558843dd8aadaec4d0a6ebb1';
const redirectUri = 'https://vmusichub.github.io/VonSpotify/redirect.html';

// Scope required for fetching user data
const scope = 'user-read-private user-read-email';

// Spotify login URL
const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}`;

// Check if the access token exists in the URL
function getAccessTokenFromUrl() {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    return hashParams.get('access_token');
}

// Update the profile info after successful authorization
function updateProfileInfo() {
    const accessToken = getAccessTokenFromUrl();
    if (!accessToken) {
        console.log("No access token found.");
        return;
    }

    // Fetch the user's Spotify profile
    fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        // Get the profile data
        const userName = data.display_name;
        const userImage = data.images[0]?.url || ''; // Get the first image (profile picture)

        // Update the profile picture and name on the Carrd site
        const spotifyNameElement = document.getElementById('spotify_name');
        const spotifyPfpElement = document.getElementById('spotify_pfp');

        spotifyNameElement.textContent = userName;
        spotifyPfpElement.src = userImage;

        // Make them visible
        spotifyNameElement.style.visibility = 'visible';
        spotifyPfpElement.style.visibility = 'visible';
    })
    .catch(error => console.error('Error fetching Spotify profile data:', error));
}

// Trigger login when the user clicks the login button
document.getElementById('spotify_login').addEventListener('click', () => {
    window.location.href = authUrl;
});

// If there's an access token in the URL, update the profile
window.onload = () => {
    if (getAccessTokenFromUrl()) {
        updateProfileInfo();
    }
};
