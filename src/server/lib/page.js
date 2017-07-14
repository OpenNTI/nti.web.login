/*eslint strict: 0*/
'use strict';
const url = require('url');
const Path = require('path');
const fs = require('fs');

const {URL: {join: urlJoin}} = require('nti-commons');

const logger = require('./logger');

const isRootPath = RegExp.prototype.test.bind(/^\/(?!\/).*/);
const isSiteAssets = RegExp.prototype.test.bind(/^\/site\-assets/);
const isFavicon = RegExp.prototype.test.bind(/^\/favicon\.ico/);
const shouldPrefixBasePath = val => isRootPath(val) && !isSiteAssets(val) && !isFavicon(val);

const isIndex = RegExp.prototype.test.bind(/^\/index\.html/);
const isPasswordRecover = RegExp.prototype.test.bind(/^\/passwordrecover\.html/);
const isSignup = RegExp.prototype.test.bind(/^\/signup\.html/);
const isUnsupported = RegExp.prototype.test.bind(/^\/unsupported\.html/);

const basepathreplace = /(manifest|src|href)="(.*?)"/igm;
const configValues = /<\[cfg\:([^\]]*)\]>/igm;

const statCache = {};

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

exports.getPage = function getPage () {
	let revision;
	let Application;
	let template;
	let isDevMode = false;
	let file;

	return (basePath, req, clientConfig, markNotFound) => {
		basePath = basePath || '/';
		const u = url.parse(req.url);
		const manifest = u.query === 'cache' ? '<html manifest="/manifest.appcache"' : '<html';
		const path = u.pathname;
		const cfg = Object.assign({revision}, clientConfig.config || {});

		try {
			let realPath = path;
			
			if ( path === '/' ) {
				realPath = '/index.html';
			}
			
			let file = Path.resolve(__dirname, '../../main/WebApp' + realPath + '.in'); //production
			if (!isFile(file)) {
				isDevMode = true;
				file = Path.resolve(__dirname, '../../main' + realPath + '.in'); //dev
			}

			template = fs.readFileSync(file, 'utf8');
		} catch (er) {
			logger.error('%s', er.stack || er.message || er);
			template = 'Could not load page template.';
		}

		const basePathFix = (original, attr, val) =>
				attr + `="${
					shouldPrefixBasePath(val)
						? urlJoin(basePath, val)
						: val
				}"`;

		let iTunesAppId = '';
		if (cfg.itunes){
			iTunesAppId = '<meta name="apple-itunes-app" content="app-id=' + cfg.itunes + '" />';
		}

		let out = template
				.replace(/<html/, manifest)
				.replace(configValues, injectConfig.bind(this, cfg))
				.replace('<!--[itunes banner here]-->', iTunesAppId)
				.replace(basepathreplace, basePathFix);

		return out;
	};
};
