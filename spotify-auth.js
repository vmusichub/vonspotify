const client_id = '3644afee558843dd8aadaec4d0a6ebb1'; // Your Spotify client ID
const redirect_uri = 'https://vmusichub.github.io/VonSpotify/redirect.html'; // Your redirect URI

// The scopes you want to request for the user
const scopes = 'user-library-read user-read-private user-read-email';

// The Spotify authorization URL
const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${client_id}&scope=${scopes}&redirect_uri=${redirect_uri}`;

function loginWithSpotify() {
  window.location.href = authUrl; // Redirect to Spotify authorization page
}

function getProfileData() {
  const urlParams = new URLSearchParams(window.location.hash.substring(1));
  const access_token = urlParams.get('access_token');

  if (access_token) {
    fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      // Display profile information on the page
      document.getElementById('spotify-profile').innerHTML = `
        <img src="${data.images[0].url}" alt="Profile Picture" />
        <h2>${data.display_name}</h2>
      `;
    })
    .catch(error => {
      console.error('Error fetching Spotify profile:', error);
    });
  } else {
    console.log('No access token found in URL');
  }
}

window.onload = getProfileData;
