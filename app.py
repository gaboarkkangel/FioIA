from openai import OpenAI

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="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"
)

chat = client.chat.completions.create(
    model = "deepseek/deepseek-r1:free",
    messages = [
        {
            "role":"user",
            "content":"cuales son los 10 temas de creación de contenido de mayor tendencia"
        }
    ]
)

# print(chat)
print(chat.choices[0].message.content)