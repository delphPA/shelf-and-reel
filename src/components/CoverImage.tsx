"use client";

import { useState } from "react";

export function CoverImage({
  src,
  fallback,
  className,
}: {
  src: string | null;
  fallback: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <>{fallback}</>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={className} onError={() => setFailed(true)} />
  );
}
