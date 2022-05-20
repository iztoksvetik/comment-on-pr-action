const core = require('@actions/core');
const github = require('@actions/github');

try {
    const token = core.getInput('github-token');
    const client = github.getOctokit(token);

    const response = client.rest.issues.createComment({
        ...github.context.issue,
        body: '👋 Hello!',
    });

    console.log(response);
} catch (error) {
    core.setFailed(error.message);
}
