export interface SearchTextRange {
  start: number;
  end: number;
}

export function normalizeSearchPhraseQuery(query: string): string[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return normalizedQuery.length > 0 ? [normalizedQuery] : [];
}

function isSearchTermCharacter(character: string | undefined): boolean {
  return character !== undefined && /[A-Za-z0-9_]/.test(character);
}

function isWholeTermMatch(text: string, start: number, term: string): boolean {
  const before = start > 0 ? text[start - 1] : undefined;
  const after = text[start + term.length];
  return !isSearchTermCharacter(before) && !isSearchTermCharacter(after);
}

export function findSearchTermRanges(
  text: string,
  queryTerms: readonly string[],
): SearchTextRange[] {
  if (text.length === 0 || queryTerms.length === 0) {
    return [];
  }

  const normalizedText = text.toLocaleLowerCase();
  return queryTerms.flatMap((term) => {
    if (term.length === 0) return [];
    const termRanges: SearchTextRange[] = [];
    let startIndex = 0;
    while (startIndex < normalizedText.length) {
      const index = normalizedText.indexOf(term, startIndex);
      if (index === -1) break;
      if (isWholeTermMatch(normalizedText, index, term)) {
        termRanges.push({ start: index, end: index + term.length });
      }
      startIndex = index + term.length;
    }
    return termRanges;
  });
}

export function textIncludesSearchTerm(text: string, term: string): boolean {
  return findSearchTermRanges(text, [term]).length > 0;
}

export function textIncludesAllSearchTerms(text: string, queryTerms: readonly string[]): boolean {
  return queryTerms.every((term) => textIncludesSearchTerm(text, term));
}

export function getEarliestSearchTermIndex(
  text: string,
  queryTerms: readonly string[],
): number | null {
  const ranges = findSearchTermRanges(text, queryTerms);
  if (ranges.length === 0) return null;
  return ranges.reduce(
    (earliestIndex, range) => Math.min(earliestIndex, range.start),
    ranges[0]!.start,
  );
}
