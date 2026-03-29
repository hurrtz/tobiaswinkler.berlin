import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  strictTokens: true,
  globalCss: {
    html: {
      bg: 'bg',
      color: 'fg',
      scrollPaddingTop: '6rem'
    },
    body: {
      bg: 'bg',
      color: 'fg'
    },
    a: {
      textUnderlineOffset: '3px'
    },
    '::selection': {
      bg: 'blue.subtle'
    }
  }
});

export const system = createSystem(defaultConfig, config);
