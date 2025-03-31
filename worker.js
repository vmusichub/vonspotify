addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === "OPTIONS") {
    return handleCors();
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
  }

  try {
    const { code } = await request.json();
    if (!code) {
      return new Response("Code required", { status: 400, headers: corsHeaders() });
    }

    const CLIENT_ID = globalThis.CLIENT_ID;
    const CLIENT_SECRET = globalThis.CLIENT_SECRET;
    const REDIRECT_URI = globalThis.REDIRECT_URI;

    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
      return new Response("Missing environment variables", { status: 500, headers: corsHeaders() });
    }

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI
      })
    });

    if (!tokenResponse.ok) {
      return new Response(`Token exchange failed: ${await tokenResponse.text()}`, { status: 500, headers: corsHeaders() });
    }

    const { access_token } = await tokenResponse.json();
    if (!access_token) {
      return new Response("Failed to retrieve access token", { status: 500, headers: corsHeaders() });
    }

    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: { "Authorization": `Bearer ${access_token}` }
    });

    if (!profileResponse.ok) {
      return new Response(`Profile fetch failed: ${await profileResponse.text()}`, { status: 500, headers: corsHeaders() });
    }

    const { display_name, images } = await profileResponse.json();

    return new Response(JSON.stringify({
      profile_picture: images?.[0]?.url || "",
      user_name: display_name || "Spotify User"
    }), { headers: corsHeaders() });

  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500, headers: corsHeaders() });
  }
}

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function handleCors() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
