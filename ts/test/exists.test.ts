
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { GraphiteNoteSDK } from '..'


describe('exists', async () => {

  test('test-mode', async () => {
    const testsdk = await GraphiteNoteSDK.test()
    equal(null !== testsdk, true)
  })

})
