/*eslint strict: 0, import/no-commonjs: 0, import/no-extraneous-dependencies: 0*/
'use strict';
const path = require('path');

const page = require('./lib/page');

const assets = path.resolve(__dirname, '../main/WebApp/');

exports = module.exports = {

	register (expressApp, config) {

		const pageRenderer = page.getPage();

		return {
			devmode: false,
			assets,

			render (base, req, clientConfig) {
				return pageRenderer(base, req, clientConfig);
			}
		};

	}

};
