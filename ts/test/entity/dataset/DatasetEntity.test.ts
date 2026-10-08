

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


describe('DatasetEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when GRAPHITE_NOTE_TEST_LIVE=TRUE.
  afterEach(liveDelay('GRAPHITE_NOTE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = GraphiteNoteSDK.test()
    const ent = testsdk.Dataset()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = GraphiteNoteSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Dataset().create({"columns":"x","name":"x","usercode":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.GRAPHITE_NOTE_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'dataset.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"columns":{"a":true,"h":"Columns","n":"columns","op":{"create":{"req":true,"type":"`$ARRAY`"}},"r":false,"sh":"Number of columns created.","t":"`$INTEGER`","key$":"columns","index$":0},"datasetcode":{"a":true,"h":"Datasetcode","n":"datasetcode","r":false,"sh":"Unique code assigned to the created dataset.","t":"`$STRING`","key$":"datasetcode","index$":1},"name":{"a":true,"h":"Name","n":"name","r":true,"sh":"Human-readable dataset name.","t":"`$STRING`","key$":"name","index$":2},"tablename":{"a":true,"h":"Tablename","n":"tablename","r":false,"sh":"Backing table name, e.g.","t":"`$STRING`","key$":"tablename","index$":3},"usercode":{"a":true,"h":"Usercode","n":"usercode","r":true,"sh":"Unique code identifying the user.","t":"`$STRING`","key$":"usercode","index$":4}},"name":"dataset","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["columns","name","usercode"],"co":{"id":"POST /dataset-create","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/dataset-create","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"dataset-create"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"dataset","name__orig":"dataset","Name":"Dataset","name_":"dataset","name-":"dataset","NAME":"DATASET","index$":0}, {"active":true,"entity":"dataset","key$":"BasicDatasetFlow","kind":"basic","name":"BasicDatasetFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"dataset_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0}]}, 'Dataset', {"POST /dataset-create":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"user-code":{"type":"string","description":"Unique code identifying the user.","key$":"user-code"},"name":{"type":"string","description":"Human-readable dataset name.","key$":"name"},"columns":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string","description":"Column name as it appears in the source data."},"alias":{"type":"string","description":"Display alias for the column."},"type":{"type":"string","enum":[]},"subtype":{"type":"string","enum":[]},"format":{"type":"string","description":"Optional display format, e.g. '#,###.##' for numeric or 'Y-d-m H:i:s' for datetime."}},"required":["name","alias","type","subtype"],"description":"One column of a dataset's structure.","x-ref":"#/components/schemas/ColumnDefinition"},"key$":"columns"}},"required":["user-code","name","columns"],"x-ref":"#/components/schemas/DatasetCreateRequest","index$":1}}}},"parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const dataset_ref01_ent = client.Dataset()
    let dataset_ref01_data = setup.data.new.dataset['dataset_ref01']

    dataset_ref01_data = (await dataset_ref01_ent.create(dataset_ref01_data)).data()
    assert(null != dataset_ref01_data)


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
      '../../../../.sdk/test/entity/dataset/DatasetTestData.json')

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
    ['dataset01','dataset02','dataset03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'GRAPHITE_NOTE_TEST_DATASET_ENTID': idmap,
    'GRAPHITE_NOTE_TEST_LIVE': 'FALSE',
    'GRAPHITE_NOTE_TEST_EXPLAIN': 'FALSE',
    'GRAPHITE_NOTE_APIKEY': '',
  })

  idmap = env['GRAPHITE_NOTE_TEST_DATASET_ENTID']

  const live = 'TRUE' === env.GRAPHITE_NOTE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['GRAPHITE_NOTE_TEST_DATASET_ENTID']
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
  
