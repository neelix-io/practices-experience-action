import * as core from '@actions/core';
import compareRange from './util/compare-range';


const run = async () => {
  try {
    const durationInDays = +core.getInput('duration-in-days');
    const timeToMerge = core.getInput('time-to-merge-condition');

    const durationOK = compareRange(durationInDays, timeToMerge);

    const additionalCommits = +core.getInput('additional-commits');
    const additionalCommitsCondition = core.getInput('additional-commits-condition');

    const commitsOK = compareRange(additionalCommits, additionalCommitsCondition);

    const totalChanges = +core.getInput('total-changes');
    const totalChangesCondition = core.getInput('total-changes-condition');

    const changesOK = compareRange(totalChanges, totalChangesCondition);

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
