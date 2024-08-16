{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "default",
        "format": ["camelCase"]
      },
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE", "PascalCase"]
      },
      {
        "selector": "typeLike",
        "format": ["PascalCase"]
      }
    ],
    "@typescript-eslint/triple-slash-reference": "error",
    "@typescript-eslint/parameter-properties": "off",
    "@typescript-eslint/consistent-type-assertions": "error"
  }
}
