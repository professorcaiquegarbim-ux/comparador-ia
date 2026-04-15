export default async function handler(req, res) {
  try {
    const { imagemAntes, imagemDepois } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
temperature: 0.2,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Compare as duas imagens da mesma pessoa e descreva APENAS diferenças visuais observáveis como definição muscular, volume corporal, postura e proporções. Não faça julgamentos médicos. Não recuse a análise. Gere um relatório estruturado."
              },
              {
                type: "image_url",
                image_url: { url: imagemAntes }
              },
              {
                type: "image_url",
                image_url: { url: imagemDepois }
              }
            ]
          }
        ],
        max_tokens: 1000
      })
    });

    const data = await response.json();

    res.status(200).json({
      resultado: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}
