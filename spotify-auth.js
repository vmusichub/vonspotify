document.addEventListener("DOMContentLoaded", function() {
    const profilePic = localStorage.getItem("spotify_pfp");
    const userName = localStorage.getItem("spotify_name");
    const pfpElement = document.getElementById("spotify_pfp");
    const nameElement = document.getElementById("spotify_name");
    const loginBtn = document.getElementById("spotify_login");

    if (profilePic && userName) {
        if (pfpElement) {
            pfpElement.src = profilePic;
            pfpElement.style.display = "block";
        }
        if (nameElement) {
            nameElement.textContent = userName;
            nameElement.style.display = "block";
        }
        if (loginBtn) {
            loginBtn.style.display = "none";
        }
    } else {
        if (pfpElement) pfpElement.style.display = "none";
        if (nameElement) nameElement.style.display = "none";
        if (loginBtn) loginBtn.style.display = "block";
    }
});
