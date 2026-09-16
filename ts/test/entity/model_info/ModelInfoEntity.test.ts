

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


describe('ModelInfoEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when GRAPHITE_NOTE_TEST_LIVE=TRUE.
  afterEach(liveDelay('GRAPHITE_NOTE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = GraphiteNoteSDK.test()
    const ent = testsdk.ModelInfo()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.GRAPHITE_NOTE_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'model_info.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":[{"active":true,"name":"code","req":false,"short":"Model code (Settings tab, ID section).","type":"`$STRING`","index$":0},{"active":true,"format":"date-time","name":"created_at","req":false,"type":"`$STRING`","index$":1},{"active":true,"name":"dataset_code","req":false,"short":"Code of the dataset the model is trained on.","type":"`$STRING`","index$":2},{"active":true,"name":"model_name","req":false,"short":"Model type name, e.g.","type":"`$STRING`","index$":3},{"active":true,"name":"name","req":false,"short":"User-given model name.","type":"`$STRING`","index$":4},{"active":true,"name":"properties","req":false,"short":"Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...).","type":"`$OBJECT`","index$":5},{"active":true,"format":"date-time","name":"updated_at","req":false,"type":"`$STRING`","index$":6}],"name":"model_info","op":{"load":{"input":"data","name":"load","points":[{"active":true,"args":{"params":[{"active":true,"kind":"param","name":"model_code","orig":"model_code","reqd":true,"type":"`$STRING`","index$":0}]},"contract":{"id":"GET /model/fetch-model-info/{model_code}","json":"{\"operationId\":\"FetchModelInfo\",\"parameters\":[{\"description\":\"The model's code: open the model, Settings tab, ID section.\",\"in\":\"path\",\"name\":\"model_code\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"data\":{\"description\":\"Metadata for a model created in Graphite Note.\",\"properties\":{\"code\":{\"description\":\"Model code (Settings tab, ID section).\",\"type\":\"string\"},\"created_at\":{\"format\":\"date-time\",\"type\":\"string\"},\"dataset_code\":{\"description\":\"Code of the dataset the model is trained on.\",\"type\":\"string\"},\"model_name\":{\"description\":\"Model type name, e.g. 'RFM Customer Segmentation'.\",\"type\":\"string\"},\"name\":{\"description\":\"User-given model name.\",\"type\":\"string\"},\"properties\":{\"additionalProperties\":true,\"description\":\"Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...).\",\"properties\":{},\"type\":\"object\"},\"updated_at\":{\"format\":\"date-time\",\"type\":\"string\"}},\"type\":\"object\"}},\"type\":\"object\"}}},\"description\":\"Success.\"},\"429\":{\"content\":{\"application/json\":{\"schema\":{\"additionalProperties\":true,\"description\":\"Error payload. Notable statuses: 429 rate limit (tenant 10/min, global 200/min); custom 44x business errors — 441 subscription plan limit, 442 email exists, 443 free trial finished, 445 model creation limit.\",\"properties\":{\"message\":{\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Rate limit exceeded (tenant 10/min, global 200/min).\"}},\"security\":[{\"BearerTokenAuth\":[]}],\"securitySchemes\":{\"BearerTokenAuth\":{\"description\":\"Tenant token from the Graphite Note app's Account Info page.\",\"scheme\":\"bearer\",\"type\":\"http\"}},\"securitySource\":\"definition\"}","source":"openapi3","version":1},"kind":"http","method":"GET","orig":"/model/fetch-model-info/{model_code}","segments":[{"lit":"model"},{"lit":"fetch-model-info"},{"var":"model_code"}],"select":{"exist":["model_code"]},"transform":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[["fetch_model_info"]]},"key$":"model_info","name__orig":"model_info","Name":"ModelInfo","name_":"model_info","name-":"model-info","NAME":"MODEL_INFO","index$":2}, {"active":true,"entity":"model_info","key$":"BasicModelInfoFlow","kind":"basic","name":"BasicModelInfoFlow","param":{},"step":[{"active":true,"data":{},"input":{"ref":"model_info_ref01","srcdatavar":"model_info_ref01_data","suffix":"_dt0"},"match":{"id":"model_info01"},"op":"load","spec":[],"valid":[{"apply":"TextFieldMark","def":{"mark":"Mark01-model_info_ref01"}}],"index$":0}]}, 'ModelInfo')
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let model_info_ref01_data = Object.values(setup.data.existing.model_info)[0] as any

    // LOAD: skipped — no entity id field and load requires path params.
    // Entity-var is declared here so later flow steps still compile.
    const model_info_ref01_ent = client.ModelInfo()


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/model_info/ModelInfoTestData.json')

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
    ['model_info01','model_info02','model_info03','fetch_model_info01','fetch_model_info02','fetch_model_info03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'GRAPHITE_NOTE_TEST_MODEL_INFO_ENTID': idmap,
    'GRAPHITE_NOTE_TEST_LIVE': 'FALSE',
    'GRAPHITE_NOTE_TEST_EXPLAIN': 'FALSE',
    'GRAPHITE_NOTE_APIKEY': '',
  })

  idmap = env['GRAPHITE_NOTE_TEST_MODEL_INFO_ENTID']

  const live = 'TRUE' === env.GRAPHITE_NOTE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['GRAPHITE_NOTE_TEST_MODEL_INFO_ENTID']
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
  
