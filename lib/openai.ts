export async function askOpenAIJSON<T>(prompt: string): Promise<T> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 3000,
      system: 'You are a market research AI. Always respond with valid JSON only, no markdown, no explanation, no code fences.',
      messages: [
        { role: 'user', content: prompt }
      ],
    })
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || 'Anthropic API error')
  
  const text = data.content[0].text
  // Strip any accidental markdown fences
  const clean = text.replace(/^```json\s*/,'').replace(/^```\s*/,'').replace(/\s*```$/,'').trim()
  return JSON.parse(clean) as T
}
