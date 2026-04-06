export async function POST(request) {
  try {
    const blob = await request.blob()

    const formData = new FormData()
    formData.append('image_file', blob, 'photo.jpg')
    formData.append('size', 'auto')

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': process.env.REMOVE_BG_API_KEY },
      body: formData,
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('remove.bg error:', response.status, err)
      return new Response(JSON.stringify({ error: 'Background removal failed' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const imageBuffer = await response.arrayBuffer()
    return new Response(imageBuffer, {
      status: 200,
      headers: { 'Content-Type': 'image/png' },
    })
  } catch (err) {
    console.error('remove-bg route error:', err)
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
