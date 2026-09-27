
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { GraphiteNoteSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = GraphiteNoteSDK.test()
    equal(testsdk instanceof GraphiteNoteSDK, true,
      'GraphiteNoteSDK.test() must return a client synchronously')
  })

})
