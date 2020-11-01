const { Octokit } = require("@octokit/core");

const getStatus = require("./lib/get-status");
const getFirstTimersIssues = require("./lib/get-open-first-timers-issues");
const createMergeCommit = require("./lib/create-merge-commit");
const createComments = require("./lib/create-comments");

const COMMIT_SUBJECT = `fix(README): replace "cdn.pika.dev" with "cdn.skypack.dev"`;

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

getFirstTimersIssues(octokit).then(async (issues) => {
  for (const { url: issueUrl, owner, repo } of issues) {
    console.log("");
    console.log("========================================");
    console.log("ISSUE:");
    console.log(issueUrl);
    console.log("");

    const {
      number,
      assigneesWithoutPrs,
      incompletePullRequests,
      approvedPullRequests,
    } = await getStatus({
      octokit,
      issueUrl,
    }).catch(console.log);

    console.log(
      "PRs missing from: %s",
      assigneesWithoutPrs.length
        ? assigneesWithoutPrs.join(", ")
        : "<no PRs missing>"
    );

    console.log(
      "incomplete pull requests: %s",
      incompletePullRequests.length ? "" : "<no incomplete PRs>"
    );
    for (const pr of incompletePullRequests) {
      console.log("- %s: %s", pr.url, pr.reviewDecision);
    }

    await createMergeCommit({
      octokit,
      owner,
      repo,
      subject: COMMIT_SUBJECT,
      number,
      approvedPullRequests,
    });

    await createComments({
      octokit,
      owner,
      repo,
      issueUrl,
      incompletePullRequests,
      approvedPullRequests,
    });
  }
});
