import 'dotenv/config';
import { CronJob } from 'cron';
import { invalidateIntentBatches } from './actions/invalidate-intent-batches';

/**
 * Cron job to invalidate intents every 5 minutes
 */
const jobInvalidateIntents = new CronJob(
	'0 */5 * * * *', // cronTime
	async function () {
		console.log('Invalidating intents');
    await invalidateIntentBatches();
	}, // onTick
	null, // onComplete
	true, // start
	'America/Los_Angeles' // timeZone
);

jobInvalidateIntents.start();