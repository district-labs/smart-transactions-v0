import { expect, test } from 'vitest'
import { selectAllIntentBatchQuery, selectIntentBatchActiveQuery, selectIntentBatchCancelledQuery } from './intent-batch'

test('should query all intent batches', async () => {
    const query = await selectAllIntentBatchQuery.execute()
    expect(query.length).toBeGreaterThan(0)
})

test('should query active intent batches', async () => {
    const query = await selectIntentBatchActiveQuery.execute()
    expect(query.length).toBeGreaterThan(0)
})

test('should query cancelled intent batches', async () => {
    const query = await selectIntentBatchCancelledQuery.execute()
    expect(query.length).toBeGreaterThan(0)
})