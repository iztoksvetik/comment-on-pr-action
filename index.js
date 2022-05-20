const core = require('@actions/core');
const github = require('@actions/github');

try {
    const token = core.getInput('github-token');
    const client = github.getOctokit(token);
    // const response = client.rest.issues.createComment({
    //     ...github.context.repo,
    //     issue_number: github.context.issue.number,
    //     body: '👋 Hello!',
    // });

    const response = client.rest.issues.listComments({
        ...github.context.repo,
        issue_number: github.context.issue.number
    }).then(response => core.info(JSON.stringify(response)));

    core.info(github.context.actor);

    // client.rest.users.getAuthenticated().then(response => console.log(response));

} catch (error) {
    core.setFailed(error.message);
}
