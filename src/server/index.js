/*eslint strict:0*/
'use strict';
const fs = require('fs');
const path = require('path');

const page = require('./lib/page');

const exists = f => {
	try { fs.accessSync(f); } catch (e) { return false; } return true; };

let assets = path.resolve(__dirname, '../main/WebApp/');

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
