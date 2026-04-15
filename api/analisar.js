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
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analise as duas imagens da MESMA pessoa em momentos diferentes. Gere um relatório comparativo direto e objetivo contendo: 1) estimativa visual do percentual de gordura antes e depois (deixe claro que é estimativa visual), 2) evolução muscular, 3) mudanças na postura, 4) pontos positivos, 5) pontos a melhorar. Não recuse a análise. Não forneça avisos sobre incapacidade. Produza o relatório normalmente."
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
