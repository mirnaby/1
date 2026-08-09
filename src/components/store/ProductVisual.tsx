export function ProductVisual({
  emoji,
  gradientFrom,
  gradientTo,
  imageUrl,
  className = "",
  emojiClassName = "text-5xl",
}: {
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  imageUrl?: string | null;
  className?: string;
  emojiClassName?: string;
}) {
  if (imageUrl) {
    return (
      <div className={`overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      <div
        className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/25 blur-xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/15 blur-2xl"
        aria-hidden
      />
      <span className={`${emojiClassName} drop-shadow-sm`} aria-hidden>
        {emoji}
      </span>
    </div>
  );
}
