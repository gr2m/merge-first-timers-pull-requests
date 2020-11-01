module.exports = createMergeCommit;

const getCommitMessage = require("./get-commit-message");

// TODO:
//
// When creating a first-timers-only issue, add the commit sha as meta hidden
// meta data (see https://github.com/probot/metadata). That way we can create
// a new pull request by simply cherry-picking that commit
//
// One thing to figure out is: how to rephrase the commit message?

async function createMergeCommit({
  octokit,
  subject,
  owner,
  repo,
  number,
  approvedPullRequests,
}) {
  const commitMessage = getCommitMessage({
    subject,
    number,
    approvedPullRequests,
  });

  console.log("updating README");

  // get README content
  const {
    data: { content, sha },
  } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner,
    repo,
    path: "README.md",
  });

  const newContent = Buffer.from(content, "base64")
    .toString()
    .replace(/pika/g, "skypack");

  // update README content
  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner,
    repo,
    path: "README.md",
    message: commitMessage,
    content: Buffer.from(newContent, "utf-8").toString("base64"),
    sha,
  });
}
