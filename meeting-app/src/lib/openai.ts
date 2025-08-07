import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export class OpenAIService {
  static async generateMeetingSummary(
    title: string,
    description?: string,
    attendees: string[] = []
  ): Promise<string> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        // Mock summary if API key not available
        return this.generateMockSummary(title, description, attendees)
      }

      const prompt = `Generate a concise and professional summary for the following meeting:

Title: ${title}
${description ? `Description: ${description}` : ''}
${attendees.length > 0 ? `Attendees: ${attendees.join(', ')}` : ''}

Please provide:
1. A brief overview of the meeting topic
2. Key discussion points (if available from description)
3. Potential objectives or outcomes

Keep the summary concise and professional, around 2-3 sentences.`

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional meeting assistant that creates concise, helpful meeting summaries.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      })

      return response.choices[0]?.message?.content || this.generateMockSummary(title, description, attendees)
    } catch (error) {
      console.error('Error generating AI summary:', error)
      return this.generateMockSummary(title, description, attendees)
    }
  }

  private static generateMockSummary(
    title: string,
    description?: string,
    attendees: string[] = []
  ): string {
    const attendeeCount = attendees.length
    let summary = `Meeting "${title}" `
    
    if (attendeeCount > 0) {
      summary += `with ${attendeeCount} participant${attendeeCount > 1 ? 's' : ''}. `
    }
    
    if (description) {
      const shortDesc = description.length > 100 ? description.substring(0, 100) + '...' : description
      summary += `Discussion focused on: ${shortDesc}`
    } else {
      summary += 'Discussion topics and objectives to be determined based on meeting agenda.'
    }
    
    return summary
  }
}
