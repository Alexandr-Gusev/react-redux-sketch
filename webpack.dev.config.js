const path = require("path");

module.exports = {
	mode: "development",
	entry: [
		"./static/jsx/App.jsx"
	],
	output: {
		path: path.resolve(__dirname),
		filename: "static/bundle.js"
	},
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.jsx$/,
				include: path.resolve(__dirname, "static/jsx"),
				use: {
					loader: "babel-loader"
				}
			}
		]
	}
};
