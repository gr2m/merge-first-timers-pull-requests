module.exports = getIssueData;

async function getIssueData(octokit, issueUrl) {
  const { issue } = await octokit.graphql(
    `query ($issueUrl: URI!) {
    issue:resource(url: $issueUrl) {
      ... on Issue {
        number
        
        # find assignees
        assignees(first:10) {
          nodes {
            login
          }
        }
        # find linked pull requests with their authors
        timelineItems(first: 100, itemTypes: [CONNECTED_EVENT, CROSS_REFERENCED_EVENT]) {
          nodes {
            ... on CrossReferencedEvent {
              pullRequest: source {
                ...pullRequestFields
              }
            }
            ... on ConnectedEvent {
              pullRequest: subject {
                ...pullRequestFields
              }
            }
          }
        }
      }
    }
  }
  
  fragment pullRequestFields on PullRequest {
    url
    number
    state

    author {
      ... on User {
        databaseId
        name
        login
        email
      }
    }
    reviewDecision
  }
  `,
    {
      issueUrl,
    }
  );

  const assignees = issue.assignees.nodes.map(({ login }) => login);
  const pullRequests = issue.timelineItems.nodes
    .map(({ pullRequest }) => pullRequest)
    // filter out timeline events that are not pull requests
    .filter((pullRequest) => Object.keys(pullRequest).length)
    // remove duplicate entries
    .reduce((result, pr) => {
      if (result.find(({ url }) => url === pr.url)) {
        return result;
      }

      return result.concat(pr);
    }, [])
    // filter out closed pull requests
    .filter((pr) => pr.state === "OPEN");

  return {
    number: issue.number,
    assignees,
    pullRequests,
  };
}
