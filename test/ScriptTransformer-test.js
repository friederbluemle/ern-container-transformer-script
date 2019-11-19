import { equal } from 'assert'
import ScriptTransformer from '../src/ScriptTransformer'

describe('ScriptTransformer', () => {
  it('should return name correctly', () => {
    equal((new ScriptTransformer()).name, 'script')
  })
})
