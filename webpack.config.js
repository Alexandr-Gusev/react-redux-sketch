const path = require("path")

const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackRootPlugin  = require("html-webpack-root-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")

module.exports = {
	entry: [
		"./src/js/index.js"
	],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js"
	},
	performance: {
		maxAssetSize: 512000,
		maxEntrypointSize: 512000
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/i,
				use: ["babel-loader"]
			},
			{
				test: /\.(svg|png|jpg|gif|ico|webm|mp4)$/i,
				use: ["file-loader"]
			},
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader"]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "react-redux-sketch",
			favicon: "src/img/favicon.png"
		}),
		new HtmlWebpackRootPlugin("app"),
		new CopyPlugin([
			"./src/server.js"
		]),
		new MiniCssExtractPlugin({filename: "bundle.css"}),
		new CleanWebpackPlugin()
	]
}
