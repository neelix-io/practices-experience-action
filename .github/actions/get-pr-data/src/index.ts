import * as core from '@actions/core';
import * as github from '@actions/github';


const token = core.getInput('github-token', { required: true });
const octokit = github.getOctokit(token);
const repo = github.context.repo;
const pullNumber = +core.getInput('pull-number', { required: true });


const run = async () => {
  try {
    const res = await octokit.rest.pulls.get({
      ...repo,
      pull_number: pullNumber,
    });

    core.info(`data:\n${JSON.stringify(res, null, 2)}`);

    const mergedTs = res.data.merged_at;
    if (mergedTs) {
      const created = new Date(res.data.created_at).valueOf();
      const merged = new Date(mergedTs).valueOf();
      const durationInDays = Math.ceil((merged - created) / (1000 * 60 * 60 * 24));
      core.setOutput('duration-in-days', durationInDays);
    }
  } catch (err) {
    let error: string | Error = 'Unknown error';
    if (typeof err === 'string') {
      error = err;
    } else if (err instanceof Error) {
      error = err;
    } else if (err && typeof err === 'object' && 'message' in err) {
      error = JSON.stringify(err.message);
    }
    core.setFailed(error);
  }
}

run();
