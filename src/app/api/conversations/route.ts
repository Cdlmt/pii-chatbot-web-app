import { conversationRepository } from '@/repositories/conversation';

export async function GET() {
  const summaries = await conversationRepository.getConversationSummaries();
  return Response.json(summaries);
}
