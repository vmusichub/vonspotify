document.addEventListener("DOMContentLoaded", function() {
    // Read from localStorage
    const profilePic = localStorage.getItem("spotify_pfp");
    const userName = localStorage.getItem("spotify_name");
    const pfpElement = document.getElementById("spotify_pfp");
    const nameElement = document.getElementById("spotify_name");
    const loginBtn = document.getElementById("spotify_login");
    const followersElement = document.getElementById("v_followers");
    const artistId = "3JsHnjpbhX4SnySpvpa9DK";

    // Helper: Show/hide, detect type
    function show(el) {
        if (!el) return;
        if (el.tagName === "IMG") {
            el.style.display = "inline-block";
        } else {
            el.style.display = "block";
        }
    }
    function hide(el) {
        if (el) el.style.display = "none";
    }

    // 1. Profile info: show/hide, fill
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

    // 2. Followers count: always public
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

    // 3. OPTIONAL: Logout button logic, for dev/debug
    // If you add <button id="spotify_logout">Log out</button> to Carrd, enable this:
    /*
    const logoutBtn = document.getElementById("spotify_logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem("spotify_pfp");
            localStorage.removeItem("spotify_name");
            location.reload();
        });
    }
    */
});
