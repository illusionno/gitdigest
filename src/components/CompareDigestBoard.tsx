import type { CompareDigestResult } from "../types/digest";
import { DigestCard } from "./DigestCard";
import { DigestProse } from "./DigestProse";

type CompareDigestBoardProps = {
  result: CompareDigestResult;
};

export function CompareDigestBoard({ result }: CompareDigestBoardProps) {
  return (
    <div className="compare-view">
      <div className="compare-grid">
        <DigestCard result={result.left} />
        <DigestCard result={result.right} />
      </div>

      <article className="comparison-conclusion">
        <span className="section-label">Decision</span>
        <h2>对比结论</h2>
        <DigestProse text={result.comparisonConclusion} />
      </article>
    </div>
  );
}