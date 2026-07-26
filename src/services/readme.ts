const README_MAX_CHARS = 10000;

export async function fetchReadme(owner: string, repo: string): Promise<string> {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
    headers: {
      Accept: "application/vnd.github.raw",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (response.status === 404) {
    return "";
  }

  if (!response.ok) {
    return "";
  }

  const text = await response.text();
  return text.slice(0, README_MAX_CHARS);
}