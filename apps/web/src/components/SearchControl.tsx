import { SearchIcon, XIcon } from "lucide-react";
import type { KeyboardEvent } from "react";

import { cn } from "~/lib/utils";

interface SearchControlProps {
  id?: string;
  value: string;
  placeholder: string;
  ariaLabel: string;
  clearAriaLabel: string;
  matchCount?: number | undefined;
  className?: string;
  onValueChange: (value: string) => void;
}

export function SearchControl({
  id,
  value,
  placeholder,
  ariaLabel,
  clearAriaLabel,
  matchCount,
  className,
  onValueChange,
}: SearchControlProps) {
  const hasValue = value.length > 0;

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && hasValue) {
      event.preventDefault();
      onValueChange("");
    }
  };

  return (
    <div className={cn("relative", className)}>
      <SearchIcon className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/45" />
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(
          "h-7 w-full rounded-md border border-border bg-secondary py-1 pl-7 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-ring",
          hasValue ? "pr-12" : "pr-2",
        )}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      {hasValue && (
        <span className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {matchCount !== undefined && (
            <span className="text-[10px] text-muted-foreground/55">{matchCount}</span>
          )}
          <button
            type="button"
            aria-label={clearAriaLabel}
            className="inline-flex size-4 cursor-pointer items-center justify-center rounded-sm text-muted-foreground/55 transition-colors hover:bg-accent hover:text-foreground"
            onClick={() => onValueChange("")}
          >
            <XIcon className="size-3" />
          </button>
        </span>
      )}
    </div>
  );
}
