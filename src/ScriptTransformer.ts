import fs from 'fs'
import path from 'path'
import shell from 'shelljs'
import tmp from 'tmp'
import { getActiveCauldron } from 'ern-cauldron-api'

export interface ScriptTransformerExtra {
  scriptPath: string
  scriptParams?: string
}

export default class ScriptTransformer {
  /**
   * Name of this transformer
   */
  get name(): string {
    return 'script'
  }

  /**
   * Supported platforms
   */
  get platforms(): string[] {
    return ['ios', 'android']
  }

  /**
   * Transform the container
   */
  public async transform({
    containerPath,
    extra,
  }: {
      containerPath: string
      extra?: ScriptTransformerExtra
    }) {
    if (!extra) {
      this.throwError('Missing extra property')
    }

    //
    // Validate extra object (throw if invalid)
    this.validate(extra!)

    let pathToScript = extra!.scriptPath
    if (pathToScript.startsWith('cauldron://')) {
      const localRepoPath = tmp.dirSync({ unsafeCleanup: true }).name
      const cauldron = await getActiveCauldron({ localRepoPath, ignoreSchemaVersionMismatch: true })
      if (!cauldron) {
        this.throwError('A Cauldron needs to be active for using a script stored in the Cauldron')
      }
      if (!await cauldron.hasFile({ cauldronFilePath: pathToScript })) {
        this.throwError(`Cannot find ${pathToScript} in Cauldron`)
      }
      const scriptFile = await cauldron.getFile({ cauldronFilePath: pathToScript })
      const scriptFileName = path.basename(pathToScript.replace('cauldron://', ''))
      const tmpScriptDir = tmp.dirSync({ unsafeCleanup: true }).name
      pathToScript = path.join(tmpScriptDir, scriptFileName)
      fs.writeFileSync(pathToScript, scriptFile.toString())
      shell.chmod('+x', pathToScript)
    }

    console.log(`scriptParams: ${extra!.scriptParams}`)
    const scriptResult = shell.exec(`${pathToScript}${extra!.scriptParams?` ${extra!.scriptParams}`:''}`, {cwd:containerPath})
    if (scriptResult.code !== 0) {
      throw new Error(`Script execution failed with code ${scriptResult.code}`)
    }
  }

  public validate(extra: ScriptTransformerExtra) {
    if (!extra.scriptPath) {
      this.throwError('Missing extra scriptPath')
    }
  }

  public throwError(msg: string) {
    throw new Error(`[ScriptTransformer] ${msg}`)
  }
}
