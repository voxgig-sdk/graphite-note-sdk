
import { Context } from './Context'


class GraphiteNoteError extends Error {

  isGraphiteNoteError = true

  sdk = 'GraphiteNote'

  code: string
  ctx: Context

  constructor(code: string, msg: string, ctx: Context) {
    super(msg)
    this.code = code
    this.ctx = ctx
  }

}

export {
  GraphiteNoteError
}

