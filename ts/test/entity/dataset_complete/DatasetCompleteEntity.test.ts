

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { GraphiteNoteSDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('DatasetCompleteEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when GRAPHITE_NOTE_TEST_LIVE=TRUE.
  afterEach(liveDelay('GRAPHITE_NOTE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = GraphiteNoteSDK.test()
    const ent = testsdk.DatasetComplete()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = GraphiteNoteSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.DatasetComplete().create({"datasetcode":1,"usercode":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.GRAPHITE_NOTE_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'dataset_complete.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"datasetcode":{"a":true,"h":"Datasetcode","n":"datasetcode","r":true,"t":"`$STRING`","key$":"datasetcode","index$":0},"details":{"a":true,"h":"Details","n":"details","r":false,"t":"`$OBJECT`","key$":"details","index$":1},"status":{"a":true,"h":"Status","n":"status","r":false,"sh":"'success' on success.","t":"`$STRING`","key$":"status","index$":2},"usercode":{"a":true,"h":"Usercode","n":"usercode","r":true,"t":"`$STRING`","key$":"usercode","index$":3}},"name":"dataset_complete","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["datasetcode","usercode"],"co":{"id":"POST /dataset-complete","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/dataset-complete","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"dataset-complete"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"dataset_complete","name__orig":"dataset_complete","Name":"DatasetComplete","name_":"dataset_complete","name-":"dataset-complete","NAME":"DATASET_COMPLETE","index$":1}, {"active":true,"entity":"dataset_complete","key$":"BasicDatasetCompleteFlow","kind":"basic","name":"BasicDatasetCompleteFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"dataset_complete_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0}]}, 'DatasetComplete', {"POST /dataset-complete":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"user-code":{"type":"string","key$":"user-code"},"dataset-code":{"type":"string","key$":"dataset-code"}},"required":["user-code","dataset-code"],"description":"Signals the end of dataset insertion: triggers final dataset shape calculation and post-processing.","x-ref":"#/components/schemas/DatasetCompleteRequest","index$":1}}}},"parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const dataset_complete_ref01_ent = client.DatasetComplete()
    let dataset_complete_ref01_data = setup.data.new.dataset_complete['dataset_complete_ref01']

    dataset_complete_ref01_data = (await dataset_complete_ref01_ent.create(dataset_complete_ref01_data)).data()
    assert(null != dataset_complete_ref01_data)


  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/dataset_complete/DatasetCompleteTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = GraphiteNoteSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['dataset_complete01','dataset_complete02','dataset_complete03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'GRAPHITE_NOTE_TEST_DATASET_COMPLETE_ENTID': idmap,
    'GRAPHITE_NOTE_TEST_LIVE': 'FALSE',
    'GRAPHITE_NOTE_TEST_EXPLAIN': 'FALSE',
    'GRAPHITE_NOTE_APIKEY': '',
  })

  idmap = env['GRAPHITE_NOTE_TEST_DATASET_COMPLETE_ENTID']

  const live = 'TRUE' === env.GRAPHITE_NOTE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['GRAPHITE_NOTE_TEST_DATASET_COMPLETE_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new GraphiteNoteSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
        apikey: env.GRAPHITE_NOTE_APIKEY,
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.GRAPHITE_NOTE_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
