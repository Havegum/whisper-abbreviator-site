import colorDefinition from './colors.json';

export type Color = Record<string, string>;

const colors = Object.fromEntries(
  colorDefinition.hues.map(hue => {
    const colors = Object.fromEntries(
      hue.colors.map((color, index) => [colorDefinition.tones[index], color]),
    );

    colors.DEFAULT = colors['500'];

    return [hue.name, colors];
  }),
);

export default colors;
