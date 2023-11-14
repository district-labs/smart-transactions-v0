import 'dotenv/config';
import { CronJob } from 'cron';
import { invalidateIntentBatches } from './actions/invalidate-intent-batches';
import { pingSearcherEngine } from './actions/ping-searcher-engine';

/**
 * Cron job to invalidate intents every 5 minutes
 */
const jobInvalidateIntents = new CronJob(
	'0 */5 * * * *',
	async () => {
		await invalidateIntentBatches();
	},
	() => console.log('Intent Batches Invalidated'), // onComplete
	false, // start
	'America/Los_Angeles' // timeZone
);

/**
 * Cron job to ping searcher every 2 minutes
 */
const jobPingSearcher = new CronJob(
	'0 */2 * * * *',
	async () => {
		await pingSearcherEngine();
	},
	() => console.log('Searcher Engine Pinged'), // onComplete
	false, // start
	'America/Los_Angeles' // timeZone
);

jobPingSearcher.start();
jobInvalidateIntents.start();