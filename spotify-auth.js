const clientId = "3644afee558843dd8aadaec4d0a6ebb1";
const redirectUri = "https://vmusichub.github.io/VonSpotify/redirect.html";
const scopes = "playlist-modify-private playlist-modify-public";

// Function to start authorization process
function authorizeSpotify() {
    const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(scopes)}`;
    
    window.location.href = authUrl;
}

// Function to extract token from URL fragment
function getAccessToken() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get("access_token");
}

// Function to create a playlist
async function createPlaylist(accessToken, playlistName, playlistDescription) {
    const userProfileResponse = await fetch("https://api.spotify.com/v1/me", {
        headers: { "Authorization": `Bearer ${accessToken}` }
    });

    if (!userProfileResponse.ok) {
        alert("Error fetching user profile.");
        return;
    }

    const userData = await userProfileResponse.json();
    const userId = userData.id;

    // Create a new playlist
    const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: playlistName,
            description: playlistDescription,
            public: false
        })
    });

    if (!createPlaylistResponse.ok) {
        alert("Error creating playlist.");
        return;
    }

    const playlistData = await createPlaylistResponse.json();
    alert(`Playlist "${playlistName}" created successfully!`);
    console.log("Created playlist:", playlistData);
}

// Handle authorization redirect
window.onload = function () {
    const accessToken = getAccessToken();
    if (accessToken) {
        document.getElementById("playlistForm").style.display = "block";

        document.getElementById("createPlaylistBtn").addEventListener("click", function () {
            const playlistName = document.getElementById("playlistName").value;
            const playlistDescription = document.getElementById("playlistDescription").value;

            if (!playlistName.trim()) {
                alert("Playlist name is required.");
                return;
            }

            createPlaylist(accessToken, playlistName, playlistDescription);
        });
    }
};
