import StyleDictionary from 'style-dictionary'

const styleDictionary = new StyleDictionary({
  source: ['src/tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'src/tokens/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'javascript/es6',
        },
      ],
    },
    tailwind: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'tailwind-tokens.js',
          format: 'javascript/object',
        },
      ],
    },
  },
})

export default styleDictionary