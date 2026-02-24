export async function askOpenAIJSON<T>(prompt: string): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a market research AI. Always respond with valid JSON only, no markdown, no explanation.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    })
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || 'OpenAI API error')
  return JSON.parse(data.choices[0].message.content) as T
}
