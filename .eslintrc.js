module.exports = {
  root: true,
  extends: '@react-native-community',
  env: {
    browser: true,
    es6: true
  },
  extends: [
    "airbnb",
    "prettier",
    "prettier/react",
    "plugin:prettier/recommended",
    "eslint-config-prettier"
  ],
  parser: "babel-eslint",
  rules": {
    "react/destructuring-assignment": [
      0,
      "always",
      { ignoreClassFields: false }
    ],
    "func-names": 0,
    "global-require": 0,
    "react/require-default-props": 0,
    "radix": 0,
    "react/prefer-stateless-function": 0,
    "import/no-unresolved": "off",
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [".js", ".jsx"]
      }
    ],
    "prettier/prettier": [
      "error",
      {
        trailingComma: "es5",
        singleQuote: true,
        printWidth": 100
      }
    ]
  },
  plugins": ["prettier"]
};
