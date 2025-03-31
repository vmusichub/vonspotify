addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === "OPTIONS") {
    return handleCors(); // Handle CORS preflight requests
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
  }

  try {
    const { code } = await request.json();
    if (!code) {
      return new Response("Code required", { status: 400, headers: corsHeaders() });
    }

    // Get CLIENT_ID and CLIENT_SECRET from environment variables
    const CLIENT_ID = globalThis.CLIENT_ID;
    const CLIENT_SECRET = globalThis.CLIENT_SECRET;
    const REDIRECT_URI = globalThis.REDIRECT_URI;

    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
      return new Response("Missing environment variables", { status: 500, headers: corsHeaders() });
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
      return new Response(`Token exchange failed: ${await tokenResponse.text()}`, { status: 500, headers: corsHeaders() });
    }

    const { access_token } = await tokenResponse.json();

    if (!access_token) {
      return new Response("Failed to retrieve access token", { status: 500, headers: corsHeaders() });
    }

    // Fetch user profile data
    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: { "Authorization": `Bearer ${access_token}` }
    });

    if (!profileResponse.ok) {
      return new Response(`Profile fetch failed: ${await profileResponse.text()}`, { status: 500, headers: corsHeaders() });
    }

    const { display_name, images } = await profileResponse.json();

    const responseData = {
      access_token,
      profile_picture: images.length > 0 ? images[0].url : "",
      user_name: display_name || "Spotify User"
    };

    return new Response(JSON.stringify(responseData), {
      headers: corsHeaders()
    });

  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500, headers: corsHeaders() });
  }
}

// Function to handle CORS headers
function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://vmusichub.com",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}

// Handle CORS preflight requests (OPTIONS)
function handleCors() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}
