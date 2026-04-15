export default async function handler(req, res) {
  try {
    const { imagemAntes, imagemDepois } = req.body;

    if (!imagemAntes || !imagemDepois) {
      return res.status(400).json({ erro: "Imagens não enviadas" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em análise de evolução corporal para musculação."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Compare as duas imagens e gere um relatório detalhado de evolução corporal, incluindo estimativa de percentual de gordura." },
              { type: "image_url", image_url: { url: imagemAntes } },
              { type: "image_url", image_url: { url: imagemDepois } }
            ]
          }
        ],
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ erro: "Resposta vazia da IA", raw: data });
    }

    const texto = data.choices[0].message.content;

    res.status(200).json({ resultado: texto });

  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}
