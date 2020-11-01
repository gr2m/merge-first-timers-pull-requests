module.exports = getCommitMessage;

const authorToCoAuthoredBy = require("./author-to-co-authored-by");

function getCommitMessage({ subject, number, approvedPullRequests }) {
  return `${subject}
    
closes #${number}
  
${approvedPullRequests.map((pr) => `closes #${pr.number}`).join("\n")}
  
  
${approvedPullRequests.map((pr) => authorToCoAuthoredBy(pr.author)).join("\n")}
`;
}
