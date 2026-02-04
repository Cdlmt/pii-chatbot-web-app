export function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-1">
      <span className="w-1.5 h-1.5 rounded-full bg-(--foreground-muted) animate-pulse" style={{ animationDelay: "0ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-(--foreground-muted) animate-pulse" style={{ animationDelay: "150ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-(--foreground-muted) animate-pulse" style={{ animationDelay: "300ms" }} />
    </div>
  );
}
