

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


describe('ModelInfoEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when GRAPHITE_NOTE_TEST_LIVE=TRUE.
  afterEach(liveDelay('GRAPHITE_NOTE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = GraphiteNoteSDK.test()
    const ent = testsdk.ModelInfo()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = GraphiteNoteSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.ModelInfo().load({"model_code":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.GRAPHITE_NOTE_TEST_LIVE
    for (const op of []) {
      if (!live && maybeSkipControl(t, 'entityOp', 'model_info.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"code":{"a":true,"h":"Code","n":"code","r":false,"sh":"Model code (Settings tab, ID section).","t":"`$STRING`","key$":"code","index$":0},"created_at":{"a":true,"fo":"date-time","h":"Created At","n":"created_at","r":false,"t":"`$STRING`","key$":"created_at","index$":1},"dataset_code":{"a":true,"h":"Dataset Code","n":"dataset_code","r":false,"sh":"Code of the dataset the model is trained on.","t":"`$STRING`","key$":"dataset_code","index$":2},"model_name":{"a":true,"h":"Model Name","n":"model_name","r":false,"sh":"Model type name, e.g.","t":"`$STRING`","key$":"model_name","index$":3},"name":{"a":true,"h":"Name","n":"name","r":false,"sh":"User-given model name.","t":"`$STRING`","key$":"name","index$":4},"properties":{"a":true,"h":"Properties","n":"properties","r":false,"sh":"Full model configuration and structured metadata (excluding bulky training artifacts); shape differs by model type (RFM, CLV, ABC, ...).","t":"`$OBJECT`","key$":"properties","index$":5},"updated_at":{"a":true,"fo":"date-time","h":"Updated At","n":"updated_at","r":false,"t":"`$STRING`","key$":"updated_at","index$":6}},"name":"model_info","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /model/fetch-model-info/{model_code}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"model_code","or":"model_code","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/model/fetch-model-info/{model_code}","q":{"exist":["model_code"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"model"},{"lit":"fetch-model-info"},{"var":"model_code"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"model_info","name__orig":"model_info","Name":"ModelInfo","name_":"model_info","name-":"model-info","NAME":"MODEL_INFO","index$":3}, {"active":true,"entity":"model_info","key$":"BasicModelInfoFlow","kind":"basic","name":"BasicModelInfoFlow","param":{},"step":[{"a":false,"d":{},"i":{"ref":"model_info_ref01","srcdatavar":"model_info_ref01_data","suffix":"_dt0"},"m":{"id":"model_info01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-model_info_ref01"}}],"unreachable":true}]}, 'ModelInfo', {"GET /model/fetch-model-info/{model_code}":{"protocol":"http","parameters":[{"name":"model_code","in":"path","required":true,"description":"The model's code: open the model, Settings tab, ID section.","schema":{"type":"string"},"index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let model_info_ref01_data = Object.values(setup.data.existing.model_info)[0] as any

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
    ['model_info01','model_info02','model_info03'],
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
  
