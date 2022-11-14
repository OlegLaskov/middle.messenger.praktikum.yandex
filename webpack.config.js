// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: 'development',
	// eslint-disable-next-line no-undef
	entry: path.resolve(__dirname, './src/index.ts'),
	output: {
		// eslint-disable-next-line no-undef
		path: path.resolve(__dirname, './dist'),
		filename: 'index.js'
	},
	resolve: {
		extensions: ['.ts', '.js', '.json'],
		fallback: {
			"fs": false
		},
		alias: {
			'handlebars': 'handlebars/dist/handlebars.js'
		}
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
						// eslint-disable-next-line no-undef
						configFile: path.resolve(__dirname, 'tsconfig.json'),
						},
					},
				],
				exclude: /(node_modules)/
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.(s(a|c)ss)$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			},
			{
				test: /\.(hbs|handlebars)$/,
				loader: "handlebars-loader"
			},
			// изображения
			{
				test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
				type: 'asset/resource',
			},
			// шрифты и SVG
			{
				test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
				type: 'asset/inline',
			},
		]
	},
	devServer: {
		static: {
			// eslint-disable-next-line no-undef
			directory: path.join(__dirname, 'dist'),
		},
		historyApiFallback: true,
		port: 3000
    },
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Oleg Messenger',
			// eslint-disable-next-line no-undef
			template: path.resolve(__dirname, './src/template.html'),
			filename: 'index.html'
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		})
	]
};