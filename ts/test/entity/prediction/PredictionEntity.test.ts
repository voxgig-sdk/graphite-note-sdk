

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


describe('PredictionEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when GRAPHITE_NOTE_TEST_LIVE=TRUE.
  afterEach(liveDelay('GRAPHITE_NOTE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = GraphiteNoteSDK.test()
    const ent = testsdk.Prediction()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.GRAPHITE_NOTE_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'prediction.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":[{"active":true,"name":"columns","req":false,"short":"Column names associated with each prediction row.","type":"`$ARRAY`","index$":0},{"active":true,"name":"data","op":{"create":{"req":true,"type":"`$OBJECT`"}},"req":false,"type":"`$ARRAY`","index$":1}],"name":"prediction","op":{"create":{"input":"data","name":"create","points":[{"active":true,"args":{"params":[{"active":true,"kind":"param","name":"model_code","orig":"model_code","reqd":true,"type":"`$STRING`","index$":0}]},"contract":{"id":"POST /v1/prediction/model/{model_code}","json":"{\"operationId\":\"PredictV1\",\"parameters\":[{\"description\":\"The model's code: open the model, Settings tab, ID section.\",\"in\":\"path\",\"name\":\"model_code\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"data\":{\"properties\":{\"predict_values\":{\"description\":\"Either an array of prediction rows (each row an array of alias/selectedValue objects — Binary/Multiclass Classification and Regression models), or a single timeseries object (startDate/endDate/sequenceID[/daysData] — Timeseries models).\",\"oneOf\":[{\"description\":\"Classification/regression rows.\",\"items\":{\"items\":{\"description\":\"v1 alias-based feature value. One object per feature; every feature used in training must be present.\",\"properties\":{\"alias\":{\"description\":\"Input column name as defined during model training.\",\"type\":\"string\"},\"selectedValue\":{\"description\":\"The value submitted for prediction.\"}},\"required\":[\"alias\",\"selectedValue\"],\"type\":\"object\"},\"type\":\"array\"},\"type\":\"array\"},{\"properties\":{\"daysData\":{\"description\":\"Required ONLY for models trained with regressors: one entry per date, every regressor per entry.\",\"items\":{\"additionalProperties\":true,\"description\":\"One day of regressor values for a regressor-trained timeseries model. Beyond `date`, include EVERY regressor column used in training (e.g. promotion, price) as additional properties.\",\"properties\":{\"date\":{\"description\":\"Date the regressor values apply to (YYYY-MM-DD).\",\"format\":\"date\",\"type\":\"string\"}},\"type\":\"object\"},\"type\":\"array\"},\"endDate\":{\"description\":\"End of prediction window (YYYY-MM-DD), inclusive.\",\"format\":\"date\",\"type\":\"string\"},\"sequenceID\":{\"description\":\"Identifies the specific time series to forecast (product, store, region); 'n/a' if unused.\",\"type\":\"string\"},\"startDate\":{\"description\":\"Start of prediction window (YYYY-MM-DD); must align to model frequency.\",\"format\":\"date\",\"type\":\"string\"}},\"required\":[\"startDate\",\"endDate\",\"sequenceID\"],\"type\":\"object\"}]}},\"required\":[\"predict_values\"],\"type\":\"object\"}},\"required\":[\"data\"],\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"data\":{\"description\":\"Classification/regression prediction results.\",\"properties\":{\"columns\":{\"description\":\"Column names associated with each prediction row.\",\"items\":{\"type\":\"string\"},\"type\":\"array\"},\"data\":{\"items\":{\"additionalProperties\":true,\"description\":\"One prediction result row: the input attributes echoed back, the predicted Label, and per-class probability scores as Score_<CLASS> keys (e.g. Score_YES: 0.1045 = 10.45%).\",\"properties\":{\"Label\":{\"description\":\"Predicted label (classification models).\",\"type\":\"string\"}},\"type\":\"object\"},\"type\":\"array\"}},\"type\":\"object\"}},\"type\":\"object\"}}},\"description\":\"Prediction results. Timeseries models answer {data: [TimeseriesPoint...]} instead.\"},\"429\":{\"content\":{\"application/json\":{\"schema\":{\"additionalProperties\":true,\"description\":\"Error payload. Notable statuses: 429 rate limit (tenant 10/min, global 200/min); custom 44x business errors — 441 subscription plan limit, 442 email exists, 443 free trial finished, 445 model creation limit.\",\"properties\":{\"message\":{\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Rate limit exceeded (tenant 10/min, global 200/min).\"}},\"security\":[{\"BearerTokenAuth\":[]}],\"securitySchemes\":{\"BearerTokenAuth\":{\"description\":\"Tenant token from the Graphite Note app's Account Info page.\",\"scheme\":\"bearer\",\"type\":\"http\"}},\"securitySource\":\"definition\"}","source":"openapi3","version":1},"kind":"http","method":"POST","orig":"/v1/prediction/model/{model_code}","segments":[{"lit":"v1"},{"lit":"prediction"},{"lit":"model"},{"var":"model_code"}],"select":{"exist":["model_code"]},"transform":{"req":"`reqdata`","res":"`body.data`"},"index$":0},{"active":true,"args":{"params":[{"active":true,"kind":"param","name":"model_code","orig":"model_code","reqd":true,"type":"`$STRING`","index$":0}]},"contract":{"id":"POST /v2/prediction/model/{model_code}","json":"{\"operationId\":\"PredictV2\",\"parameters\":[{\"description\":\"The model's code: open the model, Settings tab, ID section.\",\"in\":\"path\",\"name\":\"model_code\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"data\":{\"properties\":{\"predict_values\":{\"items\":{\"additionalProperties\":true,\"description\":\"One prediction row: keys are the EXACT column names used during model training, values are the inputs. All training features are required; extra identifier fields (Lead ID, Customer ID) are passed through unchanged and echoed in the response.\",\"properties\":{},\"type\":\"object\"},\"type\":\"array\"}},\"required\":[\"predict_values\"],\"type\":\"object\"}},\"required\":[\"data\"],\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"data\":{\"description\":\"Classification/regression prediction results.\",\"properties\":{\"columns\":{\"description\":\"Column names associated with each prediction row.\",\"items\":{\"type\":\"string\"},\"type\":\"array\"},\"data\":{\"items\":{\"additionalProperties\":true,\"description\":\"One prediction result row: the input attributes echoed back, the predicted Label, and per-class probability scores as Score_<CLASS> keys (e.g. Score_YES: 0.1045 = 10.45%).\",\"properties\":{\"Label\":{\"description\":\"Predicted label (classification models).\",\"type\":\"string\"}},\"type\":\"object\"},\"type\":\"array\"}},\"type\":\"object\"}},\"type\":\"object\"}}},\"description\":\"Success.\"},\"429\":{\"content\":{\"application/json\":{\"schema\":{\"additionalProperties\":true,\"description\":\"Error payload. Notable statuses: 429 rate limit (tenant 10/min, global 200/min); custom 44x business errors — 441 subscription plan limit, 442 email exists, 443 free trial finished, 445 model creation limit.\",\"properties\":{\"message\":{\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Rate limit exceeded (tenant 10/min, global 200/min).\"}},\"security\":[{\"BearerTokenAuth\":[]}],\"securitySchemes\":{\"BearerTokenAuth\":{\"description\":\"Tenant token from the Graphite Note app's Account Info page.\",\"scheme\":\"bearer\",\"type\":\"http\"}},\"securitySource\":\"definition\"}","source":"openapi3","version":1},"kind":"http","method":"POST","orig":"/v2/prediction/model/{model_code}","segments":[{"lit":"v2"},{"lit":"prediction"},{"lit":"model"},{"var":"model_code"}],"select":{"exist":["model_code"]},"transform":{"req":"`reqdata`","res":"`body.data`"},"index$":1}],"key$":"create"}},"relations":{"ancestors":[["model"]]},"key$":"prediction","name__orig":"prediction","Name":"Prediction","name_":"prediction","name-":"prediction","NAME":"PREDICTION","index$":4}, {"active":true,"entity":"prediction","key$":"BasicPredictionFlow","kind":"basic","name":"BasicPredictionFlow","param":{},"step":[{"active":true,"data":{},"input":{"ref":"prediction_ref01"},"match":{"model_code":"model_code01"},"op":"create","spec":[],"valid":[],"index$":0}]}, 'Prediction')
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
    ['prediction01','prediction02','prediction03','model01','model02','model03'],
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
  
