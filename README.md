# Script Container Transformer

This transformer allows for executing an arbitrary script to transform the Container in some custom way. It supports transformation of both iOS and Android Containers.

## Inputs

- `containerPath` : Path to the Container to transform
- `scriptPath` : Path to the script to execute. It can be a local file path (for ex `/Users/username/scripts/myscript.sh`) or a path to a file stored in the Cauldron (for ex `cauldron://scripts/myscript.sh`). It is recommended to use the path to a file stored in the CauldronFor the `scriptPath` (the file needs to be added first to the cauldron through the [cauldron add file](https://native.electrode.io/cli-commands/cauldron-add/file) command).
- `scriptParams`: Optional parameter(s) to pass on the command line when invoking the script.

## Notes

The script will be executed from the Container directory.

## Usage

### With `ern transform-container` CLI command

```bash
$ ern transform-container --containerPath [pathToContainer] -t script -e '{"scriptPath":"[pathToScript]"}'
```

Instead of passing the whole configuration on the command line for `--extra/-e`, it is also possible to use a file path to a json file holding the configuration, or a path to a file stored in the Cauldron. Check out the [ern transform-container](https://native.electrode.io/cli-commands/transform-container) command documentation for more info.

### With Cauldron

To automatically transform the Cauldron generated Containers of a target native application and platform, you can add a transformer entry in the Cauldron in the Container generator configuration object as follow :

**Electrode Native <= 0.31**

```json
"transformers": [
  {
    "name": "script",
    "extra": {
      "scriptPath": "[pathToScript]",
      "scriptParams": "[params]"
    }
  }
]
```

**Electrode Native >= 0.32**

```json
"pipeline": [
  {
    "name": "script",
    "extra": {
      "scriptPath": "[pathToScript]",
      "scriptParams": "[params]"
    }
  }
]
```

### Programmatically

```typescript
import ScriptTransformer from 'ern-container-transformer-script'
const transformer = new ScriptTransformer()
transformer.transform(
  {
    /* Local file system path to the Container */
    containerPath: string
    /* Extra data specific to this publisher */
    extra?: {
      scriptPath: string,
      scriptParams?: string
    }
  }
})
```
