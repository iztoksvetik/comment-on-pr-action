const core = require('@actions/core');
const github = require('@actions/github');

try {
    run().then(commentId => {
        core.info(`Comment ID: ${commentId}`);
        core.setOutput('comment-id', commentId);
    });
} catch (error) {
    core.setFailed(error.message);
}

async function run() {
    core.info(core.getInput('repo'));
    core.info(core.getInput('issue'));
    // const token = core.getInput('github-token');
    // const client = github.getOctokit(token);
    // const existingComment = await get_existing_comment(client);
    // const update = core.getInput('update-comment') === 'true';
    //
    // if (existingComment && update) {
    //     core.info("Updating comment: " + existingComment.id);
    //     const {data: comment} = await update_comment(client, existingComment.id);
    //     return comment.id;
    // }
    //
    // core.info("Creating a new comment");
    // const {data: comment} = await create_comment(client);
    // return comment.id;
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
