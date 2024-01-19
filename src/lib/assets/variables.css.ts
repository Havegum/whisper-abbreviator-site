import {
  createGlobalThemeContract,
  createGlobalTheme,
} from '@vanilla-extract/css';

import colors from './colors';

export const globalThemeContract = createGlobalThemeContract(
  colors,
  (_, path) => path.join('-').replace('-DEFAULT', ''),
);

export const globalStyle = createGlobalTheme(
  '.whisper-abbreviator-frontend',
  globalThemeContract,
  colors,
);
