module.exports = authorToCoAuthoredBy;

function authorToCoAuthoredBy(author) {
  const name = author.name || author.login;
  const email =
    author.email ||
    `${author.databaseId}+${author.login}@users.noreply.github.com`;
  return `Co-authored-by: ${name} <${email}>`;
}
