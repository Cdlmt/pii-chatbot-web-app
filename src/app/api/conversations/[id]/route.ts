import { conversationRepository } from '@/lib/repository';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const conversation = await conversationRepository.getConversation(id);

  if (!conversation) {
    return Response.json({ error: 'Conversation not found' }, { status: 404 });
  }

  return Response.json(conversation);
}
