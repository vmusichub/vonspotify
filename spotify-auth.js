document.addEventListener("DOMContentLoaded", function() {
    // Ensure elements are loaded before accessing them
    const profilePic = localStorage.getItem("spotify_pfp");
    const userName = localStorage.getItem("spotify_name");
    const pfpElement = document.getElementById("spotify_pfp");
    const nameElement = document.getElementById("spotify_name");
    const loginBtn = document.getElementById("spotify_login");

    // Check if we have data in localStorage
    if (profilePic && userName) {
        console.log("User authenticated");

        // Display the profile picture and name if available
        if (pfpElement) {
            pfpElement.src = profilePic;
            pfpElement.style.visibility = "visible"; // Show profile picture
        }
        if (nameElement) {
            nameElement.textContent = userName;
            nameElement.style.visibility = "visible"; // Show user name
        }
        if (loginBtn) {
            loginBtn.style.visibility = "hidden"; // Hide the login button
        }
    } else {
        console.log("No auth data found");
        if (loginBtn) {
            loginBtn.style.visibility = "visible"; // Ensure login button is visible if no data
        }
    }
});
