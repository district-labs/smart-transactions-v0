/** @type {import('prettier').Config} */
module.exports = {
    endOfLine: "lf",
    semi: false,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: "es5",
    importOrder: [
        "<THIRD_PARTY_MODULES>",
        "",
        "",
        "^[./]",
    ],
    importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
    plugins: [
      "@ianvs/prettier-plugin-sort-imports",
    ],
  }