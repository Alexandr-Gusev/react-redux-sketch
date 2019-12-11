const path = require("path")

const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackRootPlugin  = require("html-webpack-root-plugin")
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
	mode: "development",
	devtool: "source-map",
	entry: [
		"./src/jsx/App.jsx"
	],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.jsx$/,
				include: path.resolve(__dirname, "src/jsx"),
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.(svg|png|jpg)$/,
				include: path.resolve(__dirname, "src/img"),
				use: [
					"file-loader"
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "react-redux-sketch",
			favicon: "src/img/favicon.png",
			meta: {
				charset: "UTF-8"
			}
		}),
		new HtmlWebpackRootPlugin("app"),
		new CopyPlugin([
			"./src/server.js"
		])
	]
}
