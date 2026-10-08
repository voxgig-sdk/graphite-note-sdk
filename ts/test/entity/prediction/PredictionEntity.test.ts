

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


describe('PredictionEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when GRAPHITE_NOTE_TEST_LIVE=TRUE.
  afterEach(liveDelay('GRAPHITE_NOTE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = GraphiteNoteSDK.test()
    const ent = testsdk.Prediction()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = GraphiteNoteSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Prediction().create({"model_code":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.GRAPHITE_NOTE_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'prediction.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"columns":{"a":true,"h":"Columns","n":"columns","r":false,"sh":"Column names associated with each prediction row.","t":"`$ARRAY`","key$":"columns","index$":0},"data":{"a":true,"h":"Data","n":"data","op":{"create":{"req":true,"type":"`$OBJECT`"}},"r":false,"t":"`$ARRAY`","key$":"data","index$":1}},"name":"prediction","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["data"],"co":{"id":"POST /v1/prediction/model/{model_code}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"model_code","or":"model_code","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"POST","o":"/v1/prediction/model/{model_code}","q":{"exist":["model_code"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v1"},{"lit":"prediction"},{"lit":"model"},{"var":"model_code"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0},{"a":true,"bf":["data"],"co":{"id":"POST /v2/prediction/model/{model_code}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"model_code","or":"model_code","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"POST","o":"/v2/prediction/model/{model_code}","q":{"exist":["model_code"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v2"},{"lit":"prediction"},{"lit":"model"},{"var":"model_code"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":1}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"prediction","name__orig":"prediction","Name":"Prediction","name_":"prediction","name-":"prediction","NAME":"PREDICTION","index$":5}, {"active":true,"entity":"prediction","key$":"BasicPredictionFlow","kind":"basic","name":"BasicPredictionFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"prediction_ref01"},"m":{"model_code":"model_code01"},"o":"create","s":[],"v":[],"index$":0}]}, 'Prediction', {"POST /v1/prediction/model/{model_code}":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"data":{"type":"object","properties":{"predict_values":{"description":"Either an array of prediction rows (each row an array of alias/selectedValue objects — Binary/Multiclass Classification and Regression models), or a single timeseries object (startDate/endDate/sequenceID[/daysData] — Timeseries models).","oneOf":[{},{}]}},"required":["predict_values"],"key$":"data"}},"required":["data"],"x-ref":"#/components/schemas/PredictionRequestV1","index$":1}}}},"parameters":[{"name":"model_code","in":"path","required":true,"description":"The model's code: open the model, Settings tab, ID section.","schema":{"type":"string"},"index$":0}]},"POST /v2/prediction/model/{model_code}":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"data":{"type":"object","properties":{"predict_values":{"type":"array","items":{"type":"object","properties":{},"description":"One prediction row: keys are the EXACT column names used during model training, values are the inputs. All training features are required; extra identifier fields (Lead ID, Customer ID) are passed through unchanged and echoed in the response.","additionalProperties":true,"x-ref":"#/components/schemas/PredictionRowV2"}}},"required":["predict_values"],"key$":"data"}},"required":["data"],"x-ref":"#/components/schemas/PredictionRequestV2","index$":1}}}},"parameters":[{"name":"model_code","in":"path","required":true,"description":"The model's code: open the model, Settings tab, ID section.","schema":{"type":"string"},"index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const prediction_ref01_ent = client.Prediction()
    let prediction_ref01_data = setup.data.new.prediction['prediction_ref01']
    prediction_ref01_data['model_code'] = setup.idmap['model_code01']

    prediction_ref01_data = (await prediction_ref01_ent.create(prediction_ref01_data)).data()
    assert(null != prediction_ref01_data)


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
      '../../../../.sdk/test/entity/prediction/PredictionTestData.json')

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
    ['prediction01','prediction02','prediction03','model_code01'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'GRAPHITE_NOTE_TEST_PREDICTION_ENTID': idmap,
    'GRAPHITE_NOTE_TEST_LIVE': 'FALSE',
    'GRAPHITE_NOTE_TEST_EXPLAIN': 'FALSE',
    'GRAPHITE_NOTE_APIKEY': '',
  })

  idmap = env['GRAPHITE_NOTE_TEST_PREDICTION_ENTID']

  const live = 'TRUE' === env.GRAPHITE_NOTE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['GRAPHITE_NOTE_TEST_PREDICTION_ENTID']
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
  
