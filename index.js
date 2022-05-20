const core = require('@actions/core');
const github = require('@actions/github');

try {
    // const token = core.getInput('github-token');
    // const client = github.getOctokit(token);
    // const response = client.rest.issues.createComment({
    //     ...github.context.repo,
    //     issue_number: github.context.issue.number,
    //     body: '👋 Hello!',
    // });

    run().then(_ => core.info("Successfully ran"));

} catch (error) {
    core.setFailed(error.message);
}

async function run() {
    const token = core.getInput('github-token');
    const client = github.getOctokit(token);
    const existingComment = await get_existing_comment(client);
    if (existingComment) {
        core.info("Comment ID: " + existingComment.id);
    } else {
        core.info("No comment found");
    }

}

async function get_existing_comment(client) {
    const {data: comments} = await client.rest.issues.listComments({
        ...github.context.repo,
        issue_number: github.context.issue.number
    });
    return comments.find(element => element.user.login === "github-actions[bot]")
}
