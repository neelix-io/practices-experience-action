import * as core from '@actions/core';
import compareRange from './util/compare-range';


const run = async () => {
  try {
    const daysToMerge = +core.getInput('days-to-merge');
    const daysToMergeLimit = core.getInput('days-to-merge-limit');

    const durationOK = compareRange(daysToMerge, daysToMergeLimit);

    const additionalCommits = +core.getInput('additional-commits');
    const additionalCommitsLimit = core.getInput('additional-commits-limit');

    const commitsOK = compareRange(additionalCommits, additionalCommitsLimit);

    const codeChanged = +core.getInput('code-changed');
    const codeChangedLimit = core.getInput('code-changed-limit');

    const changesOK = compareRange(codeChanged, codeChangedLimit);

    core.setOutput('satisfied', durationOK && commitsOK && changesOK);
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
