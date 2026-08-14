
import * as Path from 'node:path'


import {
  Content,
  File,
  Fragment,
  Line,
  cmp,
  each,
  isAuthActive,
  resolveAuthPrefix,
  serverVariables,
} from '@voxgig/sdkgen'


import {
  KIT,
  Model,
  getModelPath,
  nom,
} from '@voxgig/apidef'


import {
  clean,
  formatRubyHash,
} from './utility_rb'


const Config = cmp(async function Config(props: any) {
  const ctx$ = props.ctx$
  const target = props.target

  const model: Model = ctx$.model

  const entity = getModelPath(model, `main.${KIT}.entity`)
  const feature = getModelPath(model, `main.${KIT}.feature`)

  const headers = getModelPath(model, `main.${KIT}.config.headers`) || {}

  const authActive = isAuthActive(model)
  // config.auth.prefix override -> spec-derived info.security.prefix -> 'Bearer'
  const authPrefix = resolveAuthPrefix(model)

  let baseUrl = ''
  try { baseUrl = getModelPath(model, `main.${KIT}.info.servers.0.url`) } catch (_e) { }

  // Templated server URL: emit the spec's server-variable defaults so the
  // runtime can substitute {name} placeholders in base (see make_options).
  // `#` is escaped so a default can never open a Ruby interpolation.
  const svars = serverVariables(model)
  const rbs = (s: string) => JSON.stringify(s).replace(/#/g, '\\#')
  const serverBlock = 0 === svars.length ? '' :
    '        "server" => {\n' +
    svars.map((v: any) => `          ${rbs(v.name)} => ${rbs(v.dflt)},\n`).join('') +
    '        },\n'

  const authBlock = authActive
    ? `        "auth" => {
          "prefix" => "${authPrefix}",
        },\n`
    : ''

  File({ name: 'config.' + target.ext }, () => {

    Content(`# ${model.const.Name} SDK configuration

module ${model.const.Name}Config
  # Return the process-wide config, built once on first use. The SDK reads
  # the config on every request and never writes to it, so one instance is
  # shared by every client rather than rebuilt per client.
  #
  # The returned hash is shared: treat it as read-only. Callers that need to
  # mutate should use make_config, which always returns a fresh copy.
  def self.shared_config
    @shared_config ||= make_config
  end


  # Build a fresh, fully materialised config hash. Every call rebuilds the
  # whole structure, so prefer shared_config unless you need a private copy
  # you intend to mutate.
  def self.make_config
    {
      "main" => {
        "name" => "${model.const.Name}",
      },
      "feature" => {
`)

    each(feature, (f: any) => {
      const fconfig = f.config || {}
      Content(`        "${f.name}" => ${formatRubyHash(fconfig, 4)},
`)
    })

    Content(`      },
      "options" => {
        "base" => "${baseUrl}",
${serverBlock}${authBlock}        "headers" => ${formatRubyHash(headers, 4)},
        "entity" => {
`)

    each(entity, (entity: any) => {
      Content(`          "${entity.name}" => {},
`)
    })

    Content(`        },
      },
      "entity" => ${formatRubyHash(
      Object.values(entity).reduce((a: any, n: any) => (a[n.name] = clean({
        fields: n.fields,
        name: n.name,
        op: n.op,
        relations: n.relations,
      }, true), a), {}), 3)},
    }
  end


  def self.make_feature(name)
    require_relative 'features'
    ${model.const.Name}Features.make_feature(name)
  end
end
`)
  })
})


export {
  Config
}
