import { dndxdnd } from '@dndxdnd/eslint-config'

export default dndxdnd(
  [
    {
      rules: {
        '@angular-eslint/directive-selector': 'off',
      },
    },
  ],
  {
    angular: true,
  })
