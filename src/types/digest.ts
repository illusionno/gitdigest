export type WorthScore = "high" | "medium" | "low";

export type RepoDigest = {
  repoName: string;
  repoUrl: string;
  stars: number;
  language: string | null;
  worthScore: WorthScore;
  worthReason: string;
  whyTrending: string;
  keyHighlights: string[];
  techStack: string;
  howToLearn: string[];
  useCases: string;
  notFor: string;
};

export type DigestResult = RepoDigest;

export type CompareDigestResult = {
  left: RepoDigest;
  right: RepoDigest;
  comparisonConclusion: string;
};

export type GithubRepoResponse = {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  html_url: string;
};