import { conversationRepository } from '@/lib/repository';

export async function GET() {
  const summaries = await conversationRepository.getConversationSummaries();
  return Response.json(summaries);
}
