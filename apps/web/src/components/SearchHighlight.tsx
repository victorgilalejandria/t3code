import { findSearchTermRanges } from "../lib/searchText";

export function getHighlightedSearchSegments(
  text: string,
  queryTerms: readonly string[],
): { key: string; text: string; highlighted: boolean }[] {
  if (text.length === 0 || queryTerms.length === 0) {
    return [{ key: "plain-0", text, highlighted: false }];
  }

  const ranges = findSearchTermRanges(text, queryTerms);

  if (ranges.length === 0) {
    return [{ key: "plain-0", text, highlighted: false }];
  }

  const mergedRanges = ranges
    .toSorted((left, right) => left.start - right.start || left.end - right.end)
    .reduce<{ start: number; end: number }[]>((merged, range) => {
      const previous = merged.at(-1);
      if (!previous || range.start > previous.end) {
        merged.push({ ...range });
        return merged;
      }
      previous.end = Math.max(previous.end, range.end);
      return merged;
    }, []);

  const segments: { key: string; text: string; highlighted: boolean }[] = [];
  let cursor = 0;
  for (const range of mergedRanges) {
    if (range.start > cursor) {
      segments.push({
        key: `plain-${cursor}-${range.start}`,
        text: text.slice(cursor, range.start),
        highlighted: false,
      });
    }
    segments.push({
      key: `highlight-${range.start}-${range.end}`,
      text: text.slice(range.start, range.end),
      highlighted: true,
    });
    cursor = range.end;
  }
  if (cursor < text.length) {
    segments.push({
      key: `plain-${cursor}-${text.length}`,
      text: text.slice(cursor),
      highlighted: false,
    });
  }
  return segments;
}

export function HighlightedSearchText({
  text,
  queryTerms,
}: {
  text: string;
  queryTerms: readonly string[];
}) {
  return (
    <>
      {getHighlightedSearchSegments(text, queryTerms).map((segment) =>
        segment.highlighted ? (
          <mark
            key={segment.key}
            className="rounded bg-yellow-400/35 px-0.5 text-foreground dark:bg-yellow-300/25"
          >
            {segment.text}
          </mark>
        ) : (
          <span key={segment.key}>{segment.text}</span>
        ),
      )}
    </>
  );
}
