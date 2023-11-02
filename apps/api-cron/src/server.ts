import 'dotenv/config';
import { CronJob } from 'cron';
import { invalidateIntentBatches } from './actions/invalidate-intent-batches';

const job = new CronJob(
	'1-59 * * * * *', // cronTime
	async function () {
		console.log('You will see this message every second');
    await invalidateIntentBatches();
	}, // onTick
	null, // onComplete
	true, // start
	'America/Los_Angeles' // timeZone
);

job.start();