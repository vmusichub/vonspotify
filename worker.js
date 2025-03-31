addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { code } = await request.json();
    if (!code) {
      return new Response("Code required", { status: 400 });
    }

    const tokenUrl = "https://accounts.spotify.com/api/token";
    const credentials = btoa("3644afee558843dd8aadaec4d0a6ebb1:8786f75ee7cd4e8cb5bb5e3e45c3c101"); // client_id:client_secret

    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://vmusichub.github.io/vonspotify/redirect.html"
      })
    });

    if (!tokenResponse.ok) {
      return new Response(`Token exchange failed: ${await tokenResponse.text()}`, { status: 500 });
    }

    const { access_token } = await tokenResponse.json();

    // Запрос профиля пользователя
    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: { "Authorization": `Bearer ${access_token}` }
    });

    if (!profileResponse.ok) {
      return new Response(`Profile fetch failed: ${await profileResponse.text()}`, { status: 500 });
    }

    const { display_name, images } = await profileResponse.json();

    return new Response(JSON.stringify({
      access_token,
      profile_picture: images.length > 0 ? images[0].url : "",
      user_name: display_name || "Spotify User"
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
