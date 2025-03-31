document.addEventListener("DOMContentLoaded", function() {
    const profilePic = localStorage.getItem("spotify_pfp");
    const userName = localStorage.getItem("spotify_name");
    const pfpElement = document.getElementById("spotify_pfp");
    const nameElement = document.getElementById("spotify_name");
    const loginBtn = document.getElementById("spotify_login");

    if (profilePic && userName) {
        pfpElement.src = profilePic;
        pfpElement.style.display = "block";
        nameElement.textContent = userName;
        nameElement.style.display = "block";
        loginBtn.style.display = "none";
    } else {
        pfpElement.style.display = "none";
        nameElement.style.display = "none";
        loginBtn.style.display = "block";
    }
});
