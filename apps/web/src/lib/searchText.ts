export interface SearchTextRange {
  start: number;
  end: number;
}

export function normalizeSearchQuery(query: string): string[] {
  return query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
}

function isSearchTokenCharacter(character: string | undefined): boolean {
  return character !== undefined && /[A-Za-z0-9_]/.test(character);
}

function isWholeTokenMatch(text: string, start: number, token: string): boolean {
  const before = start > 0 ? text[start - 1] : undefined;
  const after = text[start + token.length];
  return !isSearchTokenCharacter(before) && !isSearchTokenCharacter(after);
}

export function findSearchTokenRanges(
  text: string,
  queryTokens: readonly string[],
): SearchTextRange[] {
  if (text.length === 0 || queryTokens.length === 0) {
    return [];
  }

  const normalizedText = text.toLocaleLowerCase();
  return queryTokens.flatMap((token) => {
    if (token.length === 0) return [];
    const tokenRanges: SearchTextRange[] = [];
    let startIndex = 0;
    while (startIndex < normalizedText.length) {
      const index = normalizedText.indexOf(token, startIndex);
      if (index === -1) break;
      if (isWholeTokenMatch(normalizedText, index, token)) {
        tokenRanges.push({ start: index, end: index + token.length });
      }
      startIndex = index + token.length;
    }
    return tokenRanges;
  });
}

export function textIncludesSearchToken(text: string, token: string): boolean {
  return findSearchTokenRanges(text, [token]).length > 0;
}

export function textIncludesAllSearchTokens(text: string, queryTokens: readonly string[]): boolean {
  return queryTokens.every((token) => textIncludesSearchToken(text, token));
}

export function textIncludesAnySearchToken(text: string, queryTokens: readonly string[]): boolean {
  return queryTokens.some((token) => textIncludesSearchToken(text, token));
}

export function getEarliestSearchTokenIndex(
  text: string,
  queryTokens: readonly string[],
): number | null {
  const ranges = findSearchTokenRanges(text, queryTokens);
  if (ranges.length === 0) return null;
  return ranges.reduce(
    (earliestIndex, range) => Math.min(earliestIndex, range.start),
    ranges[0]!.start,
  );
}
