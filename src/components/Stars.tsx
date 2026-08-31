export function Stars({ rating, size = "text-base" }: { rating: number; size?: string }) {
  const rounded = Math.round(rating);
  return (
    <span className={`${size} tracking-tight text-amber-500`} aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rounded)}
      <span className="text-neutral-300">{"★".repeat(5 - rounded)}</span>
    </span>
  );
}
