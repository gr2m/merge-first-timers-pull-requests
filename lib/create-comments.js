module.exports = createComments;

async function createComments({
  octokit,
  issueUrl,
  owner,
  repo,
  incompletePullRequests,
  approvedPullRequests,
}) {
  for (const pr of incompletePullRequests) {
    const comment = `Sorry @${pr.author.login}, we had to go ahead and merge the open pull requests for #123. You didn’t get back to our change requests, so we had to close yours 😞 Good news is: we have some other issues marked as first-timers-only, you can find them [here](${issueUrl}).`;

    console.log("closing PR #%d", pr.number);
    await octokit.request("PATCH /repos/{owner}/{repo}/pulls/{pull_number}", {
      owner,
      repo,
      pull_number: pr.number,
      state: "closed",
    });

    console.log("posting the comment");
    const { data } = await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner,
        repo,
        issue_number: pr.number,
        body: comment,
      }
    );
    console.log(data.html_url);
  }

  for (const pr of approvedPullRequests) {
    const comment = `Congratulations 🥳 We hope you enjoyed the process of sending the pull requests, and maybe learned a thing or two? If anything was unclear, or if you have any suggestions on how we can improve the suggestions in the issue #123, please let us know! It will help future first time contributors!

If you are looking to make another pull requests, look out for issues with the help wanted label. They are not as straight forward as the first-timers-only issues, but hey, you no longer are a first-timers 🙂 You can find help wanted issues [here](https://github.com/issues?q=is%3Aopen+is%3Aissue+org%3Aoctokit+label%3A%22help+wanted%22).
    
You can help us by starring this repository, as well as our primary repository at <https://github.com/octokit/rest.js/> ⭐️ Stars help others to discover our project.
    
If you are interested in Octokit and future opportunities to contribute, you can subscribe to our announcement discussion at <https://github.com/octokit/rest.js/discussions/620>. We will post an update soon and will point out issues you can contribute to.`;

    console.log("Adding comment to #%d", pr.number);
    const { data } = await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner,
        repo,
        issue_number: pr.number,
        body: comment,
      }
    );
    console.log(data.html_url);
  }
}
