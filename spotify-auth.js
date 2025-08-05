document.addEventListener("DOMContentLoaded", function() {
    const profilePic = localStorage.getItem("spotify_pfp");
    const userName = localStorage.getItem("spotify_name");
    const pfpElement = document.getElementById("spotify_pfp");
    const nameElement = document.getElementById("spotify_name");
    const loginBtn = document.getElementById("spotify_login");
    const followersElement = document.getElementById("v_followers");
    const artistId = "3JsHnjpbhX4SnySpvpa9DK";

    // Show/hide helpers
    function show(el) { if (el) el.style.display = ""; }
    function hide(el) { if (el) el.style.display = "none"; }

    // 1. Handle profile info
    if (profilePic && userName) {
        if (pfpElement) {
            pfpElement.src = profilePic;
            show(pfpElement);
        }
        if (nameElement) {
            nameElement.textContent = userName;
            show(nameElement);
        }
        if (loginBtn) {
            hide(loginBtn);
        }
    } else {
        if (pfpElement) hide(pfpElement);
        if (nameElement) hide(nameElement);
        if (loginBtn) show(loginBtn);
    }

    // 2. Fetch followers count
    if (followersElement) {
        fetch("https://spotify-auth.vonmusichub.workers.dev/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ artist_id: artistId })
        })
        .then(res => res.json())
        .then(data => {
            if (typeof data.followers === "number") {
                followersElement.textContent = data.followers.toLocaleString();
                show(followersElement);
            } else {
                followersElement.textContent = "-";
                show(followersElement);
            }
        })
        .catch(() => {
            followersElement.textContent = "-";
            show(followersElement);
        });
    }

    // 3. Optionally: log out logic
    // Add a logout button with id "spotify_logout" if you want to use this
    // document.getElementById("spotify_logout")?.addEventListener("click", function() {
    //     localStorage.removeItem("spotify_pfp");
    //     localStorage.removeItem("spotify_name");
    //     location.reload();
    // });
});
