function initSpotifyAuth() {
    console.log("Initializing Spotify auth");

    var profilePic = localStorage.getItem("spotify_pfp");
    var userName = localStorage.getItem("spotify_name");
    var pfpElement = document.getElementById("spotify_pfp");
    var nameElement = document.getElementById("spotify_name");
    var loginBtn = document.getElementById("spotify_login");

    if (profilePic && userName) {
        console.log("User authenticated");

        if (pfpElement) {
            pfpElement.src = profilePic;
            pfpElement.style.visibility = "visible";
        }
        if (nameElement) {
            nameElement.textContent = userName;
            nameElement.style.visibility = "visible";
        }
        if (loginBtn) {
            loginBtn.style.display = "none";  // Hide login button after login
        }
    } else {
        console.log("No auth data found");
        if (loginBtn) {
            loginBtn.style.visibility = "visible";
        }
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initSpotifyAuth);
