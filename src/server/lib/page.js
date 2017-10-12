/*eslint strict: 0, import/no-commonjs: 0, import/no-extraneous-dependencies: 0*/
'use strict';
const url = require('url');
const Path = require('path');
const fs = require('fs');

const {URL: {join: urlJoin}} = require('nti-commons');

const logger = require('./logger');

const isRootPath = RegExp.prototype.test.bind(/^\/(?!\/).*/);
const isSiteAssets = RegExp.prototype.test.bind(/^\/site-assets/);
const isFavicon = RegExp.prototype.test.bind(/^\/favicon\.ico/);
const isMobile = RegExp.prototype.test.bind(/^\/mobile/);
const shouldPrefixBasePath = val => isRootPath(val) && !isSiteAssets(val) && !isFavicon(val) && !isMobile(val);


const basepathreplace = /(manifest|src|href)="(.*?)"/igm;
const configValues = /<\[cfg:([^\]]*)\]>/igm;

const NOOP = () => {};
const NOT_FOUND = '404 Not Found';

function injectConfig (cfg, orginal, prop) {
	return cfg[prop] || 'MissingConfigValue';
}

function isFile (file) {
	try {
		return fs.statSync(file).isFile();
	} catch (e) {
		return false;
	}
}

function resolveFile (path) {
	const extensions = ['', 'index.html'];

	for (let ext of extensions) {
		const filePath = path + ext + '.in';

		const [file] = [
			Path.resolve(__dirname, '../../main/WebApp' + filePath), //production
			Path.resolve(__dirname, '../../main' + filePath), //dev
		].filter(isFile);

		if (file) {
			return file;
		}
	}
}

exports.getPage = function getPage () {

	return (basePath, req, clientConfig, markError = NOOP) => {
		basePath = basePath || '/';
		const u = url.parse(req.url);
		const manifest = u.query === 'cache' ? '<html manifest="/manifest.appcache"' : '<html';
		const path = u.pathname;
		const cfg = Object.assign({}, clientConfig.config || {});

		let template;
		try {
			const file = resolveFile(path);

			if (!file) {
				throw new Error(NOT_FOUND);
			}

			template = fs.readFileSync(file, 'utf8');
		} catch (er) {
			if (er.message === NOT_FOUND) {
				markError(404);
				template = NOT_FOUND;
			} else {
				markError(500);
				logger.error('%s', er.stack || er.message || er);
				template = 'Could not load page template.';
			}
		}

		const basePathFix = (original, attr, val) =>
			attr + `="${
				shouldPrefixBasePath(val)
					? urlJoin(basePath, val)
					: val
			}"`;


		const iTunesAppId = !cfg.itunes ? '' : '<meta name="apple-itunes-app" content="app-id=' + cfg.itunes + '" />';

		const out = template
			.replace(/<html/, manifest)
			.replace(configValues, injectConfig.bind(this, cfg))
			.replace('<!--[itunes banner here]-->', iTunesAppId)
			.replace(basepathreplace, basePathFix);

		return out;
	};
};
