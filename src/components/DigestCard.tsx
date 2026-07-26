import type { DigestResult, WorthScore } from "../types/digest";
import { DigestProse } from "./DigestProse";

type DigestCardProps = {
  result: DigestResult;
};

const WORTH_LABELS: Record<WorthScore, string> = {
  high: "值得深入",
  medium: "有选择性学习",
  low: "可快速浏览",
};

export function DigestCard({ result }: DigestCardProps) {
  return (
    <article className="digest-card">
      <div className="digest-meta">
        <div className="digest-meta-left">
          <a
            href={result.repoUrl}
            className="digest-repo-link"
            target="_blank"
            rel="noreferrer"
          >
            {result.repoName}
            <span className="digest-external" aria-hidden="true">↗</span>
          </a>
          {result.language && <span className="digest-lang">{result.language}</span>}
        </div>
        <div className="digest-meta-right">
          <span className={`worth-badge worth-${result.worthScore}`}>{WORTH_LABELS[result.worthScore]}</span>
          <span className="digest-stars">★ {result.stars.toLocaleString()}</span>
        </div>
      </div>

      <section>
        <span className="section-label">Verdict</span>
        <h2>值不值得学</h2>
        <DigestProse text={result.worthReason} />
      </section>

      <section>
        <span className="section-label">Insight</span>
        <h2>为什么火 / 解决什么问题</h2>
        <DigestProse text={result.whyTrending} />
      </section>

      {result.keyHighlights.length > 0 && (
        <section>
          <span className="section-label">Highlights</span>
          <h2>核心亮点</h2>
          <ul className="digest-list">
            {result.keyHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <span className="section-label">Stack</span>
        <h2>技术栈与架构</h2>
        <DigestProse text={result.techStack} />
      </section>

      <section>
        <span className="section-label">Path</span>
        <h2>如何学习与借鉴</h2>
        <ol className="digest-steps">
          {result.howToLearn.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section>
        <span className="section-label">Fit</span>
        <h2>我可以用于什么场景</h2>
        <DigestProse text={result.useCases} />
      </section>

      <section className="digest-skip">
        <span className="section-label">Skip</span>
        <h2>什么情况可以跳过</h2>
        <DigestProse text={result.notFor} />
      </section>
    </article>
  );
}