addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === "OPTIONS") {
    return handleCors();
  }

  if (request.method === "POST") {
    let payload;
    try {
      payload = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: corsHeaders() });
    }
    const { code, artist_id } = payload;

    // Artist followers: client credentials flow
    if (artist_id) {
      const CLIENT_ID = globalThis.CLIENT_ID;
      const CLIENT_SECRET = globalThis.CLIENT_SECRET;

      const tokenUrl = "https://accounts.spotify.com/api/token";
      const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

      const tokenResponse = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ grant_type: "client_credentials" })
      });

      if (!tokenResponse.ok) {
        return new Response(JSON.stringify({ error: "Failed to get client token" }), { status: 500, headers: corsHeaders() });
      }

      const { access_token } = await tokenResponse.json();

      // Get artist info
      const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${artist_id}`, {
        headers: { "Authorization": `Bearer ${access_token}` }
      });

      if (!artistResponse.ok) {
        return new Response(JSON.stringify({ error: "Artist fetch failed" }), { status: 500, headers: corsHeaders() });
      }

      const artist = await artistResponse.json();

      return new Response(JSON.stringify({
        followers: artist.followers ? artist.followers.total : 0
      }), { headers: corsHeaders() });
    }

    // Auth code flow for user profile
    if (!code) {
      return new Response(JSON.stringify({ error: "Code required" }), { status: 400, headers: corsHeaders() });
    }

    const CLIENT_ID = globalThis.CLIENT_ID;
    const CLIENT_SECRET = globalThis.CLIENT_SECRET;
    const REDIRECT_URI = globalThis.REDIRECT_URI;

    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
      return new Response(JSON.stringify({ error: "Missing environment variables" }), { status: 500, headers: corsHeaders() });
    }

    const tokenUrl = "https://accounts.spotify.com/api/token";
    const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      return new Response(JSON.stringify({ error: "Token exchange failed", details: errorText }), { status: 400, headers: corsHeaders() });
    }

    const { access_token } = await tokenResponse.json();

    if (!access_token) {
      return new Response(JSON.stringify({ error: "Failed to retrieve access token" }), { status: 500, headers: corsHeaders() });
    }

    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: { "Authorization": `Bearer ${access_token}` }
    });

    if (!profileResponse.ok) {
      return new Response(JSON.stringify({ error: "Profile fetch failed" }), { status: 500, headers: corsHeaders() });
    }

    const { display_name, images } = await profileResponse.json();

    return new Response(JSON.stringify({
      profile_picture: images && images.length > 0 ? images[0].url : "",
      user_name: display_name || "Spotify User"
    }), { headers: corsHeaders() });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders() });
}

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}

function handleCors() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
