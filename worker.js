const handleRequest = async (request) => {
  if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
  }

  try {
      const { code } = await request.json();

      if (!code) {
          return new Response('Code is required', { status: 400 });
      }

      const tokenUrl = 'https://accounts.spotify.com/api/token';
      const data = new URLSearchParams();
      data.append('grant_type', 'authorization_code');
      data.append('code', code);
      data.append('redirect_uri', REDIRECT_URI);
      data.append('client_id', CLIENT_ID);
      data.append('client_secret', CLIENT_SECRET);

      const tokenResponse = await fetch(tokenUrl, {
          method: 'POST',
          body: data,
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          }
      });

      if (!tokenResponse.ok) {
          return new Response('Failed to exchange authorization code for token', { status: 500 });
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      const userProfileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
              'Authorization': `Bearer ${accessToken}`
          }
      });

      if (!userProfileResponse.ok) {
          return new Response('Failed to fetch user profile', { status: 500 });
      }

      const userProfileData = await userProfileResponse.json();

      return new Response(JSON.stringify({
          access_token: accessToken,
          profile_picture: userProfileData.images[0]?.url,
          user_name: userProfileData.display_name
      }), {
          headers: { 'Content-Type': 'application/json' }
      });
  } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
  }
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
