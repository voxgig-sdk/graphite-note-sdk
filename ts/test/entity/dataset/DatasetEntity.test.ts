

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { GraphiteNoteSDK, BaseFeature, stdutil } from '../../..'

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


// AFTER the imports on purpose: TypeScript hoists `import` above any
// statement in the emitted CommonJS, so a loader placed above them would
// run only after every imported module had already been evaluated - and
// anything reading process.env at module scope would miss these values.
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


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.GRAPHITE_NOTE_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'dataset.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":[{"active":true,"name":"columns","op":{"create":{"req":true,"type":"`$ARRAY`"}},"req":false,"short":"Number of columns created.","type":"`$INTEGER`","index$":0},{"active":true,"name":"datasetcode","req":false,"short":"Unique code assigned to the created dataset.","type":"`$STRING`","index$":1},{"active":true,"name":"name","req":true,"short":"Human-readable dataset name.","type":"`$STRING`","index$":2},{"active":true,"name":"tablename","req":false,"short":"Backing table name, e.g.","type":"`$STRING`","index$":3},{"active":true,"name":"usercode","req":true,"short":"Unique code identifying the user.","type":"`$STRING`","index$":4}],"name":"dataset","op":{"create":{"input":"data","name":"create","points":[{"active":true,"args":{},"contract":{"id":"POST /dataset-create","json":"{\"operationId\":\"CreateDataset\",\"parameters\":[],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"columns\":{\"items\":{\"description\":\"One column of a dataset's structure.\",\"properties\":{\"alias\":{\"description\":\"Display alias for the column.\",\"type\":\"string\"},\"format\":{\"description\":\"Optional display format, e.g. '#,###.##' for numeric or 'Y-d-m H:i:s' for datetime.\",\"type\":\"string\"},\"name\":{\"description\":\"Column name as it appears in the source data.\",\"type\":\"string\"},\"subtype\":{\"enum\":[\"text\",\"numeric\",\"date\",\"datetime\"],\"type\":\"string\"},\"type\":{\"enum\":[\"measure\",\"dimension\"],\"type\":\"string\"}},\"required\":[\"name\",\"alias\",\"type\",\"subtype\"],\"type\":\"object\"},\"type\":\"array\"},\"name\":{\"description\":\"Human-readable dataset name.\",\"type\":\"string\"},\"user-code\":{\"description\":\"Unique code identifying the user.\",\"type\":\"string\"}},\"required\":[\"user-code\",\"name\",\"columns\"],\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"data\":{\"description\":\"A created dataset.\",\"properties\":{\"columns\":{\"description\":\"Number of columns created.\",\"type\":\"integer\"},\"dataset-code\":{\"description\":\"Unique code assigned to the created dataset.\",\"type\":\"string\"},\"table-name\":{\"description\":\"Backing table name, e.g. dataset_csv_<code>.\",\"type\":\"string\"}},\"type\":\"object\"}},\"type\":\"object\"}}},\"description\":\"Success.\"},\"429\":{\"content\":{\"application/json\":{\"schema\":{\"additionalProperties\":true,\"description\":\"Error payload. Notable statuses: 429 rate limit (tenant 10/min, global 200/min); custom 44x business errors — 441 subscription plan limit, 442 email exists, 443 free trial finished, 445 model creation limit.\",\"properties\":{\"message\":{\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Rate limit exceeded (tenant 10/min, global 200/min).\"}},\"security\":[{\"BearerTokenAuth\":[]}],\"securitySchemes\":{\"BearerTokenAuth\":{\"description\":\"Tenant token from the Graphite Note app's Account Info page.\",\"scheme\":\"bearer\",\"type\":\"http\"}},\"securitySource\":\"definition\"}","source":"openapi3","version":1},"kind":"http","method":"POST","orig":"/dataset-create","segments":[{"lit":"dataset-create"}],"select":{},"transform":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"dataset","name__orig":"dataset","Name":"Dataset","name_":"dataset","name-":"dataset","NAME":"DATASET","index$":0}, {"active":true,"entity":"dataset","key$":"BasicDatasetFlow","kind":"basic","name":"BasicDatasetFlow","param":{},"step":[{"active":true,"data":{},"input":{"ref":"dataset_ref01"},"match":{},"op":"create","spec":[],"valid":[],"index$":0}]}, 'Dataset')
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
  
