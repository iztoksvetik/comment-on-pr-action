const core = require('@actions/core');
const github = require('@actions/github');

try {
    run().then(_ => core.info("Successfully ran"));
} catch (error) {
    core.setFailed(error.message);
}

async function run() {
    const token = core.getInput('github-token');
    const client = github.getOctokit(token);
    const existingComment = await get_existing_comment(client);
    const update = core.getInput('update-comment') === 'true';
    if (existingComment && update) {
        core.info("Comment ID: " + existingComment.id);
        const response = await update_comment(client, existingComment.id);
        core.info(JSON.stringify(response, null, 2));
    } else {
        core.info("Creating a new comment");
        const response = await create_comment(client);
        core.info(JSON.stringify(response, null, 2));
    }
}

async function create_comment(client) {
    return await client.rest.issues.createComment({
        ...github.context.repo,
        issue_number: github.context.issue.number,
        body: core.getInput('content'),
    });
}

async function update_comment(client, commentId) {
    return await client.rest.issues.updateComment({
        ...github.context.repo,
        comment_id: commentId,
        body: core.getInput('content')
    });
}

async function get_existing_comment(client) {
    const {data: comments} = await client.rest.issues.listComments({
        ...github.context.repo,
        issue_number: github.context.issue.number
    });
    return comments.find(element => element.user.login === core.getInput('username'))
}
