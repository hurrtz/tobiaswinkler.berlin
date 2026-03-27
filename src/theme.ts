import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  strictTokens: true,
  globalCss: {
    'html, body': {
      bg: 'gray.50',
      color: 'gray.900'
    },
    a: {
      textUnderlineOffset: '3px'
    },
    '::selection': {
      bg: 'blue.100'
    }
  }
});

export const system = createSystem(defaultConfig, config);
