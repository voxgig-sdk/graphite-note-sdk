

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


describe('ModelResultEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when GRAPHITE_NOTE_TEST_LIVE=TRUE.
  afterEach(liveDelay('GRAPHITE_NOTE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = GraphiteNoteSDK.test()
    const ent = testsdk.ModelResult()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.GRAPHITE_NOTE_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'model_result.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":[{"active":true,"name":"data","req":false,"type":"`$ARRAY`","index$":0},{"active":true,"name":"page","req":false,"short":"Page number for paginated results.","type":"`$INTEGER`","index$":1},{"active":true,"name":"pagesize","req":false,"short":"Rows per page.","type":"`$INTEGER`","index$":2}],"name":"model_result","op":{"create":{"input":"data","name":"create","points":[{"active":true,"args":{"params":[{"active":true,"kind":"param","name":"model_code","orig":"model_code","reqd":true,"type":"`$STRING`","index$":0}]},"contract":{"id":"POST /model/fetch-result/{model_code}","json":"{\"operationId\":\"FetchModelResults\",\"parameters\":[{\"description\":\"The model's code: open the model, Settings tab, ID section.\",\"in\":\"path\",\"name\":\"model_code\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"schema\":{\"description\":\"Pagination for model result retrieval. Response carries X-Page and X-Page-Size headers.\",\"properties\":{\"page\":{\"description\":\"Page number for paginated results. Defaults to 1.\",\"type\":\"integer\"},\"page-size\":{\"description\":\"Rows per page. Defaults to 10000.\",\"type\":\"integer\"}},\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"data\":{\"items\":{\"additionalProperties\":true,\"description\":\"One row of a model's result table; remaining keys mirror the dataset's columns.\",\"properties\":{\"id\":{\"description\":\"Row id within the result table.\",\"type\":\"integer\"}},\"type\":\"object\"},\"type\":\"array\"}},\"type\":\"object\"}}},\"description\":\"A page of result rows.\",\"headers\":{\"X-Page\":{\"description\":\"The current page number.\",\"schema\":{\"type\":\"integer\"}},\"X-Page-Size\":{\"description\":\"Rows returned per page.\",\"schema\":{\"type\":\"integer\"}}}},\"429\":{\"content\":{\"application/json\":{\"schema\":{\"additionalProperties\":true,\"description\":\"Error payload. Notable statuses: 429 rate limit (tenant 10/min, global 200/min); custom 44x business errors — 441 subscription plan limit, 442 email exists, 443 free trial finished, 445 model creation limit.\",\"properties\":{\"message\":{\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Rate limit exceeded (tenant 10/min, global 200/min).\"}},\"security\":[{\"BearerTokenAuth\":[]}],\"securitySchemes\":{\"BearerTokenAuth\":{\"description\":\"Tenant token from the Graphite Note app's Account Info page.\",\"scheme\":\"bearer\",\"type\":\"http\"}},\"securitySource\":\"definition\"}","source":"openapi3","version":1},"kind":"http","method":"POST","orig":"/model/fetch-result/{model_code}","segments":[{"lit":"model"},{"lit":"fetch-result"},{"var":"model_code"}],"select":{"exist":["model_code"]},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[["fetch_result"]]},"key$":"model_result","name__orig":"model_result","Name":"ModelResult","name_":"model_result","name-":"model-result","NAME":"MODEL_RESULT","index$":3}, {"active":true,"entity":"model_result","key$":"BasicModelResultFlow","kind":"basic","name":"BasicModelResultFlow","param":{},"step":[{"active":true,"data":{},"input":{"ref":"model_result_ref01"},"match":{"model_code":"model_code01"},"op":"create","spec":[],"valid":[],"index$":0}]}, 'ModelResult')
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const model_result_ref01_ent = client.ModelResult()
    let model_result_ref01_data = setup.data.new.model_result['model_result_ref01']
    model_result_ref01_data['model_code'] = setup.idmap['model_code01']

    model_result_ref01_data = (await model_result_ref01_ent.create(model_result_ref01_data)).data()
    assert(null != model_result_ref01_data)


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/model_result/ModelResultTestData.json')

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
    ['model_result01','model_result02','model_result03','fetch_result01','fetch_result02','fetch_result03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID': idmap,
    'GRAPHITE_NOTE_TEST_LIVE': 'FALSE',
    'GRAPHITE_NOTE_TEST_EXPLAIN': 'FALSE',
    'GRAPHITE_NOTE_APIKEY': '',
  })

  idmap = env['GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID']

  const live = 'TRUE' === env.GRAPHITE_NOTE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['GRAPHITE_NOTE_TEST_MODEL_RESULT_ENTID']
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
  
