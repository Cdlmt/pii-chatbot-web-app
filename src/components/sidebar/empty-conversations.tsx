import { MessageIcon } from "@/components/ui/icons";

export function EmptyConversations() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-(--background-tertiary) flex items-center justify-center mb-4">
        <MessageIcon className="w-5 h-5 text-(--foreground-subtle)" />
      </div>
      <p className="text-sm text-(--foreground-muted) mb-1">No conversations yet</p>
      <p className="text-xs text-(--foreground-subtle)">Start a new chat to begin</p>
    </div>
  );
}
