export default async function handler(req, res) {
  try {
    const { imagemAntes, imagemDepois } = req.body;

    if (!imagemAntes || !imagemDepois) {
      return res.status(400).json({ erro: "Imagens não enviadas" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [{
          role: "user",
          content: [
            { type: "input_text", text: "Compare as duas imagens e gere um relatório detalhado de evolução corporal com estimativa de percentual de gordura." },
            { type: "input_image", image_url: imagemAntes },
            { type: "input_image", image_url: imagemDepois }
          ]
        }]
      })
    });

    const data = await response.json();

    console.log("Resposta OpenAI:", JSON.stringify(data));

    let texto = "Não foi possível gerar análise.";

    if (data.output && data.output.length > 0) {
      if (data.output[0].content && data.output[0].content.length > 0) {
        texto = data.output[0].content[0].text;
      }
    }

    res.status(200).json({ resultado: texto });

  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}
