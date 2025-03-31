document.addEventListener("DOMContentLoaded", function() {
    const spotifyUserData = localStorage.getItem("spotify_user");
    
    if (spotifyUserData) {
        const user = JSON.parse(spotifyUserData);

        // Get elements
        const nameElement = document.getElementById("spotify_name");
        const imgElement = document.getElementById("spotify_pfp");

        if (user.display_name) {
            nameElement.textContent = user.display_name;
            nameElement.style.visibility = "visible"; // Make it visible
        }

        if (user.images && user.images.length > 0) {
            imgElement.src = user.images[0].url;
            imgElement.style.visibility = "visible"; // Make it visible
        }
    }
});
