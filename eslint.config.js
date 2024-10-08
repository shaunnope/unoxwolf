import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'double', // or 'double'
  },
},
{
  rules: {
    'n/prefer-global/buffer': 'off',
    'n/prefer-global/process': 'off',
    'unicorn/no-new-array': 'off'
  }
})
