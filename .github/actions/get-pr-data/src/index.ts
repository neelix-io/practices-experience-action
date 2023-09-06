import * as core from '@actions/core';
import * as github from '@actions/github';


const token = core.getInput('github-token', { required: true });
const octokit = github.getOctokit(token);
const repo = github.context.repo;
const pullNumber = +core.getInput('pull-number', { required: true });


const run = async () => {
  try {
    const data = await octokit.rest.pulls.get({
      ...repo,
      pull_number: pullNumber,
    });

    core.info(`data:\n${JSON.stringify(data, null, 2)}`);

    core.setOutput('data', data);
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
