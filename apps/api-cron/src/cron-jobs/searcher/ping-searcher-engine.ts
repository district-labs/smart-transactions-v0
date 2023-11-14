import { CronJob } from "cron";
import "dotenv/config";
import { pingSearcherEngine } from "../../actions/searcher/ping-searcher-engine";


/**
 * Cron job to ping searcher every 2 minutes
 */
export const jobPingSearcher = new CronJob(
	'0 */2 * * * *',
	async () => {
		await pingSearcherEngine();
	},
	() => console.log('Searcher Engine Pinged'), // onComplete
	true, // start
	'America/Los_Angeles' // timeZone
);