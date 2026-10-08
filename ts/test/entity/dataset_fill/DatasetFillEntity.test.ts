

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


describe('DatasetFillEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when GRAPHITE_NOTE_TEST_LIVE=TRUE.
  afterEach(liveDelay('GRAPHITE_NOTE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = GraphiteNoteSDK.test()
    const ent = testsdk.DatasetFill()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = GraphiteNoteSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.DatasetFill().create({"append":"x","columns":"x","compressed":true,"datasetcode":"x","insertdata":"x","usercode":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.GRAPHITE_NOTE_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'dataset_fill.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"append":{"a":true,"h":"Append","n":"append","r":true,"sh":"True to append to existing rows; false to truncate the dataset first.","t":"`$BOOLEAN`","key$":"append","index$":0},"columns":{"a":true,"h":"Columns","n":"columns","r":true,"t":"`$ARRAY`","key$":"columns","index$":1},"compressed":{"a":true,"h":"Compressed","n":"compressed","r":true,"sh":"True when insert-data is gzip+base64; false when it is a JSON-escaped string.","t":"`$BOOLEAN`","key$":"compressed","index$":2},"datasetcode":{"a":true,"h":"Datasetcode","n":"datasetcode","r":true,"t":"`$STRING`","key$":"datasetcode","index$":3},"details":{"a":true,"h":"Details","n":"details","r":false,"t":"`$OBJECT`","key$":"details","index$":4},"insertdata":{"a":true,"h":"Insertdata","n":"insertdata","r":true,"sh":"The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true.","t":"`$STRING`","key$":"insertdata","index$":5},"status":{"a":true,"h":"Status","n":"status","r":false,"sh":"'success' on success.","t":"`$STRING`","key$":"status","index$":6},"usercode":{"a":true,"h":"Usercode","n":"usercode","r":true,"t":"`$STRING`","key$":"usercode","index$":7}},"name":"dataset_fill","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["append","columns","compressed","datasetcode","insertdata","usercode"],"co":{"id":"POST /dataset-fill","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/dataset-fill","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"dataset-fill"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"dataset_fill","name__orig":"dataset_fill","Name":"DatasetFill","name_":"dataset_fill","name-":"dataset-fill","NAME":"DATASET_FILL","index$":2}, {"active":true,"entity":"dataset_fill","key$":"BasicDatasetFillFlow","kind":"basic","name":"BasicDatasetFillFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"dataset_fill_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0}]}, 'DatasetFill', {"POST /dataset-fill":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"user-code":{"type":"string","key$":"user-code"},"dataset-code":{"type":"string","key$":"dataset-code"},"columns":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string","description":"Column name as it appears in the source data."},"alias":{"type":"string","description":"Display alias for the column."},"type":{"type":"string","enum":[]},"subtype":{"type":"string","enum":[]},"format":{"type":"string","description":"Optional display format, e.g. '#,###.##' for numeric or 'Y-d-m H:i:s' for datetime."}},"required":["name","alias","type","subtype"],"description":"One column of a dataset's structure.","x-ref":"#/components/schemas/ColumnDefinition"},"key$":"columns"},"insert-data":{"type":"string","description":"The rows to insert, as a STRING: a JSON-escaped array-of-arrays when compressed is false, or gzipped-then-base64 when compressed is true. Batch large datasets (e.g. 10,000 rows per call).","key$":"insert-data"},"compressed":{"type":"boolean","description":"True when insert-data is gzip+base64; false when it is a JSON-escaped string.","key$":"compressed"},"append":{"type":"boolean","description":"True to append to existing rows; false to truncate the dataset first.","key$":"append"}},"required":["user-code","dataset-code","columns","insert-data","compressed","append"],"x-ref":"#/components/schemas/DatasetFillRequest","index$":1}}}},"parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const dataset_fill_ref01_ent = client.DatasetFill()
    let dataset_fill_ref01_data = setup.data.new.dataset_fill['dataset_fill_ref01']

    dataset_fill_ref01_data = (await dataset_fill_ref01_ent.create(dataset_fill_ref01_data)).data()
    assert(null != dataset_fill_ref01_data)


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
      '../../../../.sdk/test/entity/dataset_fill/DatasetFillTestData.json')

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
    ['dataset_fill01','dataset_fill02','dataset_fill03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'GRAPHITE_NOTE_TEST_DATASET_FILL_ENTID': idmap,
    'GRAPHITE_NOTE_TEST_LIVE': 'FALSE',
    'GRAPHITE_NOTE_TEST_EXPLAIN': 'FALSE',
    'GRAPHITE_NOTE_APIKEY': '',
  })

  idmap = env['GRAPHITE_NOTE_TEST_DATASET_FILL_ENTID']

  const live = 'TRUE' === env.GRAPHITE_NOTE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['GRAPHITE_NOTE_TEST_DATASET_FILL_ENTID']
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
  
