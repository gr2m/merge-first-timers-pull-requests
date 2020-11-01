module.exports = getFirstTimersIssues;

async function getFirstTimersIssues(octokit) {
  const {
    search: { nodes },
  } = await octokit.graphql(
    `query ($q: String!) {
    search(query: $q, type: ISSUE, first: 100) {
      nodes {
        ... on Issue {
          url
          repository {
            nameWithOwner
          }
        }
      }
    }
  }`,
    {
      q: "is:open is:issue org:octokit label:hacktoberfest",
    }
  );

  return nodes.map((node) => {
    const [owner, repo] = node.repository.nameWithOwner.split("/");
    return {
      url: node.url,
      owner,
      repo,
    };
  });
}
