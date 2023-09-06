import * as core from '@actions/core';


const data = JSON.parse(core.getInput('data', { required: true }));
const timeToMerge = core.getInput('time-to-merge-condition');


const run = async () => {
  try {
    core.info(`incoming timeToMerge: ${timeToMerge}`)
    core.info(`incoming data: ${JSON.stringify(data, null, 2)}`)
    if (timeToMerge) {
      const [lowerLimit, upperLimit] = timeToMerge.split(',').map(l => +l);
      const created = new Date(data.created_at).valueOf();
      const merged = new Date(data.merged_at).valueOf();
      const durationInDays = (merged - created) / (1000 * 60 * 60 * 24);

      if (!isNaN(lowerLimit) || durationInDays < lowerLimit) {
        core.info(`PR duration ${durationInDays} not gte ${lowerLimit}`)
        core.setOutput('satisfied', false);
        return;
      }

      if (!isNaN(upperLimit) || durationInDays > upperLimit) {
        core.info(`PR duration ${durationInDays} not lte ${upperLimit}`)
        core.setOutput('satisfied', false);
        return;
      }

      core.info(`PR duration ${durationInDays} is within ${lowerLimit} and ${upperLimit}`)
      core.setOutput('satisfied', true);
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
