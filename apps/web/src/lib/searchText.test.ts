import { describe, expect, it } from "vitest";

import { normalizeSearchPhraseQuery, textIncludesAllSearchTerms } from "./searchText";

describe("search query normalization", () => {
  it("keeps search queries as a single phrase", () => {
    expect(normalizeSearchPhraseQuery("  Fix   API Bug  ")).toEqual(["fix   api bug"]);
  });

  it("drops empty phrase queries", () => {
    expect(normalizeSearchPhraseQuery("   ")).toEqual([]);
  });

  it("matches the full phrase instead of separate words", () => {
    expect(textIncludesAllSearchTerms("Please add fast thread search", ["fast thread"])).toBe(true);
    expect(
      textIncludesAllSearchTerms("Please add fast search to the thread", ["fast thread"]),
    ).toBe(false);
  });
});
