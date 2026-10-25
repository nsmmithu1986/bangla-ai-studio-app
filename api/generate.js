
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST method required" });
  }

  const apiKey = process.env.MAGIC_HOUR_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Magic Hour API key is not configured"
    });
  }

  try {
    const { prompt, duration = 3, aspectRatio = "9:16" } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Please enter a video prompt" });
    }

    const response = await fetch("https://api.magichour.ai/v1/text-to-video", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Bangla AI Studio Video",
        end_seconds: Number(duration),
        aspect_ratio: aspectRatio,
        style: { prompt },
        model: "ltx-2.5",
        resolution: "480p",
        audio: true
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Video request failed",
        details: result
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Server error while requesting video" });
  }
}
