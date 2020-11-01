module.exports = getStatus;

const getIssueData = require("./get-issue-data");

async function getStatus({ octokit, issueUrl }) {
  const { number, assignees, pullRequests } = await getIssueData(
    octokit,
    issueUrl
  );

  const pullRequestAuthors = pullRequests.map(({ author }) => author.login);
  const assigneesWithoutPrs = assignees.filter(
    (login) => !pullRequestAuthors.includes(login)
  );

  const incompletePullRequests = pullRequests.filter(
    ({ reviewDecision }) => reviewDecision !== "APPROVED"
  );

  const approvedPullRequests = pullRequests.filter(
    ({ reviewDecision }) => reviewDecision === "APPROVED"
  );

  return {
    issueUrl,
    number,
    assignees,
    pullRequests,
    pullRequestAuthors,
    assigneesWithoutPrs,
    approvedPullRequests,
    incompletePullRequests,
  };
}
