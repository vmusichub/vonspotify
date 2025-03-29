const CLIENT_ID = "3644afee558843dd8aadaec4d0a6ebb1";  
const REDIRECT_URI = "https://www.vmusichub.com/#spotify";  
const SCOPES = "playlist-modify-public playlist-modify-private";  

// Step 1: Redirect user to Spotify Auth Page
function authorizeSpotify() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = authUrl;
}

// Step 2: Get Access Token from URL
function getAccessToken() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get("access_token");
}

// Step 3: Fetch User's Spotify ID
async function getUserID(accessToken) {
    const response = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    return data.id;
}

// Step 4: Create a Playlist
async function createPlaylist(accessToken, userID, playlistName) {
    const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: playlistName,
            description: "Created via Carrd button",
            public: false,
        }),
    });
    const data = await response.json();
    return data.id;
}

// Step 5: Add Songs to Playlist Based on Custom Rules
async function addTracksToPlaylist(accessToken, playlistID, trackURIs) {
    await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: trackURIs }),
    });
}

// Step 6: Full Process
async function createAndPopulatePlaylist() {
    const accessToken = getAccessToken();
    if (!accessToken) return alert("Authorization failed!");

    const userID = await getUserID(accessToken);
    const playlistID = await createPlaylist(accessToken, userID, "VecomeBack Playlist");

    // Example rule: Add only songs by a specific artist (e.g., Tae/V)
    const trackURIs = [
        "spotify:track:7M8ySgI0n5p5tVsEVayEdr", // Example track
        "spotify:track:5vRjnM6f7wnszwCmVn5JRh", // Example track
    ];

    await addTracksToPlaylist(accessToken, playlistID, trackURIs);
    alert("Playlist created successfully!");
}

// Run this when redirected from Spotify
if (window.location.hash.includes("access_token")) {
    createAndPopulatePlaylist();
}
// JavaScript Document