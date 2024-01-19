import {
  createFilter,
  dataToEsm,
  type FilterPattern,
} from '@rollup/pluginutils';
import type { Plugin } from 'rollup';

interface Options {
  include?: FilterPattern;
  exclude?: FilterPattern;
  preferConst?: boolean;
  compact?: boolean;
  namedExports?: boolean;
  indent?: string;
}

export default function json(options: Options = {}): Plugin {
  const filter = createFilter(options.include, options.exclude);
  const indent = 'indent' in options ? options.indent : '\t';

  return {
    name: 'json',

    transform(json, id) {
      if (
        !id
          .split('.')
          .pop()
          ?.match(/^(topo|geo)json$/i) ||
        !filter(id)
      )
        return null;
      try {
        const parsed = JSON.parse(json);
        return {
          code: dataToEsm(parsed, {
            preferConst: options.preferConst,
            compact: options.compact,
            namedExports: options.namedExports,
            indent,
          }),
          map: { mappings: '' },
        };
      } catch (err) {
        const message = 'Could not parse JSON file';
        this.warn({ message, id });
        return null;
      }
    },
  };
}
