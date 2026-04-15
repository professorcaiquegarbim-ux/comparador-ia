export default async function handler(req, res) {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { imagemAntes, imagemDepois } = body || {};

    if (!imagemAntes || !imagemDepois) {
      return res.status(400).json({ erro: "Imagens não recebidas" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: "Compare as imagens e gere um relatório detalhado de evolução corporal com estimativa de percentual de gordura." },
              { type: "input_image", image_url: imagemAntes },
              { type: "input_image", image_url: imagemDepois }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    const texto =
      data?.output?.[0]?.content?.[0]?.text ||
      "Não foi possível gerar análise.";

    res.status(200).json({ resultado: texto });

  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}
