export async function POST(request) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image_file')
    
    const outForm = new FormData()
    // Ensure correct content-type by creating a new Blob with explicit type
    const blob = new Blob([await imageFile.arrayBuffer()], { type: 'image/png' })
    outForm.append('image_file', blob, 'photo.png')
    outForm.append('size', 'auto')

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': process.env.REMOVE_BG_API_KEY },
      body: outForm,
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