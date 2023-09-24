import { expect, test } from 'vitest'
import { intentBatchActiveQuery, intentBatchCancelledQuery, selectActiveIntentBatchQuery } from './intent-batch'

test('should query active intents', async () => {
    const query = await selectActiveIntentBatchQuery.execute()
    expect(query.length).toBe(1)
})

test('should query active intents', () => {
    const query = intentBatchActiveQuery
    expect(query.length).toBe(1)
})

test('should query cancelled intents', () => {
    const query = intentBatchCancelledQuery
    expect(query.length).toBe(0)
})