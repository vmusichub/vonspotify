// Define constants
const CLIENT_ID = '3644afee558843dd8aadaec4d0a6ebb1';
const CLIENT_SECRET = '8786f75ee7cd4e8cb5bb5e3e45c3c101'; 
const REDIRECT_URI = 'https://vmusichub.github.io/VonSpotify/redirect.html';

// This function will be called after the authorization code is received
function authenticateSpotify(code) {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    
    // Exchange the authorization code for an access token
    const data = new URLSearchParams();
    data.append('grant_type', 'authorization_code');
    data.append('code', code);
    data.append('redirect_uri', REDIRECT_URI);
    data.append('client_id', CLIENT_ID);
    data.append('client_secret', CLIENT_SECRET);
    
    axios.post(tokenUrl, data)
        .then(response => {
            const accessToken = response.data.access_token;
            // Fetch the Spotify user data using the access token
            fetchUserProfile(accessToken);
        })
        .catch(error => {
            console.error('Error exchanging code for token:', error);
            alert('Authentication failed.');
        });
}

// This function fetches the user's Spotify profile using the access token
function fetchUserProfile(accessToken) {
    const apiUrl = 'https://api.spotify.com/v1/me';
    
    axios.get(apiUrl, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        const userData = response.data;
        updateProfile(userData);
    })
    .catch(error => {
        console.error('Error fetching user profile:', error);
        alert('Could not fetch user profile.');
    });
}

// This function updates the profile picture and name in your Carrd site
function updateProfile(userData) {
    const profilePicUrl = userData.images[0] ? userData.images[0].url : '';
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
