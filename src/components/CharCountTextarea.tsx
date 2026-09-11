"use client";

import { useState, type TextareaHTMLAttributes } from "react";

export function CharCountTextarea({
  maxLength,
  defaultValue,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { maxLength: number }) {
  const [value, setValue] = useState(typeof defaultValue === "string" ? defaultValue : "");

  return (
    <>
      <textarea
        {...props}
        maxLength={maxLength}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={className}
      />
      <p className="mt-1 text-right text-xs text-stone-400">
        {value.length}/{maxLength} characters ({maxLength - value.length} left)
      </p>
    </>
  );
}
