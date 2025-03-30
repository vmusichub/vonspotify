addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { code } = await request.json()
    if (!code) return new Response('Code required', { status: 400 })

    const tokenUrl = 'https://accounts.spotify.com/api/token'
    const params = new URLSearchParams()
    params.append('grant_type', 'authorization_code')
    params.append('code', code)
    params.append('redirect_uri', 'https://vmusichub.github.io/vonspotify/redirect.html')
    params.append('client_id', '3644afee558843dd8aadaec4d0a6ebb1')
    params.append('client_secret', '8786f75ee7cd4e8cb5bb5e3e45c3c101')

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })

    if (!tokenResponse.ok) return new Response('Token exchange failed', { status: 500 })
    
    const { access_token } = await tokenResponse.json()
    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${access_token}` }
    })

    if (!profileResponse.ok) return new Response('Profile fetch failed', { status: 500 })
    
    const { display_name, images } = await profileResponse.json()
    return new Response(JSON.stringify({
      access_token,
      profile_picture: images[0]?.url,
      user_name: display_name
    }), { headers: { 'Content-Type': 'application/json' } })
    
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 })
  }
}
