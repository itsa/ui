# ITSA UI

UI library based on Material UI.

## Publish

- yarn prepublish
- npm publish build

## Usage with Gatsby

The [`gatsby-plugin-compile-es6-packages`](https://www.gatsbyjs.org/packages/gatsby-plugin-compile-es6-packages/) plugin is required to transpile the JSX files.

Install:

```bash
yarn add gatsby-plugin-compile-es6-packages
```

Add to `gatsby-config.js`:

```js
{
	resolve: `gatsby-plugin-compile-es6-packages`,
	options: {
		modules: [`@itsa/ui`],
		test: /\.js(x)?$/,
	},
},
```
