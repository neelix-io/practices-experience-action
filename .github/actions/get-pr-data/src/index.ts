import * as core from '@actions/core';
import * as github from '@actions/github';


const token = core.getInput('github-token', { required: true });
const octokit = github.getOctokit(token);
const repo = github.context.repo;
const pullNumber = +core.getInput('pull-number', { required: true });


const run = async () => {
  try {
    const [pulls, commits] = await Promise.all([
      octokit.rest.pulls.get({
        ...repo,
        pull_number: pullNumber,
      }),
      octokit.rest.pulls.listCommits({
        ...repo,
        pull_number: pullNumber,
      }),
    ]);

    const mergedTs = pulls.data.merged_at;
    if (mergedTs) {
      // days-to-merge
      const created = new Date(pulls.data.created_at).valueOf();
      const merged = new Date(mergedTs).valueOf();
      const durationInDays = Math.ceil((merged - created) / (1000 * 60 * 60 * 24));
      core.setOutput('days-to-merge', durationInDays);

      // code-changed
      const additions = pulls.data.additions;
      const deletions = pulls.data.deletions;
      core.setOutput('code-changed', additions + deletions);

      // additional-commits
      const additionalCommits = commits.data
        .filter(c => {
          const date = c.commit.author?.date || c.commit.committer?.date;
          if (!date) {
            return false;
          }
          return new Date(date).valueOf() > created;
        })
        .length;
      core.setOutput('additional-commits', additionalCommits);
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
